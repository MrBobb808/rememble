import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateUUID } from "@/utils/validation";

interface Collaborator {
  id: string;
  memorial_id: string;
  user_id: string | null;
  email: string;
  role: 'admin' | 'contributor' | 'viewer';
}

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  birth_year: string | null;
  death_year: string | null;
  banner_image_url: string | null;
  summary: string | null;
  memorial_collaborators: Collaborator[];
}

export const useDirectorMemorials = (userId: string | null) => {
  const { toast } = useToast();
  
  // Ensure this evaluates to a strict boolean
  const isEnabled = !!userId && validateUUID(userId);
  
  console.log('Memorials Query Enabled:', typeof isEnabled, isEnabled);

  return useQuery({
    queryKey: ['memorials', userId],
    queryFn: async () => {
      if (!userId || !validateUUID(userId)) {
        console.log('Invalid or missing user ID:', userId);
        return [];
      }

      try {
        // First check if the user is a director
        const { data: isDirector, error: directorCheckError } = await supabase
          .rpc('is_director', { user_id: userId });

        if (directorCheckError) {
          throw directorCheckError;
        }

        if (!isDirector) {
          console.log('User is not a director');
          return [];
        }

        // Fetch memorials with collaborator information
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
            title: "Error fetching memorials",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }

        return (data || []) as Memorial[];
      } catch (error: any) {
        console.error('Network error fetching memorials:', error);
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your connection.",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: isEnabled,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
  });
};