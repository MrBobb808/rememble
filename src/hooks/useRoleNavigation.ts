import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRoleNavigation = (setIsLoading: (value: boolean) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigation = async (session: any) => {
    try {
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
        setIsLoading(false);
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
        setIsLoading(false);
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
        toast({
          title: "No memorial access",
          description: "You don't have access to any memorials. Please request an invitation.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
    }
  };

  return { handleNavigation };
};