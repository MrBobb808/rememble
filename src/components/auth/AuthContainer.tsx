import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "./AuthForm";
import { AuthLoading } from "./AuthLoading";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const AuthContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get the user's profile to check if they're a director
          const { data: profile } = await supabase
            .from('profiles')
            .select('relationship')
            .eq('id', session.user.id)
            .single();

          if (profile?.relationship === 'director') {
            navigate('/director');
          } else {
            // Sign out non-director users
            await supabase.auth.signOut();
            toast({
              title: "Access Denied",
              description: "Only authorized director accounts can access this application.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        // Check if the user is a director by querying their profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('relationship')
          .eq('id', session.user.id)
          .single();

        if (profile?.relationship === 'director') {
          navigate('/director');
        } else {
          // Sign out non-director users
          await supabase.auth.signOut();
          toast({
            title: "Access Denied",
            description: "Only authorized director accounts can access this application.",
            variant: "destructive",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    // Initial session check
    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <AuthLoading />;
  }

  return <AuthForm />;
};