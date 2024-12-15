import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import GeneralSettings from "./tabs/GeneralSettings";

const DirectorSettings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-playfair text-gray-800 mb-6">Director Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex flex-wrap gap-2 bg-transparent">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            General
          </TabsTrigger>
        </TabsList>

        <Card className="mt-6 p-6">
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default DirectorSettings;