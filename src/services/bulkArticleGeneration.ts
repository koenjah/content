import { startArticleGeneration } from "./articleGeneration";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

type ArticleJob = Database['public']['Tables']['article_jobs']['Insert'];

const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds between requests

export const generateArticlesInBulk = async (params: {
  dataset: string;
  keywords: string;
  intern: string;
  doelgroep: string;
  schrijfstijl: string;
  words: string;
  clientId: string;
}) => {
  const keywordList = params.keywords
    .split('\n')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const jobIds: string[] = [];

  for (const keyword of keywordList) {
    // Start article generation for this keyword
    const jobId = await startArticleGeneration({
      ...params,
      keyword,
    });
    
    // Store job info in database
    const jobData: ArticleJob = {
      client_id: params.clientId,
      job_id: jobId,
      settings: {
        keyword,
        dataset: params.dataset,
        keywords: params.keywords,
        intern: params.intern,
        doelgroep: params.doelgroep,
        schrijfstijl: params.schrijfstijl,
        words: params.words,
        clientId: params.clientId
      },
      completed: false,
      article_id: null
    };

    await supabase
      .from('article_jobs')
      .insert(jobData);
    
    jobIds.push(jobId);

    // Wait before next request
    if (keywordList.indexOf(keyword) < keywordList.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }
  }

  return jobIds;
};