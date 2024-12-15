import { useState } from "react";
import { HelpCircle, Home, Printer, Download, Share2, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { UserMenu } from "./navigation/UserMenu";
import { HelpDialog } from "./navigation/HelpDialog";
import { PrintfulDialog } from "./memorial/PrintfulDialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "./ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile } = useProfile();
  
  const currentMemorialId = searchParams.get("id");
  const token = searchParams.get("token");

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

  const handleHomeClick = () => {
    // If we have a memorial ID, navigate back to it with the token if present
    if (currentMemorialId) {
      const params = new URLSearchParams();
      params.set("id", currentMemorialId);
      if (token) {
        params.set("token", token);
      }
      navigate(`/memorial?${params.toString()}`);
    } else {
      // If no memorial ID, just go to memorial page (this shouldn't happen often)
      navigate("/memorial");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Memorial link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error sharing",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    setIsPrintDialogOpen(true);
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your memorial will be downloaded as a PDF shortly.",
    });
    // TODO: Implement PDF generation
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-playfair text-gray-800">Memories</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>

          {/* Show Dashboard button only for director accounts */}
          {profile?.relationship === 'director' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/director")}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Memorial
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHelpOpen(true)}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
          </Button>

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