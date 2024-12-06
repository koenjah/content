import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from '@/integrations/supabase/types';
import { supabase } from "@/integrations/supabase/client";
import { checkArticleStatus } from "@/services/articleGeneration";
import { toast } from "sonner";
import { ArticleContent } from "@/components/article/ArticleContent";

type Article = Database['public']['Tables']['articles']['Row'];

interface ClientArticlesProps {
  articles: Article[];
  isLoading: boolean;
}

export const ClientArticles = ({ articles, isLoading }: ClientArticlesProps) => {
  useEffect(() => {
    const checkIncompleteArticles = async () => {
      try {
        // Fetch incomplete article jobs
        const { data: incompleteJobs } = await supabase
          .from('article_jobs')
          .select('*')
          .eq('completed', false);

        if (!incompleteJobs?.length) return;

        // Check status of each incomplete job
        for (const job of incompleteJobs) {
          try {
            const status = await checkArticleStatus(job.job_id);
            
            if (status.type === "complete" && status.output) {
              // Create new article
              const { data: article, error: articleError } = await supabase
                .from('articles')
                .insert({
                  client_id: job.client_id,
                  content: status.output,
                  title: "Nieuw Artikel",
                  word_count: status.output.split(/\s+/).filter(Boolean).length
                })
                .select()
                .single();

              if (articleError) {
                console.error("Error creating article:", articleError);
                continue;
              }

              if (article) {
                // Update job status
                await supabase
                  .from('article_jobs')
                  .update({ 
                    completed: true,
                    article_id: article.id 
                  })
                  .eq('job_id', job.job_id);

                toast.success("Artikel succesvol hersteld!");
              }
            } else if (status.type === "failed") {
              // Mark job as failed
              await supabase
                .from('article_jobs')
                .update({ completed: true })
                .eq('job_id', job.job_id);

              toast.error(`Artikel generatie mislukt: ${status.error || 'Onbekende fout'}`);
            }
            // If still running, leave as is
          } catch (error) {
            console.error(`Error processing job ${job.job_id}:`, error);
          }
        }
      } catch (error) {
        console.error("Error checking incomplete articles:", error);
      }
    };

    // Run the check when component mounts
    checkIncompleteArticles();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artikelen</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading articles...</div>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="p-6 bg-background rounded-lg hover:bg-opacity-80 transition-all"
              >
                <h3 className="text-xl font-medium mb-4">{article.title}</h3>
                <ArticleContent 
                  content={article.content} 
                  className="max-h-[500px] overflow-y-auto" 
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  {article.word_count} woorden • {new Date(article.created_at).toLocaleDateString('nl-NL')}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};