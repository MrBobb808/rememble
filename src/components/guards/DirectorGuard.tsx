import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DirectorGuardProps {
  children: React.ReactNode;
}

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkDirectorAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }

        // If it's the director account, grant immediate access
        if (session.user.email === "mr.bobb12@yahoo.com") {
          return; // Allow access without any further checks
        }

        // For non-director users, check for memorial access
        const { data: collaborations, error: collaborationError } = await supabase
          .from("memorial_collaborators")
          .select("memorial_id")
          .eq("email", session.user.email)
          .limit(1);

        if (collaborationError) {
          console.error("Error fetching collaborations:", collaborationError);
          throw collaborationError;
        }

        if (collaborations && collaborations.length > 0) {
          navigate(`/memorial?id=${collaborations[0].memorial_id}`);
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have access to any memorials. Please request an invitation.",
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking access:", error);
        navigate("/auth");
      }
    };

    checkDirectorAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkDirectorAccess();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return <>{children}</>;
};

export default DirectorGuard;