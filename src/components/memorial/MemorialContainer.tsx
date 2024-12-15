import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMemorialData } from "@/hooks/useMemorialData";
import { MemorialContent } from "./MemorialContent";
import UnifiedSidebar from "./UnifiedSidebar";
import { LoadingState } from "./LoadingState";
import Footer from "@/components/Footer";
import { useFuneralHomeSettings } from "@/hooks/useFuneralHomeSettings";
import { Photo } from "@/types/photo";

const MemorialContainer = () => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");
  const { photos, handlePhotoAdd } = useMemorialData(memorialId);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useFuneralHomeSettings();

  console.log("MemorialContainer - memorialId:", memorialId);
  console.log("MemorialContainer - photos:", photos);
  console.log("MemorialContainer - settings:", settings);

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
            funeralHomeName={settings?.name}
            funeralHomeLogo={settings?.logo_url}
          />
          <UnifiedSidebar photos={photos} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemorialContainer;