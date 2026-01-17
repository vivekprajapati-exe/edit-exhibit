-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC DEFAULT NULL,
  image_url TEXT NOT NULL,
  file_path_in_storage TEXT NOT NULL,
  is_free BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'presets',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read products (they're public listings)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_id TEXT DEFAULT NULL,
  amount NUMERIC NOT NULL
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Orders can only be inserted by service role (Edge Functions)
CREATE POLICY "Orders are insertable by service role" ON orders
  FOR INSERT WITH CHECK (true);

-- Orders are readable by service role only
CREATE POLICY "Orders are viewable by service role" ON orders
  FOR SELECT USING (true);

-- =============================================
-- EMAIL LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  product_name TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  error_message TEXT DEFAULT NULL
);

-- Enable RLS
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Email logs can only be managed by service role
CREATE POLICY "Email logs manageable by service role" ON email_logs
  FOR ALL USING (true);

-- =============================================
-- SAMPLE PRODUCTS (with placeholder images)
-- =============================================
INSERT INTO products (name, description, price, image_url, file_path_in_storage, is_free, category) VALUES
  ('20 Free Transitions Pack', 'A collection of 20 smooth transitions for your video projects. Perfect for beginners!', NULL, 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop', 'free-assets/20-free-transitions.zip', true, 'transitions'),
  ('Cinematic Color Grading LUTs', 'Professional cinematic LUTs used in major productions. 50+ looks included.', 499, 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=300&fit=crop', 'presets/cinematic-luts-pack.zip', false, 'luts'),
  ('After Effects Presets Bundle', 'Save hours with 100+ AE presets for text animations, transitions, and effects.', 799, 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop', 'presets/ae-presets-bundle.zip', false, 'presets');
