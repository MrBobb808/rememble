import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isDirector, setIsDirector] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserEmail(session.user.email);
        const { data: profile } = await supabase
          .from("profiles")
          .select("relationship")
          .eq("id", session.user.id)
          .single();

        setIsDirector(profile?.relationship === "director");
      }
      
      setIsLoading(false);
    };

    checkUserRole();
  }, []);

  const handleNavigate = () => {
    if (isDirector) {
      navigate("/director");
    } else {
      const checkMemorials = async () => {
        if (!userEmail) {
          navigate("/auth");
          return;
        }

        const { data: collaborations } = await supabase
          .from("memorial_collaborators")
          .select("memorial_id")
          .eq("email", userEmail)
          .limit(1);

        if (collaborations && collaborations.length > 0) {
          navigate(`/memorial?id=${collaborations[0].memorial_id}`);
        } else {
          navigate("/auth");
        }
      };

      checkMemorials();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-memorial-beige-light">
        <Loader2 className="w-8 h-8 animate-spin text-memorial-blue" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-end pb-32 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/03b9f4bf-4199-49eb-bcc8-fb481edd0cc4.png")',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Button 
        onClick={handleNavigate}
        size="lg"
        className="text-xl px-8 py-6 bg-white/90 text-memorial-blue hover:bg-memorial-blue hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        {isDirector ? "Enter Director Dashboard" : "View Memorial"}
      </Button>
    </div>
  );
};

export default Landing;