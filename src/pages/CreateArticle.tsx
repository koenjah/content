import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { ArticleGenerationStatus } from "@/components/article/ArticleGenerationStatus";
import { CreateArticleForm } from "@/components/article/CreateArticleForm";
import { generateArticlesInBulk } from "@/services/bulkArticleGeneration";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [generationJobIds, setGenerationJobIds] = useState<string[]>([]);
  const [currentClientId, setCurrentClientId] = useState<string>("");

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    }
  });

  const generateArticleMutation = useMutation({
    mutationFn: async (formData: {
      clientId: string;
      keywords: string;
      internalLinks: string;
      targetAudience: "business" | "consumer";
      formality: "je" | "u";
      articleLength: string;
    }) => {
      const client = clients.find(c => c.id === formData.clientId);
      if (!client) throw new Error("Geen client geselecteerd");

      const jobIds = await generateArticlesInBulk({
        dataset: client.dataset || "",
        keywords: formData.keywords,
        intern: formData.internalLinks,
        doelgroep: formData.targetAudience,
        schrijfstijl: formData.formality,
        words: formData.articleLength
      });

      setGenerationJobIds(jobIds);
      setCurrentClientId(formData.clientId);
    },
    onError: (error) => {
      toast.error("Error starting article generation: " + error.message);
    }
  });

  if (generationJobIds.length > 0) {
    return (
      <ArticleGenerationStatus 
        jobIds={generationJobIds}
        clientId={currentClientId}
        onComplete={() => navigate("/")}
      />
    );
  }

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
        
        <CreateArticleForm
          clients={clients}
          isSubmitting={generateArticleMutation.isPending}
          onSubmit={generateArticleMutation.mutate}
        />
      </div>
    </div>
  );
};

export default CreateArticle;