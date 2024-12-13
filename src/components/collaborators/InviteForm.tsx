import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Collaborator } from "@/hooks/useCollaborators";

interface InviteFormProps {
  onInvite: (email: string, role: Collaborator["role"]) => void;
}

const InviteForm = ({ onInvite }: InviteFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Collaborator["role"]>("viewer");

  const handleSubmit = () => {
    if (email && role) {
      onInvite(email, role);
      setEmail("");
      setRole("viewer");
    }
  };

  return (
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
      <Button onClick={handleSubmit}>Invite</Button>
    </div>
  );
};

export default InviteForm;