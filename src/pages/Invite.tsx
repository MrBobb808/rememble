import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";

const Invite = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "contributor" | "viewer">("viewer");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("memorial");

  const handleInvite = async () => {
    if (!memorialId) {
      toast({
        title: "Error",
        description: "No memorial ID provided",
        variant: "destructive",
      });
      return;
    }

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
          invitationToken: collaborator.invitation_token,
          role,
        },
      });

      if (inviteError) throw inviteError;

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      // Navigate back to memorial
      navigate(`/memorial`);
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
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Invite Family Member</h1>
            <p className="mt-2 text-gray-600">
              Send an invitation to collaborate on this memorial
            </p>
          </div>

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
        </div>
      </main>
    </div>
  );
};

export default Invite;