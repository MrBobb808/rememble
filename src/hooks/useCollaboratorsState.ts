import { useState } from "react";
import { Collaborator } from "@/types/collaborator";

export const useCollaboratorsState = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return {
    collaborators,
    setCollaborators,
    isLoading,
    setIsLoading,
  };
};