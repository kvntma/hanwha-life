'use client';

import { useAuth } from '@/providers/auth-provider';

export function useIsAdmin() {
  const { user } = useAuth();

  // Check if user has admin flag in user_metadata
  return user?.user_metadata?.is_admin === true;
}
