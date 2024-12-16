import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [memorialId, setMemorialId] = useState<string | null>(null);

  const isDirectorEmail = (email: string) => {
    // Remove spaces and convert to lowercase for comparison
    const normalizedEmail = email.replace(/\s+/g, '').toLowerCase();
    return normalizedEmail === 'mr.bobb12@yahoo.com';
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          // Check if user is director using the normalized email comparison
          if (isDirectorEmail(session.user.email || '')) {
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
            toast({
              title: "No memorial access",
              description: "You don't have access to any memorials. Please request an invitation.",
              variant: "destructive",
            });
            navigate("/");
          }
        }
      } catch (error: any) {
        console.error("Session check error:", error);
        toast({
          title: "Authentication Error",
          description: error.message || "Please sign in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Immediately redirect director to dashboard using normalized email comparison
        if (session.user?.email && isDirectorEmail(session.user.email)) {
          navigate("/director");
          return;
        }
        checkSession();
      }
    });

    // Initial session check
    checkSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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
            email ? `Welcome to ${role === 'admin' ? 'your' : 'the'} Memorial` : "Access Memorial"
          ) : (
            "Sign In"
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