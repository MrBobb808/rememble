import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDirectorAccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      try {
        // In development, automatically grant director access
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: Granting director access");
          if (mounted) {
            setIsAuthorized(true);
            setIsLoading(false);
            setIsCheckingAuth(false);
          }
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No active session found");
          if (mounted) {
            setIsAuthorized(false);
            setIsCheckingAuth(false);
            navigate("/auth");
          }
          return;
        }

        if (mounted) {
          setIsCheckingAuth(false);
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error checking access:", error);
        if (mounted) {
          setIsAuthorized(false);
          setIsCheckingAuth(false);
          navigate("/auth");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (process.env.NODE_ENV !== 'development') {
        checkAccess();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, searchParams, toast]);

  return { isLoading, isAuthorized, isCheckingAuth };
};