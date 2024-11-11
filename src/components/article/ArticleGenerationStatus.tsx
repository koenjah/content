import { useEffect, useState } from "react";
import { checkArticleStatus } from "@/services/articleGeneration";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ArticleGenerationStatusProps {
  jobIds: string[];
  clientId: string;
  onComplete: () => void;
}

export const ArticleGenerationStatus = ({ jobIds, clientId, onComplete }: ArticleGenerationStatusProps) => {
  const [completedJobs, setCompletedJobs] = useState<string[]>([]);
  const [failedJobs, setFailedJobs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAllJobs = async () => {
      try {
        const results = await Promise.all(
          jobIds.map(async (jobId) => {
            const response = await checkArticleStatus(jobId);
            return { jobId, response };
          })
        );

        for (const { jobId, response } of results) {
          if (response.type === "complete" && !completedJobs.includes(jobId)) {
            // Store the article in Supabase
            const { error } = await supabase.from("articles").insert({
              client_id: clientId,
              content: response.output,
              title: "Nieuw Artikel",
              word_count: response.output.split(" ").length
            });

            if (error) throw error;
            
            setCompletedJobs(prev => [...prev, jobId]);
            toast.success(`Artikel ${completedJobs.length + 1}/${jobIds.length} succesvol gegenereerd!`);
          } else if (response.type === "failed" && !failedJobs.includes(jobId)) {
            setFailedJobs(prev => [...prev, jobId]);
            toast.error(`Artikel generatie mislukt voor job ${jobId}`);
          }
        }

        // Check if all jobs are completed or failed
        const allJobsProcessed = results.every(
          ({ jobId }) => completedJobs.includes(jobId) || failedJobs.includes(jobId)
        );

        if (allJobsProcessed) {
          if (failedJobs.length === 0) {
            onComplete();
          }
        } else {
          // Check again in 10 seconds if not all jobs are processed
          setTimeout(checkAllJobs, 10000);
        }
      } catch (error) {
        console.error("Error checking article status:", error);
        toast.error("Er is een fout opgetreden bij het controleren van de artikel status");
      }
    };

    checkAllJobs();
  }, [jobIds, clientId, completedJobs, failedJobs, onComplete]);

  if (completedJobs.length < jobIds.length && failedJobs.length < jobIds.length) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          Artikelen worden gegenereerd... ({completedJobs.length}/{jobIds.length} voltooid)
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Dit kan tot 20 minuten per artikel duren.
        </p>
      </div>
    );
  }

  if (failedJobs.length > 0) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          {failedJobs.length === jobIds.length 
            ? "Alle artikel generaties zijn mislukt"
            : `${failedJobs.length} artikel(en) zijn mislukt, ${completedJobs.length} succesvol gegenereerd`}
        </p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Terug naar dashboard
        </Button>
      </div>
    );
  }

  return null;
};