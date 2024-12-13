import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: {
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
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-playfair">Memory Details</DialogTitle>
          <DialogDescription className="text-lg">{image.caption}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="relative w-full overflow-hidden rounded-lg">
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-auto object-cover"
            />
          </div>
          {image.contributorName && image.relationship && (
            <div className="mt-4 text-sm text-memorial-gray-dark">
              <p>Shared by {image.contributorName}</p>
              <p className="italic">Relationship: {image.relationship}</p>
            </div>
          )}
          {image.aiReflection && (
            <div className="mt-4 p-4 bg-memorial-beige-light rounded-lg border border-memorial-beige-dark/20">
              <h3 className="text-lg font-semibold mb-2 text-memorial-gray-dark">AI Reflection</h3>
              <p className="text-gray-700 italic leading-relaxed">{image.aiReflection}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;