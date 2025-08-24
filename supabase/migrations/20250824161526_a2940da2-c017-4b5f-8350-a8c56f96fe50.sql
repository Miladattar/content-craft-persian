-- Create admin settings table for various configuration options
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'array')),
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hook banks table for managing content hooks
CREATE TABLE public.hook_banks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  target_audience TEXT,
  tone TEXT,
  industry TEXT,
  template_type TEXT,
  performance_score INTEGER DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
  usage_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prompts table for AI prompt management
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  system_prompt TEXT,
  user_prompt_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  max_tokens INTEGER DEFAULT 1000,
  temperature DECIMAL(2,1) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  model TEXT DEFAULT 'gpt-4',
  is_active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(template_type, version)
);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hook_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for admin access
CREATE POLICY "Only admins can manage settings"
ON public.admin_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins and editors can view hook banks"
ON public.hook_banks
FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can manage hook banks"
ON public.hook_banks
FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can view prompts"
ON public.prompts
FOR SELECT
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can manage prompts"
ON public.prompts
FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_hook_banks_category ON public.hook_banks(category);
CREATE INDEX idx_hook_banks_template_type ON public.hook_banks(template_type);
CREATE INDEX idx_hook_banks_is_active ON public.hook_banks(is_active);
CREATE INDEX idx_hook_banks_tags ON public.hook_banks USING GIN(tags);
CREATE INDEX idx_prompts_template_type ON public.prompts(template_type);
CREATE INDEX idx_prompts_is_active ON public.prompts(is_active);
CREATE INDEX idx_admin_settings_category ON public.admin_settings(category);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hook_banks_updated_at
  BEFORE UPDATE ON public.hook_banks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin settings
INSERT INTO public.admin_settings (setting_key, setting_value, setting_type, display_name, description, category) VALUES
('max_daily_generations', '100', 'number', 'حداکثر تولید روزانه', 'حداکثر تعداد محتوای قابل تولید در روز', 'limits'),
('default_tone', '"خودمونی-حرفه‌ای"', 'string', 'لحن پیش‌فرض', 'لحن پیش‌فرض برای تولید محتوا', 'content'),
('enabled_templates', '["Story", "Limit", "Contrast", "WrongRight"]', 'array', 'قالب‌های فعال', 'لیست قالب‌های فعال سیستم', 'templates'),
('maintenance_mode', 'false', 'boolean', 'حالت تعمیرات', 'فعال‌سازی حالت تعمیرات سایت', 'system');

-- Insert sample hook banks
INSERT INTO public.hook_banks (title, content, category, target_audience, tone, industry, template_type, tags) VALUES
('قلاب فروش محصول', 'آیا می‌دانید که ۸۰٪ مردم این اشتباه را می‌کنند؟', 'فروش', 'عموم', 'خودمونی-حرفه‌ای', 'عمومی', 'Story', ARRAY['فروش', 'آمار', 'اشتباه']),
('قلاب آموزشی', 'بزرگترین دروغی که درباره این موضوع شنیده‌اید چیست؟', 'آموزشی', 'علاقه‌مندان یادگیری', 'خودمونی', 'آموزش', 'Contrast', ARRAY['آموزش', 'دروغ', 'واقعیت']),
('قلاب خدماتی', 'قبل از اینکه این کار را بکنید، این ۳ نکته را بدانید', 'خدماتی', 'مشتریان بالقوه', 'رسمی', 'خدمات', 'Warning', ARRAY['نکته', 'هشدار', 'راهنمایی']);

-- Insert sample prompts
INSERT INTO public.prompts (name, template_type, system_prompt, user_prompt_template, variables, description) VALUES
('پرامپت استوری', 'Story', 
'شما یک متخصص تولید محتوای فارسی هستید. وظیفه شما ساخت استوری‌های جذاب و کوتاه است.',
'برای موضوع "{topic}" و مخاطب "{audience}" یک استوری {tone} بنویسید که شامل قلاب قوی، روایت ۱۲۰-۲۰۰ کلمه‌ای و CTA مناسب باشد.',
'["topic", "audience", "tone"]',
'پرامپت تولید استوری‌های جذاب'),

('پرامپت تضاد', 'Contrast',
'شما یک متخصص تولید محتوای فارسی هستید که در ایجاد تضاد و کشف باورهای غلط تخصص دارید.',
'درباره "{topic}" یک محتوا بنویسید که تضاد بین باور رایج "{common_belief}" و واقعیت را نشان دهد. لحن {tone} باشد.',
'["topic", "common_belief", "tone"]',
'پرامپت تولید محتوای تضاد و باورهای غلط');