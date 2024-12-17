import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDirectorAccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // In development, automatically grant director access
        if (process.env.NODE_ENV === 'development') {
          console.log("Development mode: Granting director access");
          setIsAuthorized(true);
          setIsLoading(false);
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
            navigate("/auth");
          }
          return;
        }

        if (mounted) {
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("Error checking access:", error);
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (process.env.NODE_ENV !== 'development') {
        checkAccess();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams, toast]);

  return { isLoading, isAuthorized };
};
