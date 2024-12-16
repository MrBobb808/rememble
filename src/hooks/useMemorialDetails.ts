import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useMemorialDetails = (memorialId: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['memorial', memorialId],
    queryFn: async () => {
      if (!memorialId) return null;
      
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', memorialId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!memorialId,
    retry: 2,
    meta: {
      errorHandler: () => {
        toast({
          title: "Error loading memorial",
          description: "Unable to load memorial details. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};