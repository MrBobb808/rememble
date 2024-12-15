import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMemorialData } from "@/hooks/useMemorialData";
import { MemorialContent } from "./MemorialContent";
import UnifiedSidebar from "./UnifiedSidebar";
import { LoadingState } from "./LoadingState";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface FuneralHomeSettings {
  name: string;
  logo_url: string | null;
}

const MemorialContainer = () => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");
  const { photos, handlePhotoAdd } = useMemorialData(memorialId);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<FuneralHomeSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('funeral_home_settings')
        .select('name, logo_url')
        .single();

      if (error) {
        console.error('Error fetching funeral home settings:', error);
        return;
      }

      setSettings(data);
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (photos.length > 0) {
      setIsLoading(false);
    }
  }, [photos]);

  if (isLoading) {
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