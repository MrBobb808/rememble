import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Users } from "lucide-react";
import { useCollaborators } from "@/hooks/useCollaborators";
import InviteForm from "./collaborators/InviteForm";
import CollaboratorsList from "./collaborators/CollaboratorsList";

interface CollaboratorsManagementProps {
  memorialId: string;
}

const CollaboratorsManagement = ({ memorialId }: CollaboratorsManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    collaborators,
    isLoading,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
  } = useCollaborators(memorialId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Manage Collaborators
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Collaborators</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InviteForm onInvite={inviteCollaborator} />
          <CollaboratorsList
            collaborators={collaborators}
            isLoading={isLoading}
            onRoleChange={updateCollaboratorRole}
            onRemove={removeCollaborator}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorsManagement;