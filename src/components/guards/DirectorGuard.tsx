import { ReactNode, useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DirectorGuardLoading } from "./DirectorGuardLoading";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DirectorGuardProps {
  children: ReactNode;
}

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile, isLoading, error } = useProfile();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
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
        console.error("Session check error:", error);
        if (mounted) {
          setIsAuthorized(false);
          navigate("/auth");
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (event === 'SIGNED_OUT' && mounted) {
        setIsAuthorized(false);
        navigate("/auth");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    const checkAuthorization = async () => {
      if (isCheckingAuth || isLoading) {
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Bypassing director guard");
        if (mounted) {
          setIsAuthorized(true);
        }
        return;
      }

      if (error) {
        console.error("Error fetching profile:", error);
        if (mounted) {
          setIsAuthorized(false);
          toast({
            title: "Authentication Error",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          navigate("/auth");
        }
        return;
      }

      if (profile) {
        const isDirector = profile?.relationship?.toLowerCase().trim() === 'director';
        
        if (!isDirector) {
          console.log("Access denied: User is not a director", { 
            relationship: profile?.relationship,
            userId: profile?.id 
          });
          
          if (mounted) {
            setIsAuthorized(false);
            toast({
              title: "Access Denied",
              description: "You do not have permission to access this page.",
              variant: "destructive",
            });
            navigate("/auth");
          }
        } else if (mounted) {
          setIsAuthorized(true);
        }
      }
    };

    checkAuthorization();

    return () => {
      mounted = false;
    };
  }, [profile, isLoading, error, navigate, toast, isCheckingAuth]);

  if (isCheckingAuth || isLoading || isAuthorized === null) {
    return <DirectorGuardLoading />;
  }

  return isAuthorized ? <>{children}</> : null;
};

export default DirectorGuard;