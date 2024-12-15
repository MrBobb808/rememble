import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "./ui/badge";
import { Users } from "lucide-react";

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: {
    id: string;
    url: string;
    caption: string;
    aiReflection?: string;
    contributorName?: string;
    relationship?: string;
  } | null;
}

const ImageDialog = ({ open, onOpenChange, image }: ImageDialogProps) => {
  const [activeViewers, setActiveViewers] = useState<number>(0);

  useEffect(() => {
    if (!image?.id || !open) return;

    // Subscribe to presence updates for this image
    const channel = supabase.channel(`image_${image.id}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const viewerCount = Object.keys(state).length;
        setActiveViewers(viewerCount);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user: 'anonymous',
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [image?.id, open]);

  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex flex-col md:grid md:grid-cols-2">
          {/* Image Section */}
          <div className="relative w-full bg-black flex items-center">
            <img
              src={image.url}
              alt={image.caption}
              className="w-full h-auto object-contain max-h-[50vh] md:max-h-[90vh]"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col h-[50vh] md:h-[90vh] overflow-hidden">
            <div className="p-4 space-y-3 bg-white">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle className="text-lg font-playfair">Memory Details</DialogTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {activeViewers} viewing
                </Badge>
              </DialogHeader>

              <p className="text-base text-gray-600">{image.caption}</p>
              
              {image.contributorName && image.relationship && (
                <div className="text-sm text-memorial-gray-dark">
                  <p>Shared by {image.contributorName}</p>
                  <p className="italic">Relationship: {image.relationship}</p>
                </div>
              )}

              {image.aiReflection && (
                <div className="p-3 bg-memorial-beige-light rounded-lg border border-memorial-beige-dark/20">
                  <h3 className="text-sm font-semibold mb-1 text-memorial-gray-dark">AI Reflection</h3>
                  <p className="text-sm text-gray-700 italic leading-relaxed">{image.aiReflection}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;