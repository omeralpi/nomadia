'use client';

import { api } from '@/lib/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import superjson from 'superjson';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error: any) => {
                    if (error?.data?.httpStatus === 401) {
                        signOut({ callbackUrl: "/" });
                        return false;
                    }
                    return failureCount < 3;
                },
            },
            mutations: {
                retry: (failureCount, error: any) => {
                    if (error?.data?.httpStatus === 401) {
                        signOut({ callbackUrl: "/" });
                        return false;
                    }
                    return failureCount < 3;
                },
            },
        },
    }));

    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                    transformer: superjson,
                }),
            ],
        })
    );

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </api.Provider>
    );
} 