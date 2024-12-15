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
import { useState } from "react";

const AppearanceSettings = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    font: "inter",
    imageDisplay: "grid",
    enableDarkMode: true,
  });

  const handleSave = () => {
    // TODO: Implement settings save functionality
    console.log("Saving appearance settings:", settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Appearance Settings</h2>
        <p className="text-muted-foreground">
          Customize how memorial pages look and feel
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Theme Mode</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) => setSettings({ ...settings, theme: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select
            value={settings.font}
            onValueChange={(value) => setSettings({ ...settings, font: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="playfair">Playfair Display</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Image Display</Label>
          <Select
            value={settings.imageDisplay}
            onValueChange={(value) =>
              setSettings({ ...settings, imageDisplay: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select display style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="fullWidth">Full Width</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Dark Mode Toggle</Label>
            <p className="text-sm text-muted-foreground">
              Allow users to switch between light and dark mode
            </p>
          </div>
          <Switch
            checked={settings.enableDarkMode}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, enableDarkMode: checked })
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

export default AppearanceSettings;