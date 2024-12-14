import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const UserManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">User Management</h2>
        <p className="text-muted-foreground">
          Configure user roles and access settings
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Default Role for New Users</Label>
            <Select defaultValue="viewer">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="contributor">Contributor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Invitation Expiry</Label>
            <Select defaultValue="7">
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Email Verification</Label>
              <p className="text-sm text-muted-foreground">
                Users must verify their email before accessing the platform
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Account Deletion</Label>
              <p className="text-sm text-muted-foreground">
                Users can delete their own accounts
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default UserManagement;