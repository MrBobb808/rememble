import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MemorialItem } from "./memorials/MemorialItem";
import { EditMemorialDialog } from "./memorials/EditMemorialDialog";
import { PreviewMemorialDialog } from "./memorials/PreviewMemorialDialog";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Memorials</CardTitle>
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
          setNewName={setNewName}
          onClose={() => setEditingMemorial(null)}
          onSave={handleUpdateName}
        />
      )}
      
      {previewMemorial && (
        <PreviewMemorialDialog
          memorial={previewMemorial}
          onClose={() => setPreviewMemorial(null)}
        />
      )}
    </Card>
  );
};