import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [signupToken, setSignupToken] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigate("/memorial");
        return;
      }

      const token = searchParams.get("token");
      if (token) {
        try {
          const { data, error } = await supabase
            .from("signup_tokens")
            .select("*")
            .eq("token", token)
            .eq("status", "pending")
            .single();

          if (error) throw error;
          if (!data) throw new Error("Invalid or expired token");

          const now = new Date();
          const expiresAt = new Date(data.expires_at);
          
          if (now > expiresAt) {
            throw new Error("This invitation has expired");
          }

          setSignupToken(token);
          setTokenData(data);
        } catch (error: any) {
          toast({
            title: "Invalid Invitation",
            description: error.message,
            variant: "destructive",
          });
          navigate("/auth");
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, searchParams, toast]);

  const handleAuthChange = async (event: any, session: any) => {
    if (event === "SIGNED_IN") {
      if (signupToken && tokenData) {
        try {
          // Add user to memorial_collaborators
          await supabase
            .from("memorial_collaborators")
            .insert({
              memorial_id: tokenData.memorial_id,
              user_id: session.user.id,
              email: session.user.email,
              role: tokenData.role,
              invitation_accepted: true
            });

          // Update token status
          await supabase
            .from("signup_tokens")
            .update({ status: "used" })
            .eq("token", signupToken);

          // Navigate to the memorial
          navigate(`/memorial?id=${tokenData.memorial_id}`);
        } catch (error: any) {
          console.error("Error processing signup:", error);
          toast({
            title: "Error",
            description: "There was a problem completing your signup. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        navigate("/memorial");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-playfair text-center mb-8">
          {signupToken ? "Complete Your Registration" : "Welcome Back"}
        </h1>
        
        {signupToken && tokenData && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              You've been invited as a <span className="font-semibold">{tokenData.role}</span>
            </p>
          </div>
        )}

        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4F46E5',
                  brandAccent: '#4338CA',
                },
              },
            },
          }}
          providers={[]}
          onAuthStateChange={handleAuthChange}
        />
      </div>
    </div>
  );
};

export default Auth;