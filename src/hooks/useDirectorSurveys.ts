import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { validateUUID } from "@/utils/validation";

interface Survey {
  id: string;
  memorial_id: string;
  name: string;
  key_memories?: string | null;
  family_messages?: string | null;
  personality_traits?: string | null;
  preferred_tone?: string | null;
  created_at: string;
  memorial: {
    name: string;
  } | null;
}

export const useDirectorSurveys = (userId: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['surveys', userId],
    queryFn: async () => {
      if (!userId || !validateUUID(userId)) {
        console.log('Invalid or missing user ID:', userId);
        return [];
      }

      console.log('Fetching surveys for user:', userId);
      
      try {
        // First check if the user is a director
        const { data: isDirector, error: directorCheckError } = await supabase
          .rpc('is_director', { user_id: userId });

        if (directorCheckError) {
          throw directorCheckError;
        }

        if (!isDirector) {
          console.log('User is not a director');
          return [];
        }

        // Fetch surveys with memorial information using the correct join syntax
        const { data, error } = await supabase
          .from('memorial_surveys')
          .select(`
            id,
            memorial_id,
            name,
            key_memories,
            family_messages,
            personality_traits,
            preferred_tone,
            created_at,
            memorial:memorials!memorial_surveys_memorial_id_fkey (
              name
            )
          `)
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
      } catch (error: any) {
        console.error('Network error fetching surveys:', error);
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your connection.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!userId && validateUUID(userId),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
  });
};