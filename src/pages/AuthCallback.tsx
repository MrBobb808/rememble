import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (type === 'email_confirmation' && token_hash) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type: "email",
          });

          if (verifyError) throw verifyError;

          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) throw sessionError;
          if (!session) {
            toast({
              title: "Session error",
              description: "Could not establish a session. Please try signing in again.",
              variant: "destructive",
            });
            navigate("/auth");
            return;
          }

          // Check if user is a director
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('relationship')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw profileError;
          }

          if (profile?.relationship === 'director') {
            toast({
              title: "Email verified",
              description: "Your account has been verified successfully.",
            });
            navigate("/director");
          } else {
            await supabase.auth.signOut();
            toast({
              title: "Access Denied",
              description: "Director access is limited to authorized accounts only.",
              variant: "destructive",
            });
            navigate("/auth");
          }
        } else {
          navigate("/auth");
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast({
          title: "Error",
          description: error.message || "An error occurred during verification. Please try again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
    </div>
  );
};

export default AuthCallback;