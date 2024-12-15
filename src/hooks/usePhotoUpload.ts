import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePhotoUpload = (
  onPhotoAdd: (file: File, caption: string, contributorName: string, relationship: string) => void,
) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setIsUploadDialogOpen(true);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  const generateAIReflection = async (imageUrl: string, caption: string) => {
    try {
      console.log("Generating AI reflection for image:", imageUrl);
      const { data, error } = await supabase.functions.invoke("generate-reflection", {
        body: {
          imageUrl,
          caption,
        },
      });

      if (error) {
        console.error("Error generating reflection:", error);
        throw error;
      }

      console.log("Generated reflection:", data.reflection);
      return data.reflection;
    } catch (error) {
      console.error("Error generating reflection:", error);
      throw error;
    }
  };

  const handleSubmit = async (caption: string, contributorName: string, relationship: string) => {
    if (!selectedFile) return;

    try {
      await onPhotoAdd(selectedFile, caption, contributorName, relationship);
      setSelectedFile(null);
      setIsUploadDialogOpen(false);
      
      toast({
        title: "Memory added",
        description: "Your memory has been added to the memorial.",
      });
    } catch (error) {
      console.error("Error adding photo:", error);
      toast({
        title: "Error adding memory",
        description: "There was a problem adding your memory. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    selectedFile,
    isUploadDialogOpen,
    handleFileChange,
    handleSubmit,
    setIsUploadDialogOpen,
  };
};