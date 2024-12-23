// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Your actual Supabase project details
const SUPABASE_URL = 'https://jrnfunsgzdymrdwxztgh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybmZ1bnNnemR5bXJkd3h6dGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNTAwMjksImV4cCI6MjA0OTYyNjAyOX0.FTI-1E-0ZT5ef8U7eu8PJjNwTKQKTQK_B98iddc_MuE' // Public anon key from your Project Settings

/**
 * Create the Supabase client with built-in session management enabled.
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // This allows Supabase to store and refresh the session for you
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'memories-in-a-quilt',
    },
  },
})

/**
 * Check the current user session from Supabase.
 * 
 * Returns:
 * - The session object if it exists.
 * - null if there is no session or an error occurs.
 */
export const checkSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Session check failed:', error.message)
      return null
    }
    if (!session) {
      console.warn('No valid session found')
      return null
    }
    return session
  } catch (err) {
    console.error('Unexpected error during session check:', err)
    return null
  }
}

/**
 * Listen for changes to the auth state and handle them appropriately.
 */
supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event, session?.user?.id)

  switch (event) {
    case 'SIGNED_OUT':
      // Clear out local storage if needed (Supabase already removes its own session).
      localStorage.clear()

      // Redirect to the auth page unless we're *already* on it
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth'
      }
      break

    case 'SIGNED_IN':
      // When the user signs in, Supabase automatically stores the full session.
      // If you need to track additional app-level info, you can do so here:
      console.log('User signed in:', session?.user?.id)
      break

    case 'TOKEN_REFRESHED':
      // The access token has been refreshed automatically
      console.log('Token refreshed')
      break

    default:
      // Other events (e.g. PASSWORD_RECOVERY, USER_UPDATED) can be handled here if desired
      break
  }
})
