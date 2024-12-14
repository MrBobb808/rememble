import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MemorialSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Memorial Settings</h2>
        <p className="text-muted-foreground">
          Configure memorial creation and management settings
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Require Approval</Label>
            <p className="text-sm text-muted-foreground">
              New memorials require admin approval before publishing
            </p>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <Label>Auto-Archive Period</Label>
          <Select defaultValue="never">
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="6months">After 6 months</SelectItem>
              <SelectItem value="1year">After 1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Content Guidelines</Label>
          <Textarea
            placeholder="Enter your content guidelines here..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default MemorialSettings;