import { useEffect, useState } from "react";
import { checkArticleStatus } from "@/services/articleGeneration";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArticleGenerationStatusProps {
  jobId: string;
  clientId: string;
  onComplete: () => void;
}

export const ArticleGenerationStatus = ({ jobId, clientId, onComplete }: ArticleGenerationStatusProps) => {
  const [status, setStatus] = useState<"pending" | "complete" | "failed">("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await checkArticleStatus(jobId);
        
        if (response.type === "complete") {
          // Store the article in Supabase
          const { error } = await supabase.from("articles").insert({
            client_id: clientId,
            content: response.output,
            title: "Nieuw Artikel", // You might want to extract this from the content
            word_count: response.output.split(" ").length
          });

          if (error) throw error;
          
          setStatus("complete");
          toast.success("Artikel succesvol gegenereerd!");
          onComplete();
        } else if (response.type === "failed") {
          setStatus("failed");
          toast.error("Artikel generatie mislukt");
        } else {
          // Check again in 10 seconds
          setTimeout(checkStatus, 10000);
        }
      } catch (error) {
        console.error("Error checking article status:", error);
        toast.error("Er is een fout opgetreden bij het controleren van de artikel status");
      }
    };

    checkStatus();
  }, [jobId, clientId, onComplete]);

  if (status === "pending") {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          Artikel wordt gegenereerd... Dit kan tot 20 minuten duren.
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">Artikel generatie is mislukt</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Terug naar dashboard
        </Button>
      </div>
    );
  }

  return null;
};