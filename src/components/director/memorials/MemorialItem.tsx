import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Link, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  onGenerateLink,
}: MemorialItemProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerateLink = async (type: 'collaborator' | 'viewer') => {
    try {
      // Get current user
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

      if (error) {
        console.error('Error generating link:', error);
        throw error;
      }

      if (!link) {
        throw new Error('No link was generated');
      }

      // Generate the full URL for the memorial with the token
      const baseUrl = window.location.origin;
      const memorialUrl = `${baseUrl}/memorial?id=${memorial.id}&token=${link.token}`;

      try {
        // Try to copy to clipboard
        await navigator.clipboard.writeText(memorialUrl);
        toast({
          title: "Link generated successfully",
          description: "The link has been copied to your clipboard.",
        });
      } catch (clipboardError) {
        // If clipboard access is denied, show the link in the toast
        console.error('Clipboard access denied:', clipboardError);
        toast({
          title: "Link generated",
          description: "Copy this link manually: " + memorialUrl,
          duration: 10000, // Show for longer since user needs to copy manually
        });
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
    </div>
  );
};