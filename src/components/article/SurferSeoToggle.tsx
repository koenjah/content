import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SurferSeoToggleProps {
  value: "with" | "without";
  onValueChange: (value: "with" | "without") => void;
}

export function SurferSeoToggle({ value, onValueChange }: SurferSeoToggleProps) {
  return (
    <div>
      <Label>Met of zonder SurferSEO?</Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="flex gap-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="with" id="with-surfer" />
          <Label htmlFor="with-surfer">Met SurferSEO</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="without" id="without-surfer" />
          <Label htmlFor="without-surfer">Zonder SurferSEO</Label>
        </div>
      </RadioGroup>
    </div>
  );
}