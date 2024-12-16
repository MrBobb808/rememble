import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      // In development, return a mock profile
      if (process.env.NODE_ENV === 'development') {
        return {
          id: 'mock-user-id',
          full_name: 'Test User',
          relationship: 'director',
          created_at: new Date().toISOString()
        };
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    retry: false
  });
};