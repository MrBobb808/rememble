import { DashboardMetrics } from "@/components/director/DashboardMetrics";
import { DashboardCharts } from "@/components/director/DashboardCharts";
import { MemorialsList } from "@/components/director/MemorialsList";
import DirectorSettings from "@/components/director/settings/DirectorSettings";
import Navigation from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings } from "lucide-react";

const DirectorDashboard = () => {
  // Fetch memorials data
  const { data: memorials = [] } = useQuery({
    queryKey: ['memorials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Calculate metrics
  const metrics = {
    totalMemorials: memorials.length,
    activeMemorials: memorials.filter(m => !m.is_complete).length,
    completedMemorials: memorials.filter(m => m.is_complete).length,
    newMemorialsToday: memorials.filter(m => {
      const today = new Date();
      const createdAt = new Date(m.created_at);
      return (
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      );
    }).length
  };

  // Prepare chart data
  const barData = memorials.reduce((acc: any[], memorial) => {
    const date = new Date(memorial.created_at).toLocaleDateString();
    const existingEntry = acc.find(entry => entry.date === date);
    
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    
    return acc;
  }, []).slice(-7); // Last 7 days

  const pieData = [
    { name: 'Active', value: metrics.activeMemorials },
    { name: 'Completed', value: metrics.completedMemorials }
  ];

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memorials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch data automatically through React Query
    } catch (error) {
      console.error('Error deleting memorial:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-playfair text-gray-800">
                  Funeral Director Dashboard
                </h1>
              </div>

              <DashboardMetrics {...metrics} />
              <DashboardCharts barData={barData} pieData={pieData} />
              <MemorialsList memorials={memorials} onDelete={handleDelete} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <DirectorSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DirectorDashboard;