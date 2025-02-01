-- Kimlik Doğrulama ve Yetkilendirme Tabloları

-- Kullanıcı Profilleri
CREATE TABLE public.user_profiles (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    email text NOT NULL UNIQUE,
    full_name text NOT NULL,
    phone_number text,
    is_verified boolean DEFAULT false,
    two_factor_enabled boolean DEFAULT false,
    last_login_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Kullanıcı Rolleri
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.user_profiles(id),
    role_name text NOT NULL,
    permissions jsonb DEFAULT '{}',
    assigned_at timestamptz DEFAULT now(),
    assigned_by uuid REFERENCES public.user_profiles(id),
    UNIQUE(user_id, role_name)
);

-- Oturum Yönetimi
CREATE TABLE public.user_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.user_profiles(id),
    device_info jsonb,
    ip_address text,
    user_agent text,
    last_active_at timestamptz DEFAULT now(),
    expires_at timestamptz NOT NULL,
    is_valid boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Güvenlik Logları
CREATE TABLE public.security_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.user_profiles(id),
    event_type text NOT NULL,
    event_details jsonb,
    ip_address text,
    created_at timestamptz DEFAULT now()
);

-- İki Faktörlü Kimlik Doğrulama
CREATE TABLE public.two_factor_auth (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES public.user_profiles(id) UNIQUE,
    secret_key text NOT NULL,
    backup_codes text[] DEFAULT ARRAY[]::text[],
    enabled_at timestamptz DEFAULT now(),
    last_used_at timestamptz
);

-- RLS Politikaları
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;

-- Kullanıcı Profili Politikaları
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Oturum Politikaları
CREATE POLICY "Users can view their own sessions"
    ON public.user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can invalidate their own sessions"
    ON public.user_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- Güvenlik Fonksiyonları
CREATE OR REPLACE FUNCTION check_password_strength(password text)
RETURNS boolean AS $$
BEGIN
    -- En az 8 karakter
    IF length(password) < 8 THEN
        RETURN false;
    END IF;
    
    -- En az bir büyük harf
    IF password !~ '[A-Z]' THEN
        RETURN false;
    END IF;
    
    -- En az bir küçük harf
    IF password !~ '[a-z]' THEN
        RETURN false;
    END IF;
    
    -- En az bir rakam
    IF password !~ '[0-9]' THEN
        RETURN false;
    END IF;
    
    -- En az bir özel karakter
    IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;
