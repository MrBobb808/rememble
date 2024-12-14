import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, MessageSquare, Phone } from "lucide-react";

const SupportHelp = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Support & Help</h2>
        <p className="text-muted-foreground">
          Get help and support for your platform
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <div className="bg-memorial-blue-light p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-5 w-5" />
            <h3 className="font-semibold">Contact Support</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Available Monday to Friday, 9am - 5pm EST
          </p>
          <div className="space-y-2">
            <p className="text-sm">Phone: (555) 123-4567</p>
            <p className="text-sm">Email: support@memories.com</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <h3 className="font-semibold">Send Feedback</h3>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Message</Label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts or report an issue..."
              className="min-h-[100px]"
            />
          </div>
          <Button>Submit Feedback</Button>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5" />
            <h3 className="font-semibold">Quick Links</h3>
          </div>
          <div className="space-y-2">
            <Button variant="link" className="h-auto p-0">
              Documentation
            </Button>
            <Button variant="link" className="h-auto p-0">
              FAQs
            </Button>
            <Button variant="link" className="h-auto p-0">
              Video Tutorials
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportHelp;