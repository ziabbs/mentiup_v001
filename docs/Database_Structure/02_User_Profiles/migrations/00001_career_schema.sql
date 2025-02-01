-- Kariyer Profili ve İlgili Tablolar

-- Kariyer Profili Tablosu
CREATE TABLE IF NOT EXISTS public.career_profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text,
    current_position text,
    industry text,
    experience_years integer,
    education_level text,
    skills jsonb DEFAULT '[]'::jsonb,
    interests jsonb DEFAULT '[]'::jsonb,
    bio text,
    linkedin_url text,
    github_url text,
    portfolio_url text,
    achievements jsonb DEFAULT '[]'::jsonb,
    certifications jsonb DEFAULT '[]'::jsonb,
    mentor_preferences jsonb DEFAULT '{}'::jsonb,
    profile_completion_rate integer DEFAULT 0,
    is_looking_for_mentor boolean DEFAULT false,
    is_available_as_mentor boolean DEFAULT false,
    last_updated timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_profile_completion_rate CHECK (profile_completion_rate BETWEEN 0 AND 100)
);

-- Belge Yönetimi Tablosu
CREATE TABLE IF NOT EXISTS public.user_documents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type text NOT NULL CHECK (document_type IN ('cv', 'certificate', 'portfolio', 'other')),
    title text NOT NULL,
    description text,
    file_path text NOT NULL,
    file_size bigint NOT NULL,
    file_type text NOT NULL,
    is_primary boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb,
    uploaded_at timestamptz DEFAULT now(),
    last_updated timestamptz DEFAULT now()
);

-- Kullanıcı Tercihleri Tablosu
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications jsonb DEFAULT '{
        "mentor_requests": true,
        "messages": true,
        "career_opportunities": true,
        "profile_views": true,
        "system_updates": true
    }'::jsonb,
    app_preferences jsonb DEFAULT '{
        "theme": "light",
        "language": "tr",
        "accessibility": {
            "high_contrast": false,
            "font_size": "medium",
            "screen_reader": false
        }
    }'::jsonb,
    mentor_matching_preferences jsonb DEFAULT '{
        "industries": [],
        "experience_level": "any",
        "meeting_frequency": "weekly",
        "communication_style": "any",
        "languages": ["tr"]
    }'::jsonb,
    last_updated timestamptz DEFAULT now()
);

-- Profil Görünürlük Ayarları Tablosu
CREATE TABLE IF NOT EXISTS public.privacy_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    profile_visibility text DEFAULT 'public' CHECK (profile_visibility IN ('public', 'connections', 'private')),
    contact_info_visibility jsonb DEFAULT '{
        "email": "connections",
        "phone": "private",
        "social_links": "public"
    }'::jsonb,
    document_visibility jsonb DEFAULT '{
        "cv": "connections",
        "certificates": "public",
        "portfolio": "public"
    }'::jsonb,
    searchable boolean DEFAULT true,
    show_online_status boolean DEFAULT true,
    last_updated timestamptz DEFAULT now()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_career_profiles_user_id ON public.career_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_career_profiles_skills ON public.career_profiles USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_career_profiles_industry ON public.career_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON public.user_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON public.privacy_settings(user_id);

-- Unique Constraints
ALTER TABLE public.career_profiles ADD CONSTRAINT unique_user_career_profile UNIQUE (user_id);
ALTER TABLE public.user_preferences ADD CONSTRAINT unique_user_preferences UNIQUE (user_id);
ALTER TABLE public.privacy_settings ADD CONSTRAINT unique_user_privacy_settings UNIQUE (user_id);

-- Otomatik Güncelleme Fonksiyonları
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Last Updated Triggers
CREATE TRIGGER update_career_profiles_last_updated
    BEFORE UPDATE ON public.career_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated();

CREATE TRIGGER update_user_documents_last_updated
    BEFORE UPDATE ON public.user_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated();

CREATE TRIGGER update_user_preferences_last_updated
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated();

CREATE TRIGGER update_privacy_settings_last_updated
    BEFORE UPDATE ON public.privacy_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated();

-- Profil Tamamlanma Oranı Hesaplama Fonksiyonu
CREATE OR REPLACE FUNCTION calculate_profile_completion_rate()
RETURNS TRIGGER AS $$
DECLARE
    completion_rate integer := 0;
    total_fields integer := 10;
    filled_fields integer := 0;
BEGIN
    -- Ana alanları kontrol et
    IF NEW.title IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.current_position IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.industry IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.experience_years IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.education_level IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF NEW.bio IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    
    -- JSON alanları kontrol et
    IF jsonb_array_length(NEW.skills) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF jsonb_array_length(NEW.interests) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF jsonb_array_length(NEW.achievements) > 0 THEN filled_fields := filled_fields + 1; END IF;
    IF jsonb_array_length(NEW.certifications) > 0 THEN filled_fields := filled_fields + 1; END IF;
    
    -- Oranı hesapla
    completion_rate := (filled_fields::float / total_fields::float * 100)::integer;
    
    -- Yeni değeri ata
    NEW.profile_completion_rate := completion_rate;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
