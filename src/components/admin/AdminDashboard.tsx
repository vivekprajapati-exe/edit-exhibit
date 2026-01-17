import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, LogOut, FileText, Video, Camera, Package, ShoppingCart } from 'lucide-react';
import BlogPostEditor from './BlogPostEditor';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publish_date: string;
  image?: string;
  tags: string[];
  slug: string;
  post_type: 'article' | 'reel' | 'video';
  is_published: boolean;
  video_url?: string;
  reel_url?: string;
}

interface AdminDashboardProps {
  user: User;
  onSignOut: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onSignOut }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'blog' | 'products' | 'orders'>('blog');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our BlogPost interface
      const transformedPosts: BlogPost[] = (data || []).map(post => ({
        ...post,
        post_type: post.post_type as 'article' | 'reel' | 'video'
      }));

      setPosts(transformedPosts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch posts: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== id));
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete post: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !post.is_published })
        .eq('id', post.id);

      if (error) throw error;

      setPosts(posts.map(p =>
        p.id === post.id ? { ...p, is_published: !p.is_published } : p
      ));

      toast({
        title: "Success",
        description: `Post ${!post.is_published ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update post: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handlePostSaved = () => {
    setShowEditor(false);
    setEditingPost(null);
    fetchPosts();
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'reel': return <Camera className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (showEditor) {
    return (
      <BlogPostEditor
        post={editingPost}
        onSave={handlePostSaved}
        onCancel={() => {
          setShowEditor(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bebas uppercase text-white tracking-wider">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 text-sm">
                Welcome back, {user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {activeTab === 'blog' && (
                <Button
                  onClick={() => setShowEditor(true)}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onSignOut}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6 border-b border-white/10">
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-3 font-bebas text-sm tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'blog'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              <FileText className="w-4 h-4" />
              BLOG POSTS
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 font-bebas text-sm tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'products'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              <Package className="w-4 h-4" />
              PRODUCTS
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-bebas text-sm tracking-wider flex items-center gap-2 transition-colors ${activeTab === 'orders'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-500 hover:text-gray-300'
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              ORDERS
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'blog' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Posts</p>
                      <p className="text-2xl font-bold text-white">{posts.length}</p>
                    </div>
                    <FileText className="w-8 h-8 text-white/60" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Published</p>
                      <p className="text-2xl font-bold text-white">
                        {posts.filter(p => p.is_published).length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Drafts</p>
                      <p className="text-2xl font-bold text-white">
                        {posts.filter(p => !p.is_published).length}
                      </p>
                    </div>
                    <Edit className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Videos</p>
                      <p className="text-2xl font-bold text-white">
                        {posts.filter(p => p.post_type === 'video' || p.post_type === 'reel').length}
                      </p>
                    </div>
                    <Video className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Posts List */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-bebas">All Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No posts yet</p>
                    <Button
                      onClick={() => setShowEditor(true)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      Create your first post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getPostTypeIcon(post.post_type)}
                              <h3 className="text-lg font-semibold text-white">
                                {post.title}
                              </h3>
                              <Badge
                                variant={post.is_published ? "default" : "secondary"}
                                className={post.is_published ? "bg-green-500" : "bg-yellow-500"}
                              >
                                {post.is_published ? "Published" : "Draft"}
                              </Badge>
                              <Badge variant="outline" className="text-gray-400 border-gray-600">
                                {post.post_type}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{post.summary}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{post.author}</span>
                              <span>{new Date(post.publish_date).toLocaleDateString()}</span>
                              <span>{post.tags.length} tags</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTogglePublish(post)}
                              className="border-white/20 text-white hover:bg-white/10 rounded-full"
                            >
                              <Eye className="w-4 h-4 text-white" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingPost(post);
                                setShowEditor(true);
                              }}
                              className="border-white/20 text-white hover:bg-white/10 rounded-full"
                            >
                              <Edit className="w-4 h-4 text-white" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeletePost(post.id)}
                              className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : activeTab === 'products' ? (
          <ProductManager />
        ) : (
          <OrderManager />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
