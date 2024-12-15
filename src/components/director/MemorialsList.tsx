import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MemorialItem } from "./memorials/MemorialItem";
import { EditMemorialDialog } from "./memorials/EditMemorialDialog";
import { PreviewMemorialDialog } from "./memorials/PreviewMemorialDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createNewMemorial } from "@/services/memorialService";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  banner_image_url?: string;
  birth_year?: string;
  death_year?: string;
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

  const handleCreateMemorial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      await createNewMemorial(user.id);
      
      toast({
        title: "Memorial created",
        description: "New memorial has been created successfully.",
      });
      
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error creating memorial",
        description: error.message || "There was a problem creating the memorial.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateName = async () => {
    if (!editingMemorial) return;

    try {
      const { error } = await supabase
        .from('memorials')
        .update({ 
          name: newName.trim(),
          banner_image_url: editingMemorial.banner_image_url,
          birth_year: editingMemorial.birth_year,
          death_year: editingMemorial.death_year
        })
        .eq('id', editingMemorial.id);

      if (error) throw error;

      toast({
        title: "Memorial updated",
        description: "The memorial has been updated successfully.",
      });

      setEditingMemorial(null);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error updating memorial",
        description: error.message || "There was a problem updating the memorial.",
        variant: "destructive",
      });
    }
  };

  const handleBannerChange = async (url: string) => {
    if (!editingMemorial) return;
    setEditingMemorial({ ...editingMemorial, banner_image_url: url });
  };

  const handleBirthYearChange = (value: string) => {
    if (!editingMemorial) return;
    setEditingMemorial({ ...editingMemorial, birth_year: value });
  };

  const handleDeathYearChange = (value: string) => {
    if (!editingMemorial) return;
    setEditingMemorial({ ...editingMemorial, death_year: value });
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

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: link, error } = await supabase
        .from('memorial_links')
        .insert({
          memorial_id: memorialId,
          type,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (!link) {
        throw new Error('No link was generated');
      }

      const shareUrl = `${window.location.origin}/memorial?id=${memorialId}&token=${link.token}`;
      await navigator.clipboard.writeText(shareUrl);

      toast({
        title: "Link generated",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} link has been copied to clipboard.`,
      });
    } catch (error: any) {
      console.error('Error generating link:', error);
      toast({
        title: "Error generating link",
        description: error.message || "There was a problem generating the link.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Memorials</CardTitle>
        <Button onClick={handleCreateMemorial} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Memorial
        </Button>
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
        onBannerChange={handleBannerChange}
        onBirthYearChange={handleBirthYearChange}
        onDeathYearChange={handleDeathYearChange}
      />

      <PreviewMemorialDialog
        memorial={previewMemorial}
        onOpenChange={() => setPreviewMemorial(null)}
      />
    </Card>
  );
};
