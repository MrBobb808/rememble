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
    setMockupUrl(null); // Reset any previous mockup

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

  if (isLoadingPhotos) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
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
            alt="Product Preview" 
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
      </div>
    </div>
  );
};