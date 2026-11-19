import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Stateless client for server-side reads (public, RLS-protected). */
export function serverClient(accessToken?: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}

let browser: SupabaseClient | null = null;
/** Singleton client for the browser (admin page keeps its session in localStorage). */
export function browserClient(): SupabaseClient {
  browser ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browser;
}
