import { useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

export function useSupabaseClient() {
  const { getToken } = useAuth();

  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => {
        try {
          const token = await getToken({ template: 'supabase' });
          console.log('🧾 Supabase JWT:', token);
          if (token) {
            // Decode and log the JWT payload for debugging
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('🔑 JWT Payload:', payload);
          }
          return token ?? null;
        } catch (error) {
          console.error('Error getting Supabase token:', error);
          return null;
        }
      },
    }
  );

  return supabaseClient;
}
