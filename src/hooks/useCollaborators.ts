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
    const fetchCollaborators = async () => {
      const { data, error } = await supabase
        .from("memorial_collaborators")
        .select("*")
        .eq("memorial_id", memorialId);

      if (error) {
        console.error("Error fetching collaborators:", error);
        toast({
          title: "Error fetching collaborators",
          description: "Please try again later",
          variant: "destructive",
        });
      } else {
        setCollaborators(data);
      }
      setIsLoading(false);
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
          fetchCollaborators();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memorialId]);

  const inviteCollaborator = async (email: string, role: Collaborator["role"]) => {
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
        description: "Please try again later",
        variant: "destructive",
      });
      return null;
    }

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
    const { error } = await supabase
      .from("memorial_collaborators")
      .update({ role: newRole })
      .eq("id", collaboratorId);

    if (error) {
      console.error("Error updating collaborator role:", error);
      toast({
        title: "Error updating role",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Role updated",
      description: "The collaborator's role has been updated",
    });

    return true;
  };

  const removeCollaborator = async (collaboratorId: string) => {
    const { error } = await supabase
      .from("memorial_collaborators")
      .delete()
      .eq("id", collaboratorId);

    if (error) {
      console.error("Error removing collaborator:", error);
      toast({
        title: "Error removing collaborator",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    }

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