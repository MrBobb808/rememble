import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Globe, Mail, Phone } from "lucide-react";

interface ContactFormProps {
  funeralHome: {
    name: string;
    phone: string;
    email: string;
    website: string;
  };
  setFuneralHome: (value: any) => void;
}

const ContactForm = ({ funeralHome, setFuneralHome }: ContactFormProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Funeral Home Name</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="name"
            className="pl-10"
            value={funeralHome.name}
            onChange={(e) =>
              setFuneralHome({ ...funeralHome, name: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="phone"
            className="pl-10"
            value={funeralHome.phone}
            onChange={(e) =>
              setFuneralHome({ ...funeralHome, phone: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="email"
            type="email"
            className="pl-10"
            value={funeralHome.email}
            onChange={(e) =>
              setFuneralHome({ ...funeralHome, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="website">Website</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            id="website"
            className="pl-10"
            value={funeralHome.website}
            onChange={(e) =>
              setFuneralHome({ ...funeralHome, website: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;