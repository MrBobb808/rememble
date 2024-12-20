import { DashboardMetrics } from "./DashboardMetrics";
import { DashboardCharts } from "./DashboardCharts";
import { MemorialsList } from "./MemorialsList";
import { FamilySurveyLink } from "./FamilySurveyLink";

interface DashboardContentProps {
  metrics: {
    totalMemorials: number;
    activeMemorials: number;
    completedMemorials: number;
    newMemorialsToday: number;
    surveysCompleted: number;
    pendingSurveys: number;
  };
  barData: Array<{ date: string; count: number }>;
  pieData: Array<{ name: string; value: number }>;
  surveyData: Array<{ name: string; completed: number; pending: number }>;
  memorials: any[];
  onDelete: (id: string) => Promise<void>;
}

export const DashboardContent = ({
  metrics,
  barData,
  pieData,
  surveyData,
  memorials,
  onDelete,
}: DashboardContentProps) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-playfair text-gray-800">
          Funeral Director Dashboard
        </h1>
      </div>

      <DashboardMetrics {...metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <DashboardCharts 
            barData={barData} 
            pieData={pieData} 
            surveyData={surveyData}
          />
        </div>
        <div className="lg:col-span-1">
          <FamilySurveyLink />
        </div>
      </div>
      
      <MemorialsList memorials={memorials} onDelete={onDelete} />
    </div>
  );
};