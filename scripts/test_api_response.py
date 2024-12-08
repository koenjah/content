import json
import os
import requests
from supabase import create_client

# Supabase configuratie
url = "https://toshxkanuhofshjqamlx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2h4a2FudWhvZnNoanFhbWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjg2MzUsImV4cCI6MjA0NjkwNDYzNX0.6Kq9D8aaHdyDUuiHFyyY5ZPNGvPltc79wanqFOnNvB0"

# API configuratie
API_URL = "https://api-d7b62b.stack.tryrelevance.com/latest/studios/e6bd882c-b1a4-4d33-a9fc-4f32d7f3aa32"
API_KEY = "fa7659c4878d-4a1f-aff2-3ea6d1ffabf9:sk-NWFjYTEyZGYtNzdkMi00M2M3LTkxZTctYjAwZmJkZTlmZTA2"

if not API_KEY:
    raise ValueError("RELEVANCE_API_KEY environment variable is not set")

supabase = create_client(url, key)

def get_job_id_from_article():
    """Haal een job_id op van een bestaand artikel"""
    try:
        # Haal het meest recente voltooide artikel op
        response = supabase.table('article_jobs').select('*').eq('completed', True).limit(1).execute()
        
        if response.data:
            job = response.data[0]
            print(f"\nGevonden job_id: {job['job_id']}")
            return job['job_id']
        else:
            print("Geen voltooide artikelen gevonden")
            return None
    except Exception as e:
        print(f"Error bij ophalen job_id: {str(e)}")
        return None

def check_article_status(job_id):
    """Check de status van een artikel en toon de ruwe API response"""
    try:
        print(f"\nAPI request naar: {API_URL}/async_poll/{job_id}")
        response = requests.get(
            f"{API_URL}/async_poll/{job_id}",
            headers={
                "Authorization": API_KEY,
                "Content-Type": "application/json"
            }
        )
        
        if not response.ok:
            print(f"API error: {response.status_code} {response.reason}")
            return
        
        data = response.json()
        print("\nRuwe API response:")
        print(json.dumps(data, indent=2))
        
        # Zoek specifiek naar de velden die we nodig hebben
        if data.get('updates'):
            last_update = data['updates'][-1]
            if last_update.get('output', {}).get('output'):
                output = last_update['output']['output']
                
                print("\nRelevante velden:")
                print(f"llm_2_2_answer aanwezig: {'llm_2_2_answer' in output}")
                if 'llm_2_2_answer' in output:
                    print(f"llm_2_2_answer lengte: {len(output['llm_2_2_answer'])}")
                
                print(f"title_output_answer aanwezig: {'title_output_answer' in output}")
                if 'title_output_answer' in output:
                    print(f"title_output_answer: {output['title_output_answer']}")
                
    except Exception as e:
        print(f"Error bij checken artikel status: {str(e)}")

def main():
    print("Test script voor API response")
    job_id = get_job_id_from_article()
    
    if job_id:
        check_article_status(job_id)
    else:
        print("Kon geen job_id vinden om te testen")

if __name__ == "__main__":
    main()
