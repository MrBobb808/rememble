import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
}

interface MemorialsListProps {
  memorials: Memorial[];
  onDelete: (id: string) => Promise<void>;
}

export const MemorialsList = ({ memorials, onDelete }: MemorialsListProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Memorials</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <div className="p-4">
            {memorials.map((memorial) => (
              <div
                key={memorial.id}
                className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium">{memorial.name}</h3>
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
                    onClick={() => navigate(`/memorial?id=${memorial.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/memorial/edit?id=${memorial.id}`)}
                  >
                    <Edit className="w-4 h-4" />
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
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};