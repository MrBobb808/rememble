import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AuthContainer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const autoSignIn = async () => {
      try {
        // Sign in as mr.bobb12@yahoo.com using email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'mr.bobb12@yahoo.com',
          password: 'rememble2024', // Make sure this matches the actual password
        });

        if (error) {
          console.error('Auto sign-in error:', error);
          return;
        }

        // Redirect to director dashboard after successful sign-in
        navigate('/director');
      } catch (error) {
        console.error('Unexpected error during auto sign-in:', error);
      }
    };

    autoSignIn();
  }, [navigate]);

  // Return null since we're automatically redirecting
  return null;
};