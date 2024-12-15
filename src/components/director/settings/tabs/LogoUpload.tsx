import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LogoUploadProps {
  settingsId: string | null;
}

const LogoUpload = ({ settingsId }: LogoUploadProps) => {
  const { toast } = useToast();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settingsId) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('memorial-photos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('funeral_home_settings')
        .update({ logo_url: publicUrl })
        .eq('id', settingsId);

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

  return (
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
  );
};

export default LogoUpload;