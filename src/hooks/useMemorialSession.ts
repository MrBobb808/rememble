import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase, checkSession } from "@/integrations/supabase/client";

export const useMemorialSession = (token?: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      try {
        // If there's a token, we don't need to check authentication
        if (token) {
          if (mounted) setIsLoading(false);
          return;
        }

        const session = await checkSession();
        
        if (!session) {
          setSessionError(new Error("No valid session found"));
          toast({
            title: "Session expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        if (mounted) {
          setIsLoading(false);
          setSessionError(null);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        if (error instanceof Error) {
          setSessionError(error);
        } else {
          setSessionError(new Error("Unknown session error"));
        }
      }
    };

    // Initial session verification
    verifySession();

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