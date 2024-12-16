import { Card } from "@/components/ui/card";
import GeneralSettings from "./tabs/GeneralSettings";
import BillingSettings from "./tabs/BillingSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Settings } from "lucide-react";

const DirectorSettings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6">
            <GeneralSettings />
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card className="p-6">
            <BillingSettings />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DirectorSettings;