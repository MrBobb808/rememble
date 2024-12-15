import { Button } from "@/components/ui/button";
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
import { Bell, Info, Volume2, Phone } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    newMemorialNotifications: true,
    commentNotifications: false,
    notificationFrequency: "realtime",
    mobileNotifications: false,
    soundEnabled: true,
    isAdvancedOpen: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log("Saving notification settings:", settings);
    setHasChanges(false);
  };

  const handleCancel = () => {
    // Reset to initial settings
    setSettings({
      newMemorialNotifications: true,
      commentNotifications: false,
      notificationFrequency: "realtime",
      mobileNotifications: false,
      soundEnabled: true,
      isAdvancedOpen: false,
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-memorial-blue" />
        <h2 className="text-2xl font-semibold">Notification Settings</h2>
      </div>
      <p className="text-muted-foreground">
        Manage how and when you receive notifications
      </p>

      <Separator />

      {hasChanges && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="text-sm text-yellow-700">
            You have unsaved changes. Remember to save your settings.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label>New Memorial Notifications</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Receive notifications when new memorials are created
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground">
                Get notified when new memorials are created
              </p>
            </div>
            <Switch
              checked={settings.newMemorialNotifications}
              onCheckedChange={(checked) =>
                updateSetting("newMemorialNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label>Comment Notifications</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Receive notifications for new comments
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-muted-foreground">
                Get notified when new comments are added
              </p>
            </div>
            <Switch
              checked={settings.commentNotifications}
              onCheckedChange={(checked) =>
                updateSetting("commentNotifications", checked)
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Notification Frequency</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Choose how often you want to receive notifications
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={settings.notificationFrequency}
              onValueChange={(value) =>
                updateSetting("notificationFrequency", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Collapsible
            open={settings.isAdvancedOpen}
            onOpenChange={(isOpen) =>
              updateSetting("isAdvancedOpen", isOpen)
            }
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Advanced Settings
                <Info className="h-4 w-4 ml-2" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <Label>Mobile Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable push notifications on mobile devices
                  </p>
                </div>
                <Switch
                  checked={settings.mobileNotifications}
                  onCheckedChange={(checked) =>
                    updateSetting("mobileNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <Label>Notification Sound</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Play a sound when notifications arrive
                  </p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) =>
                    updateSetting("soundEnabled", checked)
                  }
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-6">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={!hasChanges}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;