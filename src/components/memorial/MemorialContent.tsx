import PhotoGrid from "@/components/PhotoGrid";
import MemorialSummary from "@/components/MemorialSummary";
import MemorialBanner from "./MemorialBanner";
import { cn } from "@/lib/utils";
import { useSearchParams } from "react-router-dom";
import { Photo } from "@/types/photo";

interface MemorialContentProps {
  photos: Photo[];
  handlePhotoAdd: (file: File, caption: string, contributorName: string, relationship: string) => Promise<void>;
  isLoading: boolean;
  memorial?: {
    name: string;
    banner_image_url?: string;
    birth_year?: string;
    death_year?: string;
  };
}

export const MemorialContent = ({
  photos,
  handlePhotoAdd,
  isLoading,
  memorial,
}: MemorialContentProps) => {
  const [searchParams] = useSearchParams();
  const memorialId = searchParams.get("id");

  return (
    <div className="pt-8">
      <MemorialBanner 
        name={memorial?.name || "Memorial"}
        birthYear={memorial?.birth_year}
        deathYear={memorial?.death_year}
        photoUrl={memorial?.banner_image_url}
      />

      <div className={cn(
        "max-w-[1400px] mx-auto",
        "bg-gradient-to-b from-memorial-beige-light to-white/50",
        "rounded-lg shadow-sm p-4 mx-auto my-6"
      )}>
        <div className="space-y-6">
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
      </div>
    </div>
  );
};