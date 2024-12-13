import { useCollaboratorsState } from "./useCollaboratorsState";
import { useCollaboratorsFetch } from "./useCollaboratorsFetch";
import { useCollaboratorActions } from "./useCollaboratorActions";

export type { Collaborator } from "@/types/collaborator";

export const useCollaborators = (memorialId: string) => {
  const { collaborators, isLoading } = useCollaboratorsState();
  const { fetchCollaborators } = useCollaboratorsFetch(memorialId);
  const { inviteCollaborator, updateCollaboratorRole, removeCollaborator } = 
    useCollaboratorActions(memorialId);

  return {
    collaborators,
    isLoading,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
  };
};