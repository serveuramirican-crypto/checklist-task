import { createClient } from '@supabase/supabase-js';

function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
    if (process.env[`NEXT_PUBLIC_${key}`]) return process.env[`NEXT_PUBLIC_${key}`];
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];
  }
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (metaEnv) {
      if (metaEnv[key]) return metaEnv[key];
      if (metaEnv[`VITE_${key}`]) return metaEnv[`VITE_${key}`];
      if (metaEnv[`NEXT_PUBLIC_${key}`]) return metaEnv[`NEXT_PUBLIC_${key}`];
    }
  } catch {
    // ignore
  }
  return undefined;
}

const rawUrl =
  getEnv('SUPABASE_URL') ||
  getEnv('VITE_SUPABASE_URL') ||
  getEnv('NEXT_PUBLIC_SUPABASE_URL') ||
  'https://yyfsmcjmhrnneuwmcarr.supabase.co/rest/v1/';

const supabaseKey =
  getEnv('SUPABASE_ANON_KEY') ||
  getEnv('VITE_SUPABASE_ANON_KEY') ||
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
  getEnv('SUPABASE_PUBLISHABLE_KEY') ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZnNtY2ptaHJubmV1d21jYXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3MTk2NjcsImV4cCI6MjExMTI5NTY2N30.Kisnrg84hcgTiHvOlVoWBerF9mBe2a6GinAhzFOCR4o';

if (!rawUrl || !supabaseKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.'
  );
}

// Clean up trailing slash and /rest/v1 path if present to allow proper routing for auth/rpc
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

