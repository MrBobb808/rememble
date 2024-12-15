import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMemorialData } from "@/hooks/useMemorialData";
import { MemorialContent } from "./MemorialContent";
import UnifiedSidebar from "./UnifiedSidebar";
import { LoadingState } from "./LoadingState";
import Footer from "@/components/Footer";
import { useFuneralHomeSettings } from "@/hooks/useFuneralHomeSettings";
import { Photo } from "@/types/photo";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MemorialContainer = () => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");
  const { photos, handlePhotoAdd } = useMemorialData(memorialId);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch memorial details
  const { data: memorial } = useQuery({
    queryKey: ['memorial', memorialId],
    queryFn: async () => {
      if (!memorialId) return null;
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', memorialId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!memorialId
  });

  console.log("MemorialContainer - memorialId:", memorialId);
  console.log("MemorialContainer - photos:", photos);
  console.log("MemorialContainer - memorial:", memorial);

  useEffect(() => {
    if (photos.length >= 0) {  // Changed from > 0 to >= 0 to handle empty memorials
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  }, [photos]);

  if (isLoading) {
    console.log("Rendering LoadingState");
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <MemorialContent
            photos={photos}
            handlePhotoAdd={handlePhotoAdd}
            isLoading={isLoading}
            memorial={memorial}
          />
          <UnifiedSidebar photos={photos} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemorialContainer;