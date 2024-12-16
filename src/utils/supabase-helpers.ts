import { PostgrestError } from '@supabase/supabase-js';

export type QueryResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export const handleQueryResponse = <T>(response: QueryResponse<T>) => {
  if (response.error) {
    console.error('Query error:', response.error);
    throw new Error(response.error.message);
  }
  return response.data;
};

export const isQueryError = (result: any): result is PostgrestError => {
  return result && 'code' in result && 'message' in result && 'details' in result;
};

export const ensureQueryResult = <T>(result: T | PostgrestError | null): T => {
  if (isQueryError(result)) {
    throw new Error(result.message);
  }
  if (!result) {
    throw new Error('No data returned from query');
  }
  return result;
};