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
    storageKey: 'memorial-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'memories-in-a-quilt'
    }
  }
});

// Enhanced session management
export const checkSession = async () => {
  try {
    // First try to get the session from storage
    const storedSession = localStorage.getItem('memorial-auth-token');
    
    if (!storedSession) {
      console.log('No stored session found');
      return null;
    }

    // Get current session state
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

    return session;
  } catch (error) {
    console.error('Unexpected error during session check:', error);
    await handleSessionError();
    return null;
  }
};

// Enhanced auth state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
  
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear all local storage data on sign out
    localStorage.clear();
    window.location.href = '/auth';
  } else if (event === 'SIGNED_IN' && session) {
    // Store the session token
    localStorage.setItem('memorial-auth-token', session.access_token);
  } else if (event === 'TOKEN_REFRESHED' && session) {
    // Update stored token on refresh
    localStorage.setItem('memorial-auth-token', session.access_token);
  }
});

const handleSessionError = async () => {
  try {
    // Clear session and sign out
    await supabase.auth.signOut();
    localStorage.clear();
    
    // Only redirect if we're not already on the auth page
    if (!window.location.pathname.includes('/auth')) {
      window.location.href = '/auth';
    }
  } catch (error) {
    console.error('Error during session cleanup:', error);
    // Force a page reload as a last resort
    window.location.reload();
  }
};