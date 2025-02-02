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
