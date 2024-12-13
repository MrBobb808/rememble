import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpDialog = ({ isOpen, onOpenChange }: HelpDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Need Help?</DialogTitle>
          <DialogDescription>
            Here are some common questions and answers to help you navigate the memorial:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">How do I add a photo?</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Add Photo" button in the header, then select a photo from your device
              and add a caption to share your memory.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">How do I share the memorial?</h3>
            <p className="text-sm text-muted-foreground">
              Click the "Share" button to copy a link that you can send to family and friends.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Can I download or print the memorial?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! Use the "Download" button to save a PDF version, or "Print Memorial"
              to print directly from your browser.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};