-- Add featured flag to control which videos appear on landing page
ALTER TABLE public.blog_posts 
ADD COLUMN featured boolean DEFAULT false;

-- Create tags table for tag suggestions and management
CREATE TABLE public.content_tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'general', -- 'video', 'reel', 'article', 'general'
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on content_tags
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for content_tags
CREATE POLICY "Anyone can view tags" 
ON public.content_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage tags" 
ON public.content_tags 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create trigger for content_tags updated_at
CREATE TRIGGER update_content_tags_updated_at
BEFORE UPDATE ON public.content_tags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial common tags
INSERT INTO public.content_tags (name, category) VALUES 
('Commercial', 'video'),
('Film', 'video'),
('Motion Graphics', 'video'),
('Color Grading', 'general'),
('Sound Design', 'general'),
('Editing', 'general'),
('Behind the Scenes', 'reel'),
('Process', 'reel'),
('Tutorial', 'reel'),
('Creative', 'general'),
('Client Work', 'video'),
('Personal Project', 'general');

-- Function to automatically update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Update usage count for tags when they're used in blog posts
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Update counts for all tags in the new/updated post
        UPDATE public.content_tags 
        SET usage_count = (
            SELECT COUNT(*) 
            FROM public.blog_posts 
            WHERE name = ANY(blog_posts.tags)
        )
        WHERE name = ANY(NEW.tags);
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        -- Update counts for tags that were in the deleted post
        UPDATE public.content_tags 
        SET usage_count = (
            SELECT COUNT(*) 
            FROM public.blog_posts 
            WHERE name = ANY(blog_posts.tags)
        )
        WHERE name = ANY(OLD.tags);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update tag usage counts
CREATE TRIGGER update_blog_post_tag_usage
AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_tag_usage();