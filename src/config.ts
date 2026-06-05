// config.ts — Constants and configuration for Chess 3D
// Replaces config.js with Vite environment variables

export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY: string = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Build-time validation — prevents silent failures in production
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '❌ Missing Supabase environment variables.\n' +
    '   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or CI secrets.'
  );
}