import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUUID, ensureValidUUID } from "@/utils/validation";
import { Memorial } from "@/types/director";

export const useDirectorMemorials = (userId: string | null, authInitialized: boolean) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['memorials', userId],
    queryFn: async () => {
      try {
        console.log('Starting memorials fetch for user:', userId);
        
        const validUserId = ensureValidUUID(userId, 'user ID');
        console.log('Validated user ID:', validUserId);

        // Single query to fetch memorials with all related data
        const { data, error } = await supabase
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
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching memorials:', error);
          throw error;
        }

        if (!data) {
          console.log('No memorials data returned');
          return [];
        }

        console.log('Successfully fetched memorials:', data.length);

        // Transform and validate the data in a single pass
        return data.map(memorial => ({
          ...memorial,
          id: ensureValidUUID(memorial.id, 'memorial ID'),
          memorial_collaborators: memorial.memorial_collaborators.map(collab => ({
            ...collab,
            id: ensureValidUUID(collab.id, 'collaborator ID'),
            memorial_id: ensureValidUUID(collab.memorial_id, 'memorial ID'),
            user_id: collab.user_id ? ensureValidUUID(collab.user_id, 'user ID') : null,
          }))
        })) as Memorial[];
      } catch (error: any) {
        console.error('Error in useDirectorMemorials:', error);
        throw error;
      }
    },
    enabled: authInitialized && Boolean(userId) && validateUUID(userId),
    staleTime: 30000,
    gcTime: 300000,
  });
};