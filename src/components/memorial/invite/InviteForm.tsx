import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface InviteFormProps {
  onSubmit: (email: string, role: string) => void;
  isLoading: boolean;
}

export const InviteForm = ({ onSubmit, isLoading }: InviteFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "contributor" | "viewer">("viewer");

  const handleSubmit = () => {
    onSubmit(email, role);
    setEmail("");
    setRole("viewer");
  };

  const getRoleDescription = (selectedRole: string) => {
    switch (selectedRole) {
      case "admin":
        return "Can manage memorial and invite others";
      case "contributor":
        return "Can add photos and comments";
      case "viewer":
        return "Can view the memorial";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <Select value={role} onValueChange={(value: any) => setRole(value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="contributor">Contributor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <p className="mt-1 text-sm text-gray-500">
          {getRoleDescription(role)}
        </p>
      </div>

      <Button 
        className="w-full bg-memorial-blue hover:bg-memorial-blue-dark" 
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Sending invitation..." : "Send Invitation"}
      </Button>
    </div>
  );
};