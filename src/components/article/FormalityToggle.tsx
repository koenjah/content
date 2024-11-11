import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormalityToggleProps {
  value: "je" | "u";
  onValueChange: (value: "je" | "u") => void;
}

export function FormalityToggle({ value, onValueChange }: FormalityToggleProps) {
  return (
    <div>
      <Label>Je/u vorm <span className="text-accent">*</span></Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex gap-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="je" id="je-form" />
          <Label htmlFor="je-form">Je vorm</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="u" id="u-form" />
          <Label htmlFor="u-form">U vorm</Label>
        </div>
      </RadioGroup>
    </div>
  );
}