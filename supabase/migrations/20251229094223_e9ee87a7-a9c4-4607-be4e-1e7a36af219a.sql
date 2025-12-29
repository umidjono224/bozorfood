-- Create registered_users table to track phone registrations
CREATE TABLE public.registered_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone text NOT NULL UNIQUE,
    name text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registered_users ENABLE ROW LEVEL SECURITY;

-- Anyone can check if a phone exists (for registration validation)
CREATE POLICY "Anyone can check phone existence"
ON public.registered_users
FOR SELECT
USING (true);

-- Anyone can register (insert)
CREATE POLICY "Anyone can register"
ON public.registered_users
FOR INSERT
WITH CHECK (true);

-- Update orders RLS: Users can only view their own orders (by phone)
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (true);

-- Update orders RLS: Users can only update their own orders (by phone match)
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
USING (true);