import { useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProductHeader } from "@/components/printful/ProductHeader";
import { ProductVariants } from "@/components/printful/ProductVariants";
import { PhotoGrid } from "@/components/printful/PhotoGrid";
import { ActionButtons } from "@/components/printful/ActionButtons";
import { InteractivePreview } from "@/components/printful/InteractivePreview";
import { PHOTO_BOOK_VARIANTS, QUILT_VARIANTS, PrintfulVariant } from "@/components/printful/variants";

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

  const variants: PrintfulVariant[] = productType === 'photo-book' ? PHOTO_BOOK_VARIANTS : QUILT_VARIANTS;

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
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantSelect={setSelectedVariant}
        />

        <PhotoGrid photos={photos} />

        <InteractivePreview 
          mockupUrl={mockupUrl}
          isLoading={isLoading}
        />

        <ActionButtons
          onBack={() => navigate(-1)}
          onAction={handleCreateProduct}
          isLoading={isLoading}
          mockupUrl={mockupUrl}
        />
      </div>
    </div>
  );
};

export default PrintfulProduct;