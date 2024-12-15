import {
  Dialog,
  DialogContent,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative w-full bg-black flex items-center">
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-auto object-contain max-h-[90vh] md:max-h-[600px]"
            />
          </div>

          {/* Details and Comments Section */}
          <div className="p-6 flex flex-col h-full max-h-[90vh] md:max-h-[600px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-playfair">Memory Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-y-auto">
              <p className="text-base text-gray-600">{image.caption}</p>
              
              {image.contributorName && image.relationship && (
                <div className="text-sm text-memorial-gray-dark">
                  <p>Shared by {image.contributorName}</p>
                  <p className="italic">Relationship: {image.relationship}</p>
                </div>
              )}

              {image.aiReflection && (
                <div className="p-3 bg-memorial-beige-light rounded-lg border border-memorial-beige-dark/20">
                  <h3 className="text-sm font-semibold mb-1 text-memorial-gray-dark">AI Reflection</h3>
                  <p className="text-sm text-gray-700 italic leading-relaxed">{image.aiReflection}</p>
                </div>
              )}

              <div className="pt-4">
                <CommentsList photoId={image.id} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;