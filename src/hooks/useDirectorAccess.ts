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
    let mounted = true;

    const checkAccess = async () => {
      try {
        // First check if we have a valid session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!sessionData.session) {
          console.log("No active session found");
          // Clear any potentially invalid session data
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        // Refresh session if needed
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("Session refresh error:", refreshError);
          throw refreshError;
        }

        if (!session) {
          console.log("Session refresh failed");
          await supabase.auth.signOut();
          navigate("/auth");
          return;
        }

        // Get user details
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User error:", userError);
          throw userError;
        }

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

        if (mounted) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error checking access:", error);
        // Clear any potentially invalid session data
        await supabase.auth.signOut();
        navigate("/auth");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAccess();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkAccess();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, searchParams, toast]);

  return { isLoading, isAuthorized };
};