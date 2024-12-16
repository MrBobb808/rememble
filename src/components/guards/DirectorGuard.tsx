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

        if (session.user.email !== "mr.bobb12@yahoo.com") {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Check subscription status
        const { data: subscription, error: subscriptionError } = await supabase
          .from("director_subscriptions")
          .select("status")
          .eq("user_id", session.user.id)
          .single();

        if (subscriptionError || !subscription || subscription.status !== "active") {
          toast({
            title: "Subscription Required",
            description: "Please activate your subscription to access the dashboard.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Director access check error:", error);
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