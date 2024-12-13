import { useState, useEffect } from "react";
import { Image, Plus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import PhotoUploadDialog from "./PhotoUploadDialog";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});

  // Create array of 25 cells (5x5 grid)
  const gridCells = Array(25).fill(null).map((_, index) => {
    const photo = photos[index];
    return { id: index, photo };
  });

  const handleImageLoad = (id: number) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: number) => {
    setImageLoading(prev => ({ ...prev, [id]: false }));
    toast({
      title: "Error loading image",
      description: "There was a problem loading the image. Please try again later.",
      variant: "destructive",
    });
  };

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
      const { data, error } = await supabase.functions.invoke('generate-reflection', {
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
      const imageUrl = URL.createObjectURL(selectedFile);
      const aiReflection = await generateAIReflection(imageUrl, caption);
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
      <div className="grid grid-cols-5 gap-4">
        {Array(25).fill(null).map((_, index) => (
          <Skeleton key={index} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {gridCells.map(({ id, photo }) => (
          <div
            key={id}
            className="relative aspect-square group"
          >
            {photo ? (
              <div className="w-full h-full relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg">
                {imageLoading[id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 className="w-6 h-6 animate-spin text-memorial-blue" />
                  </div>
                )}
                <img
                  src={`${photo.url}?quality=80&width=400`}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onLoad={() => handleImageLoad(id)}
                  onError={() => handleImageError(id)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/40 backdrop-blur-sm">
                    <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
                  </div>
                </div>
              </div>
            ) : (
              <label className="w-full h-full flex items-center justify-center border border-dashed border-memorial-gray-dark/30 rounded-lg cursor-pointer hover:bg-memorial-gray-light/10 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Plus className="w-6 h-6 text-memorial-gray-dark/50" />
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