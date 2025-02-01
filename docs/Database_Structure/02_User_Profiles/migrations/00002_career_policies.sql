-- Güvenlik Politikaları

-- Career Profiles için RLS
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;

-- Herkes public profilleri görebilir
CREATE POLICY "Public profiles are viewable by everyone" ON public.career_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.privacy_settings ps 
            WHERE ps.user_id = career_profiles.user_id 
            AND ps.profile_visibility = 'public'
        )
    );

-- Kullanıcılar kendi profillerini yönetebilir
CREATE POLICY "Users can manage their own profile" ON public.career_profiles
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Documents için RLS
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- Belge görünürlük politikası
CREATE POLICY "Document visibility based on settings" ON public.user_documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.privacy_settings ps 
            WHERE ps.user_id = user_documents.user_id
            AND (
                -- Belge sahibi
                auth.uid() = user_documents.user_id 
                OR 
                -- Belge türüne göre görünürlük kontrolü
                (ps.document_visibility->>document_type)::text = 'public'
                OR 
                -- Connections kontrolü (burada implement edilecek)
                ((ps.document_visibility->>document_type)::text = 'connections' 
                 AND EXISTS (
                    -- Bağlantı kontrolü logic'i eklenecek
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid()
                 ))
            )
        )
    );

-- Kullanıcılar kendi belgelerini yönetebilir
CREATE POLICY "Users can manage their own documents" ON public.user_documents
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User Preferences için RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi tercihlerini görebilir ve yönetebilir
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Privacy Settings için RLS
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi gizlilik ayarlarını görebilir ve yönetebilir
CREATE POLICY "Users can manage their own privacy settings" ON public.privacy_settings
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Veri Maskeleme Politikaları
CREATE POLICY "Mask contact information" ON public.career_profiles
    FOR SELECT
    USING (true)
    WITH CHECK (auth.uid() = user_id)
    TRANSFORMING (
        linkedin_url AS CASE
            WHEN auth.uid() = user_id OR 
                 EXISTS (
                    SELECT 1 FROM public.privacy_settings ps 
                    WHERE ps.user_id = career_profiles.user_id 
                    AND (ps.contact_info_visibility->>'social_links')::text = 'public'
                 )
            THEN linkedin_url
            ELSE NULL
        END,
        github_url AS CASE
            WHEN auth.uid() = user_id OR 
                 EXISTS (
                    SELECT 1 FROM public.privacy_settings ps 
                    WHERE ps.user_id = career_profiles.user_id 
                    AND (ps.contact_info_visibility->>'social_links')::text = 'public'
                 )
            THEN github_url
            ELSE NULL
        END,
        portfolio_url AS CASE
            WHEN auth.uid() = user_id OR 
                 EXISTS (
                    SELECT 1 FROM public.privacy_settings ps 
                    WHERE ps.user_id = career_profiles.user_id 
                    AND (ps.contact_info_visibility->>'social_links')::text = 'public'
                 )
            THEN portfolio_url
            ELSE NULL
        END
    );

-- Admin Politikaları
CREATE POLICY "Admins have full access to career profiles" ON public.career_profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins have full access to user documents" ON public.user_documents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins have full access to user preferences" ON public.user_preferences
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins have full access to privacy settings" ON public.privacy_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );
