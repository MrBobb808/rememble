import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Security Settings</h2>
        <p className="text-muted-foreground">
          Manage security and authentication settings
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Require 2FA for all admin accounts
            </p>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <Label>Maximum Login Attempts</Label>
          <Input type="number" min="1" max="10" defaultValue="5" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Session Timeout</Label>
            <p className="text-sm text-muted-foreground">
              Automatically log out inactive users
            </p>
          </div>
          <Switch />
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SecuritySettings;