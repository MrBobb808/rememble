import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Link, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
}

interface MemorialItemProps {
  memorial: Memorial;
  onEdit: (memorial: Memorial) => void;
  onPreview: (memorial: Memorial) => void;
  onDelete: (id: string) => void;
  onGenerateLink: (memorialId: string, type: 'collaborator' | 'viewer') => Promise<void>;
}

export const MemorialItem = ({
  memorial,
  onEdit,
  onPreview,
  onDelete,
  onGenerateLink,
}: MemorialItemProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4 border-b last:border-0 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`/memorial?id=${memorial.id}&preview=true`)}
            className="hover:underline font-medium"
          >
            {memorial.name}
          </button>
          <p className="text-sm text-gray-500">
            Created: {new Date(memorial.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={memorial.is_complete ? "default" : "secondary"}
            className={memorial.is_complete ? "bg-green-500" : "bg-blue-500"}
          >
            {memorial.is_complete ? 'Completed' : 'Active'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPreview(memorial)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(memorial)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(memorial.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onGenerateLink(memorial.id, 'collaborator')}
        >
          <Shield className="mr-2 h-4 w-4" />
          Generate Collaborator Link
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onGenerateLink(memorial.id, 'viewer')}
          disabled={!memorial.is_complete}
        >
          <Link className="mr-2 h-4 w-4" />
          Generate Viewer Link
          {!memorial.is_complete && (
            <span className="ml-2 text-xs text-gray-500">(Fill all tiles first)</span>
          )}
        </Button>
      </div>
    </div>
  );
};