import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemorialData } from "@/hooks/useMemorialData";
import { useMemorialSession } from "@/hooks/useMemorialSession";
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
  const { photos, handlePhotoAdd } = useMemorialData(memorialId);
  const [isLoading, setIsLoading] = useState(true);

  // Check for valid access and handle session
  const { isLoading: isSessionLoading } = useMemorialSession(token);

  // Fetch memorial details with error handling in meta
  const { data: memorial, error: memorialError } = useMemorialDetails(memorialId);

  if (process.env.NODE_ENV === 'development') {
    console.log("MemorialContainer - memorialId:", memorialId);
    console.log("MemorialContainer - photos:", photos);
    console.log("MemorialContainer - memorial:", memorial);
  }

  // Update loading state when photos are loaded
  useState(() => {
    if (photos.length >= 0) {
      setIsLoading(false);
    }
  }, [photos]);

  if (isSessionLoading || isLoading) {
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