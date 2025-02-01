-- Oturum Yönetimi Tabloları ve Fonksiyonlar

-- Oturum Tablosu
CREATE TABLE public.user_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    refresh_token text UNIQUE,
    device_info jsonb NOT NULL,
    ip_address text,
    user_agent text,
    platform text,
    last_active_at timestamptz DEFAULT now(),
    expires_at timestamptz NOT NULL,
    is_valid boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_platform CHECK (platform IN ('mobile', 'desktop', 'tablet'))
);

-- Cihaz tipi enum
CREATE TYPE device_type AS ENUM ('mobile', 'tablet', 'desktop');

-- Oturum meta verileri
CREATE TABLE public.session_metadata (
    session_id uuid REFERENCES public.user_sessions(id),
    device_type device_type NOT NULL,
    screen_size jsonb,
    os_info text,
    browser_info text,
    preferences jsonb,
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (session_id)
);

-- Mobil cihazlar
CREATE TABLE public.mobile_devices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    device_token text UNIQUE,
    device_model text,
    os_version text,
    app_version text,
    push_enabled boolean DEFAULT true,
    last_sync_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Offline veri senkronizasyonu
CREATE TABLE public.offline_data_sync (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    device_id uuid REFERENCES public.mobile_devices(id),
    data_type text NOT NULL,
    local_changes jsonb,
    sync_status text DEFAULT 'pending',
    sync_attempted_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Oturum oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION create_user_session(
    p_user_id uuid,
    p_device_info jsonb,
    p_ip_address text,
    p_user_agent text
) RETURNS uuid AS $$
DECLARE
    v_session_id uuid;
    v_device_type device_type;
BEGIN
    -- Cihaz tipini belirle
    v_device_type := CASE
        WHEN p_device_info->>'type' = 'mobile' THEN 'mobile'::device_type
        WHEN p_device_info->>'type' = 'tablet' THEN 'tablet'::device_type
        ELSE 'desktop'::device_type
    END;

    -- Oturum oluştur
    INSERT INTO public.user_sessions (
        user_id,
        device_info,
        ip_address,
        user_agent,
        platform,
        expires_at
    ) VALUES (
        p_user_id,
        p_device_info,
        p_ip_address,
        p_user_agent,
        v_device_type::text,
        now() + interval '7 days'
    ) RETURNING id INTO v_session_id;

    -- Meta verileri kaydet
    INSERT INTO public.session_metadata (
        session_id,
        device_type,
        screen_size,
        os_info,
        browser_info,
        preferences
    ) VALUES (
        v_session_id,
        v_device_type,
        p_device_info->'screen',
        p_device_info->>'os',
        p_device_info->>'browser',
        '{}'::jsonb
    );

    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Mobil cihaz kayıt fonksiyonu
CREATE OR REPLACE FUNCTION register_mobile_device(
    p_user_id uuid,
    p_device_token text,
    p_device_info jsonb
) RETURNS uuid AS $$
DECLARE
    v_device_id uuid;
BEGIN
    INSERT INTO public.mobile_devices (
        user_id,
        device_token,
        device_model,
        os_version,
        app_version
    ) VALUES (
        p_user_id,
        p_device_token,
        p_device_info->>'model',
        p_device_info->>'osVersion',
        p_device_info->>'appVersion'
    ) ON CONFLICT (device_token) 
    DO UPDATE SET
        updated_at = now(),
        last_sync_at = now()
    RETURNING id INTO v_device_id;

    RETURN v_device_id;
END;
$$ LANGUAGE plpgsql;

-- Performans indeksleri
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_valid ON public.user_sessions(is_valid) WHERE is_valid = true;
CREATE INDEX idx_user_sessions_expires ON public.user_sessions(expires_at) WHERE expires_at > now();
