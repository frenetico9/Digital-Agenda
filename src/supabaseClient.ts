
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Values from user's .env.local (also used as hardcoded fallbacks)
const FALLBACK_SUPABASE_URL = 'https://yxuyycpoykfjrijbrxny.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dXl5Y3BveWtmanJpamJyeG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTA5MTYsImV4cCI6MjA2NjUyNjkxNn0.O3xP-pLZ_grVRRC7R-O7dVTvaAA5jZPrumQxmH8wtT0';

let supabaseUrl: string | undefined;
let supabaseAnonKey: string | undefined;

console.log('[SupabaseClient] Initializing...');

// Attempt 1: Load from process.env (for REACT_APP_ prefixes, as per user's .env.local example)
if (typeof process !== 'undefined' && process.env) {
    console.log('[SupabaseClient] Checking process.env for REACT_APP_ variables...');
    const urlFromReactApp = process.env.REACT_APP_SUPABASE_URL;
    const keyFromReactApp = process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (urlFromReactApp) {
        supabaseUrl = urlFromReactApp;
        console.log('[SupabaseClient] Loaded REACT_APP_SUPABASE_URL from process.env.');
    } else {
        console.log('[SupabaseClient] REACT_APP_SUPABASE_URL not found in process.env.');
    }

    if (keyFromReactApp) {
        supabaseAnonKey = keyFromReactApp;
        console.log('[SupabaseClient] Loaded REACT_APP_SUPABASE_ANON_KEY from process.env.');
    } else {
        console.log('[SupabaseClient] REACT_APP_SUPABASE_ANON_KEY not found in process.env.');
    }
} else {
    console.warn('[SupabaseClient] process.env is not available. REACT_APP_ variables cannot be loaded from here.');
}

// Attempt 2: Load from import.meta.env (for VITE_ prefixes, as a secondary option)
if ((!supabaseUrl || !supabaseAnonKey) && typeof import.meta.env !== 'undefined') {
    console.log('[SupabaseClient] Checking import.meta.env for VITE_ variables as fallback...');
    const urlFromImportMeta = import.meta.env.VITE_SUPABASE_URL;
    const keyFromImportMeta = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl && urlFromImportMeta) {
        supabaseUrl = urlFromImportMeta;
        console.log('[SupabaseClient] Loaded VITE_SUPABASE_URL from import.meta.env.');
    } else if (!supabaseUrl) {
        console.log('[SupabaseClient] VITE_SUPABASE_URL not found in import.meta.env.');
    }

    if (!supabaseAnonKey && keyFromImportMeta) {
        supabaseAnonKey = keyFromImportMeta;
        console.log('[SupabaseClient] Loaded VITE_SUPABASE_ANON_KEY from import.meta.env.');
    } else if (!supabaseAnonKey) {
        console.log('[SupabaseClient] VITE_SUPABASE_ANON_KEY not found in import.meta.env.');
    }
} else if (!supabaseUrl || !supabaseAnonKey) {
     console.warn('[SupabaseClient] import.meta.env is not available or was not checked because keys already found or not needed as fallback.');
}


// Attempt 3: Use hardcoded values as a last resort
if (!supabaseUrl) {
    console.warn('[SupabaseClient] Supabase URL not found in any environment variables. Using hardcoded fallback URL.');
    supabaseUrl = FALLBACK_SUPABASE_URL;
}
if (!supabaseAnonKey) {
    console.warn('[SupabaseClient] Supabase Anon Key not found in any environment variables. Using hardcoded fallback Key.');
    supabaseAnonKey = FALLBACK_SUPABASE_ANON_KEY;
}

// Final check and client creation
if (!supabaseUrl || !supabaseAnonKey) {
  let errorMessage = '[SupabaseClient] CRITICAL: Supabase URL and/or Anon Key are definitively missing even after all fallbacks. ';
  errorMessage += `URL Found: ${!!supabaseUrl}, Key Found: ${!!supabaseAnonKey}. `;
  errorMessage += 'This indicates a severe configuration issue. ';
  errorMessage += 'Please verify your environment variables (REACT_APP_SUPABASE_URL/KEY, VITE_SUPABASE_URL/KEY) or the hardcoded fallback values in `supabaseClient.ts`.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

console.log(`[SupabaseClient] Initializing Supabase client with URL: ${supabaseUrl}`);
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
console.log('[SupabaseClient] Supabase client initialized.');
