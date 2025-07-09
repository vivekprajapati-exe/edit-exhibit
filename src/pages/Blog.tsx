
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BlogList from '@/components/blog/BlogList';
import SearchBar from '@/components/blog/SearchBar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogPost {
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
 * Blog page component - displays all blog posts with search functionality
 */
const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('publish_date', { ascending: false });

      if (error) throw error;

      // Transform the data to match the expected interface
      const transformedPosts: BlogPost[] = (data || []).map(post => ({
        id: post.id,
        title: post.title,
        summary: post.summary,
        content: post.content,
        author: post.author,
        publishDate: post.publish_date,
        image: post.image,
        tags: post.tags || [],
        slug: post.slug,
      }));

      setPosts(transformedPosts);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset search when component unmounts
  useEffect(() => {
    return () => setSearchTerm('');
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog - Vivek Prajapati | Video Editor & Motion Designer</title>
        <meta 
          name="description" 
          content="Read the latest insights on video editing, color grading, motion graphics, and creative storytelling from professional video editor Vivek Prajapati." 
        />
        <meta name="keywords" content="video editing blog, color grading tips, motion graphics tutorials, cinematography insights" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <main className="pt-32 pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bebas uppercase tracking-tight text-white mb-4">
                <span className="text-gradient">Blog</span>
              </h1>
              <p className="text-xl text-gray-400 font-roboto max-w-2xl mx-auto">
                Insights, tutorials, and behind-the-scenes stories from the world of video production
              </p>
            </motion.header>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              <SearchBar 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search posts by title, content, or tags..."
              />
            </motion.div>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg font-roboto">
                  Loading posts...
                </p>
              </div>
            ) : (
              /* Blog Posts */
              <BlogList posts={posts} searchTerm={searchTerm} />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
