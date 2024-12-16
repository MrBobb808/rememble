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
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No active session found");
          setIsAuthorized(false);
          navigate("/auth");
          return;
        }
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthorized(false);
        navigate("/auth");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (event === 'SIGNED_OUT') {
        setIsAuthorized(false);
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const checkAuthorization = async () => {
      // Skip if still checking auth or loading profile
      if (isCheckingAuth || isLoading) {
        return;
      }

      // Development mode bypass
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Bypassing director guard");
        setIsAuthorized(true);
        return;
      }

      // Handle authentication errors
      if (error) {
        console.error("Error fetching profile:", error);
        setIsAuthorized(false);
        toast({
          title: "Authentication Error",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Check director status only when profile data is available
      if (profile) {
        const isDirector = profile?.relationship?.toLowerCase().trim() === 'director';
        
        if (!isDirector) {
          console.log("Access denied: User is not a director", { 
            relationship: profile?.relationship,
            userId: profile?.id 
          });
          
          setIsAuthorized(false);
          toast({
            title: "Access Denied",
            description: "You do not have permission to access this page.",
            variant: "destructive",
          });
          navigate("/auth");
        } else {
          setIsAuthorized(true);
        }
      }
    };

    checkAuthorization();
  }, [profile, isLoading, error, navigate, toast, isCheckingAuth]);

  if (isCheckingAuth || isLoading || isAuthorized === null) {
    return <DirectorGuardLoading />;
  }

  return isAuthorized ? <>{children}</> : null;
};

export default DirectorGuard;