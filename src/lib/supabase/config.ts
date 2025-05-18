type SupabaseConfig = {
  url: string;
  anonKey: string;
};

type SupabaseConfigs = {
  development: SupabaseConfig;
  production: SupabaseConfig;
};

export const supabaseConfig: SupabaseConfigs = {
  development: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  production: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

export const getSupabaseConfig = (): SupabaseConfig => {
  const env = process.env.NODE_ENV || 'development';
  const config = supabaseConfig[env as keyof typeof supabaseConfig];

  if (!config.url || !config.anonKey) {
    throw new Error(`Supabase ${env} configuration is missing`);
  }

  return config;
};
