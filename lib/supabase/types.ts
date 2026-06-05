export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      conversation_sessions: {
        Row: {
          id: string;
          status: string;
          language: string;
          region: string;
          safety_flag: boolean;
          safety_reason: string | null;
          mission_priority: boolean;
          mission_priority_reason: string | null;
          context_json: Json;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          status?: string;
          language?: string;
          region?: string;
          safety_flag?: boolean;
          safety_reason?: string | null;
          mission_priority?: boolean;
          mission_priority_reason?: string | null;
          context_json?: Json;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["conversation_sessions"]["Insert"]>;
      };
      conversation_messages: {
        Row: {
          id: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          safety_flag: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          safety_flag?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversation_messages"]["Insert"]>;
      };
      guidance_results: {
        Row: {
          id: string;
          session_id: string;
          title: string;
          summary: string;
          result_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          title: string;
          summary: string;
          result_json: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["guidance_results"]["Insert"]>;
      };
      founder_alerts: {
        Row: {
          id: string;
          session_id: string | null;
          priority: "crisis" | "hoog" | "middel" | "laag";
          reason: string;
          summary: string;
          status: "open" | "bekeken" | "gesloten";
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          priority: "crisis" | "hoog" | "middel" | "laag";
          reason: string;
          summary: string;
          status?: "open" | "bekeken" | "gesloten";
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["founder_alerts"]["Insert"]>;
      };
      feedback_entries: {
        Row: {
          id: string;
          session_id: string | null;
          guidance_result_id: string | null;
          rating: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          guidance_result_id?: string | null;
          rating: string;
          note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["feedback_entries"]["Insert"]>;
      };
    };
  };
};
