import { useCollaboratorsState } from "./useCollaboratorsState";
import { useCollaboratorsFetch } from "./useCollaboratorsFetch";
import { useCollaboratorActions } from "./useCollaboratorActions";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type { Collaborator } from "@/types/collaborator";

export const useCollaborators = (memorialId: string) => {
  const { toast } = useToast();
  const { collaborators, isLoading, setCollaborators, setIsLoading } = useCollaboratorsState();
  const { fetchCollaborators } = useCollaboratorsFetch(memorialId);
  const { inviteCollaborator, updateCollaboratorRole, removeCollaborator } = 
    useCollaboratorActions(memorialId);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to manage collaborators.",
          variant: "destructive",
        });
        setCollaborators([]);
        setIsLoading(false);
        return;
      }
    };

    checkAuth();
  }, []);

  return {
    collaborators,
    isLoading,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
  };
};