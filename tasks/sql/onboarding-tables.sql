-- Mentorship Types Table
-- Stores the main mentorship types available in the system
CREATE TABLE public.onboarding_mentorship_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- Examples: career-development, senior-career, startup, senior-startup
    name TEXT NOT NULL, -- Display name of the mentorship type
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Option Categories Table
-- Defines different categories of options available for each mentorship type
CREATE TABLE public.onboarding_option_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- Format: {mentorship-type}_{category-type} (e.g., career-development_career_fields)
    mentorship_type_id UUID REFERENCES public.onboarding_mentorship_types(id),
    category_type TEXT NOT NULL, -- Examples: career_fields, industries, goals, stages
    name TEXT NOT NULL, -- Display name of the category
    description TEXT,
    is_required BOOLEAN DEFAULT false, -- Whether this category must be filled during onboarding
    allow_multiple BOOLEAN DEFAULT true, -- Whether multiple options can be selected
    display_order INTEGER DEFAULT 0, -- Order in which categories should be displayed
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mentorship_type_id, category_type)
);

-- Options Table
-- Contains individual options within each category
CREATE TABLE public.onboarding_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- Format: {mentorship-type}_{category-type}_{option} (e.g., career-development_career_fields_marketing)
    category_id UUID REFERENCES public.onboarding_option_categories(id),
    value TEXT NOT NULL, -- Unique identifier for the option
    name TEXT NOT NULL, -- Display name of the option
    description TEXT,
    icon TEXT, -- Emoji or icon identifier
    subcategories JSONB DEFAULT '[]', -- Array of subcategories (e.g., ["Digital Marketing", "Brand Management"])
    metadata JSONB DEFAULT '{}', -- Additional option-specific data
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Selections Table
-- Stores user selections for each category during onboarding
CREATE TABLE public.onboarding_user_selections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.onboarding_option_categories(id),
    selected_options JSONB DEFAULT '[]', -- Array of selected option values
    custom_input TEXT, -- For "Other" option input
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category_id)
);

-- User Expectations Table
-- Stores user's free-form expectations for the mentorship
CREATE TABLE public.onboarding_user_expectations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mentorship_type_id UUID REFERENCES public.onboarding_mentorship_types(id),
    expectation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.onboarding_mentorship_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_option_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_user_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_user_expectations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Mentorship Types: Viewable by everyone, modifiable by admins
CREATE POLICY "Mentorship types are viewable by everyone"
    ON public.onboarding_mentorship_types FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify mentorship types"
    ON public.onboarding_mentorship_types FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role_id IN (
                SELECT id FROM public.roles
                WHERE name = 'admin'
            )
        )
    );

-- Option Categories: Viewable by everyone, modifiable by admins
CREATE POLICY "Option categories are viewable by everyone"
    ON public.onboarding_option_categories FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify option categories"
    ON public.onboarding_option_categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role_id IN (
                SELECT id FROM public.roles
                WHERE name = 'admin'
            )
        )
    );

-- Options: Viewable by everyone, modifiable by admins
CREATE POLICY "Options are viewable by everyone"
    ON public.onboarding_options FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify options"
    ON public.onboarding_options FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role_id IN (
                SELECT id FROM public.roles
                WHERE name = 'admin'
            )
        )
    );

-- User Selections: Users can view and modify their own selections
CREATE POLICY "Users can view own selections"
    ON public.onboarding_user_selections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own selections"
    ON public.onboarding_user_selections FOR ALL
    USING (auth.uid() = user_id);

-- User Expectations: Users can view and modify their own expectations
CREATE POLICY "Users can view own expectations"
    ON public.onboarding_user_expectations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own expectations"
    ON public.onboarding_user_expectations FOR ALL
    USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at_mentorship_types
    BEFORE UPDATE ON public.onboarding_mentorship_types
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_option_categories
    BEFORE UPDATE ON public.onboarding_option_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_options
    BEFORE UPDATE ON public.onboarding_options
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_selections
    BEFORE UPDATE ON public.onboarding_user_selections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_expectations
    BEFORE UPDATE ON public.onboarding_user_expectations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Updated_at Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
