import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "./AuthForm";
import { AuthLoading } from "./AuthLoading";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";

export const AuthContainer = () => {
  const { isLoading, setIsLoading } = useSessionCheck();
  const { handleNavigation } = useRoleNavigation(setIsLoading);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          await handleNavigation(session);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        await handleNavigation(session);
      }
    });

    // Initial session check
    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleNavigation, setIsLoading]);

  if (isLoading) {
    return <AuthLoading />;
  }

  return <AuthForm />;
};