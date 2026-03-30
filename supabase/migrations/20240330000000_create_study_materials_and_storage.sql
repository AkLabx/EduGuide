-- Create study_materials table
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'pdf', 'video', 'notes'
    file_url TEXT NOT NULL,
    size TEXT,
    target_class TEXT,
    target_board TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Create policies for study_materials
CREATE POLICY "Enable read access for all users" ON public.study_materials
    FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert (you may want to restrict this to admins later)
CREATE POLICY "Enable insert for authenticated users" ON public.study_materials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.study_materials
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.study_materials
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for study materials
INSERT INTO storage.buckets (id, name, public) VALUES ('study-materials', 'study-materials', true) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for homework
INSERT INTO storage.buckets (id, name, public) VALUES ('homework', 'homework', true) ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for study-materials
CREATE POLICY "Public Access study-materials" ON storage.objects
    FOR SELECT USING (bucket_id = 'study-materials');

CREATE POLICY "Auth Insert study-materials" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'study-materials' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Update study-materials" ON storage.objects
    FOR UPDATE USING (bucket_id = 'study-materials' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Delete study-materials" ON storage.objects
    FOR DELETE USING (bucket_id = 'study-materials' AND auth.role() = 'authenticated');

-- Set up storage policies for homework
CREATE POLICY "Public Access homework" ON storage.objects
    FOR SELECT USING (bucket_id = 'homework');

CREATE POLICY "Auth Insert homework" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'homework' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Update homework" ON storage.objects
    FOR UPDATE USING (bucket_id = 'homework' AND auth.role() = 'authenticated');

CREATE POLICY "Auth Delete homework" ON storage.objects
    FOR DELETE USING (bucket_id = 'homework' AND auth.role() = 'authenticated');
