import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
}

interface PreviewMemorialDialogProps {
  memorial: Memorial | null;
  onOpenChange: (open: boolean) => void;
}

export const PreviewMemorialDialog = ({
  memorial,
  onOpenChange,
}: PreviewMemorialDialogProps) => {
  return (
    <Dialog open={!!memorial} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{memorial?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <iframe
            src={`/memorial?id=${memorial?.id}&preview=true`}
            className="w-full h-[600px] rounded-lg border"
            title="Memorial Preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};