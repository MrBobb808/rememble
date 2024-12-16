import { useEffect, useState } from "react";
import PhotoGrid from "@/components/PhotoGrid";
import MemorialSummary from "@/components/MemorialSummary";
import MemorialBanner from "./MemorialBanner";
import { TributeModal } from "./TributeModal";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { Photo } from "@/types/photo";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import Slideshow from "./Slideshow";

interface MemorialContentProps {
  photos: Photo[];
  handlePhotoAdd: (file: File, caption: string, contributorName: string, relationship: string, position: number) => Promise<void>;
  isLoading: boolean;
  memorial?: {
    name: string;
    banner_image_url?: string;
    birth_year?: string;
    death_year?: string;
  };
}

export const MemorialContent = ({
  photos,
  handlePhotoAdd,
  isLoading,
  memorial,
}: MemorialContentProps) => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");
  const [showTributeModal, setShowTributeModal] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [isGeneratingSlideshow, setIsGeneratingSlideshow] = useState(false);
  const [showSlideshowDialog, setShowSlideshowDialog] = useState(false);
  const { toast } = useToast();

  const handleGenerateSlideshow = async () => {
    if (photos.length === 25) {
      setShowSlideshowDialog(true);
    } else {
      setShowIncompleteAlert(true);
    }
  };

  return (
    <div className="pt-8">
      <MemorialBanner 
        name={memorial?.name || "Memorial"}
        birthYear={memorial?.birth_year}
        deathYear={memorial?.death_year}
        photoUrl={memorial?.banner_image_url}
      />

      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleGenerateSlideshow}
          className="bg-memorial-blue hover:bg-memorial-blue/90"
          disabled={isGeneratingSlideshow}
        >
          View Slideshow
        </Button>
      </div>

      <div className={cn(
        "max-w-[1400px] mx-auto",
        "bg-gradient-to-b from-memorial-beige-light to-white/50",
        "rounded-lg shadow-sm p-4 mx-auto my-6"
      )}>
        <div className="space-y-6">
          <PhotoGrid photos={photos} onPhotoAdd={handlePhotoAdd} isLoading={isLoading} />
        </div>
      </div>

      <TributeModal
        open={showTributeModal}
        onOpenChange={setShowTributeModal}
        photos={photos}
      />

      <AlertDialog open={showIncompleteAlert} onOpenChange={setShowIncompleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Incomplete Memorial</AlertDialogTitle>
            <AlertDialogDescription>
              Please complete all 25 photo tiles before viewing the memorial slideshow. 
              You have added {photos.length} out of 25 photos.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showSlideshowDialog} onOpenChange={setShowSlideshowDialog}>
        <DialogContent className="max-w-lg w-[70vw]">
          <DialogHeader>
            <DialogTitle>Memorial Slideshow</DialogTitle>
          </DialogHeader>
          <Slideshow photos={photos} />
        </DialogContent>
      </Dialog>
    </div>
  );
};