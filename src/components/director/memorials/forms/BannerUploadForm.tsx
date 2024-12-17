import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BannerUploadFormProps {
  currentBannerUrl?: string;
  onBannerChange: (url: string) => void;
}

export const BannerUploadForm = ({
  currentBannerUrl,
  onBannerChange,
}: BannerUploadFormProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('memorial-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('memorial-photos')
          .getPublicUrl(data.path);

        onBannerChange(publicUrl);
        toast({
          title: "Banner uploaded",
          description: "The banner image has been updated successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading the banner.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="banner">Banner Image</Label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isUploading}
            onClick={() => document.getElementById('banner')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Banner"}
          </Button>
          <input
            id="banner"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
      {currentBannerUrl && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden">
          <img
            src={currentBannerUrl}
            alt="Current banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
};