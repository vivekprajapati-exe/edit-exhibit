import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, ShoppingCart, Package, IndianRupee } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FreeAssetModal from '@/components/products/FreeAssetModal';
import PaymentModal from '@/components/products/PaymentModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  category: string;
  image_url: string;
  is_free: boolean;
  file_path_in_storage: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'presets', label: 'Presets' },
    { id: 'luts', label: 'LUTs' },
    { id: 'transitions', label: 'Transitions' },
    { id: 'templates', label: 'Templates' },
  ];

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
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    if (product.is_free) {
      setShowFreeModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bebas text-white tracking-wider mb-4"
          >
            DIGITAL ASSETS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Premium presets, LUTs, transitions, and templates to elevate your video editing
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`font-bebas tracking-wider ${activeCategory === category.id
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'border-white/20 text-white hover:bg-white/10'
                  }`}
              >
                {category.label.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No products found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
                      {/* Product Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge
                            className={product.is_free
                              ? 'bg-white text-black font-bebas tracking-wide'
                              : 'bg-black/70 text-white border border-white/20 font-bebas tracking-wide'
                            }
                          >
                            {product.is_free ? 'FREE' : (
                              <span className="flex items-center">
                                <IndianRupee className="w-3 h-3" />
                                {product.price}
                              </span>
                            )}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge variant="outline" className="border-white/30 text-white text-xs">
                            {product.category.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <h3 className="font-bebas text-xl text-white tracking-wide mb-2">
                          {product.name.toUpperCase()}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <Button
                          onClick={() => handleProductClick(product)}
                          className={`w-full font-bebas tracking-wider ${product.is_free
                              ? 'bg-white hover:bg-gray-200 text-black'
                              : 'bg-white hover:bg-gray-200 text-black'
                            }`}
                        >
                          {product.is_free ? (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              GET FREE
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              BUY NOW
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Modals */}
      {selectedProduct && (
        <>
          <FreeAssetModal
            isOpen={showFreeModal}
            onClose={() => {
              setShowFreeModal(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
          />
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedProduct(null);
            }}
            product={{
              ...selectedProduct,
              price: selectedProduct.price || 0,
            }}
          />
        </>
      )}
    </div>
  );
};

export default Products;
