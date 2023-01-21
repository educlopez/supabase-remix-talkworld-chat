export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          content: string
          created_at: string
          created_at_date: string
          created_at_time: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          created_at_date?: string
          created_at_time?: string
          id?: string
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_at_date?: string
          created_at_time?: string
          id?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
