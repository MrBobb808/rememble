import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface DirectorGuardProps {
  children: React.ReactNode;
}

const AUTHORIZED_EMAIL = "mr.bobb12@yahoo.com";

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check subscription status
  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: response, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return response;
    }
  });

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No session found, redirecting to auth");
        navigate("/auth");
        return;
      }

      // Check if user's email matches the authorized email
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email?.toLowerCase() || '';
      const authorizedEmail = AUTHORIZED_EMAIL.toLowerCase();
      
      console.log("Access Check:");
      console.log("Current user email (lowercase):", userEmail);
      console.log("Authorized email (lowercase):", authorizedEmail);
      console.log("Email match:", userEmail === authorizedEmail);
      
      if (!user || userEmail !== authorizedEmail) {
        console.log("Access denied - email mismatch");
        toast({
          title: "Access Denied",
          description: "You are not authorized to access the director dashboard.",
          variant: "destructive",
        });
        navigate("/memorial");
        return;
      }

      // If we get here, the email matched
      console.log("Email authorized, proceeding with additional checks");

      // Check if user came from a collaborator link
      const token = searchParams.get("token");
      const memorialId = searchParams.get("id");
      
      if (token && memorialId) {
        const { data: linkData, error: linkError } = await supabase
          .from("memorial_links")
          .select("memorial_id, type")
          .eq("token", token)
          .single();

        if (!linkError && linkData) {
          if (linkData.memorial_id === memorialId) {
            navigate(`/memorial?id=${memorialId}&token=${token}`);
            return;
          }
        }
      }

      // If not subscribed, show subscription prompt
      if (!subscriptionData?.subscribed) {
        toast({
          title: "Subscription Required",
          description: "Please subscribe to access the director dashboard.",
          duration: 5000,
        });
        navigate("/director?tab=billing");
      }
    };

    // Run the check immediately when the component mounts
    checkAccess();

    // Set up a listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams, subscriptionData, toast]);

  // If not subscribed, only show settings page
  if (!subscriptionData?.subscribed && window.location.pathname !== "/director") {
    return null;
  }

  return <>{children}</>;
};

export default DirectorGuard;