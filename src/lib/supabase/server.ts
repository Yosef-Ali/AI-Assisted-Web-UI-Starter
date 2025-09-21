import { createClient } from '@supabase/supabase-js';

// Server-side (Route handlers / scripts) using service role key when available.
// DO NOT expose service role key to the browser.
const serviceUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // optional in Phase 1 (no auth/RLS yet)

if (!serviceUrl) {
    // eslint-disable-next-line no-console
    console.warn('[supabase] Missing SUPABASE_URL; server client disabled.');
}

export function getServiceClient() {
    if (!serviceUrl || !serviceKey) return undefined;
    return createClient(serviceUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}
