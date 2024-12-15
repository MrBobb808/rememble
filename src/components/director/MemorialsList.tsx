import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MemorialItem } from "./memorials/MemorialItem";
import { CreateMemorialButton } from "./memorials/CreateMemorialButton";
import { MemorialManagement } from "./memorials/MemorialManagement";
import { supabase } from "@/integrations/supabase/client";

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
  const [previewMemorial, setPreviewMemorial] = useState<Memorial | null>(null);

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Memorials</CardTitle>
        <CreateMemorialButton />
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
                    onEdit={() => setEditingMemorial(memorial)}
                    onDelete={() => onDelete(memorial.id)}
                    onPreview={() => setPreviewMemorial(memorial)}
                    onGenerateLink={handleGenerateLink}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <MemorialManagement
        memorial={editingMemorial || previewMemorial}
        onClose={() => {
          setEditingMemorial(null);
          setPreviewMemorial(null);
        }}
        isEditing={!!editingMemorial}
        isPreviewing={!!previewMemorial}
      />
    </Card>
  );
};