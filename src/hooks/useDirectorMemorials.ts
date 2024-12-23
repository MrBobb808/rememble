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
      if (!userId) {
        throw new Error('No user ID provided');
      }

      console.log('Fetching memorials for user:', userId);
      
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
        throw error;
      }

      console.log('Fetched memorials:', data);
      return (data || []) as Memorial[];
    },
    enabled: !!userId,
    meta: {
      errorHandler: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error loading memorials",
          description: "Unable to load memorials. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
};