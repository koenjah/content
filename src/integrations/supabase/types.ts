export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          created_at: string
          client_id: string
          content: string
          title: string
          word_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          client_id: string
          content: string
          title: string
          word_count: number
        }
        Update: {
          id?: string
          created_at?: string
          client_id?: string
          content?: string
          title?: string
          word_count?: number
        }
      }
      clients: {
        Row: {
          id: string
          created_at: string
          name: string
          dataset: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          dataset?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          dataset?: string | null
        }
      }
    }
  }
}