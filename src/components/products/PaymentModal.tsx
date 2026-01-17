import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CreditCard, Loader2, CheckCircle, IndianRupee } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, product }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { toast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!razorpayLoaded) {
      toast({
        title: "Payment Loading",
        description: "Payment system is loading. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { email, productId: product.id },
      });

      if (orderError) throw orderError;
      if (orderData?.error) throw new Error(orderData.error);

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Vivek Cuts',
        description: product.name,
        order_id: orderData.razorpay_order_id,
        prefill: { email },
        theme: { color: '#000000' },
        handler: async function (response: any) {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.order_id,
              },
            });

            if (verifyError) throw verifyError;
            if (verifyData?.error) throw new Error(verifyData.error);

            setIsSuccess(true);
            toast({
              title: "Payment Successful!",
              description: "Check your email for the download link",
            });

            setTimeout(() => {
              onClose();
              setIsSuccess(false);
              setEmail('');
            }, 3000);

          } catch (error: any) {
            toast({
              title: "Verification Failed",
              description: error.message || "Payment verification failed. Contact support.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description || "Payment failed. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
      rzp.open();

    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail('');
    setIsSuccess(false);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bebas text-2xl tracking-wider text-white">
            PURCHASE ASSET
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete your purchase to get instant access
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="font-bebas text-xl tracking-wide mb-2">PAYMENT SUCCESSFUL</h3>
            <p className="text-gray-400 text-sm">
              Check {email} for your download link
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
              <div className="flex-1">
                <h3 className="font-bebas text-lg tracking-wide">{product.name.toUpperCase()}</h3>
                <p className="text-gray-500 text-sm line-clamp-1">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-white font-bebas text-2xl">
                  <IndianRupee className="w-5 h-5" />
                  {product.price}
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePayment} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="payment-email" className="text-gray-400 uppercase text-xs tracking-wide">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="payment-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-600"
                    disabled={isLoading}
                    required
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Download link will be sent to this email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-white hover:bg-gray-200 text-black py-6 font-bebas text-lg tracking-wider"
                disabled={isLoading || !razorpayLoaded}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    PAY ₹{product.price}
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                <span>🔒 Secure Payment</span>
                <span>•</span>
                <span>Powered by Razorpay</span>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
