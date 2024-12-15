import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the session to check if the user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!session) {
          toast({
            title: "Authentication failed",
            description: "Please try signing in again.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        // Check if user is already in the profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        // If profile exists, redirect to director dashboard
        if (profile) {
          toast({
            title: "Email verified",
            description: "Your account has been verified successfully.",
          });
          navigate("/director");
          return;
        }

        // If no profile exists, something went wrong
        toast({
          title: "Setup incomplete",
          description: "Please complete your profile setup.",
          variant: "destructive",
        });
        navigate("/auth");
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Error",
          description: "An error occurred during verification. Please try again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
    </div>
  );
};

export default AuthCallback;