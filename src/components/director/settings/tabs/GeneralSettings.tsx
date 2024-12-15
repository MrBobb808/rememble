import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LogoUpload from "./LogoUpload";
import ContactForm from "./ContactForm";

const GeneralSettings = () => {
  const { toast } = useToast();
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [funeralHome, setFuneralHome] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    timezone: "UTC",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('funeral_home_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setSettingsId(data.id);
        setFuneralHome({
          ...funeralHome,
          name: data.name || "",
          phone: data.phone_number || "",
          email: data.email_address || "",
          website: data.website || "",
        });
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settingsId) return;

    try {
      const { error } = await supabase
        .from('funeral_home_settings')
        .update({
          name: funeralHome.name,
          phone_number: funeralHome.phone,
          email_address: funeralHome.email,
          website: funeralHome.website,
        })
        .eq('id', settingsId);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your funeral home settings have been updated.",
      });

    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message || "There was a problem saving your settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">
          Manage your funeral home's basic information and preferences
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <LogoUpload settingsId={settingsId} />
        <ContactForm funeralHome={funeralHome} setFuneralHome={setFuneralHome} />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default GeneralSettings;