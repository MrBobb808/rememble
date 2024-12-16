import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Link, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  banner_image_url?: string;
  birth_year?: string;
  death_year?: string;
}

interface MemorialItemProps {
  memorial: Memorial;
  onEdit: (memorial: Memorial) => void;
  onPreview: (memorial: Memorial) => void;
  onDelete: (id: string) => void;
  onGenerateLink: (memorialId: string, type: 'collaborator' | 'viewer') => Promise<void>;
}

export const MemorialItem = ({
  memorial,
  onEdit,
  onPreview,
  onDelete,
}: MemorialItemProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleGenerateLink = async (type: 'collaborator' | 'viewer') => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to generate links.",
          variant: "destructive",
        });
        return;
      }

      // Special handling for mr.bobb12@yahoo.com - bypass all checks
      const isSpecialUser = user.email === 'mr.bobb12@yahoo.com';

      if (!isSpecialUser) {
        // Check if user is an admin for this memorial
        const { data: collaborator, error: collaboratorError } = await supabase
          .from('memorial_collaborators')
          .select('role')
          .eq('memorial_id', memorial.id)
          .eq('user_id', user.id)
          .single();

        if (collaboratorError || !collaborator || collaborator.role !== 'admin') {
          toast({
            title: "Permission denied",
            description: "Only memorial admins can generate links.",
            variant: "destructive",
          });
          return;
        }
      }

      // Create the link
      const { data: link, error } = await supabase
        .from('memorial_links')
        .insert({
          memorial_id: memorial.id,
          type,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/memorial?id=${memorial.id}&token=${link.token}`;
      
      setGeneratedLink(fullLink);
      setShowDialog(true);

      try {
        await navigator.clipboard.writeText(fullLink);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
      } catch (clipboardError) {
        // Don't show an error toast since we're showing the manual copy dialog
        console.error('Clipboard access denied:', clipboardError);
      }
    } catch (error: any) {
      console.error('Error generating link:', error);
      toast({
        title: "Error generating link",
        description: error.message || "There was a problem generating the link.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b last:border-0 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`/memorial?id=${memorial.id}&preview=true`)}
            className="hover:underline font-medium"
          >
            {memorial.name}
          </button>
          <p className="text-sm text-gray-500">
            Created: {new Date(memorial.created_at).toLocaleDateString()}
          </p>
          {memorial.birth_year && memorial.death_year && (
            <p className="text-sm text-gray-500">
              {memorial.birth_year} - {memorial.death_year}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={memorial.is_complete ? "default" : "secondary"}
            className={memorial.is_complete ? "bg-green-500" : "bg-blue-500"}
          >
            {memorial.is_complete ? 'Completed' : 'Active'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(memorial)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(memorial)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(memorial.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleGenerateLink('collaborator')}
        >
          <Shield className="mr-2 h-4 w-4" />
          Generate Collaborator Link
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleGenerateLink('viewer')}
        >
          <Link className="mr-2 h-4 w-4" />
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
                      // Don't show error toast since the link is visible for manual copy
                    });
                }
              }}
            >
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};