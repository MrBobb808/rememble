import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { MemorialContent } from "./MemorialContent";
import { useMemorialAuth } from "@/hooks/useMemorialAuth";
import { createNewMemorial } from "@/services/memorialService";
import { LoadingState } from "./LoadingState";
import { useMemorialData } from "@/hooks/useMemorialData";

const MemorialContainer = () => {
  const [memorialId, setMemorialId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { supabase } = useMemorialAuth();
  const navigate = useNavigate();
  
  const { photos, summary, handlePhotoAdd } = useMemorialData(memorialId);

  useEffect(() => {
    const checkAuthAndInitialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No authenticated session found");
          navigate("/auth");
          return;
        }

        const id = searchParams.get("id");
        if (id) {
          setMemorialId(id);
          setIsLoading(false);
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error("No authenticated user");
          }
          
          console.log("Creating new memorial for user:", user.id);
          const memorial = await createNewMemorial(user.id);
          setMemorialId(memorial.id);
          
          navigate(`/memorial?id=${memorial.id}`, { replace: true });
          
          toast({
            title: "Memorial created",
            description: "Your memorial has been created successfully.",
          });
        }
      } catch (error: any) {
        console.error("Error initializing memorial:", error);
        toast({
          title: "Error creating memorial",
          description: error.message || "There was a problem creating the memorial. Please try again.",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndInitialize();
  }, [searchParams, toast, supabase.auth, navigate]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <MemorialContent
            photos={photos}
            summary={summary}
            onPhotoAdd={handlePhotoAdd}
          />
        </div>
      </main>
    </div>
  );
};

export default MemorialContainer;