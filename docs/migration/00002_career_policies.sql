-- Enable Row Level Security
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Career Profiles Policies
CREATE POLICY "Users can view their own career profile"
    ON public.career_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view public career profiles"
    ON public.career_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.privacy_settings ps
            WHERE ps.user_id = career_profiles.user_id
            AND ps.profile_visibility = 'public'
        )
    );

CREATE POLICY "Users can update their own career profile"
    ON public.career_profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own career profile"
    ON public.career_profiles FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career profile"
    ON public.career_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- User Preferences Policies
CREATE POLICY "Users can view their own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
    ON public.user_preferences FOR DELETE
    USING (auth.uid() = user_id);

-- Privacy Settings Policies
CREATE POLICY "Users can view their own privacy settings"
    ON public.privacy_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy settings"
    ON public.privacy_settings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own privacy settings"
    ON public.privacy_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own privacy settings"
    ON public.privacy_settings FOR DELETE
    USING (auth.uid() = user_id);

-- Data Masking Functions
CREATE OR REPLACE FUNCTION public.mask_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
    IF email IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN REGEXP_REPLACE(email, '^(.{2})(.*?)(@.*$)', '\1***\3');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.mask_url(url TEXT)
RETURNS TEXT AS $$
BEGIN
    IF url IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN CASE 
        WHEN url LIKE '%linkedin.com%' THEN 'LinkedIn Profile'
        WHEN url LIKE '%github.com%' THEN 'GitHub Profile'
        ELSE 'External Profile'
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create masked view for public profile data
CREATE OR REPLACE VIEW public.masked_career_profiles AS
SELECT 
    cp.id,
    cp.user_id,
    cp.current_title,
    cp.experience_years,
    cp.education_level,
    cp.skills,
    cp.mentoring_areas,
    cp.bio,
    CASE 
        WHEN ps.show_email THEN p.email
        ELSE public.mask_email(p.email)
    END as email,
    CASE 
        WHEN ps.show_social_links THEN cp.linkedin_url
        ELSE public.mask_url(cp.linkedin_url)
    END as linkedin_url,
    CASE 
        WHEN ps.show_social_links THEN cp.github_url
        ELSE public.mask_url(cp.github_url)
    END as github_url,
    CASE 
        WHEN ps.show_social_links THEN cp.portfolio_url
        ELSE public.mask_url(cp.portfolio_url)
    END as portfolio_url
FROM 
    public.career_profiles cp
    JOIN public.profiles p ON p.id = cp.user_id
    JOIN public.privacy_settings ps ON ps.user_id = cp.user_id
WHERE 
    ps.profile_visibility = 'public';
