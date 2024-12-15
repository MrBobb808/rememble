import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import PhotoUploadDialog from "./PhotoUploadDialog";
import ImageDialog from "./ImageDialog";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";
import GridCell from "./photo-grid/GridCell";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
  contributorName?: string;
  relationship?: string;
}

interface PhotoGridProps {
  photos: Photo[];
  onPhotoAdd: (file: File, caption: string, contributorName: string, relationship: string) => void;
  isLoading?: boolean;
  isPreview?: boolean;
}

const PhotoGrid = ({ photos, onPhotoAdd, isLoading = false, isPreview = false }: PhotoGridProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // Create array of 25 cells (5x5 grid)
  const gridCells = Array(25)
    .fill(null)
    .map((_, index) => {
      const photo = photos[index];
      return { id: index, photo };
    });

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

  const handleImageSelect = (photo: Photo) => {
    setSelectedImage(photo);
    setIsImageDialogOpen(true);
  };

  const generateAIReflection = async (imageUrl: string, caption: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-reflection", {
        body: {
          imageUrl,
          caption,
        },
      });

      if (error) throw error;
      return data.reflection;
    } catch (error) {
      console.error("Error generating reflection:", error);
      throw error;
    }
  };

  const handleSubmit = async (caption: string, contributorName: string, relationship: string) => {
    if (!selectedFile) return;

    try {
      // First, upload the file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('memorial-photos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('memorial-photos')
        .getPublicUrl(fileName);

      console.log("Generated public URL:", publicUrl);

      // Generate AI reflection using the public URL
      const aiReflection = await generateAIReflection(publicUrl, caption);
      
      if (!aiReflection) {
        throw new Error("No AI reflection generated");
      }

      onPhotoAdd(selectedFile, caption, contributorName, relationship);
      
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

  useEffect(() => {
    const channel = supabase
      .channel("photos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memorial_photos",
        },
        (payload) => {
          console.log("Photo changes detected:", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-2">
        {Array(25)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-lg" />
          ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-2">
        {gridCells.map(({ id, photo }) => (
          <div key={id} className="relative group">
            <GridCell
              photo={photo}
              onImageSelect={handleImageSelect}
              onFileSelect={isPreview ? undefined : handleFileChange}
              isPreview={isPreview}
            />
          </div>
        ))}
      </div>

      {!isPreview && (
        <>
          <PhotoUploadDialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
            imageFile={selectedFile}
            onSubmit={handleSubmit}
          />

          <ImageDialog
            open={isImageDialogOpen}
            onOpenChange={setIsImageDialogOpen}
            image={selectedImage}
          />
        </>
      )}
    </>
  );
};

export default PhotoGrid;
