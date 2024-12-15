import { useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ProductHeader } from "@/components/printful/ProductHeader";
import { ProductVariants } from "@/components/printful/ProductVariants";
import { PhotoGrid } from "@/components/printful/PhotoGrid";
import { ActionButtons } from "@/components/printful/ActionButtons";
import { Card } from "@/components/ui/card";

const PHOTO_BOOK_VARIANTS = [
  {
    id: 438,
    name: "Standard Photo Book",
    price: "$29.99",
    description: "8.5\" x 8.5\", 20 pages"
  },
  {
    id: 439,
    name: "Premium Photo Book",
    price: "$39.99",
    description: "10\" x 10\", 30 pages"
  },
  {
    id: 440,
    name: "Deluxe Photo Book",
    price: "$49.99",
    description: "12\" x 12\", 40 pages"
  }
];

export const PrintfulProduct = () => {
  const [searchParams] = useSearchParams();
  const { productType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  
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
    if (!selectedVariant) {
      toast({
        title: "No variant selected",
        description: "Please select a product option before continuing.",
        variant: "destructive"
      });
      return;
    }

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
          variantId: selectedVariant,
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
    if (!selectedVariant) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-printful-product', {
        body: {
          type: productType,
          variantId: selectedVariant,
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
      <div className="container mx-auto px-4 py-8">
        <ProductHeader productType={productType || ''} />
        
        <ProductVariants
          variants={PHOTO_BOOK_VARIANTS}
          selectedVariant={selectedVariant}
          onVariantSelect={setSelectedVariant}
        />

        <PhotoGrid photos={photos} />

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

        <ActionButtons
          onBack={() => navigate(-1)}
          onAction={mockupUrl ? handleProceedToCheckout : handleCreateProduct}
          isLoading={isLoading}
          mockupUrl={mockupUrl}
        />
      </div>
    </div>
  );
};

export default PrintfulProduct;