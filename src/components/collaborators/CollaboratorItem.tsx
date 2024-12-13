import { Collaborator } from "@/hooks/useCollaborators";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Shield, UserPlus, Eye } from "lucide-react";

interface CollaboratorItemProps {
  collaborator: Collaborator;
  onRoleChange: (id: string, role: Collaborator["role"]) => void;
  onRemove: (id: string) => void;
}

const CollaboratorItem = ({
  collaborator,
  onRoleChange,
  onRemove,
}: CollaboratorItemProps) => {
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
    <div className="flex items-center justify-between p-2 rounded-lg border">
      <div className="flex items-center gap-2">
        {getRoleIcon(collaborator.role)}
        <span>{collaborator.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={collaborator.role}
          onValueChange={(value: any) => onRoleChange(collaborator.id, value)}
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
          onClick={() => onRemove(collaborator.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default CollaboratorItem;