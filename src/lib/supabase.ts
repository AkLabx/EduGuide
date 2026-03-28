import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://fqhiqhovccxclrdljaoe.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HiaRyakJpYe8JprJ0UTaQg_p-A_wjms';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
