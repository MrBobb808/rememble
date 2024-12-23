import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDirectorSurveys = (userId: string | null) => {
  return useQuery({
    queryKey: ['surveys', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('memorial_surveys')
        .select('*, memorials!memorial_surveys_memorial_id_fkey(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId
  });
};