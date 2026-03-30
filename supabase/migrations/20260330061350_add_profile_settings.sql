-- Add new columns to public.profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Insert storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies using IF NOT EXISTS logic
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'objects' AND policyname = 'Public Access for Avatars'
    ) THEN
        CREATE POLICY "Public Access for Avatars" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'objects' AND policyname = 'Auth Upload for Avatars'
    ) THEN
        CREATE POLICY "Auth Upload for Avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'avatars' );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'objects' AND policyname = 'Auth Update for Avatars'
    ) THEN
        CREATE POLICY "Auth Update for Avatars" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'avatars' );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'objects' AND policyname = 'Auth Delete for Avatars'
    ) THEN
        CREATE POLICY "Auth Delete for Avatars" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'avatars' );
    END IF;
END $$;
