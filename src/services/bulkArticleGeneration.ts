import { startArticleGeneration } from "./articleGeneration";

const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconden tussen requests

export const generateArticlesInBulk = async (params: {
  dataset: string;
  keywords: string;
  intern: string;
  doelgroep: string;
  schrijfstijl: string;
  words: string;
}) => {
  const keywordList = params.keywords
    .split('\n')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  const jobIds: string[] = [];

  for (const keyword of keywordList) {
    // Start artikel generatie voor deze keyword
    const jobId = await startArticleGeneration({
      ...params,
      keyword,
    });
    
    jobIds.push(jobId);

    // Wacht even voordat we de volgende request doen
    if (keywordList.indexOf(keyword) < keywordList.length - 1) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
    }
  }

  return jobIds;
};