-- Drop the existing constraint and recreate with tiktok included
ALTER TABLE public.videos DROP CONSTRAINT IF EXISTS videos_video_type_check;
ALTER TABLE public.videos ADD CONSTRAINT videos_video_type_check CHECK (video_type IN ('youtube', 'upload', 'tiktok'));