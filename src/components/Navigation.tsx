import { useState } from "react";
import { HelpCircle, Home, Printer, Download, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { UserMenu } from "./navigation/UserMenu";
import { HelpDialog } from "./navigation/HelpDialog";
import { InviteDialog } from "./memorial/InviteDialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "./ui/use-toast";

const Navigation = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-playfair text-gray-800">Memories</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/memorial")}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>

          {memorialId && <InviteDialog memorialId={memorialId} />}

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
    </div>
  );
};

export default Navigation;