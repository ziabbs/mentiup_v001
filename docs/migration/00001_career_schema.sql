-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Career Profiles table
CREATE TABLE public.career_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    current_title TEXT,
    experience_years INTEGER,
    education_level TEXT,
    skills JSONB DEFAULT '[]',
    interests JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    mentoring_areas JSONB DEFAULT '[]',
    learning_areas JSONB DEFAULT '[]',
    bio TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User Preferences table
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    language TEXT DEFAULT 'tr',
    theme TEXT DEFAULT 'light',
    email_notifications JSONB DEFAULT '{
        "mentorship_requests": true,
        "messages": true,
        "career_updates": true,
        "learning_reminders": true,
        "newsletter": true
    }',
    push_notifications JSONB DEFAULT '{
        "mentorship_requests": true,
        "messages": true,
        "career_updates": true,
        "learning_reminders": true
    }',
    mentorship_preferences JSONB DEFAULT '{
        "available_for_mentoring": false,
        "seeking_mentor": false,
        "preferred_meeting_times": [],
        "preferred_communication_methods": ["video", "chat"]
    }',
    learning_preferences JSONB DEFAULT '{
        "preferred_learning_style": "visual",
        "preferred_content_types": ["video", "interactive"],
        "daily_learning_goal_minutes": 30
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Privacy Settings table
CREATE TABLE public.privacy_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_visibility TEXT DEFAULT 'public',
    show_email BOOLEAN DEFAULT false,
    show_social_links BOOLEAN DEFAULT true,
    show_learning_progress BOOLEAN DEFAULT true,
    show_mentorship_status BOOLEAN DEFAULT true,
    show_skills BOOLEAN DEFAULT true,
    show_certifications BOOLEAN DEFAULT true,
    searchable BOOLEAN DEFAULT true,
    allow_messages_from TEXT DEFAULT 'all', -- all, connections, none
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_career_profiles_user_id ON public.career_profiles(user_id);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_privacy_settings_user_id ON public.privacy_settings(user_id);

-- Add updated_at trigger to all tables
CREATE TRIGGER handle_updated_at_career_profiles
    BEFORE UPDATE ON public.career_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_preferences
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_privacy_settings
    BEFORE UPDATE ON public.privacy_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
