-- Fix function search path mutable warnings
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;