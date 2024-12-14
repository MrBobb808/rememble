import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { validateUUID } from "@/utils/validation";
import { InviteForm } from "./invite/InviteForm";
import { supabase } from "@/integrations/supabase/client";
import { CollaboratorRole } from "@/types/collaborator";

interface InviteDialogProps {
  memorialId: string;
}

export const InviteDialog = ({ memorialId }: InviteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInvite = async ({ email, role }: { email: string; role: CollaboratorRole }) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateUUID(memorialId)) {
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
      // Create signup token
      const { data: tokenData, error: tokenError } = await supabase
        .from("signup_tokens")
        .insert({
          memorial_id: memorialId,
          email,
          role: role as "admin" | "contributor" | "viewer",
        })
        .select()
        .single();

      if (tokenError) throw tokenError;

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke("send-signup-invitation", {
        body: {
          email,
          token: tokenData.token,
          role,
        },
      });

      if (emailError) throw emailError;

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      setIsOpen(false);
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
        <InviteForm onSubmit={handleInvite} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
};