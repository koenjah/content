import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { checkArticleStatus } from '@/services/articleGeneration';
import { toast } from 'sonner';

// Hook to check and update incomplete article jobs
export const useArticleStatusCheck = () => {
  const queryClient = useQueryClient();

  // Fetch incomplete jobs
  const { data: incompleteJobs } = useQuery({
    queryKey: ['incomplete-jobs'],
    queryFn: async () => {
      console.log('Fetching incomplete jobs...');
      const { data, error } = await supabase
        .from('article_jobs')
        .select('*')
        .eq('completed', false);

      if (error) {
        console.error('Error fetching incomplete jobs:', error);
        throw error;
      }
      console.log('Found incomplete jobs:', data);
      return data || [];
    }
  });

  useEffect(() => {
    if (!incompleteJobs?.length) {
      console.log('No incomplete jobs found');
      return;
    }

    console.log('Processing incomplete jobs:', incompleteJobs);

    // Process each incomplete job
    const processJobs = async () => {
      for (const job of incompleteJobs) {
        try {
          console.log(`Checking status for job ${job.job_id}...`);
          // Check job status
          const status = await checkArticleStatus(job.job_id);
          console.log(`Status for job ${job.job_id}:`, status);
          
          if (status.type === 'complete' && status.output) {
            console.log(`Job ${job.job_id} is complete, creating article...`);
            // Create article with title from API if available
            const { data: article, error: articleError } = await supabase
              .from('articles')
              .insert({
                client_id: job.client_id,
                content: status.output,
                title: status.title || 'Nieuw Artikel', // Use API title or fallback
                word_count: status.output.split(/\s+/).filter(Boolean).length
              })
              .select()
              .single();

            if (articleError) {
              console.error(`Error creating article for job ${job.job_id}:`, articleError);
              throw articleError;
            }

            console.log(`Article created for job ${job.job_id}, updating job status...`);
            // Update job status
            const { error: updateError } = await supabase
              .from('article_jobs')
              .update({ 
                completed: true,
                article_id: article.id 
              })
              .eq('job_id', job.job_id)
              .eq('completed', false)
              .single();

            if (updateError) {
              console.error(`Error updating job status for ${job.job_id}:`, updateError);
              throw updateError;
            }

            // Invalidate queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ['recent-articles'] });
            queryClient.invalidateQueries({ queryKey: ['client-articles'] });
            queryClient.invalidateQueries({ queryKey: ['incomplete-jobs'] });
            
            console.log(`Job ${job.job_id} processed successfully`);
            toast.success('Artikel succesvol aangemaakt!');
          } else if (status.type === 'failed') {
            console.log(`Job ${job.job_id} failed, marking as completed`);
            // Mark failed job as completed
            await supabase
              .from('article_jobs')
              .update({ completed: true })
              .eq('job_id', job.job_id);

            toast.error(`Artikel generatie mislukt: ${status.error || 'Onbekende fout'}`);
          } else {
            console.log(`Job ${job.job_id} is still running`);
          }
        } catch (error) {
          console.error(`Error processing job ${job.job_id}:`, error);
          toast.error('Er is een fout opgetreden bij het verwerken van het artikel');
        }
      }
    };

    processJobs();
  }, [incompleteJobs, queryClient]);
};
