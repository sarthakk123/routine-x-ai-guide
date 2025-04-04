
import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For development, if the environment variables aren't available,
// we'll use placeholders that will be replaced by the actual values
// from the Lovable Supabase integration
const url = supabaseUrl || 'https://your-project.supabase.co';
const anonKey = supabaseAnonKey || 'your-anon-key';

// Create Supabase client with additional options
export const supabase = createClient(url, anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type User = {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: {
    name?: string;
  };
}
