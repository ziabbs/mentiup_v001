-- Yeni kullanıcı kaydı sonrası tetiklenecek fonksiyon
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Profil oluştur
    INSERT INTO public.profiles (id, username, email, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTR(NEW.id::text, 1, 8)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );

    -- Varsayılan rol ata (standard_user)
    INSERT INTO public.user_roles (user_id, role_id)
    SELECT NEW.id, r.id
    FROM public.roles r
    WHERE r.name = 'standard_user';

    -- Güvenlik logu oluştur
    INSERT INTO public.security_logs (user_id, event_type, details)
    VALUES (
        NEW.id,
        'user.created',
        jsonb_build_object(
            'provider', NEW.provider,
            'email_confirmed', NEW.email_confirmed_at IS NOT NULL
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı auth.users tablosuna bağla
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Email doğrulama sonrası tetiklenecek fonksiyon
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    -- Email doğrulama logu
    IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
        INSERT INTO public.security_logs (user_id, event_type, details)
        VALUES (
            NEW.id,
            'email.confirmed',
            jsonb_build_object(
                'email', NEW.email,
                'confirmed_at', NEW.email_confirmed_at
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Email doğrulama trigger'ı
CREATE TRIGGER on_auth_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_email_confirmation();
