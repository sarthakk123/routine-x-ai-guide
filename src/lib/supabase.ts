
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use placeholders for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://your-project-url.supabase.co' || 
    supabaseAnonKey === 'your-anon-key') {
  console.warn('Supabase environment variables are missing or using placeholders. Authentication and data operations may not work correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type { Session, User } from '@supabase/supabase-js';
