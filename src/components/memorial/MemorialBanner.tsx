import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MemorialBannerProps {
  name: string;
  dates: string;
  photoUrl?: string;
}

interface FuneralHomeSettings {
  name: string;
  logo_url: string | null;
}

const MemorialBanner = ({ name, dates, photoUrl = "/placeholder.svg" }: MemorialBannerProps) => {
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

      if (data) {
        setSettings(data);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="relative w-full h-[50vh] min-h-[400px] mb-8">
      <div className="absolute inset-0 bg-black/20" />
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ 
          backgroundImage: `url(${settings?.logo_url || photoUrl}?quality=80&width=1920)`,
          backgroundPosition: 'center 30%'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white text-center">
        <h1 className="text-5xl md:text-6xl font-playfair mb-4 animate-fade-in">
          {settings?.name || name}
        </h1>
        <p className="text-xl md:text-2xl font-inter mb-6 animate-fade-in opacity-90">
          {dates}
        </p>
        <Heart className="mx-auto w-10 h-10 text-white/90 animate-pulse" />
      </div>
    </div>
  );
};

export default MemorialBanner;