import { useEffect, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

export const PrintfulProduct = () => {
  const [searchParams] = useSearchParams();
  const { productType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [edmLoaded, setEdmLoaded] = useState(false);
  
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

  useEffect(() => {
    // Initialize Printful EDM
    const initializeEDM = () => {
      if (!window.PrintfulEDM) {
        console.error('Printful EDM not loaded');
        return;
      }

      const edm = new window.PrintfulEDM({
        elementId: 'printful-edm',
        productId: productType === 'photo-book' ? 438 : 441, // Use actual Printful product IDs
        customization: {
          theme: {
            primary_color: '#4F46E5', // Match your app's theme
            secondary_color: '#E5E7EB',
          },
          hide_elements: ['powered_by'],
        }
      });

      edm.on('editor.loaded', () => {
        setEdmLoaded(true);
        console.log('EDM loaded successfully');
      });

      edm.on('editor.error', (error) => {
        console.error('EDM error:', error);
        toast({
          title: "Error loading design editor",
          description: "There was a problem loading the design editor. Please try again.",
          variant: "destructive"
        });
      });

      // Auto-import photos when EDM is ready
      if (photos.length > 0) {
        photos.forEach(photo => {
          edm.addImage({
            type: 'url',
            url: photo.url,
            name: photo.caption
          });
        });
      }
    };

    // Load Printful EDM script
    const script = document.createElement('script');
    script.src = 'https://tools.printful.com/js/edm/v1/edm.js';
    script.async = true;
    script.onload = initializeEDM;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, [photos, productType]);

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
          <h1 className="text-3xl font-playfair">
            {productType === 'photo-book' ? 'Create Photo Book' : 'Create Memory Quilt'}
          </h1>
        </div>

        {/* EDM Container */}
        <div 
          id="printful-edm" 
          className="w-full min-h-[800px] bg-white rounded-lg shadow-lg"
        />

        {!edmLoaded && (
          <div className="flex items-center justify-center h-[800px]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintfulProduct;