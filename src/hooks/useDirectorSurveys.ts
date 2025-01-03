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
        // Validate user ID before proceeding
        const validUserId = ensureValidUUID(userId, 'user ID');

        const { data: isDirector, error: directorCheckError } = await supabase
          .rpc('is_director', { user_id: validUserId });

        if (directorCheckError) {
          console.error('Director check error:', directorCheckError);
          toast({
            title: "Access Error",
            description: "Unable to verify director access.",
            variant: "destructive",
          });
          return [];
        }

        if (!isDirector) {
          console.log('User is not a director');
          toast({
            title: "Access Denied",
            description: "You must be a director to view this content.",
            variant: "destructive",
          });
          return [];
        }

        const { data: surveys, error: surveysError } = await supabase
          .from('memorial_surveys')
          .select('*, memorials!memorial_surveys_memorial_id_fkey(name)')
          .order('created_at', { ascending: false });
        
        if (surveysError) {
          console.error('Error fetching surveys:', surveysError);
          toast({
            title: "Error",
            description: "Unable to fetch surveys. Please try again.",
            variant: "destructive",
          });
          return [];
        }

        const transformedSurveys = (surveys as SurveyResponse[]).map(survey => ({
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
        }));

        return transformedSurveys as Survey[];
      } catch (error: any) {
        console.error('Error in useDirectorSurveys:', error);
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: authInitialized && Boolean(userId) && validateUUID(userId),
    retry: 1,
    staleTime: 30000,
  });
};