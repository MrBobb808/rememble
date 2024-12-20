import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DirectorGuard from "@/components/guards/DirectorGuard";
import Navigation from "@/components/Navigation";
import DirectorSettings from "@/components/director/settings/DirectorSettings";
import { DashboardContent } from "@/components/director/DashboardContent";

const DirectorDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: memorials = [] } = useQuery({
    queryKey: ['memorials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memorials')
        .select('*, memorial_collaborators(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: surveys = [] } = useQuery({
    queryKey: ['surveys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('memorial_surveys')
        .select('*, memorials(name)')
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
    }).length,
    surveysCompleted: surveys.length,
    pendingSurveys: memorials.length - surveys.length
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
  }, []).slice(-7);

  const pieData = [
    { name: 'Active', value: metrics.activeMemorials },
    { name: 'Completed', value: metrics.completedMemorials }
  ];

  const surveyData = memorials.slice(0, 5).map(memorial => ({
    name: memorial.name,
    completed: surveys.filter(s => s.memorial_id === memorial.id).length,
    pending: 1 - surveys.filter(s => s.memorial_id === memorial.id).length
  }));

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memorials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['memorials'] });
      await queryClient.invalidateQueries({ queryKey: ['activity_logs'] });
      
      toast({
        title: "Memorial deleted",
        description: "The memorial has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting memorial:', error);
      toast({
        title: "Error deleting memorial",
        description: error.message || "There was a problem deleting the memorial.",
        variant: "destructive",
      });
    }
  };

  return (
    <DirectorGuard>
      <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
        <Navigation />
        <main className="container mx-auto px-4 py-8 mt-16 space-y-8">
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
              <DashboardContent 
                metrics={metrics}
                barData={barData}
                pieData={pieData}
                surveyData={surveyData}
                memorials={memorials}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="settings">
              <DirectorSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DirectorGuard>
  );
};

export default DirectorDashboard;