import PhotoGrid from "@/components/PhotoGrid";
import MemorialSummary from "@/components/MemorialSummary";
import UnifiedSidebar from "./UnifiedSidebar";
import MemorialBanner from "./MemorialBanner";
import { cn } from "@/lib/utils";

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
  summary: string | null;
  onPhotoAdd: (file: File, caption: string, contributorName: string, relationship: string) => Promise<void>;
}

export const MemorialContent = ({
  photos,
  summary,
  onPhotoAdd,
}: MemorialContentProps) => {
  return (
    <>
      <MemorialBanner 
        name="John Doe"
        dates="1945 - 2024"
        photoUrl="/placeholder.svg"
      />
      
      <div className={cn(
        "grid lg:grid-cols-[1fr,300px] gap-8",
        "bg-gradient-to-b from-memorial-beige-light/50 to-white/50",
        "rounded-lg shadow-sm p-6"
      )}>
        <div className="space-y-8">
          <PhotoGrid photos={photos} onPhotoAdd={onPhotoAdd} />
          {photos.length === 25 && (
            <MemorialSummary 
              summary={summary}
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
    </>
  );
};