import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, Book, Shirt, ShoppingCart } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";

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
        url: photo.image_url, // Map image_url to url for consistency
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
    setMockupUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-printful-mockup', {
        body: {
          type: productType,
          photos: photos.map(photo => ({
            url: photo.url,
            caption: photo.caption
          }))
        },
      });

      if (error) throw error;
      
      if (!data?.mockupUrl) {
        throw new Error('No mockup URL received from Printful');
      }

      setMockupUrl(data.mockupUrl);
      
      toast({
        title: "Preview generated",
        description: "Your product preview has been generated successfully.",
      });
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error creating preview",
        description: error.message || "There was a problem creating your preview. Please try again.",
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
        <div className="flex items-center gap-4 mb-8">
          {productType === 'photo-book' ? (
            <Book className="w-8 h-8 text-memorial-blue" />
          ) : (
            <Shirt className="w-8 h-8 text-memorial-blue" />
          )}
          <h1 className="text-3xl font-playfair">
            {productType === 'photo-book' ? 'Create Memorial Photo Book' : 'Create Memory Quilt'}
          </h1>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Selected Photos</h2>
          <p className="text-gray-600 mb-4">
            {productType === 'photo-book' 
              ? 'These photos will be beautifully arranged in your memorial photo book.'
              : 'These photos will be carefully arranged on your memory quilt.'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-md">
                <img 
                  src={photo.url} 
                  alt={photo.caption} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </Card>

        {mockupUrl && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <img 
              src={mockupUrl} 
              alt="Product Preview" 
              className="max-w-full rounded-lg shadow-lg"
            />
          </Card>
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
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintfulProduct;