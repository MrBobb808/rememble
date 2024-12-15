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
import { Download, Save } from "lucide-react";
import { useState } from "react";

const DataSettings = () => {
  const [settings, setSettings] = useState({
    autoSave: true,
    backupFrequency: "daily",
    enableExport: true,
    retentionPeriod: 30,
  });

  const handleSave = () => {
    // TODO: Implement settings save functionality
    console.log("Saving data settings:", settings);
  };

  const handleExport = () => {
    // TODO: Implement data export functionality
    console.log("Exporting data...");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Data & Backup Settings</h2>
        <p className="text-muted-foreground">
          Manage your memorial data and backup preferences
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-Save</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save changes as they are made
            </p>
          </div>
          <Switch
            checked={settings.autoSave}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, autoSave: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Backup Frequency</Label>
          <Select
            value={settings.backupFrequency}
            onValueChange={(value) =>
              setSettings({ ...settings, backupFrequency: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select backup frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Data Export</Label>
            <p className="text-sm text-muted-foreground">
              Allow exporting memorial data
            </p>
          </div>
          <Switch
            checked={settings.enableExport}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, enableExport: checked })
            }
          />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleExport}
          disabled={!settings.enableExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export All Data
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default DataSettings;