import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        if (token) {
          // Check if token exists in signup_tokens table
          const { data: tokenData, error: tokenError } = await supabase
            .from("signup_tokens")
            .select("email, role, memorial_id")
            .eq("token", token)
            .single();

          if (tokenError) throw tokenError;
          if (tokenData) {
            setEmail(tokenData.email);
            setRole(tokenData.role);
          }
        }
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Check if user is director
        if (session.user.email === "mr.bobb12@yahoo.com") {
          navigate("/director");
          return;
        }

        // For regular users, check memorial access
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
      } else {
        setIsLoading(false);
      }
    };

    if (token) {
      checkToken();
    } else {
      checkSession();
    }
  }, [token, navigate]);

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
          {token ? (
            email ? `Welcome ${email}` : "Access Memorial"
          ) : (
            "Director Sign In"
          )}
        </h1>
        {email && (
          <p className="text-center text-gray-600 mb-6">
            You've been invited as a {role}
          </p>
        )}
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1e40af',
                  brandAccent: '#1e3a8a',
                },
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
          {...(email ? { defaultEmail: email } : {})}
        />
      </div>
    </div>
  );
};

export default Auth;