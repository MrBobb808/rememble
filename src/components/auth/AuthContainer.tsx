import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from "./AuthForm";
import { AuthLoading } from "./AuthLoading";

export const AuthContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const verifyConnection = async () => {
      try {
        console.log("Verifying Supabase connection...");
        
        // Test the connection with a simple query
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

    verifyConnection();

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

        // Check if the user is mr.bobb12@yahoo.com
        if (session.user.email === 'mr.bobb12@yahoo.com') {
          console.log("Director access granted");
          navigate("/director");
          return;
        }

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
          if (collaboration.role === 'admin') {
            navigate("/memorial");
          } else {
            navigate(`/memorial?id=${collaboration.memorial_id}`);
          }
        } else {
          if (mounted) {
            toast({
              title: "No memorial access",
              description: "You don't have access to any memorials. Please request an invitation.",
              variant: "destructive",
            });
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        await checkSession();
      } else if (event === 'SIGNED_OUT') {
        if (mounted) setIsLoading(false);
      }
    });

    // Initial session check
    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <AuthLoading />;
  }

  return <AuthForm />;
};