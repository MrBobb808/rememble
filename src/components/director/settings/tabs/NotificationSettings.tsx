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

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Notification Settings</h2>
        <p className="text-muted-foreground">
          Manage how and when you receive notifications
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Memorial Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when new memorials are created
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Comment Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for new comments
              </p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select defaultValue="realtime">
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
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default NotificationSettings;