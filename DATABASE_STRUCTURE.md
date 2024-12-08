# Database Structure Documentation

## Overview
This document outlines the database structure for the Content Generation Tool. The database is hosted on Supabase and consists of three main tables with their relationships.

## Tables

### 1. clients
Primary table for storing client information.

```sql
CREATE TABLE clients (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    name       TEXT NOT NULL,
    dataset    TEXT NOT NULL
);
```

### 2. articles
Stores generated articles with their content and metadata.

```sql
CREATE TABLE articles (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    client_id  UUID REFERENCES clients(id),
    content    TEXT NOT NULL,
    title      TEXT NOT NULL,
    word_count INTEGER NOT NULL
);
```

### 3. article_jobs
Tracks article generation jobs and their status.

```sql
CREATE TABLE article_jobs (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    job_id     TEXT NOT NULL,
    client_id  UUID REFERENCES clients(id),
    article_id UUID REFERENCES articles(id),
    completed  BOOLEAN DEFAULT false,
    settings   JSONB NOT NULL
);
```

## Relationships

### Foreign Keys
1. `articles.client_id` → `clients.id`
   - Each article belongs to one client
   - One-to-many relationship (one client can have many articles)

2. `article_jobs.client_id` → `clients.id`
   - Each job belongs to one client
   - One-to-many relationship (one client can have many jobs)

3. `article_jobs.article_id` → `articles.id`
   - Each job can be linked to one article (when completed)
   - One-to-one relationship

## Important Fields

### clients
- `dataset`: Specifies which dataset to use for article generation
- `name`: Client's name/identifier

### articles
- `content`: The actual article content
- `title`: Article title
- `word_count`: Number of words in the article
- `client_id`: Links to the client who owns the article

### article_jobs
- `job_id`: External API job identifier
- `completed`: Job status flag
- `settings`: JSON object containing generation parameters
  ```typescript
  {
    dataset: string;
    keyword: string;
    intern: string;
    doelgroep: string;
    schrijfstijl: string;
    words: string;
  }
  ```

## Notes
1. All tables include `created_at` timestamps with UTC timezone
2. UUIDs are used as primary keys across all tables
3. The `article_jobs` table uses a boolean flag `completed` for job status tracking
4. Article content and job settings are stored as TEXT and JSONB respectively for flexibility

## Usage Patterns
1. When creating a new article:
   - First create job in `article_jobs` with completed=false
   - When job completes, create article in `articles`
   - Update `article_jobs` with article_id and completed=true

2. Querying active jobs:
   ```sql
   SELECT * FROM article_jobs 
   WHERE completed = false 
   ORDER BY created_at ASC;
   ```

3. Getting client's articles:
   ```sql
   SELECT a.* FROM articles a
   JOIN clients c ON c.id = a.client_id
   WHERE c.id = [client_id]
   ORDER BY a.created_at DESC;
   ```
