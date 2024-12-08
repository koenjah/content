import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { checkArticleStatus } from '@/services/articleGeneration';
import { toast } from 'sonner';

// Hook to check and update incomplete article jobs
export const useArticleStatusCheck = () => {
  const queryClient = useQueryClient();

  // Fetch incomplete jobs with more details
  const { data: incompleteJobs } = useQuery({
    queryKey: ['incomplete-jobs'],
    queryFn: async () => {
      console.log('Fetching incomplete jobs...');
      const { data, error } = await supabase
        .from('article_jobs')
        .select(`
          *,
          client:clients(name)
        `)
        .eq('completed', false)
        .order('created_at', { ascending: true });  // Process oldest first

      if (error) {
        console.error('Error fetching incomplete jobs:', error);
        throw error;
      }
      
      // Add time in queue for each job
      return (data || []).map(job => ({
        ...job,
        timeInQueue: Date.now() - new Date(job.created_at).getTime(),
        attempts: 0, // Track retry attempts
      }));
    },
    // Poll every 30 seconds
    refetchInterval: 30000
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
          
          // Update progress in real-time
          queryClient.setQueryData(['incomplete-jobs'], (oldData: any) => {
            if (!oldData) return oldData;
            return oldData.map((j: any) => 
              j.job_id === job.job_id 
                ? { ...j, status: status.type, progress: status.progress || 0 }
                : j
            );
          });

          if (status.type === 'complete' && status.output) {
            console.log(`Job ${job.job_id} is complete, creating article...`);
            
            // First check if article already exists for this job
            const { data: existingJob } = await supabase
              .from('article_jobs')
              .select('article_id')
              .eq('job_id', job.job_id)
              .single();

            if (existingJob?.article_id) {
              console.log(`Article already exists for job ${job.job_id}, skipping creation`);
              continue;
            }

            // Create article with optimistic locking
            const { data: article, error: articleError } = await supabase
              .from('articles')
              .insert({
                client_id: job.client_id,
                content: status.output,
                title: status.title || 'Nieuw Artikel',
                word_count: status.output.split(/\s+/).filter(Boolean).length
              })
              .select()
              .single();

            if (articleError) {
              console.error(`Error creating article for job ${job.job_id}:`, articleError);
              throw articleError;
            }

            // Update job status with optimistic locking
            const { error: updateError } = await supabase
              .from('article_jobs')
              .update({ 
                completed: true,
                article_id: article.id 
              })
              .eq('job_id', job.job_id)
              .eq('completed', false)  // Optimistic lock
              .is('article_id', null)  // Ensure no article is linked yet
              .single();

            if (updateError) {
              console.error(`Error updating job status for ${job.job_id}:`, updateError);
              // Another process might have completed this job
              console.log('Checking if job was completed by another process...');
              const { data: finalJob } = await supabase
                .from('article_jobs')
                .select('completed, article_id')
                .eq('job_id', job.job_id)
                .single();

              if (finalJob?.completed) {
                console.log('Job was already completed by another process');
                continue;
              }
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
