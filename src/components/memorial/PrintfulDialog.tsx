import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Book, Shirt } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface PrintfulDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memorialId: string;
  photos: Array<{ url: string; caption: string }>;
}

export const PrintfulDialog = ({ open, onOpenChange, memorialId, photos }: PrintfulDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleProductSelection = (type: 'photo-book' | 'quilt') => {
    if (!photos || photos.length === 0) {
      toast({
        title: "No photos available",
        description: "Please add some photos to the memorial before creating a print product.",
        variant: "destructive",
      });
      return;
    }

    // Close the dialog
    onOpenChange(false);
    
    // Navigate to the appropriate product page with the memorial ID
    navigate(`/print/${type}?memorial=${memorialId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-playfair">
            Create Memorial Print
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => handleProductSelection('photo-book')}
            disabled={isLoading}
          >
            <Book className="h-8 w-8" />
            <span>Photo Book</span>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => handleProductSelection('quilt')}
            disabled={isLoading}
          >
            <Shirt className="h-8 w-8" />
            <span>Memory Quilt</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};