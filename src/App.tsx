import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css'
import { Suspense } from 'react';
import AppRoutes from '@/route';
import { Toaster } from "@/components/ui/sonner"

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {

  return (
    <>
      <Suspense fallback={<div className="">Loading...</div>}>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster />
        </QueryClientProvider>
      </Suspense>
    </>
  )
}

export default App
