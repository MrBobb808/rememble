import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUUID, ensureValidUUID } from "@/utils/validation";
import { Survey } from "@/types/director";

interface SurveyResponse {
  id: string;
  memorial_id: string;
  name: string;
  key_memories: string | null;
  family_messages: string | null;
  personality_traits: string | null;
  preferred_tone: string | null;
  created_at: string;
  memorials: {
    name: string;
  } | null;
}

export const useDirectorSurveys = (userId: string | null, authInitialized: boolean) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['surveys', userId],
    queryFn: async () => {
      try {
        console.log('Starting surveys fetch for user:', userId);
        
        const validUserId = ensureValidUUID(userId, 'user ID');
        console.log('Validated user ID:', validUserId);

        // Single query to fetch surveys with memorial data
        const { data: surveys, error: surveysError } = await supabase
          .from('memorial_surveys')
          .select('*, memorials!memorial_surveys_memorial_id_fkey(name)')
          .order('created_at', { ascending: false });
        
        if (surveysError) {
          console.error('Error fetching surveys:', surveysError);
          throw surveysError;
        }

        if (!surveys) {
          console.log('No surveys data returned');
          return [];
        }

        console.log('Successfully fetched surveys:', surveys.length);

        // Transform and validate the data in a single pass
        return (surveys as SurveyResponse[]).map(survey => ({
          id: ensureValidUUID(survey.id, 'survey ID'),
          memorial_id: ensureValidUUID(survey.memorial_id, 'memorial ID'),
          name: survey.name,
          key_memories: survey.key_memories,
          family_messages: survey.family_messages,
          personality_traits: survey.personality_traits,
          preferred_tone: survey.preferred_tone,
          created_at: survey.created_at,
          memorial: {
            name: survey.memorials?.name ?? ''
          }
        })) as Survey[];
      } catch (error: any) {
        console.error('Error in useDirectorSurveys:', error);
        throw error;
      }
    },
    enabled: authInitialized && Boolean(userId) && validateUUID(userId),
    staleTime: 30000,
    gcTime: 300000,
  });
};