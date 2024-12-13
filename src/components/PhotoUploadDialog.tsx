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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-playfair">Add a Memory</DialogTitle>
        </DialogHeader>
        {isSubmitting ? (
          <div className="py-8">
            <UploadProgress message="Generating AI reflection..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {imageFile && (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="contributorName">Your Name</Label>
              <Input
                id="contributorName"
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder={isProfileLoading ? "Loading..." : "Enter your name"}
                disabled={isProfileLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder={isProfileLoading ? "Loading..." : "e.g., Son, Daughter, Friend"}
                disabled={isProfileLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share the story behind this memory..."
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isProfileLoading}>
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