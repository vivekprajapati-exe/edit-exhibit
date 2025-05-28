
import React from 'react';
import { motion } from 'framer-motion';
import BlogItem from './BlogItem';
import { BlogListProps } from '@/types/blog';

/**
 * BlogList component displays a list of blog posts
 * Handles filtering based on search term
 */
const BlogList: React.FC<BlogListProps> = ({ posts, searchTerm = '' }) => {
  // Filter posts based on search term
  const filteredPosts = posts.filter(post => 
    searchTerm === '' || 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (filteredPosts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-400 text-lg font-roboto">
          {searchTerm ? `No posts found matching "${searchTerm}"` : 'No blog posts available.'}
        </p>
      </motion.div>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="main">
      {filteredPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <BlogItem post={post} />
        </motion.div>
      ))}
    </section>
  );
};

export default BlogList;
