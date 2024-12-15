import { Plus } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
  contributorName?: string;
  relationship?: string;
}

interface GridCellProps {
  photo?: Photo;
  onImageSelect?: (photo: Photo) => void;
  onFileSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isPreview?: boolean;
}

const GridCell = ({ photo, onImageSelect, onFileSelect, isPreview = false }: GridCellProps) => {
  if (photo) {
    return (
      <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
        <button
          onClick={() => !isPreview && onImageSelect?.(photo)}
          className="w-full h-full relative focus:outline-none focus:ring-2 focus:ring-memorial-beige-dark"
        >
          <img
            src={photo.url}
            alt={photo.caption}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>
      </AspectRatio>
    );
  }

  if (isPreview) {
    return (
      <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
        <div className="w-full h-full bg-memorial-beige-light/50 rounded-lg border-2 border-dashed border-memorial-beige-dark/20 flex items-center justify-center">
          <div className="text-memorial-gray-dark/40">
            <Plus className="w-6 h-6" />
          </div>
        </div>
      </AspectRatio>
    );
  }

  return (
    <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
      <label className="w-full h-full bg-memorial-beige-light/50 rounded-lg border-2 border-dashed border-memorial-beige-dark/20 flex items-center justify-center cursor-pointer hover:bg-memorial-beige-light/70 transition-colors duration-200">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onFileSelect}
        />
        <div className="text-memorial-gray-dark/40">
          <Plus className="w-6 h-6" />
        </div>
      </label>
    </AspectRatio>
  );
};

export default GridCell;