'use client';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function DebugToken() {
  const { getToken } = useAuth();

  useEffect(() => {
    (async () => {
      const token = await getToken({ template: 'supabase' });
      if (token) {
        console.log(JSON.parse(atob(token.split('.')[1])));
      }
    })();
  }, []);

  return <div>Check the console for your JWT</div>;
}
