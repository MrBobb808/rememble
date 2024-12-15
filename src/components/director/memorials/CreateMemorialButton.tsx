import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { createNewMemorial } from "@/services/memorialService";

export const CreateMemorialButton = () => {
  const { toast } = useToast();

  const handleCreateMemorial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      await createNewMemorial(user.id);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error creating memorial",
        description: error.message || "There was a problem creating the memorial.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleCreateMemorial} size="sm">
      <Plus className="w-4 h-4 mr-2" />
      Create Memorial
    </Button>
  );
};