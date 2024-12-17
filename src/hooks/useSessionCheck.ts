import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSessionCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const verifyConnection = async () => {
      try {
        console.log("Verifying Supabase connection...");
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error("Supabase connection error:", error);
          toast({
            title: "Connection Error",
            description: "Unable to connect to the database. Please try again later.",
            variant: "destructive",
          });
        } else {
          console.log("Supabase connection successful!");
        }
      } catch (error) {
        console.error("Unexpected error during connection verification:", error);
      }
    };

    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) setIsLoading(false);
          return;
        }

        if (!session?.user) {
          console.log("No active session");
          if (mounted) setIsLoading(false);
          return;
        }

        console.log("Session found:", session.user.id);
        return session;
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) setIsLoading(false);
      }
    };

    verifyConnection();
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_OUT' && mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { isLoading, setIsLoading };
};