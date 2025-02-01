-- RBAC Politikaları ve Erişim Kontrolleri

-- Rol bazlı erişim politikaları
CREATE POLICY "Users can read their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
    ON public.user_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('admin', 'super_admin')
        )
    );

-- Frontend erişim kontrolleri
/*
const ProtectedRoute = ({ requiredRole, children }) => {
    const { user, role } = useAuth();
    
    if (!user || role !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
};
*/

-- API erişim kontrolleri
/*
export const checkRole = (requiredRole: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        const hasRole = await supabase
            .from('user_roles')
            .select('roles!inner(*)')
            .eq('user_id', user.id)
            .eq('roles.name', requiredRole)
            .single();

        if (!hasRole) {
            return res.status(403).json({
                error: 'Yetersiz yetki'
            });
        }
        next();
    };
};
*/

-- İzin kullanım analizi
CREATE TABLE public.permission_usage_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    permission text NOT NULL,
    resource_type text NOT NULL,
    resource_id uuid,
    action text NOT NULL,
    success boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);
