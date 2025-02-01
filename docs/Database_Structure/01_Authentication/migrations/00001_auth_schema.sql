-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles table
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Sessions table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    refresh_token TEXT UNIQUE,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security logs table
CREATE TABLE public.security_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
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

-- Create updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_roles
    BEFORE UPDATE ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_roles
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
