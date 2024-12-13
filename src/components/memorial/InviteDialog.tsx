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

  // For testing purposes, use a default memorial ID if none is provided
  const effectiveMemorialId = memorialId || "00000000-0000-0000-0000-000000000000";

  const handleInvite = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create collaborator record
      const { data: collaborator, error: collaboratorError } = await supabase
        .from("memorial_collaborators")
        .insert({
          memorial_id: effectiveMemorialId,
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
          memorialId: effectiveMemorialId,
          invitationToken: collaborator.invitation_token,
          role,
        },
      });

      if (inviteError) throw inviteError;

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
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
          <DialogTitle>Invite Family Member</DialogTitle>
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
              {role === "admin" && "Can manage memorial and invite others"}
              {role === "contributor" && "Can add photos and comments"}
              {role === "viewer" && "Can view the memorial"}
            </p>
          </div>

          <Button 
            className="w-full" 
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