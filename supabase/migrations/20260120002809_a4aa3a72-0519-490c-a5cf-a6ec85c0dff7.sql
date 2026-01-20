-- Add views_count column to videos table
ALTER TABLE public.videos 
ADD COLUMN views_count text;