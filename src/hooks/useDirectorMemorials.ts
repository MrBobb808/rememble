import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  birth_year?: string;
  death_year?: string;
  banner_image_url?: string;
  memorial_collaborators?: Array<{
    id: string;
    memorial_id: string;
    user_id: string;
    email: string;
    role: string;
  }>;
}

export const useDirectorMemorials = (userId: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['memorials', userId],
    queryFn: async () => {
      // Check for valid UUID format
      if (!userId?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log('Invalid or missing user ID:', userId);
        return [];
      }

      console.log('Fetching memorials for user:', userId);
      
      try {
        const { data, error } = await supabase
          .from('memorials')
          .select('*, memorial_collaborators(*)')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching memorials:', error);
          toast({
            title: "Error fetching memorials",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }

        console.log('Fetched memorials:', data);
        return (data || []) as Memorial[];
      } catch (error) {
        console.error('Network error fetching memorials:', error);
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your connection.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
  });
};