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
        
        // Validate user ID before proceeding
        const validUserId = ensureValidUUID(userId, 'user ID');
        console.log('Validated user ID:', validUserId);

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

        console.log('Director check result:', isDirector);

        if (!isDirector) {
          console.log('User is not a director');
          toast({
            title: "Access Denied",
            description: "You must be a director to view this content.",
            variant: "destructive",
          });
          return [];
        }

        console.log('Fetching memorials data...');
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
          toast({
            title: "Error",
            description: "Unable to fetch memorials. Please try again.",
            variant: "destructive",
          });
          return [];
        }

        console.log('Successfully fetched memorials:', data?.length);

        // Validate UUIDs in the response
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
    gcTime: 300000, // 5 minutes
  });
};