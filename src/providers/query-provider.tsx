'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { Product } from '@/types/product';

interface QueryProviderProps {
  children: ReactNode;
  initialData?: {
    products?: Product[];
    featuredProducts?: Product[];
  };
}

export function QueryProvider({ children, initialData }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Set initial data if provided
  if (initialData?.products) {
    queryClient.setQueryData(['products'], initialData.products);
  }
  if (initialData?.featuredProducts) {
    queryClient.setQueryData(['products', 'featured'], initialData.featuredProducts);
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
