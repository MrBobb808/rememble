import { supabase } from "@/integrations/supabase/client";

export const useMemorialAuth = () => {
  // During development, we'll bypass authentication
  return { supabase };
};