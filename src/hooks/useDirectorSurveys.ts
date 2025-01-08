import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUUID, ensureValidUUID } from "@/utils/validation";
import { Survey } from "@/types/director";
import { requestQueue } from "@/utils/request-queue";
import { PostgrestResponse } from "@supabase/supabase-js";

type SurveyResponse = {
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
};

export const useDirectorSurveys = (userId: string | null, authInitialized: boolean) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['surveys', userId],
    queryFn: async () => {
      try {
        console.log('[useDirectorSurveys] Starting query execution');
        console.log('[useDirectorSurveys] User ID:', userId);
        
        const validUserId = ensureValidUUID(userId, 'user ID');
        console.log('[useDirectorSurveys] Validated user ID:', validUserId);

        console.log('[useDirectorSurveys] Enqueueing Supabase query');
        const response: PostgrestResponse<SurveyResponse> = await requestQueue.enqueue(() =>
          supabase
            .from('memorial_surveys')
            .select('*, memorials!memorial_surveys_memorial_id_fkey(name)')
            .order('created_at', { ascending: false })
        );
        
        if (response.error) {
          console.error('[useDirectorSurveys] Supabase error:', response.error);
          throw response.error;
        }

        if (!response.data) {
          console.log('[useDirectorSurveys] No surveys data returned');
          return [];
        }

        console.log('[useDirectorSurveys] Data received:', response.data.length, 'records');

        const transformedData = response.data.map(survey => ({
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

        console.log('[useDirectorSurveys] Data transformation complete');
        return transformedData;
      } catch (error: any) {
        console.error('[useDirectorSurveys] Error in query:', error);
        throw error;
      }
    },
    enabled: authInitialized && Boolean(userId) && validateUUID(userId),
    staleTime: 30000,
    gcTime: 300000,
    retry: false
  });
};