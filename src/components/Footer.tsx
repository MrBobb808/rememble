import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Globe, Mail, Phone } from "lucide-react";

interface FuneralHomeSettings {
  name: string;
  phone_number: string | null;
  email_address: string | null;
  website: string | null;
  logo_url: string | null;
}

const Footer = () => {
  const [settings, setSettings] = useState<FuneralHomeSettings | null>(null);

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

      if (data) {
        setSettings(data);
      }
    };

    fetchSettings();
  }, []);

  if (!settings) return null;

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Funeral Home Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-memorial-blue">
              <Building2 className="h-5 w-5" />
              <h3 className="font-semibold">{settings.name}</h3>
            </div>
          </div>

          {/* Phone */}
          {settings.phone_number && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-memorial-blue">
                <Phone className="h-5 w-5" />
                <a 
                  href={`tel:${settings.phone_number}`}
                  className="hover:text-memorial-blue/80 transition-colors"
                >
                  {settings.phone_number}
                </a>
              </div>
            </div>
          )}

          {/* Email */}
          {settings.email_address && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-memorial-blue">
                <Mail className="h-5 w-5" />
                <a 
                  href={`mailto:${settings.email_address}`}
                  className="hover:text-memorial-blue/80 transition-colors"
                >
                  {settings.email_address}
                </a>
              </div>
            </div>
          )}

          {/* Website */}
          {settings.website && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-memorial-blue">
                <Globe className="h-5 w-5" />
                <a 
                  href={settings.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-memorial-blue/80 transition-colors"
                >
                  {settings.website}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {settings.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;