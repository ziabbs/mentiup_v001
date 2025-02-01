-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Roles policies
CREATE POLICY "Roles are viewable by authenticated users"
    ON public.roles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify roles"
    ON public.roles FOR ALL
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

-- User roles policies
CREATE POLICY "Users can view own roles"
    ON public.user_roles FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Only admins can modify user roles"
    ON public.user_roles FOR ALL
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

-- Sessions policies
CREATE POLICY "Users can view own sessions"
    ON public.sessions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
    ON public.sessions FOR DELETE
    USING (user_id = auth.uid());

-- Security logs policies
CREATE POLICY "Users can view own security logs"
    ON public.security_logs FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Only admins can view all security logs"
    ON public.security_logs FOR SELECT
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

-- Helper functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
    SELECT r.name
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_uuid
    ORDER BY r.name = 'admin' DESC, r.name = 'moderator' DESC
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_user_permission(user_uuid UUID, required_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_permissions JSONB;
BEGIN
    SELECT r.permissions INTO user_permissions
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_uuid
    ORDER BY r.name = 'admin' DESC
    LIMIT 1;

    RETURN (user_permissions->>'all')::boolean 
        OR required_permission = ANY(ARRAY(SELECT jsonb_array_elements_text(user_permissions->'permissions')));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
