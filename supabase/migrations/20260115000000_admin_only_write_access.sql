-- =============================================
-- ADMIN-ONLY WRITE ACCESS RLS POLICIES
-- Only scuti.bgstar@gmail.com can INSERT/UPDATE/DELETE
-- Everyone can SELECT (read)
-- =============================================

-- =============================================
-- PRODUCTS TABLE - Admin-Only Write
-- =============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
DROP POLICY IF EXISTS "Admin can insert products" ON products;
DROP POLICY IF EXISTS "Admin can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;

-- Enable RLS on products (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- SELECT: Anyone can read products
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

-- INSERT: Only admin can create
CREATE POLICY "Admin can insert products"
  ON products
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- UPDATE: Only admin can update
CREATE POLICY "Admin can update products"
  ON products
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- DELETE: Only admin can delete
CREATE POLICY "Admin can delete products"
  ON products
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- =============================================
-- BLOG_POSTS TABLE - Admin-Only Write
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can delete blog posts" ON blog_posts;

-- SELECT: Anyone can read published posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  USING (is_published = true);

-- SELECT: Admin can see all posts (including drafts)
CREATE POLICY "Admin can view all blog posts"
  ON blog_posts
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- INSERT: Only admin can create
CREATE POLICY "Admin can insert blog posts"
  ON blog_posts
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- UPDATE: Only admin can update
CREATE POLICY "Admin can update blog posts"
  ON blog_posts
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- DELETE: Only admin can delete
CREATE POLICY "Admin can delete blog posts"
  ON blog_posts
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- =============================================
-- CONTENT_TAGS TABLE - Admin-Only Write
-- =============================================

-- Enable RLS on content_tags
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

-- SELECT: Anyone can read tags
CREATE POLICY "Anyone can view content tags"
  ON content_tags
  FOR SELECT
  USING (true);

-- INSERT: Only admin can create (auto-created by blog posts, so allow system)
CREATE POLICY "Admin can insert content tags"
  ON content_tags
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- UPDATE: Only admin can update
CREATE POLICY "Admin can update content tags"
  ON content_tags
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- DELETE: Only admin can delete
CREATE POLICY "Admin can delete content tags"
  ON content_tags
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- =============================================
-- BLOG_IMAGES TABLE - Admin-Only Write
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view all blog images" ON blog_images;
DROP POLICY IF EXISTS "Authenticated users can insert blog images" ON blog_images;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON blog_images;

-- SELECT: Anyone can read blog images
CREATE POLICY "Anyone can view blog images"
  ON blog_images
  FOR SELECT
  USING (true);

-- INSERT: Only admin can upload
CREATE POLICY "Admin can insert blog images"
  ON blog_images
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- DELETE: Only admin can delete
CREATE POLICY "Admin can delete blog images"
  ON blog_images
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- =============================================
-- ORDERS TABLE - Keep existing service role policies
-- Users should be able to view their own orders
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Orders are insertable by service role" ON orders;
DROP POLICY IF EXISTS "Orders are viewable by service role" ON orders;

-- SELECT: Admin can see all orders
CREATE POLICY "Admin can view all orders"
  ON orders
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- SELECT: Users can see their own orders (by email)
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (
    user_email = auth.jwt() ->> 'email'
  );

-- INSERT: Service role only (Edge Functions)
CREATE POLICY "Service role can insert orders"
  ON orders
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
  );

-- UPDATE: Admin only can update order status
CREATE POLICY "Admin can update orders"
  ON orders
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- =============================================
-- STORAGE POLICIES - Update for admin-only
-- =============================================

-- Blog images bucket - Admin only can upload
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

CREATE POLICY "Admin can upload blog images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

CREATE POLICY "Admin can update blog images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'blog-images'
    AND auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

CREATE POLICY "Admin can delete blog images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'blog-images'
    AND auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- Products bucket - Admin only can upload
DROP POLICY IF EXISTS "Authenticated users can upload products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON storage.objects;

CREATE POLICY "Admin can upload products"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

CREATE POLICY "Admin can delete products"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'products'
    AND auth.jwt() ->> 'email' = 'scuti.bgstar@gmail.com'
  );

-- Anyone can view files from storage (already set as public buckets)
-- No change needed for SELECT/download policies
