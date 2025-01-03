import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUUID } from "@/utils/validation";
import { Survey } from "@/types/director";

export const useDirectorSurveys = (userId: string | null, authInitialized: boolean) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['surveys', userId],
    queryFn: async () => {
      // Early return if no userId or invalid UUID
      if (!userId || !validateUUID(userId)) {
        console.log('Invalid or missing user ID:', userId);
        return [];
      }

      try {
        const { data: isDirector, error: directorCheckError } = await supabase
          .rpc('is_director', { user_id: userId });

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
            memorial:memorials!fk_memorial (
              name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching surveys:', error);
          toast({
            title: "Error",
            description: "Unable to fetch surveys. Please try again.",
            variant: "destructive",
          });
          return [];
        }

        return data as Survey[];
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
    enabled: authInitialized && Boolean(userId) && validateUUID(userId),
    retry: 1,
    staleTime: 30000, // Cache data for 30 seconds
  });
};