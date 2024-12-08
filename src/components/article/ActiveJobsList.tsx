import { Card } from "@/components/ui/card";
import { Loader2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface JobStatus {
  type: "complete" | "failed" | "running" | "pending";
  progress?: number;
  error?: string;
  lastChecked?: string;
}

// Component to show active article generation jobs
export const ActiveJobsList = () => {
  // Fetch incomplete jobs (shared with useArticleStatusCheck)
  const { data: activeJobs = [] } = useQuery({
    queryKey: ['incomplete-jobs'],
    // Data fetching handled by useArticleStatusCheck
  });

  if (!activeJobs.length) {
    return null;
  }

  const getStatusIcon = (status: JobStatus['type']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-accent animate-spin" />;
      default:
        return <Loader2 className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (job: any) => {
    if (job.error) {
      return 'Fout opgetreden';
    }
    switch (job.type) {
      case 'complete':
        return 'Voltooid';
      case 'failed':
        return 'Mislukt';
      case 'running':
        return job.progress ? `${job.progress}% voltooid` : 'Bezig...';
      default:
        return 'In wachtrij';
    }
  };

  return (
    <Card className="p-7 bg-card border border-border rounded-md">
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-2xl font-semibold flex items-center gap-2.5">
          <Loader2 className="w-7 h-7 text-accent animate-spin" />
          Actieve Taken
        </h2>
      </div>

      <div className="space-y-2.5">
        {activeJobs.map((job) => (
          <div
            key={job.job_id}
            className="p-3.5 rounded-md bg-secondary/5 hover:bg-secondary/10 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <FileText className="w-7 h-7 text-accent" />
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {job.settings?.keyword || "Artikel in verwerking"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {job.client?.name} • {formatDistanceToNow(
                      new Date(job.created_at),
                      { addSuffix: true, locale: nl }
                    )}
                  </p>
                  {job.lastChecked && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Laatst gecontroleerd: {formatDistanceToNow(
                        new Date(job.lastChecked),
                        { addSuffix: true, locale: nl }
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {job.progress !== undefined && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-500"
                          style={{ 
                            width: `${job.progress}%`,
                            backgroundColor: job.type === 'failed' ? 'rgb(239, 68, 68)' : undefined
                          }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{job.progress}% voltooid</p>
                      {job.error && <p className="text-red-500">{job.error}</p>}
                    </TooltipContent>
                  </Tooltip>
                )}
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(job.type)}
                  <span className="text-sm text-muted-foreground">
                    {getStatusText(job)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
