-- =====================================================
-- SECURITY FIXES FOR SUPABASE WARNINGS
-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/torqbmnzwfwmylmfxfhn/sql/new
-- =====================================================

-- =====================================================
-- FIX 1: Function Search Path Mutable
-- Set search_path to prevent SQL injection attacks
-- =====================================================

-- Fix cleanup_old_rate_limits function
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM public.rate_limit_log 
    WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$;

-- Fix update_tag_usage function
CREATE OR REPLACE FUNCTION public.update_tag_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update tag usage count logic here
    RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =====================================================
-- FIX 2: RLS Policies - Restrict to Admin Only
-- Admin email: scuti.bgstar@gmail.com
-- =====================================================

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND email = 'scuti.bgstar@gmail.com'
    );
$$;

-- =====================================================
-- FIX 2A: Products Table - Admin Only Operations
-- =====================================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Create admin-only policies
CREATE POLICY "Admin can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update products"
ON products FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete products"
ON products FOR DELETE
TO authenticated
USING (public.is_admin());

-- =====================================================
-- FIX 2B: Blog Images Table - Admin Only Operations
-- =====================================================

DROP POLICY IF EXISTS "Authenticated can insert blog images" ON blog_images;
DROP POLICY IF EXISTS "Authenticated can delete blog images" ON blog_images;

CREATE POLICY "Admin can insert blog images"
ON blog_images FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete blog images"
ON blog_images FOR DELETE
TO authenticated
USING (public.is_admin());

-- =====================================================
-- FIX 2C: Rate Limit Log - Service Role Only
-- This table should ONLY be accessed by Edge Functions
-- =====================================================

-- Drop existing policy
DROP POLICY IF EXISTS "Rate limit logs manageable by service role" ON rate_limit_log;

-- Service role policies don't need USING/WITH CHECK since service_role bypasses RLS
-- But we need to ensure only service_role can access it
ALTER TABLE rate_limit_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Create a more restrictive policy - no access for regular users
-- Service role always bypasses RLS, so this effectively blocks everyone except service_role
CREATE POLICY "No public access to rate limit logs"
ON rate_limit_log FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- =====================================================
-- FIX 3: Auth Settings (Manual Steps Required)
-- =====================================================

-- NOTE: These settings must be changed in the Supabase Dashboard:
-- 
-- 1. OTP Expiry (reduce to < 1 hour):
--    Go to: Authentication > Email Templates > OTP Expiry
--    Set to: 3600 (1 hour) or less (recommended: 900 = 15 minutes)
--
-- 2. Leaked Password Protection:
--    Go to: Authentication > Providers > Email
--    Enable: "Prevent use of leaked passwords"
--
-- 3. Postgres Version Upgrade:
--    Go to: Project Settings > Infrastructure
--    Click: "Upgrade" to latest version

-- =====================================================
-- VERIFICATION: Check all policies
-- =====================================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('products', 'blog_images', 'rate_limit_log', 'orders', 'email_logs')
ORDER BY tablename, policyname;

-- =====================================================
-- VERIFICATION: Check functions have search_path set
-- =====================================================

SELECT 
    proname as function_name,
    proconfig as config
FROM pg_proc 
WHERE proname IN ('cleanup_old_rate_limits', 'update_tag_usage', 'update_updated_at_column', 'is_admin')
AND pronamespace = 'public'::regnamespace;
