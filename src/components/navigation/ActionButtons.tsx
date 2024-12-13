import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Home,
  Printer,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InviteDialog } from "@/components/memorial/InviteDialog";

export const ActionButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract memorial ID from URL if we're on the memorial page
  const memorialId = location.pathname === "/memorial" ? 
    new URLSearchParams(location.search).get("id") : null;

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
      title: "Preparing memorial for print...",
      description: "The print dialog will open shortly.",
    });
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your memorial will be downloaded as a PDF shortly.",
    });
    // TODO: Implement PDF generation
  };

  return (
    <>
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/memorial")}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="hidden md:inline-flex"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="hidden md:inline-flex"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Memorial
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="hidden md:inline-flex"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        {memorialId && (
          <InviteDialog memorialId={memorialId} />
        )}
      </div>
    </>
  );
};