import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Settings, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardMetricsProps {
  totalMemorials: number;
  activeMemorials: number;
  completedMemorials: number;
  newMemorialsToday: number;
}

export const DashboardMetrics = ({
  totalMemorials,
  activeMemorials,
  completedMemorials,
  newMemorialsToday,
}: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Memorials</CardTitle>
          <Users className="h-4 w-4 text-memorial-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMemorials}</div>
          <div className="text-xs text-gray-500 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
            <span>+{newMemorialsToday} today</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Memorials</CardTitle>
          <Calendar className="h-4 w-4 text-memorial-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeMemorials}</div>
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
          <div className="text-2xl font-bold">{completedMemorials}</div>
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
  );
};