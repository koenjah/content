// Database types
type Tables = {
  articles: Article;
  clients: Client;
  article_jobs: ArticleJob;
}

// Reusable types for each table
type Article = {
  Row: {
    id: string;
    client_id: string;
    content: string;
    created_at: string;
    title: string;
    word_count: number;
  };
  Insert: Omit<Article['Row'], 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<Article['Insert']>;
};

type Client = {
  Row: {
    id: string;
    name: string;
    dataset: string;
    created_at: string;
  };
  Insert: Omit<Client['Row'], 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<Client['Insert']>;
};

type ArticleJob = {
  Row: {
    id: string;
    client_id: string;
    job_id: string;
    settings: Json;
    completed: boolean | null;
    article_id: string | null;
    created_at: string;
  };
  Insert: Omit<ArticleJob['Row'], 'id' | 'created_at'> & {
    id?: string;
    created_at?: string;
  };
  Update: Partial<ArticleJob['Insert']>;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Tables;
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};