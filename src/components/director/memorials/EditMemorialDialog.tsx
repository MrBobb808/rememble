import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  banner_image_url?: string;
  birth_year?: string;
  death_year?: string;
}

interface EditMemorialDialogProps {
  memorial: Memorial | null;
  newName: string;
  onNameChange: (value: string) => void;
  onUpdate: () => void;
  onOpenChange: (open: boolean) => void;
  onBannerChange?: (value: string) => void;
  onBirthYearChange?: (value: string) => void;
  onDeathYearChange?: (value: string) => void;
}

export const EditMemorialDialog = ({
  memorial,
  newName,
  onNameChange,
  onUpdate,
  onOpenChange,
  onBannerChange,
  onBirthYearChange,
  onDeathYearChange,
}: EditMemorialDialogProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [birthYear, setBirthYear] = useState(memorial?.birth_year || '');
  const [deathYear, setDeathYear] = useState(memorial?.death_year || '');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !memorial) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('memorial-photos')
        .getPublicUrl(fileName);

      onBannerChange?.(publicUrl);
      
      toast({
        title: "Banner uploaded",
        description: "The memorial banner has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Error uploading banner",
        description: error.message || "There was a problem uploading the banner image.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleBirthYearChange = (value: string) => {
    setBirthYear(value);
    onBirthYearChange?.(value);
  };

  const handleDeathYearChange = (value: string) => {
    setDeathYear(value);
    onDeathYearChange?.(value);
  };

  return (
    <Dialog open={!!memorial} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Memorial Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Memorial Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter memorial name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Banner Image</Label>
            <div className="flex flex-col gap-2">
              {memorial?.banner_image_url && (
                <img 
                  src={memorial.banner_image_url} 
                  alt="Memorial banner" 
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="flex-1"
                />
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthYear">Birth Year</Label>
              <Input
                id="birthYear"
                value={birthYear}
                onChange={(e) => handleBirthYearChange(e.target.value)}
                placeholder="YYYY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deathYear">Death Year</Label>
              <Input
                id="deathYear"
                value={deathYear}
                onChange={(e) => handleDeathYearChange(e.target.value)}
                placeholder="YYYY"
              />
            </div>
          </div>

          <Button onClick={onUpdate} className="w-full">
            Update Memorial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};