from supabase import create_client
import json
import requests
from datetime import datetime

# Supabase configuratie
url = "https://toshxkanuhofshjqamlx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2h4a2FudWhvZnNoanFhbWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjg2MzUsImV4cCI6MjA0NjkwNDYzNX0.6Kq9D8aaHdyDUuiHFyyY5ZPNGvPltc79wanqFOnNvB0"

# Relevance AI API configuratie
RELEVANCE_API_URL = "https://api.relevanceai.com/v1/workflows/workflow_3d3e7b/triggers/async/wf_3d3e7b_trigger1/workflow-runs"

supabase = create_client(url, key)

def check_article_status(job_id: str):
    """Check de status van een artikel generatie job en toon de volledige response"""
    try:
        # Haal de job details op uit Supabase
        response = supabase.table('article_jobs').select('*').eq('job_id', job_id).execute()
        if not response.data:
            print(f"Geen job gevonden met ID: {job_id}")
            return

        job = response.data[0]
        print("\nJob details uit Supabase:")
        print(json.dumps(job, indent=2))

        # Haal de status op van Relevance AI
        status_url = f"{RELEVANCE_API_URL}/{job_id}"
        status_response = requests.get(status_url)
        status_data = status_response.json()

        print("\nVolledige response van Relevance AI:")
        print(json.dumps(status_data, indent=2))

        # Specifiek kijken naar de titel en artikel velden
        if 'results' in status_data:
            print("\nRelevante velden uit de response:")
            results = status_data['results']
            if 'llm_2_2_answer' in results:
                print("\nArtikel content (llm_2_2_answer):")
                print(results['llm_2_2_answer'][:200] + "...")  # Eerste 200 karakters
            if 'title_output_answer' in results:
                print("\nTitel (title_output_answer):")
                print(results['title_output_answer'])
            else:
                print("\nGeen title_output_answer gevonden in de response")

    except Exception as e:
        print(f"Error bij het checken van artikel status: {str(e)}")

def main():
    # Haal de meest recente article_job op
    try:
        response = supabase.table('article_jobs').select('*').order('created_at', desc=True).limit(1).execute()
        if response.data:
            job = response.data[0]
            print(f"Meest recente job gevonden: {job['job_id']}")
            print("Details ophalen...")
            
            # Gebruik deze job_id om de status te checken
            check_article_status(job['job_id'])
        else:
            print("Geen article jobs gevonden")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
