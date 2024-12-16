import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, Shield, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface LinkGeneratorProps {
  memorialId: string;
}

export const LinkGenerator = ({ memorialId }: LinkGeneratorProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const generateLink = async (type: 'collaborator' | 'viewer') => {
    try {
      // First check if the session is valid
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        // Redirect to auth page
        navigate("/auth");
        return;
      }

      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to generate links.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data: link, error } = await supabase
        .from('memorial_links')
        .insert({
          memorial_id: memorialId,
          type,
          created_by: session.user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating link:', error);
        throw error;
      }

      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/memorial?id=${memorialId}&token=${link.token}`;
      
      setGeneratedLink(fullLink);
      setShowDialog(true);

      try {
        await navigator.clipboard.writeText(fullLink);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
      } catch (clipboardError) {
        console.error('Clipboard access denied:', clipboardError);
        // Don't show an error toast since we're showing the manual copy dialog
      }
    } catch (error: any) {
      console.error('Error generating link:', error);
      
      // Check if it's an authentication error
      if (error.message?.includes('JWT expired')) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      toast({
        title: "Error generating link",
        description: error.message || "There was a problem generating the link.",
        variant: "destructive",
      });
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
              onClick={() => {
                if (generatedLink) {
                  navigator.clipboard.writeText(generatedLink)
                    .then(() => {
                      toast({
                        title: "Link copied!",
                        description: "The link has been copied to your clipboard.",
                      });
                    })
                    .catch((error) => {
                      console.error('Error copying to clipboard:', error);
                    });
                }
              }}
            >
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};