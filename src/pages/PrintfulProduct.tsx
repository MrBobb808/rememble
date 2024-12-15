import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { ProductHeader } from "@/components/printful/ProductHeader";
import { ProductVariants } from "@/components/printful/ProductVariants";
import { PhotoGrid } from "@/components/printful/PhotoGrid";
import { InteractivePreview } from "@/components/printful/InteractivePreview";
import { ActionButtons } from "@/components/printful/ActionButtons";
import { PHOTO_BOOK_VARIANTS, QUILT_VARIANTS } from "@/components/printful/variants";

export const PrintfulProduct = () => {
  const [searchParams] = useSearchParams();
  const { productType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [edmLoaded, setEdmLoaded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  
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
    // Initialize Printful EDM
    const initializeEDM = () => {
      if (!window.PrintfulEDM || !selectedVariant) {
        console.log('Printful EDM not loaded or no variant selected');
        return;
      }

      const edm = new window.PrintfulEDM({
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

      edm.on('editor.loaded', () => {
        setEdmLoaded(true);
        console.log('EDM loaded successfully');
        
        // Auto-import photos when EDM is ready
        if (photos.length > 0) {
          photos.forEach(photo => {
            edm.addImage({
              type: 'url',
              url: photo.url,
              name: photo.caption || 'Memorial photo'
            });
          });
        }
      });

      edm.on('editor.error', (error) => {
        console.error('EDM error:', error);
        toast({
          title: "Error loading design editor",
          description: "There was a problem loading the design editor. Please try again.",
          variant: "destructive"
        });
      });

      // Handle design save
      edm.on('design.save', (design) => {
        console.log('Design saved:', design);
        // Here you could save the design to your database
      });
    };

    if (selectedVariant) {
      // Load Printful EDM script
      const script = document.createElement('script');
      script.src = 'https://tools.printful.com/js/edm/v1/edm.js';
      script.async = true;
      script.onload = initializeEDM;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [selectedVariant, photos, toast]);

  const variants = productType === 'photo-book' ? PHOTO_BOOK_VARIANTS : QUILT_VARIANTS;

  const handleVariantSelect = (variantId: number) => {
    setSelectedVariant(variantId);
    setEdmLoaded(false); // Reset EDM loaded state when variant changes
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
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ProductHeader productType={productType || ''} />
        </div>

        <ProductVariants
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantSelect={handleVariantSelect}
        />

        {selectedVariant ? (
          <div 
            id="printful-edm" 
            className="w-full min-h-[800px] bg-white rounded-lg shadow-lg mb-8"
          />
        ) : (
          <PhotoGrid photos={photos} />
        )}

        {!edmLoaded && selectedVariant && (
          <div className="flex items-center justify-center h-[800px]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintfulProduct;