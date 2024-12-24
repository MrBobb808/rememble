import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DirectorGuard from "@/components/guards/DirectorGuard";
import Navigation from "@/components/Navigation";
import DirectorSettings from "@/components/director/settings/DirectorSettings";
import { DashboardContent } from "@/components/director/DashboardContent";
import { supabase } from "@/integrations/supabase/client";
import { useDirectorMemorials } from "@/hooks/useDirectorMemorials";
import { useDirectorSurveys } from "@/hooks/useDirectorSurveys";
import { useDirectorMetrics } from "@/hooks/useDirectorMetrics";
import { useMemorialDelete } from "@/hooks/useMemorialDelete";
import { validateUUID } from "@/utils/validation";

const DirectorDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (user?.id && validateUUID(user.id)) {
          console.log("Setting valid user ID:", user.id);
          setUserId(user.id);
        } else {
          console.log("Invalid or missing user ID");
          toast({
            title: "Authentication Required",
            description: "Please sign in to access the dashboard.",
            variant: "destructive",
          });
          setUserId(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again.",
          variant: "destructive",
        });
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUserId = session?.user?.id;
      if (event === 'SIGNED_IN' && newUserId && validateUUID(newUserId)) {
        console.log("Auth state change - valid user ID:", newUserId);
        setUserId(newUserId);
      } else if (event === 'SIGNED_OUT') {
        console.log("Auth state change - signed out");
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const { data: memorials = [], isLoading: isMemorialsLoading } = useDirectorMemorials(userId);
  const { data: surveys = [], isLoading: isSurveysLoading } = useDirectorSurveys(userId);
  const metrics = useDirectorMetrics(memorials, surveys);
  const { deleteMemorial } = useMemorialDelete();

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

  if (isLoading || isMemorialsLoading || isSurveysLoading) {
    return <div>Loading...</div>;
  }

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
                onDelete={deleteMemorial}
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