import { Plus, Loader2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
}

interface GridCellProps {
  photo: Photo | null;
  onImageSelect: (photo: Photo) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const GridCell = ({ photo, onImageSelect, onFileSelect }: GridCellProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    toast({
      title: "Error loading image",
      description: "There was a problem loading the image. Please try again later.",
      variant: "destructive",
    });
  };

  if (photo) {
    return (
      <button
        onClick={() => onImageSelect(photo)}
        className="w-full h-full relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-memorial-blue group"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="w-6 h-6 animate-spin text-memorial-blue" />
          </div>
        )}
        <img
          src={`${photo.url}?quality=80&width=400`}
          alt={photo.caption}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-sm">
            <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <label className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-memorial-gray-dark/30 rounded-lg cursor-pointer hover:bg-memorial-gray-light/10 transition-colors group">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onFileSelect}
            />
            <ImageIcon className="w-8 h-8 text-memorial-gray-dark/30 mb-2 group-hover:text-memorial-blue transition-colors" />
            <span className="text-sm text-memorial-gray-dark/50 group-hover:text-memorial-blue transition-colors">
              Add a memory
            </span>
          </label>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to share a cherished memory</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default GridCell;