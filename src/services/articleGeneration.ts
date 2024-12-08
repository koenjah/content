const API_URL = "https://api-d7b62b.stack.tryrelevance.com/latest/studios/3f6edd66-6391-4621-9784-32064bc5212b";
const API_KEY = "fa7659c4878d-4a1f-aff2-3ea6d1ffabf9:sk-YmYwMDIxNzctOTY4My00MjU1LWE2NTUtZGM0ZWU2MGQ1MmNm";

interface GenerateArticleParams {
  dataset: string;
  keyword: string;
  intern: string;
  doelgroep: string;
  schrijfstijl: string;
  words: string;
}

interface ArticleResponse {
  type: "complete" | "failed" | "running" | "pending";
  output?: string;
  error?: string;
  title?: string;
  progress?: number;
  retryCount?: number;
  lastChecked?: string;
}

interface APIUpdate {
  type: string;
  output?: {
    status: string;
    errors: any[];
    output: {
      title_output_answer?: string;
      llm_2_2_answer?: string;
    };
  };
  _id: number;
}

interface APIResponse {
  type: string;
  updates?: APIUpdate[];
  error?: string;
  last_message_id?: number;
}

export const startArticleGeneration = async (params: GenerateArticleParams) => {
  try {
    // Log request params for debugging
    console.log('Starting article generation with params:', {
      ...params,
      keyword: params.keyword,
      intern: params.intern || 'Geen interne links'
    });

    const response = await fetch(`${API_URL}/trigger_async`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": API_KEY
      },
      body: JSON.stringify({
        params,
        project: "fa7659c4878d-4a1f-aff2-3ea6d1ffabf9"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(
        `API error (${response.status}): ${errorText || response.statusText}`
      );
    }

    const data = await response.json();
    if (!data.job_id) {
      console.error('Invalid API Response:', data);
      throw new Error("Geen job ID ontvangen van de API. Response: " + JSON.stringify(data));
    }

    console.log('Article generation started successfully:', {
      jobId: data.job_id,
      keyword: params.keyword
    });

    return data.job_id;
  } catch (error) {
    // Enhance error message based on error type
    let errorMessage = "Artikel generatie mislukt: ";
    if (error instanceof TypeError) {
      errorMessage += "Netwerk fout - controleer je internetverbinding";
    } else if (error instanceof Error) {
      errorMessage += error.message;
    } else {
      errorMessage += "Onbekende fout";
    }
    
    console.error("Article generation error:", {
      error,
      params: {
        ...params,
        keyword: params.keyword
      }
    });
    
    throw new Error(errorMessage);
  }
};

export const checkArticleStatus = async (jobId: string): Promise<ArticleResponse & { title?: string }> => {
  try {
    console.log('Making API request to:', `${API_URL}/async_poll/${jobId}`);
    
    // Add timestamp for tracking
    const requestTime = new Date().toISOString();
    
    const response = await fetch(`${API_URL}/async_poll/${jobId}`, {
      headers: {
        "Authorization": API_KEY
      }
    });

    if (!response.ok) {
      const errorResponse: ArticleResponse = {
        type: "failed",
        error: `API error: ${response.status} ${response.statusText}`,
        lastChecked: requestTime
      };
      console.error('API Error:', errorResponse);
      return errorResponse;
    }

    const data = await response.json() as APIResponse;
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    if (!data.type) {
      const errorResponse: ArticleResponse = {
        type: "failed",
        error: "Invalid response format from API",
        lastChecked: requestTime
      };
      console.error('Invalid Response:', errorResponse);
      return errorResponse;
    }

    // Extract content and title from updates array
    let content: string | undefined;
    let title: string | undefined;
    let progress = 0;
    
    if (data.updates?.length > 0) {
      const lastUpdate = data.updates[data.updates.length - 1];
      console.log('Last update:', JSON.stringify(lastUpdate, null, 2));
      
      // Calculate progress based on updates
      progress = Math.min(Math.round((data.updates.length / 5) * 100), 95);
      
      if (lastUpdate.output?.output) {
        const output = lastUpdate.output.output;
        progress = 100; // Set to 100 if we have output
        
        if (output.llm_2_2_answer) {
          content = output.llm_2_2_answer.replace(/^```html\n/, '').replace(/\n```$/, '');
          console.log('Found article content:', !!content);
        }
        
        if (output.title_output_answer && 
            output.title_output_answer !== "Please provide the article text for me to extract or generate the title.") {
          title = output.title_output_answer;
        } else if (content) {
          const h1Match = content.match(/<h1>(.*?)<\/h1>/);
          if (h1Match) {
            title = h1Match[1];
          }
        }
        console.log('Found article title:', title);
      }
    }

    // Return enhanced response with progress and timestamp
    const articleResponse: ArticleResponse = {
      type: data.type === "complete" ? "complete" : 
            data.type === "failed" ? "failed" : 
            content ? "complete" : "running",
      output: content,
      error: data.error,
      title: title,
      progress: progress,
      lastChecked: requestTime
    };

    console.log('Processed article status:', {
      jobId,
      type: articleResponse.type,
      progress: articleResponse.progress,
      hasContent: !!articleResponse.output,
      hasTitle: !!articleResponse.title
    });

    return articleResponse;
  } catch (error) {
    console.error("Error checking article status:", error);
    return {
      type: "failed",
      error: "Failed to check article status. Please try again.",
      progress: 0,
      lastChecked: new Date().toISOString()
    };
  }
};