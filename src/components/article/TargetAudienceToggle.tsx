import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TargetAudienceToggleProps {
  value: "business" | "consumer";
  onValueChange: (value: "business" | "consumer") => void;
}

export function TargetAudienceToggle({ value, onValueChange }: TargetAudienceToggleProps) {
  return (
    <div className="space-y-2">
      <Label className="text-base">Doelgroep <span className="text-accent">*</span></Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex gap-6 mt-2"
      >
        <div className="flex items-center space-x-2.5">
          <RadioGroupItem value="business" id="business" className="h-5 w-5" />
          <Label htmlFor="business" className="text-base">Bedrijven</Label>
        </div>
        <div className="flex items-center space-x-2.5">
          <RadioGroupItem value="consumer" id="consumer" className="h-5 w-5" />
          <Label htmlFor="consumer" className="text-base">Consumenten</Label>
        </div>
      </RadioGroup>
    </div>
  );
}