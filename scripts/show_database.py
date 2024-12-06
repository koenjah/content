from supabase import create_client
import json
from datetime import datetime

# Supabase configuratie
url = "https://toshxkanuhofshjqamlx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2h4a2FudWhvZnNoanFhbWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjg2MzUsImV4cCI6MjA0NjkwNDYzNX0.6Kq9D8aaHdyDUuiHFyyY5ZPNGvPltc79wanqFOnNvB0"

supabase = create_client(url, key)

def print_articles():
    print("\n=== Artikelen en Titels ===")
    try:
        # Probeer eerst de articles tabel
        response = supabase.table('articles').select('*').execute()
        if response.data:
            print("\nArtikelen gevonden:")
            for article in response.data:
                print("\n" + "="*50)
                print(f"ID: {article.get('id', 'Geen ID')}")
                print(f"Titel: {article.get('title', 'Geen titel')}")
                print("\nContent:")
                print("-"*30)
                print(article.get('content', 'Geen content'))
                print("="*50)
    except Exception as e:
        print(f"Kon articles tabel niet ophalen: {str(e)}")

    try:
        # Probeer de generated_articles tabel
        response = supabase.table('generated_articles').select('*').execute()
        if response.data:
            print("\nGegenereerde artikelen gevonden:")
            for article in response.data:
                print("\n" + "="*50)
                print(f"ID: {article.get('id', 'Geen ID')}")
                print(f"Titel: {article.get('title', 'Geen titel')}")
                print("\nContent:")
                print("-"*30)
                print(article.get('content', 'Geen content'))
                print("="*50)
    except Exception as e:
        print(f"Kon generated_articles tabel niet ophalen: {str(e)}")

def main():
    print("Database Overzicht")
    print("=" * 50)
    print_articles()

if __name__ == "__main__":
    main()
