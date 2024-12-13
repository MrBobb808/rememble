import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  onSubmit: (caption: string) => Promise<void>;
}

const PhotoUploadDialog = ({
  open,
  onOpenChange,
  imageFile,
  onSubmit,
}: PhotoUploadDialogProps) => {
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create preview URL when image file changes
  useState(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(caption);
      onOpenChange(false);
      setCaption("");
    } catch (error) {
      console.error("Error submitting photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add a Memory</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {previewUrl && (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <Textarea
            placeholder="Share your memory..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !caption.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Memory
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;