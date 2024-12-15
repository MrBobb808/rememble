import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const BillingSettings = () => {
  const { toast } = useToast();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: response, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return response;
    }
  });

  const handleSubscribe = async () => {
    try {
      const { data: response, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading subscription details...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and payment details
        </p>
      </div>

      <Separator />

      <div className="space-y-6">
        {subscription?.subscribed ? (
          <>
            <div className="bg-memorial-blue-light p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5" />
                <h3 className="font-semibold">Current Plan: Premium</h3>
              </div>
              <p className="text-sm text-gray-600">
                Your subscription renews on {new Date(subscription.subscription.current_period_end * 1000).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5" />
                <h3 className="font-semibold">Payment Method</h3>
              </div>
              <p className="text-sm text-gray-600">
                {subscription.subscription.default_payment_method ? 
                  `Card ending in ${subscription.subscription.default_payment_method.card.last4}` :
                  'No payment method on file'}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Update Payment Method
              </Button>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg border text-center space-y-4">
            <h3 className="text-xl font-semibold">Start Your Premium Subscription</h3>
            <p className="text-gray-600">
              Get access to all premium features including unlimited memorials, custom branding, and more.
            </p>
            <div className="flex justify-center">
              <Button onClick={handleSubscribe} size="lg">
                Subscribe Now - $29.99/month
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingSettings;