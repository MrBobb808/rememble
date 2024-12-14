import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import GeneralSettings from "./tabs/GeneralSettings";
import UserManagement from "./tabs/UserManagement";
import BrandingSettings from "./tabs/BrandingSettings";
import NotificationSettings from "./tabs/NotificationSettings";
import MemorialSettings from "./tabs/MemorialSettings";
import SecuritySettings from "./tabs/SecuritySettings";
import BillingSettings from "./tabs/BillingSettings";
import SupportHelp from "./tabs/SupportHelp";

const DirectorSettings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-playfair text-gray-800 mb-6">Director Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="memorials">Memorials</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <Card className="mt-6 p-6">
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="branding">
            <BrandingSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="memorials">
            <MemorialSettings />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>
          
          <TabsContent value="support">
            <SupportHelp />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default DirectorSettings;