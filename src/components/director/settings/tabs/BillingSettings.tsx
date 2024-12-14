import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Package } from "lucide-react";

const BillingSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and payment details
        </p>
      </div>

      <Separator />

      <div className="space-y-6">
        <div className="bg-memorial-blue-light p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5" />
            <h3 className="font-semibold">Current Plan: Premium</h3>
          </div>
          <p className="text-sm text-gray-600">
            Your subscription renews on January 1, 2025
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-5 w-5" />
            <h3 className="font-semibold">Payment Method</h3>
          </div>
          <p className="text-sm text-gray-600">
            Visa ending in 4242
          </p>
          <Button variant="outline" size="sm" className="mt-2">
            Update Payment Method
          </Button>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Memorials Created</span>
              <span>15 / 50</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span>2.5GB / 10GB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">View Invoice History</Button>
        <Button>Upgrade Plan</Button>
      </div>
    </div>
  );
};

export default BillingSettings;