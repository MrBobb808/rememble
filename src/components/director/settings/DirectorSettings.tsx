import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import GeneralSettings from "./tabs/GeneralSettings";
import UserManagement from "./tabs/UserManagement";
import BrandingSettings from "./tabs/BrandingSettings";
import NotificationSettings from "./tabs/NotificationSettings";
import MemorialSettings from "./tabs/MemorialSettings";
import SecuritySettings from "./tabs/SecuritySettings";
import CollaborationSettings from "./tabs/CollaborationSettings";
import AppearanceSettings from "./tabs/AppearanceSettings";
import DataSettings from "./tabs/DataSettings";
import IntegrationSettings from "./tabs/IntegrationSettings";

const DirectorSettings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-playfair text-gray-800 mb-6">Director Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="memorials">Memorials</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <Card className="mt-6 p-6">
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="branding">
            <BrandingSettings />
          </TabsContent>
          
          <TabsContent value="collaboration">
            <CollaborationSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="memorials">
            <MemorialSettings />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="data">
            <DataSettings />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="integrations">
            <IntegrationSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default DirectorSettings;