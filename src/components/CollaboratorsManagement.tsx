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
import { useToast } from "./ui/use-toast";

interface CollaboratorsManagementProps {
  memorialId: string;
}

const CollaboratorsManagement = ({ memorialId }: CollaboratorsManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const {
    collaborators,
    isLoading,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
  } = useCollaborators(memorialId);

  // Prevent opening the dialog if there's no valid memorial ID
  const handleOpenChange = (open: boolean) => {
    if (open && (!memorialId || memorialId === "00000000-0000-0000-0000-000000000000")) {
      toast({
        title: "Cannot manage collaborators",
        description: "Please create or select a memorial first.",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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