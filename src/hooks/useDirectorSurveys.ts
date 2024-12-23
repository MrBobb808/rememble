import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { validateUUID } from "@/utils/validation";

interface Survey {
  id: string;
  memorial_id: string;
  name: string;
  key_memories?: string;
  family_messages?: string;
  personality_traits?: string;
  preferred_tone?: string;
  created_at: string;
  memorials?: {
    name: string;
  };
}

export const useDirectorSurveys = (userId: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['surveys', userId],
    queryFn: async () => {
      // Only proceed if we have a valid UUID
      if (!userId || !validateUUID(userId)) {
        console.log('Invalid or missing user ID:', userId);
        return [];
      }

      console.log('Fetching surveys for user:', userId);
      
      try {
        const { data, error } = await supabase
          .from('memorial_surveys')
          .select('*, memorials!memorial_surveys_memorial_id_fkey(name)')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching surveys:', error);
          toast({
            title: "Error fetching surveys",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }

        console.log('Fetched surveys:', data);
        return (data || []) as Survey[];
      } catch (error) {
        console.error('Network error fetching surveys:', error);
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your connection.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
  });
};