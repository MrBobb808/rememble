import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export const usePhotoUpload = (
  onSubmit: (caption: string, contributorName: string, relationship: string) => void,
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

  const handleSubmit = async (caption: string, contributorName: string, relationship: string) => {
    try {
      await onSubmit(caption, contributorName, relationship);
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