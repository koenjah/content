import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FormalityToggleProps {
  value: "je" | "u";
  onValueChange: (value: "je" | "u") => void;
}

export function FormalityToggle({ value, onValueChange }: FormalityToggleProps) {
  return (
    <div className="space-y-2">
      <Label className="text-base">Je/u vorm <span className="text-accent">*</span></Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex gap-6 mt-2"
      >
        <div className="flex items-center space-x-2.5">
          <RadioGroupItem value="je" id="je-form" className="h-5 w-5" />
          <Label htmlFor="je-form" className="text-base">Je vorm</Label>
        </div>
        <div className="flex items-center space-x-2.5">
          <RadioGroupItem value="u" id="u-form" className="h-5 w-5" />
          <Label htmlFor="u-form" className="text-base">U vorm</Label>
        </div>
      </RadioGroup>
    </div>
  );
}