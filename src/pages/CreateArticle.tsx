import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { SurferSeoToggle } from "@/components/article/SurferSeoToggle";
import { FormalityToggle } from "@/components/article/FormalityToggle";
import { TargetAudienceToggle } from "@/components/article/TargetAudienceToggle";
import { ArticleLengthInput } from "@/components/article/ArticleLengthInput";

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
