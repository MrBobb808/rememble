import MemorialProgress from "@/components/MemorialProgress";
import CollaboratorsManagement from "@/components/CollaboratorsManagement";
import { InviteDialog } from "./InviteDialog";

interface MemorialHeaderProps {
  photosCount: number;
  memorialId: string | null;
  onShare: () => void;
  onDownload: () => void;
}

export const MemorialHeader = ({
  photosCount,
  memorialId,
  onShare,
  onDownload,
}: MemorialHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <MemorialProgress 
        photosCount={photosCount}
        onShare={onShare}
        onDownload={onDownload}
      />
      {memorialId && (
        <div className="flex gap-2">
          <InviteDialog memorialId={memorialId} />
          <CollaboratorsManagement memorialId={memorialId} />
        </div>
      )}
    </div>
  );
};