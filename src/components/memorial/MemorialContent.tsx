import PhotoGrid from "@/components/PhotoGrid";
import MemorialSummary from "@/components/MemorialSummary";
import RecentActivity from "@/components/RecentActivity";
import { CollaboratorsPanel } from "./CollaboratorsPanel";
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
  onDownload: () => void;
}

export const MemorialContent = ({
  photos,
  summary,
  onPhotoAdd,
  onDownload,
}: MemorialContentProps) => {
  return (
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
            onDownload={onDownload}
          />
        )}
      </div>
      <aside className="hidden lg:flex flex-col gap-6">
        <CollaboratorsPanel />
        <RecentActivity photos={photos} />
      </aside>
    </div>
  );
};