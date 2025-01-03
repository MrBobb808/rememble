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
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          toast({
            title: "Authentication Error",
            description: "Please try signing in again.",
            variant: "destructive",
          });
          setUserId(null);
          return;
        }
        
        if (session?.user?.id && validateUUID(session.user.id)) {
          console.log("Setting valid user ID:", session.user.id);
          setUserId(session.user.id);
        } else {
          console.error("Invalid or missing user ID from auth");
          toast({
            title: "Authentication Error",
            description: "Invalid user session. Please sign in again.",
            variant: "destructive",
          });
          setUserId(null);
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setUserId(null);
      } finally {
        setAuthInitialized(true);
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        if (validateUUID(session.user.id)) {
          console.log("Auth state change - valid user ID:", session.user.id);
          setUserId(session.user.id);
        } else {
          console.error("Invalid user ID from auth state change");
          toast({
            title: "Authentication Error",
            description: "Invalid user session. Please sign in again.",
            variant: "destructive",
          });
          setUserId(null);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("Auth state change - signed out");
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const { data: memorials = [], isLoading: isMemorialsLoading } = useDirectorMemorials(userId, authInitialized);
  const { data: surveys = [], isLoading: isSurveysLoading } = useDirectorSurveys(userId, authInitialized);
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

  if (!authInitialized || isLoading || isMemorialsLoading || isSurveysLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-memorial-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access the dashboard.</p>
        </div>
      </div>
    );
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