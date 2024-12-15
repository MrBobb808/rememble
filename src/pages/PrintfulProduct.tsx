import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";

export const PrintfulProduct = () => {
  const [searchParams] = useSearchParams();
  const { productType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  
  const memorialId = searchParams.get("memorial");

  const { data: photos = [], isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['memorial-photos', memorialId],
    queryFn: async () => {
      if (!memorialId) return [];
      const { data, error } = await supabase
        .from('memorial_photos')
        .select('*')
        .eq('memorial_id', memorialId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data.map(photo => ({
        url: photo.image_url,
        caption: photo.caption
      }));
    },
    enabled: !!memorialId
  });

  const handleCreateProduct = async () => {
    if (photos.length === 0) {
      toast({
        title: "No photos available",
        description: "Please add some photos to create a product.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // First generate a mockup
      const { data: mockupData, error: mockupError } = await supabase.functions.invoke('create-printful-mockup', {
        body: {
          type: productType,
          photos: photos.map(photo => ({
            url: photo.url,
            caption: photo.caption
          }))
        },
      });

      if (mockupError) throw mockupError;
      
      if (!mockupData?.mockupUrl) {
        throw new Error('No mockup URL received from Printful');
      }

      setMockupUrl(mockupData.mockupUrl);
      
    } catch (error: any) {
      console.error('Error creating mockup:', error);
      toast({
        title: "Error creating mockup",
        description: error.message || "There was a problem creating your mockup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToCheckout = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-printful-product', {
        body: {
          type: productType,
          photos: photos.map(photo => ({
            url: photo.url,
            caption: photo.caption
          }))
        },
      });

      if (error) throw error;
      
      if (!data?.checkoutUrl) {
        throw new Error('No checkout URL received from Printful');
      }

      // Redirect to Printful checkout
      window.location.href = data.checkoutUrl;
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error creating product",
        description: error.message || "There was a problem creating your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPhotos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-playfair mb-8">
          {productType === 'photo-book' ? 'Create Photo Book' : 'Create Memory Quilt'}
        </h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={photo.url} 
                alt={photo.caption} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {mockupUrl && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <img 
              src={mockupUrl} 
              alt="Product Mockup" 
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {!mockupUrl ? (
            <Button
              onClick={handleCreateProduct}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Preview...
                </>
              ) : (
                'Generate Preview'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleProceedToCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintfulProduct;