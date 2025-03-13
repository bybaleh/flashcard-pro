import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          user_id: string;
        };
      };
      cards: {
        Row: {
          id: string;
          created_at: string;
          deck_id: string;
          front: string;
          back: string;
          last_reviewed: string | null;
          next_review: string | null;
          review_count: number;
          ease_factor: number;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          status: "active" | "inactive" | "cancelled";
          plan_type: "free" | "premium";
          expires_at: string | null;
          payment_id: string | null;
          amount: number | null;
          currency: string | null;
        };
      };
    };
  };
};
