-- Güvenlik Log Tablosu
CREATE TABLE public.security_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    event_type text NOT NULL,
    event_details jsonb,
    ip_address text,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- Örnek güvenlik log kaydı
INSERT INTO security_logs (
    user_id,
    event_type,
    event_details,
    ip_address,
    user_agent
) VALUES (
    'user_uuid',
    'login_attempt',
    '{"success": true, "method": "email"}',
    '192.168.1.1',
    'Mozilla/5.0...'
);

-- Güvenlik log fonksiyonu
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id uuid,
    p_event_type text,
    p_event_details jsonb,
    p_ip_address text,
    p_user_agent text
) RETURNS void AS $$
BEGIN
    INSERT INTO public.security_logs (
        user_id,
        event_type,
        event_details,
        ip_address,
        user_agent
    ) VALUES (
        p_user_id,
        p_event_type,
        p_event_details,
        p_ip_address,
        p_user_agent
    );
END;
$$ LANGUAGE plpgsql;
