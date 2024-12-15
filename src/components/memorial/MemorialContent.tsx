import PhotoGrid from "@/components/PhotoGrid";
import MemorialSummary from "@/components/MemorialSummary";
import UnifiedSidebar from "./UnifiedSidebar";
import MemorialBanner from "./MemorialBanner";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";

interface Photo {
  id: number;
  url: string;
  caption: string;
  aiReflection?: string;
  contributorName?: string;
  relationship?: string;
}

interface MemorialContentProps {
  photos: Photo[];
  handlePhotoAdd: (file: File, caption: string, contributorName: string, relationship: string) => Promise<void>;
  isLoading: boolean;
}

export const MemorialContent = ({
  photos,
  handlePhotoAdd,
  isLoading,
}: MemorialContentProps) => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");

  return (
    <div className="pt-14">
      <MemorialBanner 
        name="John Doe"
        dates="1945 - 2024"
        photoUrl="/placeholder.svg"
      />

      <div className={cn(
        "max-w-7xl mx-auto",
        "grid lg:grid-cols-[1fr,300px] gap-8 mt-8",
        "bg-gradient-to-b from-memorial-beige-light to-white/50",
        "rounded-lg shadow-sm p-6 mx-4"
      )}>
        <div className="space-y-8">
          <PhotoGrid photos={photos} onPhotoAdd={handlePhotoAdd} />
          {photos.length === 25 && (
            <MemorialSummary 
              summary={null}
              onDownload={() => {
                console.log("Download memorial");
              }}
            />
          )}
        </div>
        <aside className="hidden lg:block">
          <UnifiedSidebar photos={photos} />
        </aside>
      </div>
    </div>
  );
};