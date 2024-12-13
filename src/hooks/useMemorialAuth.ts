import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useMemorialAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access memorials",
          variant: "destructive",
        });
        navigate("/auth");
      }
      
      return user;
    };

    checkAuth();
  }, [navigate, toast]);

  return { supabase };
};