import { Card } from "@/components/ui/card";
import GeneralSettings from "./tabs/GeneralSettings";

const DirectorSettings = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="p-6">
        <GeneralSettings />
      </Card>
    </div>
  );
};

export default DirectorSettings;