import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMemorialSession = (token?: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        // If there's a token, we don't need to check authentication
        if (token) {
          if (mounted) setIsLoading(false);
          return;
        }

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setSessionError(sessionError);
          return;
        }

        // If no session, try to refresh
        if (!session) {
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
          
          if (refreshError || !refreshedSession) {
            console.error("Session refresh error:", refreshError);
            setSessionError(refreshError || new Error("Failed to refresh session"));
            return;
          }
        }

        if (mounted) {
          setIsLoading(false);
          setSessionError(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (error instanceof Error) {
          setSessionError(error);
        } else {
          setSessionError(new Error("Unknown session error"));
        }
      }
    };

    // Initial session check
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth state change:", event);
      }
      
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, token]);

  return { isLoading, sessionError };
};