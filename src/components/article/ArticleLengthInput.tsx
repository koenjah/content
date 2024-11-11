import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ArticleLengthInputProps {
  useSurferSEO: "with" | "without";
  articleLength: string;
  onChange: (value: string) => void;
}

export const ArticleLengthInput = ({
  useSurferSEO,
  articleLength,
  onChange,
}: ArticleLengthInputProps) => {
  return (
    <div>
      <Label>Artikel lengte <span className="text-accent">*</span></Label>
      {useSurferSEO === "with" ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={articleLength}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Standaard gebruik ik de data van SurferSEO"
              min="300"
              max="3000"
            />
          </div>
        </div>
      ) : (
        <Input
          type="number"
          value={articleLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Aantal woorden (300-3000)"
          min="300"
          max="3000"
        />
      )}
    </div>
  );
};