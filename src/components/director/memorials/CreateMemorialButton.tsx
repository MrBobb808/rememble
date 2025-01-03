import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { createNewMemorial } from "@/services/memorialService";
import { ensureValidUUID } from "@/utils/validation";

export const CreateMemorialButton = () => {
  const { toast } = useToast();

  const handleCreateMemorial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const userId = ensureValidUUID(user.id, 'user ID');
      const memorial = await createNewMemorial(userId);
      const memorialId = ensureValidUUID(memorial.id, 'memorial ID');
      
      // Generate a viewer link for the new memorial
      const { data: link, error: linkError } = await supabase
        .from('memorial_links')
        .insert({
          memorial_id: memorialId,
          type: 'viewer',
          created_by: userId,
        })
        .select()
        .single();

      if (linkError) throw linkError;

      // Create the full link
      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/memorial?id=${memorialId}&token=${link.token}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(fullLink);

      toast({
        title: "Memorial created!",
        description: "The memorial link has been copied to your clipboard.",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error creating memorial",
        description: error.message || "There was a problem creating the memorial.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleCreateMemorial} size="sm">
      <Plus className="w-4 h-4 mr-2" />
      Create Memorial
    </Button>
  );
};