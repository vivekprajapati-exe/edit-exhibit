-- Ensure products table has correct RLS policies for public read access

-- Drop old policies
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Allow anyone (anon/authenticated) to read products
CREATE POLICY "Anyone can view products"
ON products
FOR SELECT
TO anon, authenticated
USING (true);

-- Admin-only write access (already exists but ensuring it's correct)
DROP POLICY IF EXISTS "Admin only can insert products" ON products;
DROP POLICY IF EXISTS "Admin only can update products" ON products;
DROP POLICY IF EXISTS "Admin only can delete products" ON products;

CREATE POLICY "Service role can manage products"
ON products
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
