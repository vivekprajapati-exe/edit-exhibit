
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Calendar, User } from 'lucide-react';
import { BlogPostProps } from '@/types/blog';

/**
 * BlogPost component displays the full content of a single blog post
 */
const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      {/* Back Button */}
      <Button 
        variant="ghost" 
        asChild 
        className="mb-8 hover:bg-white/5 -ml-4 text-white"
      >
        <Link to="/blog" className="flex items-center gap-2 font-boldone">
          <ChevronLeft size={18} />
          <span>Back to Blog</span>
        </Link>
      </Button>

      {/* Hero Image */}
      {post.image && (
        <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bebas uppercase text-white mb-4 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <time dateTime={post.publishDate} className="font-roboto">
              {formattedDate}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <User size={16} />
            <span className="font-roboto">{post.author}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-white/5 text-white/80 border-white/20"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* Article Content */}
      <div 
        className="prose prose-lg prose-invert max-w-none font-roboto"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{
          '--tw-prose-body': '#e5e7eb',
          '--tw-prose-headings': '#ffffff',
          '--tw-prose-links': '#ffffff',
          '--tw-prose-bold': '#ffffff',
          '--tw-prose-quotes': '#d1d5db',
          '--tw-prose-code': '#ffffff',
        } as React.CSSProperties}
      />

      {/* Navigation */}
      <footer className="mt-12 pt-8 border-t border-white/10">
        <Button 
          asChild 
          variant="outline" 
          className="bg-transparent border-white/20 text-white hover:bg-white hover:text-black"
        >
          <Link to="/blog">
            ← Return to All Posts
          </Link>
        </Button>
      </footer>
    </motion.article>
  );
};

export default BlogPost;
