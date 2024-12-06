const API_URL = "https://api-d7b62b.stack.tryrelevance.com/latest/studios/e6bd882c-b1a4-4d33-a9fc-4f32d7f3aa32";
const API_KEY = "fa7659c4878d-4a1f-aff2-3ea6d1ffabf9:sk-NWFjYTEyZGYtNzdkMi00M2M3LTkxZTctYjAwZmJkZTlmZTA2";

interface GenerateArticleParams {
  dataset: string;
  keyword: string;
  intern: string;
  doelgroep: string;
  schrijfstijl: string;
  words: string;
}

interface ArticleResponse {
  type: "complete" | "failed" | "running";
  output?: string;
  error?: string;
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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.job_id) {
      throw new Error("No job_id received from API");
    }

    return data.job_id;
  } catch (error) {
    console.error("Error starting article generation:", error);
    throw new Error("Failed to start article generation. Please try again.");
  }
};

export const checkArticleStatus = async (jobId: string): Promise<ArticleResponse & { title?: string }> => {
  try {
    console.log('Making API request to:', `${API_URL}/async_poll/${jobId}`);
    const response = await fetch(`${API_URL}/async_poll/${jobId}`, {
      headers: {
        "Authorization": API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as APIResponse;
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    // Validate response structure
    if (!data.type) {
      throw new Error("Invalid response format from API");
    }

    // Extract content and title from updates array
    let content: string | undefined;
    let title: string | undefined;
    
    if (data.updates?.length > 0) {
      const lastUpdate = data.updates[data.updates.length - 1];
      console.log('Last update:', JSON.stringify(lastUpdate, null, 2));
      
      if (lastUpdate.output?.output) {
        const output = lastUpdate.output.output;
        
        // Extract content from llm_2_2_answer
        if (output.llm_2_2_answer) {
          content = output.llm_2_2_answer;
          // Remove the markdown code block markers if present
          content = content.replace(/^```html\n/, '').replace(/\n```$/, '');
          console.log('Found article content:', !!content);
        }
        
        // Extract title from title_output_answer or from h1 tag in content
        if (output.title_output_answer && output.title_output_answer !== "Please provide the article text for me to extract or generate the title.") {
          title = output.title_output_answer;
        } else if (content) {
          // Try to extract title from h1 tag in content
          const h1Match = content.match(/<h1>(.*?)<\/h1>/);
          if (h1Match) {
            title = h1Match[1];
          }
        }
        console.log('Found article title:', title);
      }
    }

    // Return standardized response with title
    return {
      type: data.type,
      output: content,
      error: data.error,
      title: title
    };
  } catch (error) {
    console.error("Error checking article status:", error);
    throw new Error("Failed to check article status. Please try again.");
  }
};