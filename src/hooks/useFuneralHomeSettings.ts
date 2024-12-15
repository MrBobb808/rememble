import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FuneralHomeSettings {
  name: string;
  logo_url: string | null;
  phone_number: string | null;
  email_address: string | null;
  website: string | null;
}

export const useFuneralHomeSettings = () => {
  const [settings, setSettings] = useState<FuneralHomeSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('funeral_home_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching funeral home settings:', error);
        return;
      }

      setSettings(data);
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  return { settings, isLoading };
};