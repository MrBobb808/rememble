import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
}

interface EditMemorialDialogProps {
  memorial: Memorial | null;
  newName: string;
  onNameChange: (value: string) => void;
  onUpdate: () => void;
  onOpenChange: (open: boolean) => void;
}

export const EditMemorialDialog = ({
  memorial,
  newName,
  onNameChange,
  onUpdate,
  onOpenChange,
}: EditMemorialDialogProps) => {
  return (
    <Dialog open={!!memorial} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Memorial Name</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter new name"
          />
          <Button onClick={onUpdate} className="w-full">
            Update Name
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};