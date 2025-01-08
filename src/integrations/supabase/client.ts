import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = 'https://jrnfunsgzdymrdwxztgh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybmZ1bnNnemR5bXJkd3h6dGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNTAwMjksImV4cCI6MjA0OTYyNjAyOX0.FTI-1E-0ZT5ef8U7eu8PJjNwTKQKTQK_B98iddc_MuE'

// Log Supabase initialization
console.log('[Supabase] Initializing client');

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'memories-in-a-quilt',
    },
  },
})

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

supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event, session?.user?.id)

  switch (event) {
    case 'SIGNED_OUT':
      // Clear any non-session data from localStorage if needed
      localStorage.clear()
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth'
      }
      break

    case 'SIGNED_IN':
      console.log('User signed in:', session?.user?.id)
      break

    case 'TOKEN_REFRESHED':
      console.log('Token refreshed automatically')
      break

    default:
      break
  }
})