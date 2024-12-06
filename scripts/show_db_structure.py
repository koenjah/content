from supabase import create_client
import json

# Supabase configuratie
url = "https://toshxkanuhofshjqamlx.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2h4a2FudWhvZnNoanFhbWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjg2MzUsImV4cCI6MjA0NjkwNDYzNX0.6Kq9D8aaHdyDUuiHFyyY5ZPNGvPltc79wanqFOnNvB0"

supabase = create_client(url, key)

def get_table_info(table_name):
    """Haalt informatie op over de structuur van een tabel"""
    try:
        # Haal één rij op om de kolomstructuur te zien
        response = supabase.table(table_name).select("*").limit(1).execute()
        if response.data and len(response.data) > 0:
            sample_row = response.data[0]
            print(f"\n=== Tabel: {table_name} ===")
            print("Kolommen:")
            for column, value in sample_row.items():
                data_type = type(value).__name__
                if isinstance(value, dict):
                    print(f"  - {column} (JSON)")
                    # Toon de structuur van JSON velden
                    print("    Structuur:")
                    for key, val in value.items():
                        print(f"      - {key}: {type(val).__name__}")
                else:
                    print(f"  - {column} ({data_type})")
            
            # Toon aantal rijen in de tabel
            count_response = supabase.table(table_name).select("*", count="exact").execute()
            print(f"\nAantal rijen: {len(count_response.data)}")
            
        else:
            print(f"\n=== Tabel: {table_name} ===")
            print("Tabel is leeg of niet toegankelijk")
            
    except Exception as e:
        if "42P01" in str(e):  # PostgreSQL error code voor "table does not exist"
            print(f"\nTabel '{table_name}' bestaat niet")
        else:
            print(f"\nFout bij ophalen van tabel '{table_name}': {str(e)}")

def main():
    print("=== Database Structuur Overzicht ===\n")
    
    # Lijst van mogelijke tabellen om te controleren
    tables_to_check = [
        'articles',
        'article_jobs',
        'clients',
        'jobs',
        'settings',
        'content',
        'titles',
        'generated_articles'
    ]
    
    for table in tables_to_check:
        get_table_info(table)

if __name__ == "__main__":
    main()
