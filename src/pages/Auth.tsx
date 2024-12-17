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

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          // Check user's role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('relationship')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            if (mounted) setIsLoading(false);
            return;
          }

          // Handle role-based navigation
          if (profile?.relationship?.toLowerCase() === 'director') {
            navigate("/director");
            return;
          }

          // For regular users, check memorial access
          const { data: collaborations, error: collabError } = await supabase
            .from("memorial_collaborators")
            .select("memorial_id, role")
            .eq("email", session.user.email)
            .limit(1);

          if (collabError) {
            console.error('Error fetching collaborations:', collabError);
            if (mounted) setIsLoading(false);
            return;
          }

          if (collaborations && collaborations.length > 0) {
            const collaboration = collaborations[0];
            // If user is an admin, redirect to landing page first
            if (collaboration.role === 'admin') {
              navigate("/landing");
            } else {
              // For regular users, redirect to their memorial
              navigate(`/memorial?id=${collaboration.memorial_id}`);
            }
          } else {
            toast({
              title: "No memorial access",
              description: "You don't have access to any memorials. Please request an invitation.",
              variant: "destructive",
            });
            if (mounted) setIsLoading(false);
          }
        } else {
          if (mounted) setIsLoading(false);
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        if (mounted) setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        checkSession();
      } else if (event === 'SIGNED_OUT') {
        if (mounted) setIsLoading(false);
      }
    });

    // Initial session check
    checkSession();

    // Cleanup
    return () => {
      mounted = false;
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