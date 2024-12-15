import { Home, Printer, Download, Share2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";

export const NavigationButtons = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { data: profile } = useProfile();
  
  const currentMemorialId = searchParams.get("id");
  const token = searchParams.get("token");

  const handleHomeClick = () => {
    const isDirector = profile?.relationship === 'director';
    
    if (isDirector) {
      navigate("/director");
    } else {
      if (currentMemorialId) {
        const params = new URLSearchParams();
        params.set("id", currentMemorialId);
        if (token) {
          params.set("token", token);
        }
        navigate(`/memorial?${params.toString()}`);
      } else {
        navigate("/memorial");
      }
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
    toast({
      title: "Print started",
      description: "The print dialog will open shortly.",
    });
    // TODO: Implement print functionality
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your memorial will be downloaded as a PDF shortly.",
    });
    // TODO: Implement PDF generation
  };

  const isDirector = profile?.relationship === 'director';

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleHomeClick}
      >
        <Home className="w-4 h-4 mr-2" />
        {isDirector ? 'Dashboard' : 'Home'}
      </Button>

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
        onClick={() => navigate("/help")}
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        Help
      </Button>
    </div>
  );
};