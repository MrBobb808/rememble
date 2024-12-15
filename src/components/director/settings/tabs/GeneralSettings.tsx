import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2, Globe, Mail, Phone, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const GeneralSettings = () => {
  const { toast } = useToast();
  const [funeralHome, setFuneralHome] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    timezone: "UTC",
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memorial-photos')
        .getPublicUrl(fileName);

      // Update funeral home settings with new logo URL
      const { error: updateError } = await supabase
        .from('funeral_home_settings')
        .update({ logo_url: publicUrl })
        .eq('id', 1);

      if (updateError) throw updateError;

      toast({
        title: "Logo uploaded successfully",
        description: "Your new logo has been saved.",
      });

    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error uploading logo",
        description: error.message || "There was a problem uploading your logo.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('funeral_home_settings')
        .update({
          name: funeralHome.name,
          phone_number: funeralHome.phone,
          email_address: funeralHome.email,
          website: funeralHome.website,
        })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your funeral home settings have been updated.",
      });

      console.log("Saving general settings:", funeralHome);
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
        <h2 className="text-2xl font-semibold mb-2">General Settings</h2>
        <p className="text-muted-foreground">
          Manage your funeral home's basic information and preferences
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Funeral Home Logo</Label>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 border-2 border-dashed rounded-lg flex items-center justify-center">
                <input
                  type="file"
                  id="logo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <label
                  htmlFor="logo"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Logo</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Funeral Home Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="name"
                className="pl-10"
                value={funeralHome.name}
                onChange={(e) =>
                  setFuneralHome({ ...funeralHome, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="phone"
                className="pl-10"
                value={funeralHome.phone}
                onChange={(e) =>
                  setFuneralHome({ ...funeralHome, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={funeralHome.email}
                onChange={(e) =>
                  setFuneralHome({ ...funeralHome, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="website"
                className="pl-10"
                value={funeralHome.website}
                onChange={(e) =>
                  setFuneralHome({ ...funeralHome, website: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default GeneralSettings;