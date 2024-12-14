import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemorialAuth } from "@/hooks/useMemorialAuth";
import { supabase } from "@/integrations/supabase/client";

interface DirectorGuardProps {
  children: React.ReactNode;
}

const DirectorGuard = ({ children }: DirectorGuardProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useMemorialAuth();

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated) {
        navigate("/auth");
        return;
      }

      // Check if user came from a collaborator link
      const token = searchParams.get("token");
      if (token) {
        // Query the memorial_links table to find the associated memorial
        const { data: linkData, error: linkError } = await supabase
          .from("memorial_links")
          .select("memorial_id, type")
          .eq("token", token)
          .single();

        if (!linkError && linkData) {
          // If it's a collaborator link, redirect to the memorial page
          if (linkData.type === "collaborator") {
            navigate(`/memorial?id=${linkData.memorial_id}`);
            return;
          }
        }
      }

      // Check if user is a director
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: collaborations } = await supabase
        .from("memorial_collaborators")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .limit(1);

      // If user has no admin role in any memorial, redirect to their first memorial
      if (!collaborations || collaborations.length === 0) {
        const { data: userMemorials } = await supabase
          .from("memorial_collaborators")
          .select("memorial_id")
          .eq("user_id", user.id)
          .limit(1);

        if (userMemorials && userMemorials.length > 0) {
          navigate(`/memorial?id=${userMemorials[0].memorial_id}`);
          return;
        }
      }
    };

    checkAccess();
  }, [isAuthenticated, navigate, searchParams]);

  return <>{children}</>;
};

export default DirectorGuard;