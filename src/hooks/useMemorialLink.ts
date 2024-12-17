import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useMemorialLink = (memorialId: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const generateLink = async (type: 'collaborator' | 'viewer') => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
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
      }
    } catch (error: any) {
      console.error('Error generating link:', error);
      
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

  return {
    generatedLink,
    showDialog,
    setShowDialog,
    generateLink
  };
};