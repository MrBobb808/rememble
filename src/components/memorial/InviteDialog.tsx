import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteDialogProps {
  memorialId: string;
}

export const InviteDialog = ({ memorialId }: InviteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "contributor" | "viewer">("viewer");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateMemorialId = (id: string) => {
    // UUID regex pattern
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(id);
  };

  const handleInvite = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateMemorialId(memorialId)) {
      console.error("Invalid memorial ID:", memorialId);
      toast({
        title: "Error",
        description: "Invalid memorial ID. Please ensure you are working with a valid memorial.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Creating collaborator record with:", {
        memorial_id: memorialId,
        email,
        role,
      });

      const { data: newCollaborator, error: collaboratorError } = await supabase
        .from("memorial_collaborators")
        .insert({
          memorial_id: memorialId,
          email,
          role,
        })
        .select()
        .single();

      if (collaboratorError) {
        console.error("Error creating collaborator:", collaboratorError);
        throw new Error(collaboratorError.message);
      }

      console.log("Successfully created collaborator:", newCollaborator);

      console.log("Sending invitation email...");
      const { error: inviteError } = await supabase.functions.invoke("send-invitation", {
        body: {
          email,
          memorialId,
          invitationToken: newCollaborator.invitation_token,
          role,
        },
      });

      if (inviteError) {
        console.error("Error sending invitation:", inviteError);
        throw new Error(inviteError.message);
      }

      console.log("Logging activity...");
      await supabase.from('memorial_activity_log').insert({
        memorial_id: memorialId,
        action_type: 'invite_sent',
        target_email: email,
        target_role: role,
      });

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      setIsOpen(false);
      setEmail("");
      setRole("viewer");
    } catch (error: any) {
      console.error("Error in handleInvite:", error);
      toast({
        title: "Error sending invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Invite Family
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Invite Family Member</DialogTitle>
        </DialogHeader>
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
            onClick={handleInvite}
            disabled={isLoading}
          >
            {isLoading ? "Sending invitation..." : "Send Invitation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};