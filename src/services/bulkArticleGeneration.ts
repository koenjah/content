import { startArticleGeneration } from "./articleGeneration";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/integrations/supabase/types';

type ArticleJob = Database['public']['Tables']['article_jobs']['Insert']

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

  if (keywordList.length === 0) {
    throw new Error("Geen geldige zoekwoorden gevonden");
  }

  const jobIds: string[] = [];
  const failedKeywords: string[] = [];

  for (const keyword of keywordList) {
    try {
      // Start article generation for this keyword
      const jobId = await startArticleGeneration({
        ...params,
        keyword,
      });
      
      // Store job info in database with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
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

          const { error } = await supabase
            .from('article_jobs')
            .insert(jobData);

          if (!error) {
            jobIds.push(jobId);
            break;
          }

          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error storing job data (attempt ${retryCount + 1}):`, error);
          if (retryCount === maxRetries - 1) {
            throw error;
          }
        }
      }

      // Wait before next request
      if (keywordList.indexOf(keyword) < keywordList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
      }
    } catch (error) {
      console.error(`Failed to generate article for keyword: ${keyword}`, error);
      failedKeywords.push(keyword);
    }
  }

  if (failedKeywords.length > 0) {
    throw new Error(`Artikel generatie mislukt voor de volgende zoekwoorden: ${failedKeywords.join(", ")}`);
  }

  return jobIds;
};