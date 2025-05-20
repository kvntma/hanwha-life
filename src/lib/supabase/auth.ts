// import { auth } from '@clerk/nextjs/server';

// export async function getUserRole() {
//   const { userId, sessionClaims } = await auth();
//   if (!userId) return null;

//   console.log('Session claims:', sessionClaims);
//   console.log('User ID:', userId);

//   // Get the user's role from JWT claims
//   return (sessionClaims?.role as string) || 'authenticated';
// }

import { createClient } from './server';
import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from './config';

export async function getSupabaseJWTClaims() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user from Supabase:', error);
    return null;
  }

  // The JWT claims are in the user's app_metadata and user_metadata
  return {
    role: user?.app_metadata?.role,
    email: user?.email,
    firstName: user?.user_metadata?.first_name,
    lastName: user?.user_metadata?.last_name,
    userId: user?.id,
  };
}

// Client-side function to get and log JWT claims
export async function logJWTClaimsClient() {
  const { url, anonKey } = getSupabaseConfig();
  const supabase = createBrowserClient(url, anonKey);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user from Supabase:', error);
    return;
  }

  console.log('JWT Claims from Supabase (Client):', {
    role: user?.app_metadata?.role,
    email: user?.email,
    firstName: user?.user_metadata?.first_name,
    lastName: user?.user_metadata?.last_name,
    userId: user?.id,
  });
}
