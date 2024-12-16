import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemorialData } from "@/hooks/useMemorialData";
import { MemorialContent } from "./MemorialContent";
import UnifiedSidebar from "./UnifiedSidebar";
import { LoadingState } from "./LoadingState";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    let unsubscribe: (() => void) | null = null;

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
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !refreshData.session) {
            console.error("Session refresh error:", refreshError);
            toast({
              title: "Session Expired",
              description: "Please sign in again",
              variant: "destructive",
            });
            navigate("/auth");
            return;
          }

          // Verify the refreshed session
          const { error: verifyError } = await supabase.auth.getUser();
          if (verifyError) {
            console.error("Session verification error:", verifyError);
            toast({
              title: "Authentication Error",
              description: "Please sign in again",
              variant: "destructive",
            });
            navigate("/auth");
            return;
          }
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

    // Initial session check
    checkAccess();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth state change in MemorialContainer:", event, session);
      }
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        navigate("/auth");
      } else if (event === 'TOKEN_REFRESHED') {
        // Verify the refreshed token
        const { error: verifyError } = await supabase.auth.getUser();
        if (verifyError) {
          console.error("Token verification error:", verifyError);
          navigate("/auth");
        }
      }
    });

    // Store unsubscribe function
    unsubscribe = subscription.unsubscribe;

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigate, token, toast]);

  // Fetch memorial details with error handling
  const { data: memorial, error: memorialError } = useQuery({
    queryKey: ['memorial', memorialId],
    queryFn: async () => {
      if (!memorialId) return null;
      
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', memorialId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!memorialId,
    retry: 2,
    meta: {
      onError: () => {
        toast({
          title: "Error loading memorial",
          description: "Unable to load memorial details. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  if (process.env.NODE_ENV === 'development') {
    console.log("MemorialContainer - memorialId:", memorialId);
    console.log("MemorialContainer - photos:", photos);
    console.log("MemorialContainer - memorial:", memorial);
  }

  useEffect(() => {
    if (photos.length >= 0) {
      setIsLoading(false);
    }
  }, [photos]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (memorialError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Memorial</h2>
          <p className="text-gray-600 mb-4">There was an error loading the memorial details.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-memorial-blue text-white rounded hover:bg-memorial-blue/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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