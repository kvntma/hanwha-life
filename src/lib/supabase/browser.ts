import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseConfig } from './config';

// Fix for Node.js 25+ broken localStorage (experimental Web Storage API)
// Node 25 has localStorage as an object but getItem/setItem are undefined without --localstorage-file
const isBrokenNodeLocalStorage =
  typeof localStorage !== 'undefined' &&
  typeof localStorage.getItem !== 'function';

// Create a safe in-memory storage for SSR
const memoryStorage: Record<string, string> = {};
const safeStorage = {
  getItem: (key: string): string | null => {
    // Use real localStorage only in browser with working implementation
    if (typeof window !== 'undefined' && window.localStorage?.getItem) {
      return window.localStorage.getItem(key);
    }
    return memoryStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage?.setItem) {
      window.localStorage.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage?.removeItem) {
      window.localStorage.removeItem(key);
    } else {
      delete memoryStorage[key];
    }
  },
};

export const createClient = () => {
  const { url, anonKey } = getSupabaseConfig();

  return createBrowserClient(url, anonKey, {
    auth: {
      persistSession: true,
      storage: {
        getItem: (key) => {
          if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
            return window.localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key, value) => {
          if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
            window.localStorage.setItem(key, value);
          }
        },
        removeItem: (key) => {
          if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.removeItem === 'function') {
            window.localStorage.removeItem(key);
          }
        },
      },
    },
  });
};
