import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MemorialItem } from "./memorials/MemorialItem";
import { EditMemorialDialog } from "./memorials/EditMemorialDialog";
import { PreviewMemorialDialog } from "./memorials/PreviewMemorialDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createNewMemorial } from "@/services/memorialService";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  birth_year?: string;
  death_year?: string;
  banner_image_url?: string;
}

interface MemorialsListProps {
  memorials: Memorial[];
  onDelete: (id: string) => Promise<void>;
}

export const MemorialsList = ({ memorials, onDelete }: MemorialsListProps) => {
  const { toast } = useToast();
  const [editingMemorial, setEditingMemorial] = useState<Memorial | null>(null);
  const [newName, setNewName] = useState("");
  const [previewMemorial, setPreviewMemorial] = useState<Memorial | null>(null);

  const handleUpdateName = async () => {
    if (!editingMemorial) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('memorials')
        .update({ name: newName })
        .eq('id', editingMemorial.id);

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

  const handlePreview = (memorial: Memorial) => {
    setPreviewMemorial(memorial);
  };

  const handleEdit = (memorial: Memorial) => {
    setEditingMemorial(memorial);
    setNewName(memorial.name);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast({
        title: "Memorial deleted",
        description: "The memorial has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting memorial",
        description: error.message || "There was a problem deleting the memorial.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateLink = async (memorialId: string, type: 'collaborator' | 'viewer') => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to generate links.",
          variant: "destructive",
        });
        return;
      }

      const { data: link, error } = await supabase
        .from('memorial_links')
        .insert({
          memorial_id: memorialId,
          type,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const fullLink = `${baseUrl}/memorial?id=${memorialId}&token=${link.token}`;

      await navigator.clipboard.writeText(fullLink);
      toast({
        title: "Link generated",
        description: "The link has been copied to your clipboard.",
      });
    } catch (error: any) {
      toast({
        title: "Error generating link",
        description: error.message || "There was a problem generating the link.",
        variant: "destructive",
      });
    }
  };

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Memorials</CardTitle>
        <Button onClick={handleCreateMemorial} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Memorial
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <div className="p-4">
            {memorials.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No memorials found
              </div>
            ) : (
              <div className="space-y-4">
                {memorials.map((memorial) => (
                  <MemorialItem
                    key={memorial.id}
                    memorial={memorial}
                    onEdit={() => handleEdit(memorial)}
                    onDelete={() => handleDelete(memorial.id)}
                    onPreview={() => handlePreview(memorial)}
                    onGenerateLink={handleGenerateLink}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      {editingMemorial && (
        <EditMemorialDialog
          memorial={editingMemorial}
          newName={newName}
          onNameChange={setNewName}
          onUpdate={handleUpdateName}
          onOpenChange={() => setEditingMemorial(null)}
        />
      )}
      
      {previewMemorial && (
        <PreviewMemorialDialog
          memorial={previewMemorial}
          onOpenChange={(open) => {
            if (!open) setPreviewMemorial(null);
          }}
        />
      )}
    </Card>
  );
};