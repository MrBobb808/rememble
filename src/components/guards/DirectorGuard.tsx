import { ReactNode, useEffect } from "react";
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

  // Handle authentication and authorization in useEffect
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: Bypassing director guard");
      return;
    }

    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Authentication Error",
        description: "Please sign in again to continue.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!isLoading && profile) {
      const isDirector = profile?.relationship?.toLowerCase().trim() === 'director';
      
      if (!isDirector) {
        console.log("Access denied: User is not a director", { 
          relationship: profile?.relationship,
          userId: profile?.id 
        });
        
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
      }
    }
  }, [profile, isLoading, error, navigate, toast]);

  if (isLoading) {
    return <DirectorGuardLoading />;
  }

  // In development, or if user is a director, render children
  if (process.env.NODE_ENV === 'development' || 
      (profile?.relationship?.toLowerCase().trim() === 'director')) {
    return <>{children}</>;
  }

  // Return null while the redirect happens
  return null;
};

export default DirectorGuard;