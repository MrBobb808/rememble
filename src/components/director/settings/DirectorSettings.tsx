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
        <TabsList className="flex flex-wrap gap-2 bg-transparent">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger 
            value="branding"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Branding
          </TabsTrigger>
          <TabsTrigger 
            value="collaboration"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Collaboration
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Security
          </TabsTrigger>
          <TabsTrigger 
            value="memorials"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Memorials
          </TabsTrigger>
          <TabsTrigger 
            value="appearance"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger 
            value="data"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Data
          </TabsTrigger>
          <TabsTrigger 
            value="users"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Users
          </TabsTrigger>
          <TabsTrigger 
            value="integrations"
            className="data-[state=active]:bg-memorial-blue data-[state=active]:text-white"
          >
            Integrations
          </TabsTrigger>
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