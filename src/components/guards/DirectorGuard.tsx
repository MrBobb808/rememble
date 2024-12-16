import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface DirectorGuardProps {
  children: React.ReactNode;
}

const AUTHORIZED_EMAIL = "Mr.bobb12@yahoo.com";

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check subscription status
  const { data: subscription } = useQuery({
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
        navigate("/auth");
        return;
      }

      // Check if user's email matches the authorized email
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== AUTHORIZED_EMAIL) {
        toast({
          title: "Access Denied",
          description: "You are not authorized to access the director dashboard.",
          variant: "destructive",
        });
        navigate("/memorial");
        return;
      }

      // Check if user came from a collaborator link
      const token = searchParams.get("token");
      const memorialId = searchParams.get("id");
      
      if (token && memorialId) {
        // Query the memorial_links table to find the associated memorial
        const { data: linkData, error: linkError } = await supabase
          .from("memorial_links")
          .select("memorial_id, type")
          .eq("token", token)
          .single();

        if (!linkError && linkData) {
          // Verify this token matches the memorial ID
          if (linkData.memorial_id === memorialId) {
            navigate(`/memorial?id=${memorialId}&token=${token}`);
            return;
          }
        }
      }

      // If not subscribed, show subscription prompt
      if (!subscription?.subscribed) {
        toast({
          title: "Subscription Required",
          description: "Please subscribe to access the director dashboard.",
          duration: 5000,
        });
        navigate("/director?tab=billing");
      }
    };

    checkAccess();
  }, [navigate, searchParams, subscription]);

  // If not subscribed, only show settings page
  if (!subscription?.subscribed && window.location.pathname !== "/director") {
    return null;
  }

  return <>{children}</>;
};

export default DirectorGuard;