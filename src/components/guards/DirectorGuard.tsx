import { ReactNode, useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { DirectorGuardLoading } from "./DirectorGuardLoading";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DirectorGuardProps {
  children: ReactNode;
}

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: profile, isLoading, error } = useProfile();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      // Skip if still loading
      if (isLoading) return;

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
  }, [profile, isLoading, error, navigate, toast]);

  if (isLoading || isAuthorized === null) {
    return <DirectorGuardLoading />;
  }

  // Render children only if authorized
  return isAuthorized ? <>{children}</> : null;
};

export default DirectorGuard;