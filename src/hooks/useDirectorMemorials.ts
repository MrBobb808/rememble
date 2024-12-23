import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDirectorMemorials = (userId: string | null) => {
  return useQuery({
    queryKey: ['memorials', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('memorials')
        .select('*, memorial_collaborators(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });
};