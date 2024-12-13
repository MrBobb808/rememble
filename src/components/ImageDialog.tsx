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
  } | null;
}

const ImageDialog = ({ open, onOpenChange, image }: ImageDialogProps) => {
  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-playfair">Memory Details</DialogTitle>
          <DialogDescription className="text-lg">{image.caption}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={`${image.url}?quality=100&width=1200`}
              alt={image.caption}
              className="h-full w-full object-cover"
            />
          </div>
          {image.aiReflection && (
            <div className="mt-4 p-4 bg-memorial-beige-light rounded-lg">
              <p className="text-gray-700 italic">{image.aiReflection}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;