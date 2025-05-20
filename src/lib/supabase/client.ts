import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from './config';
import { useAuth } from '@clerk/nextjs';

export const createClient = () => {
  const { url, anonKey } = getSupabaseConfig();
  const { getToken } = useAuth();

  return createBrowserClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  });
};
