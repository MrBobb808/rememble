import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Facebook, Twitter, Link } from "lucide-react";
import { useState } from "react";

const IntegrationSettings = () => {
  const [settings, setSettings] = useState({
    enableSocialSharing: true,
    enableFacebook: true,
    enableTwitter: true,
    apiKey: "",
    webhookUrl: "",
  });

  const handleSave = () => {
    // TODO: Implement settings save functionality
    console.log("Saving integration settings:", settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Integration Settings</h2>
        <p className="text-muted-foreground">
          Manage connections with external services and platforms
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media Sharing</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Social Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Allow sharing memorial pages on social media
              </p>
            </div>
            <Switch
              checked={settings.enableSocialSharing}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableSocialSharing: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Facebook className="h-4 w-4" />
              <Label>Facebook</Label>
            </div>
            <Switch
              checked={settings.enableFacebook}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableFacebook: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Twitter className="h-4 w-4" />
              <Label>Twitter</Label>
            </div>
            <Switch
              checked={settings.enableTwitter}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, enableTwitter: checked })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Integration</h3>
          
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              value={settings.apiKey}
              onChange={(e) =>
                setSettings({ ...settings, apiKey: e.target.value })
              }
              placeholder="Enter your API key"
            />
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              value={settings.webhookUrl}
              onChange={(e) =>
                setSettings({ ...settings, webhookUrl: e.target.value })
              }
              placeholder="https://your-webhook-url.com"
            />
          </div>

          <Button variant="outline" className="w-full">
            <Link className="mr-2 h-4 w-4" />
            Test Connection
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default IntegrationSettings;