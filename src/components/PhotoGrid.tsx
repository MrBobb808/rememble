import { useState } from "react";
import { Image, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import PhotoUploadDialog from "./PhotoUploadDialog";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
}

interface PhotoGridProps {
  photos: Photo[];
  onPhotoAdd: (file: File, caption: string, aiReflection: string) => void;
}

const PhotoGrid = ({ photos, onPhotoAdd }: PhotoGridProps) => {
  const { toast } = useToast();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Create array of 25 cells (5x5 grid)
  const gridCells = Array(25).fill(null).map((_, index) => {
    const photo = photos[index];
    return { id: index, photo };
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setIsDialogOpen(true);
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
      const response = await fetch("/api/generate-reflection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          caption,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reflection");
      }

      const data = await response.json();
      return data.reflection;
    } catch (error) {
      console.error("Error generating reflection:", error);
      throw error;
    }
  };

  const handleSubmit = async (caption: string) => {
    if (!selectedFile) return;

    try {
      // Create a temporary URL for the image
      const imageUrl = URL.createObjectURL(selectedFile);
      
      // Generate AI reflection
      const aiReflection = await generateAIReflection(imageUrl, caption);
      
      // Add the photo with caption and AI reflection
      onPhotoAdd(selectedFile, caption, aiReflection);
      
      toast({
        title: "Memory added",
        description: "Your memory has been added to the memorial.",
      });
    } catch (error) {
      toast({
        title: "Error adding memory",
        description: "There was a problem adding your memory. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {gridCells.map(({ id, photo }) => (
          <div
            key={id}
            className="relative aspect-square group"
            onMouseEnter={() => setHoveredIndex(id)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {photo ? (
              <div className="w-full h-full relative overflow-hidden rounded-lg shadow-md">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <p className="text-white text-sm">{photo.caption}</p>
                    {photo.aiReflection && (
                      <p className="text-white/80 text-xs italic">
                        {photo.aiReflection}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <label className="w-full h-full flex items-center justify-center border-2 border-dashed border-memorial-gray rounded-lg cursor-pointer hover:bg-memorial-gray-light/20 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Plus className="w-8 h-8 text-memorial-gray-dark" />
              </label>
            )}
          </div>
        ))}
      </div>

      <PhotoUploadDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        imageFile={selectedFile}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PhotoGrid;