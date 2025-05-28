
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BlogList from '@/components/blog/BlogList';
import SearchBar from '@/components/blog/SearchBar';
import { blogPosts } from '@/data/blogPosts';

/**
 * Blog page component - displays all blog posts with search functionality
 */
const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

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

            {/* Blog Posts */}
            <BlogList posts={blogPosts} searchTerm={searchTerm} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Blog;
