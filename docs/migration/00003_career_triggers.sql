-- Create trigger function for handling new user career profile
CREATE OR REPLACE FUNCTION public.handle_new_user_career()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default career profile
    INSERT INTO public.career_profiles (user_id)
    VALUES (NEW.id);

    -- Create default user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);

    -- Create default privacy settings
    INSERT INTO public.privacy_settings (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created_career
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_career();

-- Create trigger function for profile visibility changes
CREATE OR REPLACE FUNCTION public.handle_privacy_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log privacy setting changes
    INSERT INTO public.security_logs (
        user_id,
        event_type,
        details
    ) VALUES (
        NEW.user_id,
        'privacy_settings.updated',
        jsonb_build_object(
            'profile_visibility', NEW.profile_visibility,
            'previous_visibility', OLD.profile_visibility,
            'show_email', NEW.show_email,
            'show_social_links', NEW.show_social_links
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for privacy setting changes
CREATE TRIGGER on_privacy_settings_updated
    AFTER UPDATE ON public.privacy_settings
    FOR EACH ROW
    WHEN (OLD.profile_visibility IS DISTINCT FROM NEW.profile_visibility
       OR OLD.show_email IS DISTINCT FROM NEW.show_email
       OR OLD.show_social_links IS DISTINCT FROM NEW.show_social_links)
    EXECUTE FUNCTION public.handle_privacy_changes();

-- Create trigger function for career profile updates
CREATE OR REPLACE FUNCTION public.handle_career_profile_updates()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate skills array
    IF NEW.skills IS NOT NULL AND jsonb_array_length(NEW.skills) > 50 THEN
        RAISE EXCEPTION 'Maximum 50 skills allowed';
    END IF;

    -- Validate mentoring areas
    IF NEW.mentoring_areas IS NOT NULL AND jsonb_array_length(NEW.mentoring_areas) > 10 THEN
        RAISE EXCEPTION 'Maximum 10 mentoring areas allowed';
    END IF;

    -- Validate URLs
    IF NEW.linkedin_url IS NOT NULL AND NEW.linkedin_url !~ '^https?:\/\/([a-zA-Z0-9-]+\.)*linkedin\.com' THEN
        RAISE EXCEPTION 'Invalid LinkedIn URL';
    END IF;

    IF NEW.github_url IS NOT NULL AND NEW.github_url !~ '^https?:\/\/([a-zA-Z0-9-]+\.)*github\.com' THEN
        RAISE EXCEPTION 'Invalid GitHub URL';
    END IF;

    -- Log significant changes
    IF OLD.current_title IS DISTINCT FROM NEW.current_title 
       OR OLD.experience_years IS DISTINCT FROM NEW.experience_years
       OR OLD.education_level IS DISTINCT FROM NEW.education_level THEN
        INSERT INTO public.security_logs (
            user_id,
            event_type,
            details
        ) VALUES (
            NEW.user_id,
            'career_profile.updated',
            jsonb_build_object(
                'field_changes', jsonb_build_object(
                    'current_title', jsonb_build_array(OLD.current_title, NEW.current_title),
                    'experience_years', jsonb_build_array(OLD.experience_years, NEW.experience_years),
                    'education_level', jsonb_build_array(OLD.education_level, NEW.education_level)
                )
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for career profile updates
CREATE TRIGGER on_career_profile_updated
    BEFORE UPDATE ON public.career_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_career_profile_updates();

-- Create function to automatically update user preferences
CREATE OR REPLACE FUNCTION public.handle_user_preferences_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure valid language setting
    IF NEW.language NOT IN ('tr', 'en') THEN
        NEW.language := 'tr';
    END IF;

    -- Ensure valid theme setting
    IF NEW.theme NOT IN ('light', 'dark', 'system') THEN
        NEW.theme := 'system';
    END IF;

    -- Ensure mentorship preferences are valid
    IF NEW.mentorship_preferences->>'available_for_mentoring' = 'true' 
       AND NOT EXISTS (
           SELECT 1 FROM public.career_profiles 
           WHERE user_id = NEW.user_id 
           AND array_length(mentoring_areas::text[]::text[], 1) > 0
       ) THEN
        NEW.mentorship_preferences := jsonb_set(
            NEW.mentorship_preferences::jsonb,
            '{available_for_mentoring}',
            'false'::jsonb
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user preferences validation
CREATE TRIGGER on_user_preferences_update
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_preferences_update();
