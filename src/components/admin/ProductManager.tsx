import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Package, IndianRupee, Eye, EyeOff, Upload, File, CheckCircle, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import FileUpload from './FileUpload';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'presets',
    image_url: '',
    file_path_in_storage: '',
    is_free: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch products: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.is_free ? null : parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url,
        file_path_in_storage: formData.file_path_in_storage,
        is_free: formData.is_free,
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // First get the product to know its file paths
      const productToDelete = products.find(p => p.id === id);

      // Delete the product from database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Immediately update the UI by filtering out the deleted product
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

      // Try to delete files from storage (non-blocking)
      if (productToDelete) {
        // Delete product file
        if (productToDelete.file_path_in_storage) {
          await supabase.storage
            .from('products')
            .remove([productToDelete.file_path_in_storage])
            .catch(console.error);
        }

        // Delete thumbnail if it's in our storage
        if (productToDelete.image_url && productToDelete.image_url.includes('supabase')) {
          const urlParts = productToDelete.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          if (fileName) {
            await supabase.storage
              .from('blog-images')
              .remove([fileName])
              .catch(console.error);
          }
        }
      }

      toast({
        title: "Success",
        description: "Product and associated files deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // If delete failed, refetch to ensure UI is in sync
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price?.toString() || '',
      category: product.category || 'presets',
      image_url: product.image_url,
      file_path_in_storage: product.file_path_in_storage,
      is_free: product.is_free || false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'presets',
      image_url: '',
      file_path_in_storage: '',
      is_free: false,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bebas text-white tracking-wider">
              {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
            </h2>
            <Button onClick={resetForm} variant="outline" className="text-white border-white/20 hover:bg-white/10">
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-bebas tracking-wide">PRODUCT DETAILS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Name */}
                <div>
                  <Label htmlFor="name" className="text-gray-400 uppercase text-xs tracking-wide">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-gray-400 uppercase text-xs tracking-wide">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/5 border-white/20 text-white min-h-[100px]"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-gray-400 uppercase text-xs tracking-wide">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/20">
                      <SelectItem value="presets" className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">Presets</SelectItem>
                      <SelectItem value="luts" className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">LUTs</SelectItem>
                      <SelectItem value="transitions" className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">Transitions</SelectItem>
                      <SelectItem value="templates" className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer">Templates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Is Free Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_free"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? '' : formData.price })}
                    className="w-4 h-4 rounded border-white/20"
                  />
                  <Label htmlFor="is_free" className="text-gray-400">This is a free product</Label>
                </div>

                {/* Price (only if not free) */}
                {!formData.is_free && (
                  <div>
                    <Label htmlFor="price" className="text-gray-400 uppercase text-xs tracking-wide">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                      required={!formData.is_free}
                    />
                  </div>
                )}

                {/* File Path in Storage */}
                <div>
                  <Label className="text-gray-400 uppercase text-xs tracking-wide">
                    Product File (ZIP, RAR, etc.)
                  </Label>
                  <FileUpload
                    bucket="products"
                    folder="downloads"
                    accept=".zip,.rar,.7z"
                    maxSizeMB={500}
                    currentFilePath={formData.file_path_in_storage}
                    onUploadComplete={(filePath) => setFormData({ ...formData, file_path_in_storage: filePath })}
                    label="Upload Product File"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Upload your product file (ZIP, RAR, etc.) - up to 500MB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-bebas tracking-wide">PRODUCT THUMBNAIL</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.image_url && (
                  <div className="mb-4">
                    <img src={formData.image_url} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  </div>
                )}
                <ImageUpload
                  onImageSelect={(url) => setFormData({ ...formData, image_url: url })}
                />
                {formData.image_url && (
                  <p className="text-xs text-gray-500 mt-2">Image URL: {formData.image_url}</p>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-white hover:bg-gray-200 text-black py-6 text-lg font-bebas tracking-wider"
            >
              {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bebas text-white tracking-wider">PRODUCT MANAGEMENT</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your digital products and assets</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-white hover:bg-gray-200 text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bebas text-gray-400 mb-2 tracking-wide">NO PRODUCTS YET</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-white hover:bg-gray-200 text-black"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="relative mb-3 rounded-lg overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge className={product.is_free ? 'bg-white text-black' : 'bg-black/70 text-white border border-white/20'}>
                        {product.is_free ? 'FREE' : `₹${product.price}`}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="font-bebas text-lg text-white tracking-wide mb-1">{product.name.toUpperCase()}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-white/20 text-gray-400 text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-xs text-gray-600">{product.file_path_in_storage}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(product)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#1a1a1a] border-white/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete Product</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete <span className="text-white font-semibold">{product.name}</span>? This action will:
                            <ul className="mt-2 space-y-1 text-left">
                              <li>❌ Delete the product from database</li>
                              <li>❌ Delete files from storage</li>
                              <li>❌ Existing download links will stop working</li>
                            </ul>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete Product
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;
