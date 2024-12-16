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

      // Skip if still loading or no profile
      if (isLoading || !profile) {
        return;
      }

      // Check director status
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
        console.log("Director access granted", { 
          userId: profile?.id,
          relationship: profile?.relationship 
        });
        setIsAuthorized(true);
      }
    };

    checkAuthorization();
  }, [profile, isLoading, error, navigate, toast]);

  if (isLoading) {
    return <DirectorGuardLoading />;
  }

  // Render children only if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Return null while authorization is pending or failed
  return null;
};

export default DirectorGuard;