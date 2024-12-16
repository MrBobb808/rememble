import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemorialData } from "@/hooks/useMemorialData";
import { useMemorialDetails } from "@/hooks/useMemorialDetails";
import { MemorialContent } from "./MemorialContent";
import UnifiedSidebar from "./UnifiedSidebar";
import { LoadingState } from "./LoadingState";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const MemorialContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);

  // Early validation of required parameters
  useEffect(() => {
    if (!memorialId) {
      toast({
        title: "Welcome",
        description: "Please use a valid memorial link to access a memorial.",
      });
      navigate("/");
      return;
    }
  }, [memorialId, navigate, toast]);

  const { photos, handlePhotoAdd } = useMemorialData(memorialId);
  
  // Fetch memorial details with error handling
  const { data: memorial, error: memorialError } = useMemorialDetails(memorialId);

  // Update loading state when photos are loaded
  useEffect(() => {
    if (photos && photos.length >= 0) {
      setIsLoading(false);
    }
  }, [photos]);

  if (process.env.NODE_ENV === 'development') {
    console.log("MemorialContainer - memorialId:", memorialId);
    console.log("MemorialContainer - photos:", photos);
    console.log("MemorialContainer - memorial:", memorial);
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (memorialError) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching memorial details:", memorialError);
    }
    
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