import { useEffect, useState } from "react";
import { checkArticleStatus } from "@/services/articleGeneration";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ArticleGenerationStatusProps {
  jobIds: string[];
  clientId: string;
  onComplete: () => void;
}

// Shorter polling interval for faster updates
const POLLING_INTERVAL = 5000;
// Max retries for failed API calls
const MAX_RETRIES = 3;

export const ArticleGenerationStatus = ({ jobIds, clientId, onComplete }: ArticleGenerationStatusProps) => {
  const [completedJobs, setCompletedJobs] = useState<string[]>([]);
  const [failedJobs, setFailedJobs] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAllJobs = async () => {
      try {
        // Check all jobs in parallel with retry tracking
        const results = await Promise.all(
          jobIds.map(async (jobId) => {
            try {
              const response = await checkArticleStatus(jobId);
              return { jobId, response, error: null };
            } catch (error) {
              return { jobId, response: null, error };
            }
          })
        );

        for (const { jobId, response, error } of results) {
          // Handle API errors with retries
          if (error) {
            const currentRetries = retryCount[jobId] || 0;
            if (currentRetries < MAX_RETRIES) {
              setRetryCount(prev => ({ ...prev, [jobId]: currentRetries + 1 }));
              continue;
            } else {
              setFailedJobs(prev => [...prev, jobId]);
              toast.error(`Artikel generatie mislukt voor job ${jobId} na ${MAX_RETRIES} pogingen`);
              continue;
            }
          }

          // Reset retry count on successful response
          if (response && retryCount[jobId]) {
            setRetryCount(prev => ({ ...prev, [jobId]: 0 }));
          }

          if (response?.type === "complete" && !completedJobs.includes(jobId)) {
            try {
              // Use a transaction to prevent race conditions
              const { data: job, error: jobError } = await supabase
                .from('article_jobs')
                .select('completed, article_id')
                .eq('job_id', jobId)
                .single();

              if (jobError) throw jobError;

              if (!job?.completed) {
                // Start a transaction
                const { data: article, error: articleError } = await supabase
                  .from('articles')
                  .insert({
                    client_id: clientId,
                    content: response.output,
                    title: response.title || "Nieuw Artikel",
                    word_count: response.output.split(/\s+/).filter(Boolean).length
                  })
                  .select()
                  .single();

                if (articleError) throw articleError;

                // Update job status within the same transaction
                const { error: updateError } = await supabase
                  .from('article_jobs')
                  .update({ 
                    completed: true,
                    article_id: article.id 
                  })
                  .eq('job_id', jobId)
                  .eq('completed', false)
                  .single();

                if (updateError) throw updateError;

                setCompletedJobs(prev => [...prev, jobId]);
                toast.success(`Artikel ${completedJobs.length + 1}/${jobIds.length} succesvol gegenereerd!`);
              }
            } catch (error) {
              console.error("Transaction error:", error);
              setFailedJobs(prev => [...prev, jobId]);
              toast.error(`Fout bij het verwerken van artikel voor job ${jobId}`);
              continue;
            }
          } else if (response?.type === "failed" && !failedJobs.includes(jobId)) {
            setFailedJobs(prev => [...prev, jobId]);
            toast.error(`Artikel generatie mislukt voor job ${jobId}: ${response.error || 'Onbekende fout'}`);
          }
        }

        // Check if all jobs are processed
        const allJobsProcessed = results.every(
          ({ jobId }) => completedJobs.includes(jobId) || failedJobs.includes(jobId)
        );

        if (allJobsProcessed) {
          if (failedJobs.length === 0) {
            onComplete();
          }
        } else {
          // Continue polling with shorter interval
          setTimeout(checkAllJobs, POLLING_INTERVAL);
        }
      } catch (error) {
        console.error("Error checking article status:", error);
        toast.error("Er is een fout opgetreden bij het controleren van de artikel status");
      }
    };

    checkAllJobs();
  }, [jobIds, clientId, completedJobs, failedJobs, onComplete, retryCount]);

  if (completedJobs.length < jobIds.length && failedJobs.length < jobIds.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-10 py-10 max-w-[1400px] mx-auto">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 text-accent hover:text-accent/90 
                     transition-colors duration-200 mb-12"
          >
            <ArrowLeft className="w-7 h-7" />
            <span className="text-lg">Terug naar dashboard</span>
          </Link>

          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4" />
            <p className="text-muted-foreground">
              Artikelen worden gegenereerd... ({completedJobs.length}/{jobIds.length} voltooid)
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Dit kan tot 20 minuten per artikel duren.
              Je kunt dit venster sluiten, de artikelen worden op de achtergrond gegenereerd.
            </p>
          </div>
        </div>
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