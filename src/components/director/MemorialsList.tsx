import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MemorialItem } from "./memorials/MemorialItem";
import { EditMemorialDialog } from "./memorials/EditMemorialDialog";
import { PreviewMemorialDialog } from "./memorials/PreviewMemorialDialog";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
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
    if (!editingMemorial || !newName.trim()) return;

    try {
      const { error } = await supabase
        .from('memorials')
        .update({ name: newName.trim() })
        .eq('id', editingMemorial.id);

      if (error) throw error;

      toast({
        title: "Memorial updated",
        description: "The memorial name has been updated successfully.",
      });

      setEditingMemorial(null);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error updating memorial",
        description: error.message || "There was a problem updating the memorial name.",
        variant: "destructive",
      });
    }
  };

  const generateLink = async (memorialId: string, type: 'collaborator' | 'viewer') => {
    try {
      if (type === 'viewer') {
        const { data: photos } = await supabase
          .from('memorial_photos')
          .select('id')
          .eq('memorial_id', memorialId);

        if (!photos || photos.length < 25) {
          toast({
            title: "Cannot generate viewer link",
            description: "All 25 photo tiles must be filled before generating a viewer link.",
            variant: "destructive",
          });
          return;
        }
      }

      const { data: link, error } = await supabase
        .from('memorial_links')
        .insert({
          memorial_id: memorialId,
          type,
        })
        .select()
        .single();

      if (error) throw error;

      const shareUrl = `${window.location.origin}/memorial?token=${link.token}`;
      await navigator.clipboard.writeText(shareUrl);

      toast({
        title: "Link generated",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} link has been copied to clipboard.`,
      });
    } catch (error: any) {
      toast({
        title: "Error generating link",
        description: error.message || "There was a problem generating the link.",
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
            {memorials.map((memorial) => (
              <MemorialItem
                key={memorial.id}
                memorial={memorial}
                onEdit={(memorial) => {
                  setEditingMemorial(memorial);
                  setNewName(memorial.name);
                }}
                onPreview={(memorial) => setPreviewMemorial(memorial)}
                onDelete={onDelete}
                onGenerateLink={generateLink}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <EditMemorialDialog
        memorial={editingMemorial}
        newName={newName}
        onNameChange={setNewName}
        onUpdate={handleUpdateName}
        onOpenChange={() => setEditingMemorial(null)}
      />

      <PreviewMemorialDialog
        memorial={previewMemorial}
        onOpenChange={() => setPreviewMemorial(null)}
      />
    </Card>
  );
};