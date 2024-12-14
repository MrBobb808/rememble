import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { DashboardMetrics } from "@/components/director/DashboardMetrics";
import { DashboardCharts } from "@/components/director/DashboardCharts";
import { MemorialsList } from "@/components/director/MemorialsList";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
}

const DirectorDashboard = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and has director role
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Here you would check if the user has the director role
      // For now, we'll just fetch the data
      fetchMemorials();
    };

    checkAuth();
  }, [navigate]);

  const fetchMemorials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemorials(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching memorials",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memorials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMemorials(memorials.filter(m => m.id !== id));
      toast({
        title: "Memorial deleted",
        description: "The memorial has been successfully deleted."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting memorial",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredMemorials = memorials.filter(memorial => {
    const matchesSearch = memorial.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "complete" 
        ? memorial.is_complete 
        : !memorial.is_complete;
    return matchesSearch && matchesStatus;
  });

  const barData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayMemorials = memorials.filter(m => 
      new Date(m.created_at).toDateString() === date.toDateString()
    );
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayMemorials.length
    };
  }).reverse();

  const pieData = [
    { name: 'Active', value: memorials.filter(m => !m.is_complete).length },
    { name: 'Completed', value: memorials.filter(m => m.is_complete).length }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-memorial-blue"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair text-gray-800">Funeral Director Dashboard</h1>
          <div className="flex gap-4">
            <SearchInput
              placeholder="Search memorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              icon={<Search className="w-4 h-4" />}
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="complete">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DashboardMetrics
          totalMemorials={memorials.length}
          activeMemorials={memorials.filter(m => !m.is_complete).length}
          completedMemorials={memorials.filter(m => m.is_complete).length}
          newMemorialsToday={barData[barData.length - 1].count}
        />

        <DashboardCharts
          barData={barData}
          pieData={pieData}
        />

        <MemorialsList
          memorials={filteredMemorials}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default DirectorDashboard;