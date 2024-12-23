import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
      if (!userId) {
        throw new Error('No user ID provided');
      }

      console.log('Fetching surveys for user:', userId);
      
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
        throw error;
      }

      console.log('Fetched surveys:', data);
      return (data || []) as Survey[];
    },
    enabled: !!userId,
    meta: {
      errorHandler: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error loading surveys",
          description: "Unable to load surveys. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};