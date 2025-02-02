-- Create expectations table
CREATE TABLE IF NOT EXISTS public.expectations (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.expectations ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
    ON public.expectations
    FOR SELECT
    USING (true);

-- Only allow admins to modify
CREATE POLICY "Only admins can modify expectations"
    ON public.expectations
    FOR ALL
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

-- Insert default expectations
INSERT INTO public.expectations (id, text) VALUES
    ('user_expectations_career_growth', 'Kariyerimde ilerleme ve büyüme fırsatları yakalamak istiyorum'),
    ('user_expectations_skill_development', 'Yeni beceriler geliştirmek ve mevcut yeteneklerimi güçlendirmek istiyorum'),
    ('user_expectations_networking', 'Sektördeki diğer profesyonellerle bağlantı kurmak ve network''ümü genişletmek istiyorum'),
    ('user_expectations_guidance', 'Kariyerimle ilgili zorlu kararlarda rehberlik ve destek almak istiyorum'),
    ('user_expectations_feedback', 'Düzenli geri bildirim ve yapıcı eleştiriler almak istiyorum')
ON CONFLICT (id) DO NOTHING;
