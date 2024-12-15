import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CommentsList from "./comments/CommentsList";

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: {
    id: string;
    url: string;
    caption: string;
    aiReflection?: string;
    contributorName?: string;
    relationship?: string;
  } | null;
}

const ImageDialog = ({ open, onOpenChange, image }: ImageDialogProps) => {
  if (!image) return null;

  console.log("ImageDialog - image:", {
    id: image.id,
    url: image.url,
    caption: image.caption
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-playfair">Memory Details</DialogTitle>
          <DialogDescription className="text-base">{image.caption}</DialogDescription>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <div className="relative w-full overflow-hidden rounded-lg">
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-auto object-cover"
            />
          </div>
          {image.contributorName && image.relationship && (
            <div className="mt-2 text-sm text-memorial-gray-dark">
              <p>Shared by {image.contributorName}</p>
              <p className="italic">Relationship: {image.relationship}</p>
            </div>
          )}
          {image.aiReflection && (
            <div className="mt-2 p-3 bg-memorial-beige-light rounded-lg border border-memorial-beige-dark/20">
              <h3 className="text-sm font-semibold mb-1 text-memorial-gray-dark">AI Reflection</h3>
              <p className="text-sm text-gray-700 italic leading-relaxed">{image.aiReflection}</p>
            </div>
          )}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3 text-memorial-gray-dark">Comments</h3>
            <CommentsList photoId={image.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;