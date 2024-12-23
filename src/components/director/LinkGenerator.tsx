import { Button } from "@/components/ui/button";
import { Shield, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMemorialLink } from "@/hooks/useMemorialLink";
import { useToast } from "@/hooks/use-toast";

interface LinkGeneratorProps {
  memorialId: string;
}

export const LinkGenerator = ({ memorialId }: LinkGeneratorProps) => {
  const { toast } = useToast();
  const { generatedLink, showDialog, setShowDialog, generateLink } = useMemorialLink(memorialId);

  const handleCopyLink = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast({
          title: "Error copying link",
          description: "Please try copying the link manually.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => generateLink('collaborator')}
        >
          <Shield className="mr-2 h-4 w-4" />
          Generate Collaborator Link
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => generateLink('viewer')}
        >
          <Eye className="mr-2 h-4 w-4" />
          Generate Viewer Link
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generated Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If the link wasn't automatically copied, you can manually copy it below:
            </p>
            <div className="p-2 bg-muted rounded-md">
              <code className="text-sm break-all">{generatedLink}</code>
            </div>
            <Button 
              className="w-full"
              onClick={handleCopyLink}
            >
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};