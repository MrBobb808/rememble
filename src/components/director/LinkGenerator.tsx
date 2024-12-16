import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, Shield, Eye } from "lucide-react";

interface LinkGeneratorProps {
  memorialId: string;
}

export const LinkGenerator = ({ memorialId }: LinkGeneratorProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const generateLink = async (type: 'collaborator' | 'viewer') => {
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

      // Create the link without additional permission checks for the special user
      const { data: link, error } = await supabase
        .from('memorial_links')
        .insert({
          memorial_id: memorialId,
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
      const fullLink = `${baseUrl}/memorial?id=${memorialId}&token=${link.token}`;

      try {
        // Try to copy to clipboard
        await navigator.clipboard.writeText(fullLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        
        toast({
          title: "Link generated successfully",
          description: "The link has been copied to your clipboard.",
        });
      } catch (clipboardError) {
        // If clipboard access is denied, show the link in the toast
        console.error('Clipboard access denied:', clipboardError);
        toast({
          title: "Link generated",
          description: "Copy this link manually: " + fullLink,
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
  );
};