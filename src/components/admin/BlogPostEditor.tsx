
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, EyeOff, X, Image } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from './ImageUpload';

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

interface BlogPostEditorProps {
  post?: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: 'Vivek Prajapati',
    image: '',
    tags: [] as string[],
    slug: '',
    post_type: 'article' as 'article' | 'reel' | 'video',
    is_published: false,
    video_url: '',
    reel_url: '',
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState<string | false>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        summary: post.summary,
        content: post.content,
        author: post.author,
        image: post.image || '',
        tags: post.tags,
        slug: post.slug,
        post_type: post.post_type,
        is_published: post.is_published,
        video_url: post.video_url || '',
        reel_url: post.reel_url || '',
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (title, summary, content)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const postData = {
        ...formData,
        is_published: publish,
        updated_at: new Date().toISOString(),
      };

      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: `Post ${publish ? 'published' : 'saved'} successfully`,
        });
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: `Post ${publish ? 'published' : 'created'} successfully`,
        });
      }

      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save post: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (url: string) => {
    if (showImageUpload === 'featured') {
      setFormData(prev => ({ ...prev, image: url }));
      setShowImageUpload(false);
    } else {
      // Insert into content at cursor position
      const imageTag = `<img src="${url}" alt="Blog image" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
      setFormData(prev => ({ 
        ...prev, 
        content: prev.content + '\n\n' + imageTag + '\n\n'
      }));
      setShowImageUpload(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onCancel}
                className="text-white hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2 text-white" />
                Back
              </Button>
              <h1 className="text-xl font-bebas uppercase text-white">
                {post ? 'Edit Post' : 'Create New Post'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={isLoading}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={isLoading}
                className="bg-white text-black hover:bg-gray-200"
              >
                {formData.is_published ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                {isLoading ? 'Saving...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue="editor" className="space-y-6">
            <TabsList className="bg-black/20 border-white/10">
              <TabsTrigger value="editor" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Editor</TabsTrigger>
              <TabsTrigger value="images" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="editor">
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Enter post title..."
                        className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Slug
                      </label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="post-slug"
                        className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Post Type
                        </label>
                        <Select
                          value={formData.post_type}
                          onValueChange={(value: 'article' | 'reel' | 'video') => 
                            setFormData(prev => ({ ...prev, post_type: value }))
                          }
                        >
                          <SelectTrigger className="bg-black border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-white/20 text-white">
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="reel">Reel</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Author
                        </label>
                        <Input
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                          className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Summary *
                      </label>
                      <Textarea
                        value={formData.summary}
                        onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Brief summary of the post..."
                        rows={3}
                        className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Media URLs */}
                  {(formData.post_type === 'video' || formData.post_type === 'reel') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {formData.post_type === 'video' ? 'Video URL' : 'Reel URL'}
                        </label>
                        <Input
                          value={formData.post_type === 'video' ? formData.video_url : formData.reel_url}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [formData.post_type === 'video' ? 'video_url' : 'reel_url']: e.target.value
                          }))}
                          placeholder="https://..."
                          className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Featured Image URL
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImageUpload('featured')}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Browse Images
                      </Button>
                    </div>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://..."
                      className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        className="border-white/20"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-white/10 text-white"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Content * (HTML supported)
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImageUpload('content')}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Insert Image
                      </Button>
                    </div>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your post content here... HTML tags are supported for formatting."
                      rows={20}
                      className="bg-black/20 border-white/20 text-white placeholder-gray-400 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;a&gt;, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white font-bebas">Image Manager</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload onImageSelect={handleImageSelect} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Image Upload Modal */}
          {showImageUpload && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <Card className="bg-black/90 border-white/10 w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white font-bebas">
                    {showImageUpload === 'featured' ? 'Select Featured Image' : 'Insert Image'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImageUpload(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="overflow-y-auto">
                  <ImageUpload onImageSelect={handleImageSelect} />
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostEditor;
