import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { UserMenu } from "./navigation/UserMenu";
import { HelpDialog } from "./navigation/HelpDialog";
import { PrintfulDialog } from "./memorial/PrintfulDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NavigationButtons } from "./navigation/NavigationButtons";

const Navigation = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  
  const currentMemorialId = searchParams.get("id");

  // Fetch photos for the current memorial
  const { data: photos = [] } = useQuery({
    queryKey: ['memorial-photos', currentMemorialId],
    queryFn: async () => {
      if (!currentMemorialId) return [];
      const { data, error } = await supabase
        .from('memorial_photos')
        .select('*')
        .eq('memorial_id', currentMemorialId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data.map(photo => ({
        url: photo.image_url,
        caption: photo.caption
      }));
    },
    enabled: !!currentMemorialId
  });

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-playfair text-gray-800">Memories</div>
        </div>

        <div className="flex items-center gap-2">
          <NavigationButtons />
          <UserMenu />
        </div>
      </div>

      <HelpDialog isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
      <PrintfulDialog 
        open={isPrintDialogOpen} 
        onOpenChange={setIsPrintDialogOpen}
        memorialId={currentMemorialId || ''}
        photos={photos}
      />
    </div>
  );
};

export default Navigation;