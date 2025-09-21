import { createClient } from '@supabase/supabase-js';

// Browser/client-side singleton (use only in components or hooks)
// Note: Auth not yet integrated; this is a placeholder for future session usage.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    // Soft warning to avoid hard crash in non-PM areas of the app pre-integration.
    // eslint-disable-next-line no-console
    console.warn('[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY (expected during early Phase 1).');
}

export const supabaseClient = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
    : undefined;

export type SupabaseClientType = typeof supabaseClient;
