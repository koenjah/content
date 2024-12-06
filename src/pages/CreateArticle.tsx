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

  // Fetch clients for dropdown
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
        words: formData.articleLength,
        clientId: formData.clientId // Add the clientId parameter
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
    <div className="min-h-screen bg-background">
      <div className="px-10 py-10 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2.5 mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 text-accent hover:text-accent/90 
                      transition-colors duration-200 p-0"
          >
            <ArrowLeft className="w-7 h-7" />
            <span className="text-lg">Terug naar dashboard</span>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-foreground">Nieuw artikel maken</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-card border border-border rounded-md p-7">
            <CreateArticleForm
              clients={clients}
              isSubmitting={generateArticleMutation.isPending}
              onSubmit={generateArticleMutation.mutate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;