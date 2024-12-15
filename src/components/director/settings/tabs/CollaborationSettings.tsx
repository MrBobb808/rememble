import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const CollaborationSettings = () => {
  const [settings, setSettings] = useState({
    defaultRole: "contributor",
    requireApproval: true,
    autoExpireLinks: true,
    linkExpirationDays: 7,
  });

  const handleSave = () => {
    // TODO: Implement settings save functionality
    console.log("Saving collaboration settings:", settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Collaboration Settings</h2>
        <p className="text-muted-foreground">
          Manage how users collaborate on memorial pages
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Default Collaborator Role</Label>
          <Select
            value={settings.defaultRole}
            onValueChange={(value) =>
              setSettings({ ...settings, defaultRole: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select default role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="contributor">Contributor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Content Approval</Label>
            <p className="text-sm text-muted-foreground">
              Require admin approval for uploaded content
            </p>
          </div>
          <Switch
            checked={settings.requireApproval}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, requireApproval: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-expire Links</Label>
            <p className="text-sm text-muted-foreground">
              Automatically expire collaboration links
            </p>
          </div>
          <Switch
            checked={settings.autoExpireLinks}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, autoExpireLinks: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Link Expiration (Days)</Label>
          <Input
            type="number"
            min="1"
            max="365"
            value={settings.linkExpirationDays}
            onChange={(e) =>
              setSettings({
                ...settings,
                linkExpirationDays: parseInt(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default CollaborationSettings;