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
}

interface PhotoGridProps {
  photos: Photo[];
  onPhotoAdd: (file: File, caption: string, aiReflection: string) => void;
  isLoading?: boolean;
}

const PhotoGrid = ({ photos, onPhotoAdd, isLoading = false }: PhotoGridProps) => {
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
      console.log("Generating AI reflection for:", { imageUrl, caption });
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

  const handleSubmit = async (caption: string) => {
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

      // Generate AI reflection using the public URL
      const aiReflection = await generateAIReflection(publicUrl, caption);
      
      if (!aiReflection) {
        throw new Error("No AI reflection generated");
      }

      onPhotoAdd(selectedFile, caption, aiReflection);
      
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {gridCells.map(({ id, photo }) => (
          <div key={id} className="relative aspect-square group">
            <GridCell
              photo={photo}
              onImageSelect={handleImageSelect}
              onFileSelect={handleFileChange}
            />
          </div>
        ))}
      </div>

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
  );
};

export default PhotoGrid;