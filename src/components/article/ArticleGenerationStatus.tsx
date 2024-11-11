import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/articleWorker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Start checking articles
          registration.active?.postMessage({
            type: 'CHECK_ARTICLES',
            jobIds,
            clientId
          });

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data.type === 'ARTICLE_COMPLETE') {
              const { jobId, success } = event.data;
              if (success) {
                setCompletedJobs(prev => [...prev, jobId]);
                toast.success(`Artikel ${completedJobs.length + 1}/${jobIds.length} succesvol gegenereerd!`);
              } else {
                setFailedJobs(prev => [...prev, jobId]);
                toast.error(`Artikel generatie mislukt voor job ${jobId}`);
              }
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          toast.error("Er is een fout opgetreden bij het starten van de artikel generatie");
        });
    } else {
      toast.error("Je browser ondersteunt geen service workers. De pagina moet open blijven tijdens het genereren.");
    }

    // Cleanup
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => registration.unregister());
        });
      }
    };
  }, [jobIds, clientId]);

  // Check if all jobs are complete
  useEffect(() => {
    const allJobsProcessed = jobIds.every(
      jobId => completedJobs.includes(jobId) || failedJobs.includes(jobId)
    );

    if (allJobsProcessed && failedJobs.length === 0) {
      onComplete();
    }
  }, [completedJobs, failedJobs, jobIds, onComplete]);

  if (completedJobs.length < jobIds.length && failedJobs.length < jobIds.length) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          Artikelen worden gegenereerd... ({completedJobs.length}/{jobIds.length} voltooid)
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Je kunt deze pagina nu sluiten. Je krijgt een notificatie wanneer de artikelen klaar zijn.
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