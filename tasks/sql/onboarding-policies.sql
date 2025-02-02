-- Enable RLS
ALTER TABLE public.onboarding_mentorship_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_option_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_user_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_user_expectations ENABLE ROW LEVEL SECURITY;

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
