import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUUID } from "@/utils/validation";

interface Survey {
  id: string;
  memorial_id: string;
  name: string;
  key_memories: string | null;
  family_messages: string | null;
  personality_traits: string | null;
  preferred_tone: string | null;
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
      if (!userId) {
        console.error('No user ID provided to useDirectorSurveys');
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
    enabled: Boolean(userId && validateUUID(userId)),
    retry: false,
    staleTime: 30000,
  });
};