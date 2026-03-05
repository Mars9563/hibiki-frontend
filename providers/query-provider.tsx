'use client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

interface QueryProviderProps {
  children: React.ReactNode;
}
export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
