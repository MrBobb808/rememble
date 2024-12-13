import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import UploadProgress from "./photo-grid/UploadProgress";
import { useProfile } from "@/hooks/useProfile";

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  onSubmit: (caption: string, contributorName: string, relationship: string) => Promise<void>;
}

const PhotoUploadDialog = ({
  open,
  onOpenChange,
  imageFile,
  onSubmit,
}: PhotoUploadDialogProps) => {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const [caption, setCaption] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setContributorName(profile.full_name);
      setRelationship(profile.relationship);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setIsSubmitting(true);
    await onSubmit(caption, contributorName, relationship);
    setIsSubmitting(false);
    setCaption("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-playfair">Add a Memory</DialogTitle>
        </DialogHeader>
        {isSubmitting ? (
          <div className="py-4">
            <UploadProgress message="Generating AI reflection..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {imageFile && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="contributorName" className="text-sm">Your Name</Label>
              <Input
                id="contributorName"
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder={isProfileLoading ? "Loading..." : "Enter your name"}
                disabled={isProfileLoading}
                className="h-8"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="relationship" className="text-sm">Relationship</Label>
              <Input
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder={isProfileLoading ? "Loading..." : "e.g., Son, Daughter, Friend"}
                disabled={isProfileLoading}
                className="h-8"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="caption" className="text-sm">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share the story behind this memory..."
                className="min-h-[80px] resize-none"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-8 px-3"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isProfileLoading}
                className="h-8 px-3"
              >
                Upload
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadDialog;