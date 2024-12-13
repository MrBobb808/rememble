import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Collaborator } from "@/types/collaborator";

export const useCollaboratorActions = (memorialId: string) => {
  const { toast } = useToast();

  const inviteCollaborator = async (email: string, role: Collaborator["role"]) => {
    if (!memorialId) {
      console.error("No memorialId provided to inviteCollaborator");
      return null;
    }

    console.log("Inviting collaborator:", { email, role, memorialId });
    
    try {
      const { data: collaborator, error: insertError } = await supabase
        .from("memorial_collaborators")
        .insert([
          {
            memorial_id: memorialId,
            email,
            role,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      const { error: inviteError } = await supabase.functions.invoke("send-invitation", {
        body: {
          email,
          memorialId,
          invitationToken: collaborator.invitation_token,
          role,
        },
      });

      if (inviteError) throw inviteError;

      console.log("Successfully invited collaborator:", collaborator);
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      return collaborator;
    } catch (error: any) {
      console.error("Error in inviteCollaborator:", error);
      toast({
        title: "Error inviting collaborator",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCollaboratorRole = async (
    collaboratorId: string,
    newRole: Collaborator["role"]
  ) => {
    console.log("Updating collaborator role:", { collaboratorId, newRole });
    const { error } = await supabase
      .from("memorial_collaborators")
      .update({ role: newRole })
      .eq("id", collaboratorId);

    if (error) {
      console.error("Error updating collaborator role:", error);
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    console.log("Successfully updated collaborator role");
    toast({
      title: "Role updated",
      description: "The collaborator's role has been updated",
    });

    return true;
  };

  const removeCollaborator = async (collaboratorId: string) => {
    console.log("Removing collaborator:", collaboratorId);
    const { error } = await supabase
      .from("memorial_collaborators")
      .delete()
      .eq("id", collaboratorId);

    if (error) {
      console.error("Error removing collaborator:", error);
      toast({
        title: "Error removing collaborator",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    console.log("Successfully removed collaborator");
    toast({
      title: "Collaborator removed",
      description: "The collaborator has been removed from the memorial",
    });

    return true;
  };

  return {
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
  };
};