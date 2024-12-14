import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BrandingSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Branding & Customization</h2>
        <p className="text-muted-foreground">
          Customize the appearance of your platform
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Palette className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="#000000"
                  className="pl-10"
                  defaultValue="#6C91C2"
                />
              </div>
              <Input type="color" className="w-16 h-10" defaultValue="#6C91C2" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable dark mode option for users
              </p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label>Font Family</Label>
            <Select defaultValue="inter">
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
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default BrandingSettings;