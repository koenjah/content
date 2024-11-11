import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SurferSeoToggle } from "./SurferSeoToggle";
import { FormalityToggle } from "./FormalityToggle";
import { TargetAudienceToggle } from "./TargetAudienceToggle";
import { ArticleLengthInput } from "./ArticleLengthInput";

interface CreateArticleFormProps {
  clients: any[];
  isSubmitting: boolean;
  onSubmit: (formData: {
    clientId: string;
    surferSEO: "with" | "without";
    surferSEOUrl: string;
    keywords: string;
    internalLinks: string;
    articleLength: string;
    formality: "je" | "u";
    targetAudience: "business" | "consumer";
  }) => void;
}

export const CreateArticleForm = ({ clients, isSubmitting, onSubmit }: CreateArticleFormProps) => {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [useSurferSEO, setUseSurferSEO] = useState<"with" | "without">("without");
  const [surferSEOUrl, setSurferSEOUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [internalLinks, setInternalLinks] = useState("");
  const [articleLength, setArticleLength] = useState("");
  const [formality, setFormality] = useState<"je" | "u">("je");
  const [targetAudience, setTargetAudience] = useState<"business" | "consumer">("business");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) {
      toast.error("Selecteer een klant");
      return;
    }

    if (useSurferSEO === "with" && !surferSEOUrl) {
      toast.error("Voer een SurferSEO URL in");
      return;
    }

    if (useSurferSEO === "without") {
      if (!keywords) {
        toast.error("Voer zoekwoorden in");
        return;
      }
      if (!articleLength) {
        toast.error("Voer een artikel lengte in");
        return;
      }
    }

    onSubmit({
      clientId: selectedClientId,
      surferSEO: useSurferSEO,
      surferSEOUrl,
      keywords,
      internalLinks,
      articleLength,
      formality,
      targetAudience,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Selecteer een klant <span className="text-accent">*</span></Label>
        <Select
          value={selectedClientId}
          onValueChange={setSelectedClientId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kies een klant" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <SurferSeoToggle value={useSurferSEO} onValueChange={setUseSurferSEO} />

      {useSurferSEO === "with" && (
        <div>
          <Label>SurferSEO URL <span className="text-accent">*</span></Label>
          <Textarea
            value={surferSEOUrl}
            onChange={(e) => setSurferSEOUrl(e.target.value)}
            placeholder="Voer SurferSEO URL's in (één per regel)"
            className="h-24"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Let op: De outline moet al gegenereerd zijn in SurferSEO
          </p>
        </div>
      )}

      {useSurferSEO === "without" && (
        <div>
          <Label>Zoekwoorden <span className="text-accent">*</span></Label>
          <Textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Voer zoekwoorden in (één per regel)"
            className="h-24"
          />
        </div>
      )}

      <div>
        <Label>Interne links Beta</Label>
        <Textarea
          value={internalLinks}
          onChange={(e) => setInternalLinks(e.target.value)}
          placeholder="Dit werkt nog niet zo goed, doe er max 2 per artikel. (Liever helemaal niet gebruiken)"
          className="h-24"
        />
      </div>

      <ArticleLengthInput 
        useSurferSEO={useSurferSEO}
        articleLength={articleLength}
        onChange={setArticleLength}
      />

      <FormalityToggle value={formality} onValueChange={setFormality} />
      <TargetAudienceToggle value={targetAudience} onValueChange={setTargetAudience} />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Bezig met genereren..." : "Genereren"}
      </Button>
    </form>
  );
};