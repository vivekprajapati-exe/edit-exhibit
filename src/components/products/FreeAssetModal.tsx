import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Download, Loader2, CheckCircle } from 'lucide-react';

interface FreeAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    description: string;
    image_url: string;
  };
}

const FreeAssetModal: React.FC<FreeAssetModalProps> = ({ isOpen, onClose, product }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-free-asset', {
        body: { email, productId: product.id },
      });

      // Log the full response for debugging
      console.log('Edge Function Response:', { data, error });

      if (error) {
        console.error('Edge Function Error:', error);
        throw new Error(error.message || 'Failed to send email');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "Check your email for the download link",
      });

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
      }, 3000);

    } catch (error: any) {
      console.error('Full Error Object:', error);
      
      // Better error message based on the actual error
      let errorMessage = error.message || "Failed to send email. Please try again.";
      
      // Check for common issues
      if (errorMessage.includes('Product not found')) {
        errorMessage = "This product doesn't exist. Please refresh the page.";
      } else if (errorMessage.includes('Failed to generate download link')) {
        errorMessage = "Product file not found. Please contact support.";
      } else if (errorMessage.includes('Too many requests')) {
        errorMessage = "You've made too many requests. Please try again in an hour.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail('');
    setIsSuccess(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl tracking-wider text-white">
            GET FREE DOWNLOAD
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your email to receive the download link
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-bebas text-xl tracking-wide mb-2">CHECK YOUR EMAIL</h3>
            <p className="text-gray-400 text-sm">
              We've sent the download link to {email}
            </p>
          </div>
        ) : (
          <>
            {/* Product Preview */}
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-bebas text-lg tracking-wide">{product.name.toUpperCase()}</h3>
                <p className="text-gray-500 text-sm line-clamp-1">{product.description}</p>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email" className="text-gray-400 uppercase text-xs tracking-wide">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-600"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-white hover:bg-gray-200 text-black py-6 font-bebas text-lg tracking-wider"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    GET FREE DOWNLOAD
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-600 text-center">
                By submitting, you agree to receive the download link via email.
                We respect your privacy and won't spam you.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FreeAssetModal;
