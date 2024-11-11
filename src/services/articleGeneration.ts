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

export const startArticleGeneration = async (params: GenerateArticleParams) => {
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

  const data = await response.json();
  return data.job_id;
};

export const checkArticleStatus = async (jobId: string) => {
  const response = await fetch(`${API_URL}/async_poll/${jobId}?ending_update_only=true`, {
    headers: {
      "Authorization": API_KEY
    }
  });
  return response.json();
};