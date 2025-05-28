
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogPost from '@/components/blog/BlogPost';
import { blogPosts } from '@/data/blogPosts';

/**
 * BlogPostPage component - displays a single blog post by slug
 */
const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  // Redirect to blog page if post not found
  if (!post) {
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
