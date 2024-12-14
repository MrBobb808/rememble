import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, Calendar, FileText, Settings, Search,
  TrendingUp, TrendingDown, Edit, Trash2, Eye,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Memorial {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
}

const COLORS = ['#6C91C2', '#4A6A9D', '#E6EEF7'];

const DirectorDashboard = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMemorials = async () => {
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching memorials:', error);
        toast({
          title: "Error fetching memorials",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setMemorials(data || []);
    };

    fetchMemorials();
  }, [toast]);

  const filteredMemorials = memorials.filter(memorial => {
    const matchesSearch = memorial.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "complete" 
        ? memorial.is_complete 
        : !memorial.is_complete;
    return matchesSearch && matchesStatus;
  });

  const pieData = [
    { name: 'Active', value: memorials.filter(m => !m.is_complete).length },
    { name: 'Completed', value: memorials.filter(m => m.is_complete).length }
  ];

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

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('memorials')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error deleting memorial",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setMemorials(memorials.filter(m => m.id !== id));
    toast({
      title: "Memorial deleted",
      description: "The memorial has been successfully deleted."
    });
  };

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Memorials</CardTitle>
              <Users className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memorials.length}</div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                <span>+{barData[barData.length - 1].count} today</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Memorials</CardTitle>
              <Calendar className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memorials.filter(m => !m.is_complete).length}
              </div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <AlertCircle className="w-3 h-3 mr-1 text-yellow-500" />
                <span>Requires attention</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FileText className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memorials.filter(m => m.is_complete).length}
              </div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                <span>Well done!</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Settings className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full text-sm">
                Manage Preferences
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Memorial Creation Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6C91C2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memorial Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Memorials</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <div className="p-4">
                {filteredMemorials.map((memorial) => (
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
                        onClick={() => handleDelete(memorial.id)}
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
      </main>
    </div>
  );
};

export default DirectorDashboard;