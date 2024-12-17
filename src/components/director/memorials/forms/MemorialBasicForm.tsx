import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MemorialBasicFormProps {
  newName: string;
  birthYear: string;
  deathYear: string;
  onNameChange: (value: string) => void;
  onBirthYearChange: (value: string) => void;
  onDeathYearChange: (value: string) => void;
}

export const MemorialBasicForm = ({
  newName,
  birthYear,
  deathYear,
  onNameChange,
  onBirthYearChange,
  onDeathYearChange,
}: MemorialBasicFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Memorial Name</Label>
        <Input
          id="name"
          value={newName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter memorial name"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthYear">Birth Year</Label>
          <Input
            id="birthYear"
            value={birthYear}
            onChange={(e) => onBirthYearChange(e.target.value)}
            placeholder="YYYY"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deathYear">Death Year</Label>
          <Input
            id="deathYear"
            value={deathYear}
            onChange={(e) => onDeathYearChange(e.target.value)}
            placeholder="YYYY"
          />
        </div>
      </div>
    </div>
  );
};