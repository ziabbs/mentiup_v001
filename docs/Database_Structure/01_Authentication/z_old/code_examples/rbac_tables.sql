-- Rol Tabloları ve Politikaları

-- Rol Tablosu
CREATE TABLE public.roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE,
    description text,
    permissions jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Kullanıcı Rolleri
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    role_id uuid REFERENCES public.roles(id),
    assigned_by uuid REFERENCES auth.users(id),
    assigned_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role_id)
);

-- Varsayılan roller
INSERT INTO public.roles (name, description, permissions) VALUES
    ('admin', 'Tam sistem erişimi', '{
        "all": true,
        "users": ["read", "write", "delete"],
        "content": ["read", "write", "delete"],
        "system": ["configure", "manage"],
        "security": ["manage", "audit"]
    }'),
    ('moderator', 'Moderatör erişimi', '{
        "chat": ["read", "moderate", "manage"],
        "content": ["read", "moderate"],
        "users": ["read", "report"],
        "support": ["handle", "escalate"]
    }'),
    ('premium_user', 'Premium üye erişimi', '{
        "features": ["all"],
        "ai": ["unlimited"],
        "content": ["read", "premium"],
        "support": ["priority"]
    }'),
    ('standard_user', 'Standart üye erişimi', '{
        "features": ["basic"],
        "ai": ["limited"],
        "content": ["read", "basic"],
        "community": ["participate"]
    }'),
    ('guest', 'Misafir erişimi', '{
        "content": ["read_demo"],
        "features": ["preview"],
        "register": ["allowed"]
    }');

-- RLS Politikaları
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Rol görüntüleme politikası
CREATE POLICY "Roles are viewable by admins"
    ON public.roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role_id IN (
                SELECT id FROM public.roles
                WHERE name IN ('admin')
            )
        )
    );

-- İzin kontrolü fonksiyonu
CREATE OR REPLACE FUNCTION check_permission(
    user_id uuid,
    required_permission text
)
RETURNS boolean AS $$
DECLARE
    user_permissions jsonb;
BEGIN
    SELECT r.permissions INTO user_permissions
    FROM public.roles r
    JOIN public.user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = user_id
    LIMIT 1;

    RETURN (user_permissions->required_permission)::boolean;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rol değişiklik logları
CREATE TABLE public.role_change_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    old_role_id uuid REFERENCES public.roles(id),
    new_role_id uuid REFERENCES public.roles(id),
    changed_by uuid REFERENCES auth.users(id),
    reason text,
    created_at timestamptz DEFAULT now()
);
