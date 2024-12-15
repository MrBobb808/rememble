import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProductHeader } from "@/components/printful/ProductHeader";
import { ProductVariants } from "@/components/printful/ProductVariants";
import { PhotoGrid } from "@/components/printful/PhotoGrid";
import { LoadingState } from "@/components/memorial/LoadingState";
import { PHOTO_BOOK_VARIANTS, QUILT_VARIANTS } from "@/components/printful/variants";

export const PrintfulProduct = () => {
  const [searchParams] = useSearchParams();
  const { productType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [edmLoaded, setEdmLoaded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [edm, setEdm] = useState<any>(null);
  
  const memorialId = searchParams.get("memorial");

  // Fetch photos for the memorial
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

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

    const initializeEDM = () => {
      if (!window.PrintfulEDM || !selectedVariant) {
        console.log('Printful EDM not loaded or no variant selected');
        return;
      }

      try {
        // Clean up previous EDM instance if it exists
        if (edm) {
          edm.destroy?.();
        }

        const newEdm = new window.PrintfulEDM({
          elementId: 'printful-edm',
          productId: selectedVariant,
          customization: {
            theme: {
              primary_color: '#4F46E5',
              secondary_color: '#E5E7EB',
            },
            hide_elements: ['powered_by'],
          }
        });

        setEdm(newEdm);

        newEdm.on('editor.loaded', () => {
          setEdmLoaded(true);
          setIsLoading(false);
          console.log('EDM loaded successfully');
          
          // Auto-import photos when EDM is ready
          if (photos.length > 0) {
            photos.forEach(photo => {
              newEdm.addImage({
                type: 'url',
                url: photo.url,
                name: photo.caption || 'Memorial photo'
              });
            });
          }
        });

        newEdm.on('editor.error', (error: any) => {
          console.error('EDM error:', error);
          setIsLoading(false);
          toast({
            title: "Error loading design editor",
            description: "There was a problem loading the design editor. Please try again.",
            variant: "destructive"
          });
        });

      } catch (error) {
        console.error('Error initializing EDM:', error);
        setIsLoading(false);
        toast({
          title: "Error initializing design editor",
          description: "There was a problem setting up the design editor. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (selectedVariant) {
      setIsLoading(true);
      setEdmLoaded(false);
      
      // Load Printful EDM script
      scriptElement = document.createElement('script');
      scriptElement.src = 'https://tools.printful.com/js/edm/v1/edm.js';
      scriptElement.async = true;
      scriptElement.onload = initializeEDM;
      document.body.appendChild(scriptElement);
    }

    return () => {
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
      if (edm) {
        edm.destroy?.();
      }
    };
  }, [selectedVariant, photos, toast]);

  const variants = productType === 'photo-book' ? PHOTO_BOOK_VARIANTS : QUILT_VARIANTS;

  const handleVariantSelect = (variantId: number) => {
    setSelectedVariant(variantId);
  };

  if (isLoadingPhotos) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <div className="container mx-auto px-4 py-8">
        <ProductHeader productType={productType || ''} />

        <ProductVariants
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantSelect={handleVariantSelect}
        />

        {selectedVariant ? (
          <>
            <div 
              id="printful-edm" 
              className={`w-full min-h-[800px] bg-white rounded-lg shadow-lg mb-8 ${!edmLoaded ? 'hidden' : ''}`}
            />
            {isLoading && <LoadingState />}
          </>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </div>
    </div>
  );
};

export default PrintfulProduct;