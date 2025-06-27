
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogPost from '@/components/blog/BlogPost';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPostData {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  image?: string;
  tags: string[];
  slug: string;
}

/**
 * BlogPostPage component - displays a single blog post by slug
 */
const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const fetchPost = async (postSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('is_published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          setNotFound(true);
        } else {
          throw error;
        }
        return;
      }

      // Transform the data to match the expected interface
      const transformedPost: BlogPostData = {
        id: data.id,
        title: data.title,
        summary: data.summary,
        content: data.content,
        author: data.author,
        publishDate: data.publish_date,
        image: data.image,
        tags: data.tags || [],
        slug: data.slug,
      };

      setPost(transformedPost);
    } catch (error: any) {
      console.error('Error fetching post:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-400 text-lg font-roboto">Loading post...</p>
      </div>
    );
  }

  // Redirect to blog page if post not found
  if (notFound || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Blog | Vivek Prajapati</title>
        <meta name="description" content={post.summary} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.publishDate} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a]">
        <main className="pt-32 pb-24 px-6">
          <BlogPost post={post} />
        </main>
      </div>
    </>
  );
};

export default BlogPostPage;
