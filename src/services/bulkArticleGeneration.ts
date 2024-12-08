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
  console.log('Starting bulk article generation with params:', {
    ...params,
    dataset: params.dataset.length + ' characters',
    keywords: params.keywords.split('\n').length + ' keywords'
  });

  // Process params - set default for empty intern
  const processedParams = {
    ...params,
    intern: params.intern?.trim() || "Geen interne links" // Added null check
  };

  console.log('Processed intern parameter:', processedParams.intern);

  const keywordList = processedParams.keywords
    .split('\n')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  if (keywordList.length === 0) {
    throw new Error("Geen geldige zoekwoorden gevonden. Voer minimaal één zoekwoord in.");
  }

  const jobIds: string[] = [];
  const failedKeywords: string[] = [];

  for (const keyword of keywordList) {
    try {
      console.log(`Processing keyword (${keywordList.indexOf(keyword) + 1}/${keywordList.length}):`, keyword);

      // Start article generation for this keyword
      const jobId = await startArticleGeneration({
        ...processedParams,
        keyword,
      });
      
      // Store job info in database with retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const jobData: ArticleJob = {
            client_id: processedParams.clientId,
            job_id: jobId,
            settings: {
              keyword,
              dataset: processedParams.dataset,
              keywords: processedParams.keywords,
              intern: processedParams.intern,
              doelgroep: processedParams.doelgroep,
              schrijfstijl: processedParams.schrijfstijl,
              words: processedParams.words,
              clientId: processedParams.clientId
            },
            completed: false,
            article_id: null
          };

          const { error } = await supabase
            .from('article_jobs')
            .insert(jobData);

          if (!error) {
            console.log(`Successfully stored job data for keyword: ${keyword}`);
            jobIds.push(jobId);
            break;
          }

          console.error(`Failed to store job data (attempt ${retryCount + 1}):`, error);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Database error for keyword "${keyword}" (attempt ${retryCount + 1}):`, error);
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
      console.error(`Failed to generate article for keyword "${keyword}":`, error);
      failedKeywords.push(keyword);
    }
  }

  if (failedKeywords.length > 0) {
    throw new Error(
      `Artikel generatie mislukt voor de volgende zoekwoorden: ${failedKeywords.join(", ")}. ` +
      `${jobIds.length} van de ${keywordList.length} artikelen zijn succesvol gestart.`
    );
  }

  console.log('Bulk article generation completed successfully:', {
    totalKeywords: keywordList.length,
    successfulJobs: jobIds.length,
    jobIds
  });

  return jobIds;
};