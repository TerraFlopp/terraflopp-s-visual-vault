-- Add subscriber_count column to trusted_clients table
ALTER TABLE public.trusted_clients 
ADD COLUMN subscriber_count text;