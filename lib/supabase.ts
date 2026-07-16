import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  plan: 'free' | 'pro'
  searches_used: number
  searches_limit: number
  created_at: string
}

// SQL para crear las tablas en Supabase:
// CREATE TABLE users (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   email TEXT UNIQUE NOT NULL,
//   plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
//   searches_used INT DEFAULT 0,
//   searches_limit INT DEFAULT 3,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE search_history (
//   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   query TEXT NOT NULL,
//   country TEXT NOT NULL,
//   result_count INT,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
