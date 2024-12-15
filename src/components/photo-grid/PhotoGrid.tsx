import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import PhotoUploadDialog from "../PhotoUploadDialog";
import ImageDialog from "../ImageDialog";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "../ui/skeleton";
import GridCell from "./GridCell";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { Photo } from "@/types/photo";

interface PhotoGridProps {
  photos: Photo[];
  onPhotoAdd: (file: File, caption: string, contributorName: string, relationship: string, position: number) => void;
  isLoading?: boolean;
  isPreview?: boolean;
}

const PhotoGrid = ({ photos, onPhotoAdd, isLoading = false, isPreview = false }: PhotoGridProps) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const { 
    selectedFile,
    isUploadDialogOpen,
    handleFileChange,
    handleSubmit,
    setIsUploadDialogOpen
  } = usePhotoUpload((caption: string, contributorName: string, relationship: string) => {
    if (selectedPosition !== null && selectedFile) {
      onPhotoAdd(selectedFile, caption, contributorName, relationship, selectedPosition);
    }
  });

  // Create array of 25 cells (5x5 grid)
  const gridCells = Array(25)
    .fill(null)
    .map((_, index) => {
      const photo = photos.find(p => p.id === String(index));
      return { id: String(index), photo, position: index };
    });

  const handleImageSelect = (photo: Photo) => {
    setSelectedImage(photo);
    setIsImageDialogOpen(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, position: number) => {
    setSelectedPosition(position);
    handleFileChange(event);
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
        {gridCells.map(({ id, photo, position }) => (
          <div key={id} className="relative group">
            <GridCell
              photo={photo}
              position={position}
              onImageSelect={handleImageSelect}
              onFileSelect={isPreview ? undefined : handleFileSelect}
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