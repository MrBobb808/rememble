import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Calendar, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
}

const DirectorDashboard = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemorials = async () => {
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching memorials:', error);
        return;
      }

      setMemorials(data || []);
    };

    fetchMemorials();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-playfair text-gray-800 mb-8">Funeral Director Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Memorials</CardTitle>
              <Users className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memorials.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Memorials</CardTitle>
              <Calendar className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memorials.filter(m => !m.is_complete).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FileText className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memorials.filter(m => m.is_complete).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Settings className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">Manage preferences</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Memorials</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <div className="p-4">
                {memorials.map((memorial) => (
                  <div
                    key={memorial.id}
                    className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/memorial?id=${memorial.id}`)}
                  >
                    <div>
                      <h3 className="font-medium">{memorial.name}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(memorial.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      memorial.is_complete 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {memorial.is_complete ? 'Completed' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DirectorDashboard;