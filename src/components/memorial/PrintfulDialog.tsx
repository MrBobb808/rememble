import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Book, Shirt } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PrintfulDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memorialId: string;
  photos: Array<{ url: string; caption: string }>;
}

export const PrintfulDialog = ({ open, onOpenChange, memorialId, photos }: PrintfulDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProduct = async (type: 'photo-book' | 'quilt') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-printful-product', {
        body: {
          type,
          memorialId,
          photos: photos.map(photo => ({
            url: photo.url,
            caption: photo.caption
          }))
        },
      });

      if (error) throw error;
      
      // Redirect to Printful checkout
      window.location.href = data.checkoutUrl;
      
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error creating product",
        description: "There was a problem creating your product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            onClick={() => handleCreateProduct('photo-book')}
            disabled={isLoading}
          >
            <Book className="h-8 w-8" />
            <span>Photo Book</span>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => handleCreateProduct('quilt')}
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