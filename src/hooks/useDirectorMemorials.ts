import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUUID, ensureValidUUID } from "@/utils/validation";
import { Memorial } from "@/types/director";
import { requestQueue } from "@/utils/request-queue";
import { PostgrestResponse } from "@supabase/supabase-js";

export const useDirectorMemorials = (userId: string | null, authInitialized: boolean) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['memorials', userId],
    queryFn: async () => {
      try {
        console.log('[useDirectorMemorials] Starting query execution');
        console.log('[useDirectorMemorials] User ID:', userId);
        
        const validUserId = ensureValidUUID(userId, 'user ID');
        console.log('[useDirectorMemorials] Validated user ID:', validUserId);

        console.log('[useDirectorMemorials] Enqueueing Supabase query');
        const response: PostgrestResponse<Memorial[]> = await requestQueue.enqueue(async () => 
          await supabase
            .from('memorials')
            .select(`
              id,
              name,
              created_at,
              is_complete,
              birth_year,
              death_year,
              banner_image_url,
              summary,
              memorial_collaborators!memorial_collaborators_memorial_id_fkey (
                id,
                memorial_id,
                user_id,
                email,
                role
              )
            `)
            .order('created_at', { ascending: false })
        );

        if (response.error) {
          console.error('[useDirectorMemorials] Supabase error:', response.error);
          throw response.error;
        }

        if (!response.data) {
          console.log('[useDirectorMemorials] No data returned');
          return [];
        }

        console.log('[useDirectorMemorials] Data received:', response.data.length, 'records');

        const transformedData = response.data.map(memorial => ({
          ...memorial,
          id: ensureValidUUID(memorial.id, 'memorial ID'),
          memorial_collaborators: memorial.memorial_collaborators.map(collab => ({
            ...collab,
            id: ensureValidUUID(collab.id, 'collaborator ID'),
            memorial_id: ensureValidUUID(collab.memorial_id, 'memorial ID'),
            user_id: collab.user_id ? ensureValidUUID(collab.user_id, 'user ID') : null,
          }))
        })) as Memorial[];

        console.log('[useDirectorMemorials] Data transformation complete');
        return transformedData;
      } catch (error: any) {
        console.error('[useDirectorMemorials] Error in query:', error);
        throw error;
      }
    },
    enabled: authInitialized && Boolean(userId) && validateUUID(userId),
    staleTime: 30000,
    gcTime: 300000,
    retry: false
  });
};