
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image, X, Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface UploadedImage {
  id: string;
  filename: string;
  public_url: string;
  original_name: string;
}

interface ImageUploadProps {
  onImageSelect: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchUploadedImages();
  }, []);

  const fetchUploadedImages = async () => {
    setLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('blog_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setUploadedImages(data || []);
    } catch (error: any) {
      console.error('Error fetching images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Generate a unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${filename}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      // Save image record to database
      const { error: dbError } = await supabase
        .from('blog_images')
        .insert([{
          filename,
          original_name: file.name,
          storage_path: filePath,
          public_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      // Refresh the images list
      fetchUploadedImages();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Image URL copied to clipboard",
    });
  };

  const insertImage = (url: string) => {
    onImageSelect(url);
    toast({
      title: "Image selected",
      description: "Image URL inserted into editor",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="bg-black/20 border-white/20 text-white file:bg-white/10 file:text-white file:border-white/20"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-white text-black hover:bg-gray-200"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Recent Images</h3>
        {loadingImages ? (
          <p className="text-gray-400 text-sm">Loading images...</p>
        ) : uploadedImages.length === 0 ? (
          <p className="text-gray-400 text-sm">No images uploaded yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="bg-black/20 border-white/10">
                <CardContent className="p-2">
                  <div className="aspect-video relative overflow-hidden rounded bg-gray-800">
                    <img
                      src={image.public_url}
                      alt={image.original_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-400 truncate">{image.original_name}</p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => insertImage(image.public_url)}
                        className="flex-1 text-xs border-white/20 text-white hover:bg-white/10"
                      >
                        <Image className="w-3 h-3 mr-1" />
                        Use
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyImageUrl(image.public_url)}
                        className="text-xs border-white/20 text-white hover:bg-white/10"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
