
-- Create a table for storing blog posts in the database
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Vivek Prajapati',
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  slug TEXT NOT NULL UNIQUE,
  post_type TEXT NOT NULL DEFAULT 'article' CHECK (post_type IN ('article', 'reel', 'video')),
  video_url TEXT,
  reel_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy that allows authenticated users to view published posts
CREATE POLICY "Anyone can view published blog posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (is_published = true);

-- Create policy that allows authenticated users to manage all posts (for admin)
CREATE POLICY "Authenticated users can manage blog posts" 
  ON public.blog_posts 
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create an index on slug for faster lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Create an index on publish_date for ordering
CREATE INDEX idx_blog_posts_publish_date ON public.blog_posts(publish_date DESC);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON public.blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
