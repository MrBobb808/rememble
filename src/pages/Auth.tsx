import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user is director
          if (session.user.email === "mr.bobb12@yahoo.com") {
            navigate("/director");
          } else {
            // Check for memorial access
            const { data: collaborations } = await supabase
              .from("memorial_collaborators")
              .select("memorial_id")
              .eq("email", session.user.email)
              .limit(1);

            if (collaborations && collaborations.length > 0) {
              navigate(`/memorial?id=${collaborations[0].memorial_id}`);
            } else {
              navigate("/");
            }
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth state change:", event, session);
      }

      if (session?.user) {
        if (session.user.email === "mr.bobb12@yahoo.com") {
          navigate("/director");
        } else {
          const { data: collaborations } = await supabase
            .from("memorial_collaborators")
            .select("memorial_id")
            .eq("email", session.user.email)
            .limit(1);

          if (collaborations && collaborations.length > 0) {
            navigate(`/memorial?id=${collaborations[0].memorial_id}`);
          } else {
            navigate("/");
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-memorial-beige-light">
        <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-memorial-beige-light">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-memorial-blue">
          Welcome Back
        </h1>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1e40af',
                  brandAccent: '#1e3a8a',
                }
              }
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
            }
          }}
          providers={[]}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};

export default Auth;