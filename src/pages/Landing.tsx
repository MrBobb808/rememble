import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // If user is director, redirect to director dashboard
        if (session.user.email === "mr.bobb12@yahoo.com") {
          navigate("/director");
          return;
        }
        
        // For regular users, check if they have access to any memorials
        const { data: collaborations } = await supabase
          .from("memorial_collaborators")
          .select("memorial_id")
          .eq("email", session.user.email)
          .limit(1);

        if (collaborations && collaborations.length > 0) {
          navigate(`/memorial?id=${collaborations[0].memorial_id}`);
          return;
        }
      }

      // If there's a token, go to auth page with token
      if (token) {
        navigate(`/auth?token=${token}`);
        return;
      }

      // Otherwise, go to regular auth page
      navigate("/auth");
    };

    checkSession();
  }, [navigate, token]);

  // Show loading state while checking session
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default Landing;
