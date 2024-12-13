import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type Collaborator = {
  id: string;
  email: string;
  role: "admin" | "contributor" | "viewer";
  invitation_accepted: boolean;
};

export const useCollaborators = (memorialId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!memorialId) {
      console.log("No memorialId provided to useCollaborators");
      setIsLoading(false);
      return;
    }

    const fetchCollaborators = async () => {
      console.log("Fetching collaborators for memorial:", memorialId);
      try {
        const { data, error } = await supabase
          .from("memorial_collaborators")
          .select("*")
          .eq("memorial_id", memorialId);

        if (error) {
          console.error("Error fetching collaborators:", error);
          toast({
            title: "Error fetching collaborators",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        console.log("Fetched collaborators:", data);
        setCollaborators(data || []);
      } catch (error) {
        console.error("Unexpected error fetching collaborators:", error);
        toast({
          title: "Error fetching collaborators",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchCollaborators();

    // Subscribe to changes
    const channel = supabase
      .channel("collaborators-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memorial_collaborators",
          filter: `memorial_id=eq.${memorialId}`,
        },
        (payload) => {
          console.log("Collaborators change detected:", payload);
          fetchCollaborators();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memorialId, toast]);

  const inviteCollaborator = async (email: string, role: Collaborator["role"]) => {
    if (!memorialId) {
      console.error("No memorialId provided to inviteCollaborator");
      return null;
    }

    console.log("Inviting collaborator:", { email, role, memorialId });
    const { data, error } = await supabase
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

    if (error) {
      console.error("Error inviting collaborator:", error);
      toast({
        title: "Error inviting collaborator",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    console.log("Successfully invited collaborator:", data);
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${email}`,
    });

    return data;
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
    collaborators,
    isLoading,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
  };
};