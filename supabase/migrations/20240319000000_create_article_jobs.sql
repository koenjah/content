-- Create articles table first since it's referenced by article_jobs
create table if not exists articles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references clients(id) not null,
  content text not null,
  title text not null,
  word_count integer not null
);

-- Create article_jobs table
create table if not exists article_jobs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references clients(id) not null,
  job_id text not null,
  settings jsonb not null,
  completed boolean default false,
  article_id uuid references articles(id)
);

-- Add indexes for better query performance
create index if not exists article_jobs_client_id_idx on article_jobs(client_id);
create index if not exists article_jobs_job_id_idx on article_jobs(job_id);
create index if not exists articles_client_id_idx on articles(client_id);