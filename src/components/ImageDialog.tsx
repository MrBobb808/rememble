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
        <div className="flex flex-col md:grid md:grid-cols-2">
          {/* Image Section */}
          <div className="relative w-full bg-black flex items-center">
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-auto object-contain max-h-[50vh] md:max-h-[90vh]"
            />
          </div>

          {/* Details and Comments Section */}
          <div className="flex flex-col h-[50vh] md:h-[90vh] overflow-hidden">
            <div className="p-6 space-y-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-playfair">Memory Details</DialogTitle>
              </DialogHeader>

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
            </div>

            {/* Comments Section */}
            <div className="flex-1 border-t overflow-hidden bg-gray-50">
              <div className="p-6 h-full overflow-y-auto">
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