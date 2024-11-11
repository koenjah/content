import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [useSurferSEO, setUseSurferSEO] = useState<"with" | "without">("without");
  const [surferSEOUrl, setSurferSEOUrl] = useState("");
  const [keywords, setKeywords] = useState("");
  const [internalLinks, setInternalLinks] = useState("");
  const [articleLength, setArticleLength] = useState("");
  const [formality, setFormality] = useState<"je" | "u">("je");
  const [targetAudience, setTargetAudience] = useState<"business" | "consumer">("business");

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Error loading clients: " + error.message);
      }
    }
  });

  const createArticleMutation = useMutation({
    mutationFn: async (formData: {
      clientId: string;
      useSurferSEO: "with" | "without";
      surferSEOUrl?: string;
      keywords?: string;
      internalLinks: string;
      articleLength: string;
      formality: "je" | "u";
      targetAudience: "business" | "consumer";
    }) => {
      const { data, error } = await supabase
        .from("articles")
        .insert([
          {
            client_id: formData.clientId,
            content: "", // This will be filled by the AI later
            title: "", // This will be filled by the AI later
            word_count: parseInt(formData.articleLength) || 0,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Artikel wordt gegenereerd!");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Error creating article: " + error.message);
    }
  });

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

    if (useSurferSEO === "without" && !keywords) {
      toast.error("Voer zoekwoorden in");
      return;
    }

    if (!articleLength) {
      toast.error("Voer een artikel lengte in");
      return;
    }

    createArticleMutation.mutate({
      clientId: selectedClientId,
      useSurferSEO,
      surferSEOUrl: useSurferSEO === "with" ? surferSEOUrl : undefined,
      keywords: useSurferSEO === "without" ? keywords : undefined,
      internalLinks,
      articleLength,
      formality,
      targetAudience,
    });
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar overzicht
        </Button>

        <h1 className="text-2xl font-bold mb-6">Nieuw artikel maken</h1>
        
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

          <div>
            <Label>Met of zonder SurferSEO?</Label>
            <RadioGroup
              value={useSurferSEO}
              onValueChange={(value: "with" | "without") => setUseSurferSEO(value)}
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

          <div>
            <Label>Artikel lengte <span className="text-accent">*</span></Label>
            {useSurferSEO === "with" ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="surfer" id="surfer-length" checked />
                  <Label htmlFor="surfer-length">Vanuit SurferSEO (AANBEVOLEN)</Label>
                </div>
                <Input
                  type="number"
                  value={articleLength}
                  onChange={(e) => setArticleLength(e.target.value)}
                  placeholder="Of voer zelf een aantal woorden in (300-3000)"
                  min="300"
                  max="3000"
                />
              </div>
            ) : (
              <Input
                type="number"
                value={articleLength}
                onChange={(e) => setArticleLength(e.target.value)}
                placeholder="Aantal woorden (300-3000)"
                min="300"
                max="3000"
              />
            )}
          </div>

          <div>
            <Label>Je/u vorm <span className="text-accent">*</span></Label>
            <RadioGroup
              value={formality}
              onValueChange={(value: "je" | "u") => setFormality(value)}
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

          <div>
            <Label>Doelgroep <span className="text-accent">*</span></Label>
            <RadioGroup
              value={targetAudience}
              onValueChange={(value: "business" | "consumer") => setTargetAudience(value)}
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

          <Button
            type="submit"
            className="w-full"
            disabled={createArticleMutation.isPending}
          >
            {createArticleMutation.isPending ? "Bezig met genereren..." : "Genereren"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;