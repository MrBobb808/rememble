import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditMemorialDialog } from "./EditMemorialDialog";
import { PreviewMemorialDialog } from "./PreviewMemorialDialog";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  birth_year?: string;
  death_year?: string;
  banner_image_url?: string;
}

interface MemorialManagementProps {
  memorial: Memorial | null;
  onClose: () => void;
  isEditing: boolean;
  isPreviewing: boolean;
}

export const MemorialManagement = ({ 
  memorial, 
  onClose,
  isEditing,
  isPreviewing
}: MemorialManagementProps) => {
  const { toast } = useToast();
  const [newName, setNewName] = useState(memorial?.name || "");

  const handleUpdateName = async () => {
    if (!memorial) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('memorials')
        .update({ name: newName })
        .eq('id', memorial.id);

      if (error) throw error;

      toast({
        title: "Memorial updated",
        description: "The memorial name has been updated successfully.",
      });

      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error updating memorial",
        description: error.message || "There was a problem updating the memorial.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {isEditing && memorial && (
        <EditMemorialDialog
          memorial={memorial}
          newName={newName}
          onNameChange={setNewName}
          onUpdate={handleUpdateName}
          onOpenChange={() => onClose()}
        />
      )}
      
      {isPreviewing && memorial && (
        <PreviewMemorialDialog
          memorial={memorial}
          onOpenChange={(open) => {
            if (!open) onClose();
          }}
        />
      )}
    </>
  );
};