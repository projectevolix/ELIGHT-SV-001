'use client';

/**
 * React Query Provider
 * Client-side provider that sets up TanStack Query (v5) with sensible defaults
 *
 * USAGE:
 * Wrap your app with this provider in src/app/layout.tsx (or in a client component wrapper):
 *
 *   import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
 *   
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html>
 *         <body>
 *           <ReactQueryProvider>
 *             <ThemeProvider>
 *               {children}
 *               <Toaster />
 *             </ThemeProvider>
 *           </ReactQueryProvider>
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * For server-side prefetching with app router, see examples in individual hook files.
 */

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Create and export QueryClient with sensible defaults
 * Can be used for SSR dehydration/hydration
 */
export function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // How long data is considered fresh (in milliseconds)
                staleTime: 60 * 1000, // 1 minute
                // How long unused data remains in cache
                gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
                // Number of retries on failure
                retry: 1,
                // Retry delay with exponential backoff
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                // Disable automatic refetch on mount if data is fresh
                refetchOnMount: false,
                // Disable automatic refetch when window regains focus
                refetchOnWindowFocus: false,
                // Disable automatic refetch when reconnecting
                refetchOnReconnect: false,
            },
            mutations: {
                // Don't retry mutations by default (they should be idempotent if needed)
                retry: 0,
                // Disable throwing errors on mutation failure (handle in onError)
                throwOnError: false,
            },
        },
    });
}

let clientQueryClient: QueryClient | undefined;

/**
 * Get or create singleton QueryClient for client-side usage
 */
function getQueryClient(): QueryClient {
    if (!clientQueryClient) {
        clientQueryClient = createQueryClient();
    }
    return clientQueryClient;
}

interface ReactQueryProviderProps {
    children: ReactNode;
}

/**
 * Provider component wrapping QueryClientProvider
 * Place this at the top of your component tree
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider
            client={queryClient}
            // Disable strict mode double invocation in development
            options={{ shouldDehydrateQuery: () => true }}
        >
            {children}
        </QueryClientProvider>
    );
}
