import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemorialData } from "@/hooks/useMemorialData";
import { MemorialContent } from "./MemorialContent";
import UnifiedSidebar from "./UnifiedSidebar";
import { LoadingState } from "./LoadingState";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const MemorialContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");
  const token = searchParams.get("token");
  const { photos, handlePhotoAdd } = useMemorialData(memorialId);
  const [isLoading, setIsLoading] = useState(true);

  // Check for valid access and handle session
  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      try {
        // If there's a token, we don't need to check authentication
        if (token) {
          if (mounted) setIsLoading(false);
          return;
        }

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast({
            title: "Session Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        // If no session, try to refresh
        if (!session) {
          console.log("No active session, attempting refresh...");
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            console.log("Session refresh failed:", refreshError);
            toast({
              title: "Session Expired",
              description: "Please sign in again",
              variant: "destructive",
            });
            navigate("/auth");
            return;
          }
          
          console.log("Session refreshed successfully:", refreshData.session);
        }

        if (mounted) setIsLoading(false);
      } catch (error) {
        console.error("Error checking access:", error);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    checkAccess();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in MemorialContainer:", event, session);
      
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, token, toast]);

  // Fetch memorial details
  const { data: memorial } = useQuery({
    queryKey: ['memorial', memorialId],
    queryFn: async () => {
      if (!memorialId) return null;
      
      try {
        const { data, error } = await supabase
          .from('memorials')
          .select('*')
          .eq('id', memorialId)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching memorial:", error);
        return null;
      }
    },
    enabled: !!memorialId
  });

  console.log("MemorialContainer - memorialId:", memorialId);
  console.log("MemorialContainer - photos:", photos);
  console.log("MemorialContainer - memorial:", memorial);

  useEffect(() => {
    if (photos.length >= 0) {
      console.log("Setting isLoading to false");
      setIsLoading(false);
    }
  }, [photos]);

  if (isLoading) {
    console.log("Rendering LoadingState");
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <MemorialContent
            photos={photos}
            handlePhotoAdd={handlePhotoAdd}
            isLoading={isLoading}
            memorial={memorial}
          />
          <UnifiedSidebar photos={photos} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemorialContainer;