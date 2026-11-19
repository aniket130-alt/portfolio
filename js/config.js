// Supabase project settings — Dashboard → Project Settings → API.
// The anon / publishable key is safe to put in a public site: Row Level Security
// (see supabase/schema.sql) only allows reading. NEVER put the service_role / secret key here.
// Leave these empty to show the static content written in index.html.
export const SUPABASE_URL = "";      // e.g. "https://abcdefgh.supabase.co"
export const SUPABASE_ANON_KEY = ""; // e.g. "sb_publishable_..." or "eyJhbGciOi..."
