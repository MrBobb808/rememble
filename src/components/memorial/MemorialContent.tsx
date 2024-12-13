import PhotoGrid from "@/components/PhotoGrid";
import MemorialSummary from "@/components/MemorialSummary";
import RecentActivity from "@/components/RecentActivity";

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
    <div className="grid lg:grid-cols-[1fr,300px] gap-8">
      <div className="space-y-8">
        <PhotoGrid photos={photos} onPhotoAdd={onPhotoAdd} />
        {photos.length === 25 && (
          <MemorialSummary 
            summary={summary}
            onDownload={onDownload}
          />
        )}
      </div>
      <aside className="hidden lg:block">
        <RecentActivity photos={photos} />
      </aside>
    </div>
  );
};