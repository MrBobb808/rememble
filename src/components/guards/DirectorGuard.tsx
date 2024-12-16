import { ReactNode } from "react";
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
  
  // In development, bypass the guard
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: Bypassing director guard");
    return <>{children}</>;
  }

  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return <DirectorGuardLoading />;
  }

  if (error) {
    console.error("Error fetching profile:", error);
    toast({
      title: "Authentication Error",
      description: "Please sign in again to continue.",
      variant: "destructive",
    });
    navigate("/auth");
    return null;
  }

  // Check if user is director based on relationship
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
    return null;
  }

  console.log("Director access granted", { 
    userId: profile?.id,
    relationship: profile?.relationship 
  });

  return <>{children}</>;
};

export default DirectorGuard;