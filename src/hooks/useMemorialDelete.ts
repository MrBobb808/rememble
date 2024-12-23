import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMemorialDelete = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMemorial = async (id: string) => {
    try {
      const { error: photosError } = await supabase
        .from('memorial_photos')
        .delete()
        .eq('memorial_id', id);
      
      if (photosError) throw photosError;

      const { error: memorialError } = await supabase
        .from('memorials')
        .delete()
        .eq('id', id);
      
      if (memorialError) throw memorialError;

      await queryClient.invalidateQueries({ queryKey: ['memorials'] });
      await queryClient.invalidateQueries({ queryKey: ['activity_logs'] });
      
      toast({
        title: "Memorial deleted",
        description: "The memorial and all associated photos have been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting memorial:', error);
      toast({
        title: "Error deleting memorial",
        description: error.message || "There was a problem deleting the memorial.",
        variant: "destructive",
      });
    }
  };

  return { deleteMemorial };
};