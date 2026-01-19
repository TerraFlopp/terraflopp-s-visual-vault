-- Create trusted_clients table for "Ils m'ont fait confiance" section
CREATE TABLE public.trusted_clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trusted_clients ENABLE ROW LEVEL SECURITY;

-- Anyone can view trusted clients (public)
CREATE POLICY "Anyone can view trusted clients"
ON public.trusted_clients
FOR SELECT
USING (true);

-- Only admins can insert trusted clients
CREATE POLICY "Admins can insert trusted clients"
ON public.trusted_clients
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update trusted clients
CREATE POLICY "Admins can update trusted clients"
ON public.trusted_clients
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete trusted clients
CREATE POLICY "Admins can delete trusted clients"
ON public.trusted_clients
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_trusted_clients_updated_at
BEFORE UPDATE ON public.trusted_clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();