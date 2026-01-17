-- =====================================================
-- COMPLETE RLS FIX FOR PRODUCTS SYSTEM
-- Run this ENTIRE script in Supabase SQL Editor
-- https://supabase.com/dashboard/project/torqbmnzwfwmylmfxfhn/sql/new
-- =====================================================

-- =====================================================
-- STEP 1: FIX PRODUCTS TABLE RLS
-- =====================================================

-- Drop ALL existing policies on products table
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'products'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON products', policy_name);
    END LOOP;
END $$;

-- Disable then re-enable RLS to reset
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy 1: ANYONE can READ products (public catalog)
CREATE POLICY "Public can view all products"
ON products FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 2: Only authenticated users can INSERT products
CREATE POLICY "Authenticated users can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Only authenticated users can UPDATE products
CREATE POLICY "Authenticated users can update products"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Only authenticated users can DELETE products
CREATE POLICY "Authenticated users can delete products"
ON products FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- STEP 2: FIX ORDERS TABLE RLS
-- =====================================================

DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'orders'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON orders', policy_name);
    END LOOP;
END $$;

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Service role (Edge Functions) can manage all orders
CREATE POLICY "Service role can manage orders"
ON orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Authenticated users (admin) can view all orders
CREATE POLICY "Authenticated users can view orders"
ON orders FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- STEP 3: FIX EMAIL_LOGS TABLE RLS
-- =====================================================

DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'email_logs'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON email_logs', policy_name);
    END LOOP;
END $$;

ALTER TABLE email_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Service role (Edge Functions) can insert/select email logs
CREATE POLICY "Service role can manage email logs"
ON email_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Authenticated users (admin) can view all email logs
CREATE POLICY "Authenticated users can view email logs"
ON email_logs FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- STEP 4: CREATE STORAGE POLICIES FOR PRODUCTS BUCKET
-- =====================================================

-- First, ensure the bucket exists and is private
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Ensure blog-images bucket exists and is PUBLIC (for thumbnails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop all existing storage policies for products bucket
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname LIKE '%products%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
    END LOOP;
END $$;

-- Policy: Authenticated users (admin) can upload files
CREATE POLICY "Admin can upload product files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Policy: Authenticated users (admin) can update files
CREATE POLICY "Admin can update product files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- Policy: Authenticated users (admin) can delete files
CREATE POLICY "Admin can delete product files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');

-- Policy: Authenticated users (admin) can view files
CREATE POLICY "Admin can view product files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'products');

-- Policy: Service role can do everything (for Edge Functions generating signed URLs)
CREATE POLICY "Service role full access to products"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- =====================================================
-- STEP 4B: FIX BLOG-IMAGES BUCKET POLICIES
-- =====================================================

-- Drop existing blog-images policies
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname LIKE '%blog%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
    END LOOP;
END $$;

-- Anyone can view blog images (public bucket)
CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'blog-images');

-- Authenticated users can upload blog images
CREATE POLICY "Admin can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Authenticated users can update blog images
CREATE POLICY "Admin can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

-- Authenticated users can delete blog images
CREATE POLICY "Admin can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- =====================================================
-- STEP 4C: FIX BLOG_IMAGES TABLE RLS
-- =====================================================

DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'blog_images'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON blog_images', policy_name);
    END LOOP;
END $$;

ALTER TABLE blog_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view blog images
CREATE POLICY "Anyone can view blog images table"
ON blog_images FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated users can insert blog images
CREATE POLICY "Authenticated can insert blog images"
ON blog_images FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can delete blog images
CREATE POLICY "Authenticated can delete blog images"
ON blog_images FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- STEP 5: GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO anon;

-- Grant select on buckets
GRANT SELECT ON storage.buckets TO authenticated;
GRANT SELECT ON storage.buckets TO anon;

-- =====================================================
-- VERIFICATION: Check if policies are applied
-- =====================================================

-- This should show all the new policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('products', 'orders', 'email_logs')
   OR (schemaname = 'storage' AND policyname LIKE '%product%')
ORDER BY tablename, policyname;
