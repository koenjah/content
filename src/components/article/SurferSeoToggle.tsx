import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SurferSeoToggleProps {
  value: "with" | "without";
  onValueChange: (value: "with" | "without") => void;
}

export function SurferSeoToggle({ value, onValueChange }: SurferSeoToggleProps) {
  return (
    <div className="space-y-2">
      <Label className="text-base">Met of zonder SurferSEO?</Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex gap-6 mt-2"
      >
        <div className="flex items-center space-x-2.5">
          <RadioGroupItem value="with" id="with-surfer" className="h-5 w-5" />
          <Label htmlFor="with-surfer" className="text-base">Met SurferSEO</Label>
        </div>
        <div className="flex items-center space-x-2.5">
          <RadioGroupItem value="without" id="without-surfer" className="h-5 w-5" />
          <Label htmlFor="without-surfer" className="text-base">Zonder SurferSEO</Label>
        </div>
      </RadioGroup>
    </div>
  );
}