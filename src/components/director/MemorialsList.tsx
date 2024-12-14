import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Link, Shield, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const navigate = useNavigate();
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
      // Refresh the page to show updated data
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
      // Check if memorial is complete for viewer links
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
              <div
                key={memorial.id}
                className="flex flex-col gap-4 p-4 border-b last:border-0 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      onClick={() => navigate(`/memorial?id=${memorial.id}`)}
                      className="hover:underline font-medium"
                    >
                      {memorial.name}
                    </button>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(memorial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={memorial.is_complete ? "default" : "secondary"}
                      className={memorial.is_complete ? "bg-green-500" : "bg-blue-500"}
                    >
                      {memorial.is_complete ? 'Completed' : 'Active'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPreviewMemorial(memorial);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingMemorial(memorial);
                        setNewName(memorial.name);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(memorial.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => generateLink(memorial.id, 'collaborator')}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Generate Collaborator Link
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => generateLink(memorial.id, 'viewer')}
                    disabled={!memorial.is_complete}
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Generate Viewer Link
                    {!memorial.is_complete && (
                      <span className="ml-2 text-xs text-gray-500">(Fill all tiles first)</span>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Edit Memorial Name Dialog */}
      <Dialog open={!!editingMemorial} onOpenChange={() => setEditingMemorial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Memorial Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
            />
            <Button onClick={handleUpdateName} className="w-full">
              Update Name
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Memorial Preview Dialog */}
      <Dialog open={!!previewMemorial} onOpenChange={() => setPreviewMemorial(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewMemorial?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <iframe
              src={`/memorial?id=${previewMemorial?.id}&preview=true`}
              className="w-full h-[600px] rounded-lg border"
              title="Memorial Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};