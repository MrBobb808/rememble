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

  const handleInvite = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to invite collaborators.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has admin rights
    const { data: collaborator } = await supabase
      .from('memorial_collaborators')
      .select('role')
      .eq('memorial_id', memorialId)
      .eq('user_id', session.user.id)
      .single();

    if (!collaborator || collaborator.role !== 'admin') {
      toast({
        title: "Permission denied",
        description: "Only admins can invite collaborators.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create collaborator record
      const { data: newCollaborator, error: collaboratorError } = await supabase
        .from("memorial_collaborators")
        .insert({
          memorial_id: memorialId,
          email,
          role,
        })
        .select()
        .single();

      if (collaboratorError) throw collaboratorError;

      // Send invitation email
      const { error: inviteError } = await supabase.functions.invoke("send-invitation", {
        body: {
          email,
          memorialId,
          invitationToken: newCollaborator.invitation_token,
          role,
        },
      });

      if (inviteError) throw inviteError;

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      // Log the activity
      await supabase.from('memorial_activity_log').insert({
        memorial_id: memorialId,
        actor_id: session.user.id,
        action_type: 'invite_sent',
        target_email: email,
        target_role: role,
      });

      setIsOpen(false);
      setEmail("");
      setRole("viewer");
    } catch (error: any) {
      console.error("Error sending invitation:", error);
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