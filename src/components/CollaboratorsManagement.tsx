import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Users, UserPlus, Shield, Eye } from "lucide-react";
import { useCollaborators, Collaborator } from "@/hooks/useCollaborators";

interface CollaboratorsManagementProps {
  memorialId: string;
}

const CollaboratorsManagement = ({ memorialId }: CollaboratorsManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Collaborator["role"]>("viewer");

  const {
    collaborators,
    isLoading,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator,
  } = useCollaborators(memorialId);

  const handleInvite = async () => {
    if (email && role) {
      await inviteCollaborator(email, role);
      setEmail("");
      setRole("viewer");
    }
  };

  const getRoleIcon = (role: Collaborator["role"]) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "contributor":
        return <UserPlus className="w-4 h-4" />;
      case "viewer":
        return <Eye className="w-4 h-4" />;
    }
  };

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
          <div className="flex gap-2">
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Select value={role} onValueChange={(value: any) => setRole(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="contributor">Contributor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInvite}>Invite</Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div>Loading collaborators...</div>
            ) : (
              collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    {getRoleIcon(collaborator.role)}
                    <span>{collaborator.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={collaborator.role}
                      onValueChange={(value: any) =>
                        updateCollaboratorRole(collaborator.id, value)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="contributor">Contributor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCollaborator(collaborator.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorsManagement;