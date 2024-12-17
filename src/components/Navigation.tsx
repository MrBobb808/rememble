import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { UserMenu } from "./navigation/UserMenu";
import { HelpDialog } from "./navigation/HelpDialog";
import { PrintfulDialog } from "./memorial/PrintfulDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NavigationButtons } from "./navigation/NavigationButtons";
import { Menu, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  
  const currentMemorialId = searchParams.get("id");
  const isDirector = profile?.relationship?.toLowerCase() === 'director';

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

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-10">
        <div className="flex flex-col gap-4">
          <NavigationButtons />
          {isDirector && (
            <Button
              variant="outline"
              onClick={() => navigate('/director')}
              className="w-full justify-start"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b h-12">
      <div className="container mx-auto h-full px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="text-xl font-playfair text-gray-800">Memories</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <NavigationButtons />
            {isDirector && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/director')}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            )}
          </div>
          <MobileMenu />
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