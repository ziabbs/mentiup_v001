-- Güvenlik Politikaları ve Fonksiyonlar

-- Hassas veri şifreleme fonksiyonu
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(
    data text,
    key_id text
) RETURNS text AS $$
BEGIN
    RETURN encode(
        encrypt(
            data::bytea,
            decode(key_id, 'hex'),
            'aes-gcm'
        ),
        'base64'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Veri maskeleme politikası
CREATE POLICY "Mask sensitive data"
    ON public.user_profiles
    FOR SELECT
    USING (true)
    WITH CHECK (auth.uid() = id)
    TRANSFORMING (
        email AS CASE
            WHEN auth.uid() = id THEN email
            ELSE regexp_replace(email, '^(.{2})(.*)(@.*)', '\1***\3')
        END,
        phone_number AS CASE
            WHEN auth.uid() = id THEN phone_number
            ELSE regexp_replace(phone_number, '^(.{3})(.*)(.{2})$', '\1***\3')
        END
    );

-- Rate limit tablosu
CREATE TABLE public.rate_limits (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address text NOT NULL,
    endpoint text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamptz DEFAULT now(),
    UNIQUE(ip_address, endpoint)
);

-- Rate limit kontrolü
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_ip_address text,
    p_endpoint text,
    p_max_requests integer,
    p_window_minutes integer
) RETURNS boolean AS $$
DECLARE
    v_count integer;
BEGIN
    -- Eski kayıtları temizle
    DELETE FROM public.rate_limits
    WHERE window_start < now() - (p_window_minutes || ' minutes')::interval;
    
    -- Mevcut istek sayısını kontrol et
    SELECT request_count INTO v_count
    FROM public.rate_limits
    WHERE ip_address = p_ip_address
    AND endpoint = p_endpoint
    AND window_start > now() - (p_window_minutes || ' minutes')::interval;
    
    IF v_count >= p_max_requests THEN
        RETURN false;
    END IF;
    
    -- İstek sayısını güncelle
    INSERT INTO public.rate_limits (ip_address, endpoint)
    VALUES (p_ip_address, p_endpoint)
    ON CONFLICT (ip_address, endpoint)
    DO UPDATE SET request_count = rate_limits.request_count + 1;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Güvenlik denetim logları
CREATE TABLE public.security_audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    event_type text NOT NULL,
    event_details jsonb,
    ip_address text,
    user_agent text,
    severity text,
    created_at timestamptz DEFAULT now()
);

-- Güvenlik metrik tablosu
CREATE TABLE public.security_metrics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name text NOT NULL,
    metric_value jsonb NOT NULL,
    measured_at timestamptz DEFAULT now()
);

-- Metrik toplama fonksiyonu
CREATE OR REPLACE FUNCTION collect_security_metrics()
RETURNS void AS $$
BEGIN
    -- Başarısız giriş denemeleri
    INSERT INTO public.security_metrics (
        metric_name,
        metric_value
    )
    SELECT
        'failed_login_attempts',
        jsonb_build_object(
            'count', count(*),
            'window', '1 hour'
        )
    FROM public.security_audit_logs
    WHERE event_type = 'login_failed'
    AND created_at > now() - interval '1 hour';
    
    -- Şüpheli aktiviteler
    INSERT INTO public.security_metrics (
        metric_name,
        metric_value
    )
    SELECT
        'suspicious_activities',
        jsonb_build_object(
            'count', count(*),
            'types', array_agg(DISTINCT event_type)
        )
    FROM public.security_audit_logs
    WHERE severity = 'warning'
    AND created_at > now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;
