import { startArticleGeneration } from "./articleGeneration";
import { supabase } from "@/integrations/supabase/client";

const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds between requests

export const generateArticlesInBulk = async (params: {
  dataset: string;
  keywords: string;
  intern: string;
  doelgroep: string;
  schrijfstijl: string;
  words: string;
  clientId: string; // Add clientId parameter
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
    await supabase.from("article_jobs").insert({
      client_id: params.clientId,
      job_id: jobId,
      settings: {
        ...params,
        keyword
      },
      completed: false
    });
    
    jobIds.push(jobId);

    // Wait before next request
    if (keywordList.indexOf(keyword) < keywordList.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }
  }

  return jobIds;
};