import { supabase } from "@/integrations/supabase/client";

export const useMemorialAuth = () => {
  // During development, we'll just return the supabase instance without auth checks
  return { supabase };
};