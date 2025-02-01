-- Güvenlik Politikaları Migration

-- 1. Aşama: Rate Limiting ve Audit Logging
--------------------------------------------------------------------------------

-- Rate limit tablosu
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address text NOT NULL,
    endpoint text NOT NULL,
    request_count integer DEFAULT 1,
    window_start timestamptz DEFAULT now(),
    UNIQUE(ip_address, endpoint)
);

-- Rate limit kontrolü fonksiyonu
CREATE OR REPLACE FUNCTION public.check_rate_limit(
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
        -- Rate limit aşıldığında güvenlik logu oluştur
        INSERT INTO public.security_audit_logs (
            event_type,
            event_details,
            ip_address,
            severity
        ) VALUES (
            'rate_limit_exceeded',
            jsonb_build_object(
                'endpoint', p_endpoint,
                'request_count', COALESCE(v_count, 0),
                'max_requests', p_max_requests,
                'window_minutes', p_window_minutes
            ),
            p_ip_address,
            'warning'
        );
        
        RETURN false;
    END IF;
    
    -- İstek sayısını güncelle
    INSERT INTO public.rate_limits (ip_address, endpoint)
    VALUES (p_ip_address, p_endpoint)
    ON CONFLICT (ip_address, endpoint)
    DO UPDATE SET request_count = rate_limits.request_count + 1;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Güvenlik denetim logları
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    event_type text NOT NULL,
    event_details jsonb,
    ip_address text,
    user_agent text,
    severity text CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    created_at timestamptz DEFAULT now()
);

-- Güvenlik log ekleme fonksiyonu
CREATE OR REPLACE FUNCTION public.log_security_event(
    p_event_type text,
    p_event_details jsonb,
    p_severity text DEFAULT 'info',
    p_user_id uuid DEFAULT auth.uid(),
    p_ip_address text DEFAULT NULL,
    p_user_agent text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_log_id uuid;
BEGIN
    INSERT INTO public.security_audit_logs (
        user_id,
        event_type,
        event_details,
        ip_address,
        user_agent,
        severity
    ) VALUES (
        p_user_id,
        p_event_type,
        p_event_details,
        p_ip_address,
        p_user_agent,
        p_severity
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Aşama: Veri Maskeleme ve Şifreleme
--------------------------------------------------------------------------------

-- Hassas veri şifreleme fonksiyonu
CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(
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
    ON public.profiles
    FOR SELECT
    USING (true)
    WITH CHECK (auth.uid() = id)
    TRANSFORMING (
        email AS CASE
            WHEN auth.uid() = id OR 
                 EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
            THEN email
            ELSE regexp_replace(email, '^(.{2})(.*)(@.*)', '\1***\3')
        END,
        phone_number AS CASE
            WHEN auth.uid() = id OR 
                 EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
            THEN phone_number
            ELSE regexp_replace(phone_number, '^(.{3})(.*)(.{2})$', '\1***\3')
        END
    );

-- 3. Aşama: Güvenlik Metrikleri
--------------------------------------------------------------------------------

-- Güvenlik metrik tablosu
CREATE TABLE IF NOT EXISTS public.security_metrics (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name text NOT NULL,
    metric_value jsonb NOT NULL,
    measured_at timestamptz DEFAULT now()
);

-- Güvenlik metriklerini güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION public.update_security_metrics() RETURNS void AS $$
BEGIN
    -- Failed login attempts son 24 saat
    INSERT INTO public.security_metrics (metric_name, metric_value)
    SELECT 
        'failed_login_attempts_24h',
        jsonb_build_object(
            'count', COUNT(*),
            'details', jsonb_agg(
                jsonb_build_object(
                    'ip_address', ip_address,
                    'count', COUNT(*)
                )
            )
        )
    FROM public.security_audit_logs
    WHERE event_type = 'login_failed'
    AND created_at > now() - interval '24 hours'
    GROUP BY ip_address;

    -- Rate limit aşımları son 24 saat
    INSERT INTO public.security_metrics (metric_name, metric_value)
    SELECT 
        'rate_limit_exceeded_24h',
        jsonb_build_object(
            'count', COUNT(*),
            'details', jsonb_agg(
                jsonb_build_object(
                    'endpoint', event_details->>'endpoint',
                    'count', COUNT(*)
                )
            )
        )
    FROM public.security_audit_logs
    WHERE event_type = 'rate_limit_exceeded'
    AND created_at > now() - interval '24 hours'
    GROUP BY event_details->>'endpoint';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Aşama: Profil ve Belge Güvenliği
--------------------------------------------------------------------------------

-- Profil erişim metriklerini güncelleme
CREATE OR REPLACE FUNCTION public.update_profile_access_metrics() RETURNS void AS $$
BEGIN
    -- Profil görüntüleme istatistikleri
    INSERT INTO public.security_metrics (metric_name, metric_value)
    SELECT 
        'profile_views_24h',
        jsonb_build_object(
            'total_views', COUNT(*),
            'by_visibility', jsonb_build_object(
                'public', SUM(CASE WHEN ps.profile_visibility = 'public' THEN 1 ELSE 0 END),
                'connections', SUM(CASE WHEN ps.profile_visibility = 'connections' THEN 1 ELSE 0 END),
                'private', SUM(CASE WHEN ps.profile_visibility = 'private' THEN 1 ELSE 0 END)
            )
        )
    FROM public.security_audit_logs sal
    JOIN public.privacy_settings ps ON ps.user_id = sal.user_id
    WHERE sal.event_type = 'profile_viewed'
    AND sal.created_at > now() - interval '24 hours';

    -- Belge erişim istatistikleri
    INSERT INTO public.security_metrics (metric_name, metric_value)
    SELECT 
        'document_access_24h',
        jsonb_build_object(
            'total_access', COUNT(*),
            'by_type', jsonb_agg(
                jsonb_build_object(
                    'document_type', event_details->>'document_type',
                    'count', COUNT(*)
                )
            )
        )
    FROM public.security_audit_logs
    WHERE event_type = 'document_accessed'
    AND created_at > now() - interval '24 hours'
    GROUP BY event_details->>'document_type';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Yeni event tipleri için check constraint güncelleme
ALTER TABLE public.security_audit_logs DROP CONSTRAINT IF EXISTS valid_event_types;
ALTER TABLE public.security_audit_logs ADD CONSTRAINT valid_event_types 
    CHECK (event_type IN (
        'login_success',
        'login_failed',
        'logout',
        'password_reset_requested',
        'password_changed',
        'email_changed',
        'profile_updated',
        'role_changed',
        'rate_limit_exceeded',
        -- Yeni event tipleri
        'profile_viewed',
        'document_accessed',
        'document_uploaded',
        'document_deleted',
        'privacy_settings_changed',
        'career_profile_created',
        'career_profile_updated',
        'mentor_request_sent',
        'mentor_request_accepted',
        'mentor_request_rejected'
    ));

-- Rate limit endpoint tanımları güncelleme
CREATE OR REPLACE FUNCTION public.get_rate_limit_config(p_endpoint text)
RETURNS TABLE (max_requests integer, window_minutes integer) AS $$
BEGIN
    RETURN QUERY
    SELECT
        CASE p_endpoint
            -- Mevcut endpointler
            WHEN '/auth/login' THEN 5
            WHEN '/auth/register' THEN 3
            WHEN '/auth/reset-password' THEN 3
            -- Yeni endpointler
            WHEN '/profile/view' THEN 60
            WHEN '/profile/update' THEN 10
            WHEN '/document/upload' THEN 20
            WHEN '/document/download' THEN 30
            WHEN '/mentor/request' THEN 5
            ELSE 30  -- Varsayılan limit
        END AS max_requests,
        CASE p_endpoint
            -- Mevcut endpointler
            WHEN '/auth/login' THEN 15
            WHEN '/auth/register' THEN 60
            WHEN '/auth/reset-password' THEN 60
            -- Yeni endpointler
            WHEN '/profile/view' THEN 60
            WHEN '/profile/update' THEN 30
            WHEN '/document/upload' THEN 60
            WHEN '/document/download' THEN 60
            WHEN '/mentor/request' THEN 1440  -- 24 saat
            ELSE 60  -- Varsayılan pencere
        END AS window_minutes;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Metrik güncelleme zamanlaması
SELECT cron.schedule(
    'update_all_security_metrics',
    '0 * * * *',  -- Her saat başı
    $$
    SELECT public.update_security_metrics();
    SELECT public.update_profile_access_metrics();
    $$
);

-- RLS Politikaları
--------------------------------------------------------------------------------

-- Rate Limits için RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all rate limits"
    ON public.rate_limits
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Security Audit Logs için RLS
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
    ON public.security_audit_logs
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Security Metrics için RLS
ALTER TABLE public.security_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view security metrics"
    ON public.security_metrics
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Indexes
--------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits (ip_address, endpoint, window_start);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event ON public.security_audit_logs (event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user ON public.security_audit_logs (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_security_metrics_name ON public.security_metrics (metric_name, measured_at);
