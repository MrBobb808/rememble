import { Collaborator } from "@/hooks/useCollaborators";
import CollaboratorItem from "./CollaboratorItem";

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  isLoading: boolean;
  onRoleChange: (id: string, role: Collaborator["role"]) => void;
  onRemove: (id: string) => void;
}

const CollaboratorsList = ({
  collaborators,
  isLoading,
  onRoleChange,
  onRemove,
}: CollaboratorsListProps) => {
  if (isLoading) {
    return <div>Loading collaborators...</div>;
  }

  return (
    <div className="space-y-2">
      {collaborators.map((collaborator) => (
        <CollaboratorItem
          key={collaborator.id}
          collaborator={collaborator}
          onRoleChange={onRoleChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CollaboratorsList;