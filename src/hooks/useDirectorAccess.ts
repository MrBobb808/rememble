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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session found");
          navigate("/auth");
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found");
          navigate("/auth");
          return;
        }

        // Check if user is the director
        if (user.email !== "mr.bobb12@yahoo.com") {
          console.log("Non-director user detected:", user.email);
          
          // Check if user has any memorial invitations
          const { data: collaborations, error: collaborationError } = await supabase
            .from("memorial_collaborators")
            .select("memorial_id")
            .eq("email", user.email)
            .limit(1);

          if (collaborationError) {
            console.error("Error fetching collaborations:", collaborationError);
            throw collaborationError;
          }

          if (collaborations && collaborations.length > 0) {
            // Redirect to the first memorial they have access to
            navigate(`/memorial?id=${collaborations[0].memorial_id}`);
          } else {
            toast({
              title: "Access Denied",
              description: "You don't have access to any memorials. Please request an invitation.",
              variant: "destructive",
            });
            navigate("/");
          }
          return;
        }

        // Check subscription status for director
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("director_subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .single();

        if (subscriptionError) {
          console.error("Error fetching subscription:", subscriptionError);
        }

        if (!subscriptionData || subscriptionData.status !== "active") {
          const redirectUrl = searchParams.get("redirect_url");
          if (redirectUrl) {
            navigate(redirectUrl);
          } else {
            navigate("/");
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking access:", error);
        navigate("/auth");
      } finally {
        setIsLoading(false);
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
  }, [navigate, searchParams, toast]);

  return { isLoading, isAuthorized };
};