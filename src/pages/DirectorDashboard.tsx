import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";

const DirectorDashboard = () => {
  // Sample static data for immediate rendering
  const metrics = {
    totalMemorials: 12,
    activeMemorials: 5,
    completedMemorials: 7,
    newMemorialsToday: 2
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-memorial-beige-light to-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair text-gray-800">Funeral Director Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Memorials</CardTitle>
              <Users className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalMemorials}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Memorials</CardTitle>
              <Calendar className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeMemorials}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <FileText className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.completedMemorials}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Settings className="h-4 w-4 text-memorial-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No recent activity to display.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DirectorDashboard;