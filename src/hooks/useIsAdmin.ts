'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function useIsAdmin() {
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken({ template: 'supabase' });
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setIsAdmin(payload.user_metadata?.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    })();
  }, [getToken]);

  return isAdmin;
}
