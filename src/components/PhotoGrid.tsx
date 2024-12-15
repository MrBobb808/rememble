import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import PhotoUploadDialog from "./PhotoUploadDialog";
import ImageDialog from "./ImageDialog";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";
import GridCell from "./photo-grid/GridCell";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { Photo } from "@/types/photo";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoAdd: (file: File, caption: string, contributorName: string, relationship: string) => void;
  isLoading?: boolean;
  isPreview?: boolean;
}

const PhotoGrid = ({ photos, onPhotoAdd, isLoading = false, isPreview = false }: PhotoGridProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const { 
    selectedFile,
    isUploadDialogOpen,
    handleFileChange,
    handleSubmit,
    setIsUploadDialogOpen
  } = usePhotoUpload(onPhotoAdd);

  // Create array of 25 cells (5x5 grid)
  const gridCells = Array(25)
    .fill(null)
    .map((_, index) => {
      const photo = photos[index];
      return { id: String(index), photo };
    });

  const handleImageSelect = (photo: Photo) => {
    setSelectedImage(photo);
    setIsImageDialogOpen(true);
  };

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