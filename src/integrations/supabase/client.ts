import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jrnfunsgzdymrdwxztgh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybmZ1bnNnemR5bXJkd3h6dGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNTAwMjksImV4cCI6MjA0OTYyNjAyOX0.FTI-1E-0ZT5ef8U7eu8PJjNwTKQKTQK_B98iddc_MuE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce',
    debug: process.env.NODE_ENV === 'development',
    storageKey: 'memorial-auth-token',
    cookieOptions: {
      name: 'memorial-auth-token',
      lifetime: 60 * 60 * 24 * 7, // 7 days
      domain: window.location.hostname,
      sameSite: 'Lax',
      secure: window.location.protocol === 'https:'
    }
  }
});

// Enhanced auth state change listener with error handling
supabase.auth.onAuthStateChange(async (event, session) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth state changed:', event, session);
  }

  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    localStorage.removeItem('memorial-auth-token');
    localStorage.removeItem('memorial_data');
    window.location.href = '/auth';
  } else if (event === 'TOKEN_REFRESHED') {
    // Ensure the session is properly stored after token refresh
    if (session) {
      localStorage.setItem('memorial-auth-token', JSON.stringify(session));
    }
  }
});

// Add a helper function to check and refresh session
export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session check failed:', error.message);
      await handleSessionError();
      return null;
    }

    if (!session) {
      console.warn('No valid session found');
      await handleSessionError();
      return null;
    }

    // Attempt to refresh the session if it's close to expiring
    const expiresAt = session?.expires_at ? session.expires_at * 1000 : 0;
    const timeNow = Date.now();
    const timeUntilExpiry = expiresAt - timeNow;
    
    if (timeUntilExpiry < 60 * 1000) { // Less than 1 minute until expiry
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Session refresh failed:', refreshError.message);
        await handleSessionError();
        return null;
      }
      
      return refreshedSession;
    }

    return session;
  } catch (error) {
    console.error('Unexpected error during session check:', error);
    await handleSessionError();
    return null;
  }
};

// Helper function to handle session errors
const handleSessionError = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.clear(); // Clear any potentially corrupted data
    window.location.href = '/auth'; // Redirect to auth page
  } catch (error) {
    console.error('Error during session cleanup:', error);
    // Force reload as last resort
    window.location.reload();
  }
};