import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MemorialBasicForm } from "./forms/MemorialBasicForm";
import { BannerUploadForm } from "./forms/BannerUploadForm";

interface Memorial {
  id: string;
  name: string;
  birth_year?: string;
  death_year?: string;
  banner_image_url?: string;
}

interface EditMemorialDialogProps {
  memorial: Memorial;
  newName: string;
  onNameChange: (value: string) => void;
  onUpdate: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
  onBannerChange: (url: string) => void;
  onBirthYearChange: (value: string) => void;
  onDeathYearChange: (value: string) => void;
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
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Memorial</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <MemorialBasicForm
            newName={newName}
            birthYear={memorial.birth_year || ""}
            deathYear={memorial.death_year || ""}
            onNameChange={onNameChange}
            onBirthYearChange={onBirthYearChange}
            onDeathYearChange={onDeathYearChange}
          />
          
          <BannerUploadForm
            currentBannerUrl={memorial.banner_image_url}
            onBannerChange={onBannerChange}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={onUpdate}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};