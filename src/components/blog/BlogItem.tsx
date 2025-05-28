
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import { BlogItemProps } from '@/types/blog';

/**
 * BlogItem component displays a single blog post summary in a card format
 * Used in the main blog listing page
 */
const BlogItem: React.FC<BlogItemProps> = ({ post }) => {
  const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Card className="bg-black/20 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden">
        {post.image && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <time dateTime={post.publishDate}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{post.author}</span>
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bebas uppercase text-white group-hover:text-gray-200 transition-colors">
            <Link to={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-300 font-roboto leading-relaxed">
            {post.summary}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-white/5 text-white/80 border-white/20 hover:bg-white/10"
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <Button 
            asChild 
            variant="outline" 
            className="w-full bg-transparent border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <Link to={`/blog/${post.slug}`}>
              Read More
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.article>
  );
};

export default BlogItem;
