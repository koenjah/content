import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TargetAudienceToggleProps {
  value: "business" | "consumer";
  onValueChange: (value: "business" | "consumer") => void;
}

export function TargetAudienceToggle({ value, onValueChange }: TargetAudienceToggleProps) {
  return (
    <div>
      <Label>Doelgroep <span className="text-accent">*</span></Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex gap-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="business" id="business" />
          <Label htmlFor="business">Bedrijven</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="consumer" id="consumer" />
          <Label htmlFor="consumer">Consumenten</Label>
        </div>
      </RadioGroup>
    </div>
  );
}