import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PhotoGrid from "@/components/PhotoGrid";
import { Skeleton } from "@/components/ui/skeleton";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
}

interface PreviewMemorialDialogProps {
  memorial: Memorial | null;
  onOpenChange: (open: boolean) => void;
}

export const PreviewMemorialDialog = ({
  memorial,
  onOpenChange,
}: PreviewMemorialDialogProps) => {
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['memorial-photos', memorial?.id],
    queryFn: async () => {
      if (!memorial) return [];
      const { data, error } = await supabase
        .from('memorial_photos')
        .select('*')
        .eq('memorial_id', memorial.id)
        .order('position', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memorial,
  });

  return (
    <Dialog open={!!memorial} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{memorial?.name} - Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-5 gap-2">
              {Array(25).fill(null).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          ) : (
            <PhotoGrid 
              photos={photos} 
              onPhotoAdd={() => {}} 
              isPreview={true}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};