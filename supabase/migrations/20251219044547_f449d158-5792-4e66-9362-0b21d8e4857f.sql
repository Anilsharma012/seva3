-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create enum for fee levels
CREATE TYPE public.fee_level AS ENUM ('village', 'block', 'district', 'haryana');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    father_name TEXT,
    mother_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT DEFAULT 'Haryana',
    pincode TEXT,
    date_of_birth DATE,
    gender TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    registration_number TEXT UNIQUE NOT NULL,
    class TEXT NOT NULL,
    roll_number TEXT,
    fee_level fee_level NOT NULL DEFAULT 'village',
    fee_amount INTEGER NOT NULL DEFAULT 99,
    fee_paid BOOLEAN DEFAULT false,
    payment_date TIMESTAMP WITH TIME ZONE,
    admit_card_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create results table
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    exam_name TEXT NOT NULL,
    marks_obtained INTEGER,
    total_marks INTEGER DEFAULT 100,
    grade TEXT,
    rank INTEGER,
    result_date DATE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memberships table
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    member_email TEXT,
    member_phone TEXT NOT NULL,
    member_address TEXT,
    membership_type TEXT DEFAULT 'regular',
    membership_number TEXT UNIQUE,
    qr_code_url TEXT,
    upi_id TEXT,
    is_active BOOLEAN DEFAULT true,
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_name TEXT NOT NULL,
    donor_email TEXT,
    donor_phone TEXT,
    amount INTEGER NOT NULL,
    payment_method TEXT,
    transaction_id TEXT,
    purpose TEXT,
    status TEXT DEFAULT 'pending',
    donation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content table for dynamic content management
CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL UNIQUE,
    title TEXT,
    content JSONB,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create gallery table
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team members table
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    photo_url TEXT,
    phone TEXT,
    email TEXT,
    bio TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to generate registration number
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    reg_num TEXT;
    year_part TEXT;
    seq_num INTEGER;
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(registration_number FROM 9) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM public.students
    WHERE registration_number LIKE 'MWSS' || year_part || '%';
    
    reg_num := 'MWSS' || year_part || LPAD(seq_num::TEXT, 4, '0');
    RETURN reg_num;
END;
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for students
CREATE POLICY "Students can view their own record"
ON public.students FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own record"
ON public.students FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all students"
ON public.students FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for results
CREATE POLICY "Students can view their own results"
ON public.results FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.students s
        WHERE s.id = results.student_id AND s.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all results"
ON public.results FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for memberships
CREATE POLICY "Users can view their own membership"
ON public.memberships FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create membership"
ON public.memberships FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage all memberships"
ON public.memberships FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for donations (public read for transparency)
CREATE POLICY "Anyone can view donations"
ON public.donations FOR SELECT
USING (true);

CREATE POLICY "Anyone can create donation"
ON public.donations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage donations"
ON public.donations FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for site_content (public read)
CREATE POLICY "Anyone can view site content"
ON public.site_content FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for gallery (public read)
CREATE POLICY "Anyone can view gallery"
ON public.gallery FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage gallery"
ON public.gallery FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for team_members (public read)
CREATE POLICY "Anyone can view team members"
ON public.team_members FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage team members"
ON public.team_members FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for services (public read)
CREATE POLICY "Anyone can view services"
ON public.services FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();