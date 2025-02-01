-- Tetikleyiciler ve Otomatik İşlemler

-- Yeni Kullanıcı için Profil Oluşturma
CREATE OR REPLACE FUNCTION handle_new_user_career_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Kariyer profili oluştur
    INSERT INTO public.career_profiles (user_id)
    VALUES (NEW.id);
    
    -- Kullanıcı tercihleri oluştur
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    -- Gizlilik ayarları oluştur
    INSERT INTO public.privacy_settings (user_id)
    VALUES (NEW.id);
    
    -- Güvenlik logu oluştur
    INSERT INTO public.security_audit_logs (
        user_id,
        event_type,
        event_details,
        severity
    ) VALUES (
        NEW.id,
        'career_profile_created',
        jsonb_build_object(
            'profile_id', NEW.id,
            'initial_completion_rate', 0
        ),
        'info'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profil Tamamlanma Oranı Trigger'ı
CREATE TRIGGER calculate_profile_completion
    BEFORE INSERT OR UPDATE ON public.career_profiles
    FOR EACH ROW
    EXECUTE FUNCTION calculate_profile_completion_rate();

-- Belge Yükleme Trigger'ı
CREATE OR REPLACE FUNCTION log_document_upload()
RETURNS TRIGGER AS $$
BEGIN
    -- Güvenlik logu oluştur
    INSERT INTO public.security_audit_logs (
        user_id,
        event_type,
        event_details,
        severity
    ) VALUES (
        NEW.user_id,
        'document_uploaded',
        jsonb_build_object(
            'document_id', NEW.id,
            'document_type', NEW.document_type,
            'file_size', NEW.file_size,
            'file_type', NEW.file_type
        ),
        'info'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_document_upload_trigger
    AFTER INSERT ON public.user_documents
    FOR EACH ROW
    EXECUTE FUNCTION log_document_upload();

-- Gizlilik Ayarları Değişiklik Trigger'ı
CREATE OR REPLACE FUNCTION log_privacy_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD IS DISTINCT FROM NEW THEN
        INSERT INTO public.security_audit_logs (
            user_id,
            event_type,
            event_details,
            severity
        ) VALUES (
            NEW.user_id,
            'privacy_settings_changed',
            jsonb_build_object(
                'old_visibility', OLD.profile_visibility,
                'new_visibility', NEW.profile_visibility,
                'changed_at', now()
            ),
            'info'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_privacy_changes_trigger
    AFTER UPDATE ON public.privacy_settings
    FOR EACH ROW
    EXECUTE FUNCTION log_privacy_changes();

-- Yeni Kullanıcı Trigger'ı
CREATE TRIGGER create_career_profile_for_new_user
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_career_profile();
