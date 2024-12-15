import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  banner_image_url?: string;
  birth_year?: string;
  death_year?: string;
}

interface EditMemorialDialogProps {
  memorial: Memorial | null;
  newName: string;
  onNameChange: (value: string) => void;
  onUpdate: () => void;
  onOpenChange: (open: boolean) => void;
  onBannerChange?: (value: string) => void;
  onBirthYearChange?: (value: string) => void;
  onDeathYearChange?: (value: string) => void;
}

export const EditMemorialDialog = ({
  memorial,
  newName,
  onNameChange,
  onUpdate,
  onOpenChange,
  onBannerChange,
  onBirthYearChange,
  onDeathYearChange,
}: EditMemorialDialogProps) => {
  return (
    <Dialog open={!!memorial} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Memorial Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Memorial Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter memorial name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Banner Image URL</Label>
            <Input
              id="banner"
              value={memorial?.banner_image_url || ''}
              onChange={(e) => onBannerChange?.(e.target.value)}
              placeholder="Enter banner image URL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthYear">Birth Year</Label>
              <Input
                id="birthYear"
                value={memorial?.birth_year || ''}
                onChange={(e) => onBirthYearChange?.(e.target.value)}
                placeholder="YYYY"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deathYear">Death Year</Label>
              <Input
                id="deathYear"
                value={memorial?.death_year || ''}
                onChange={(e) => onDeathYearChange?.(e.target.value)}
                placeholder="YYYY"
              />
            </div>
          </div>

          <Button onClick={onUpdate} className="w-full">
            Update Memorial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};