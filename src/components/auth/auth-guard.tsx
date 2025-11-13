/**
 * Auth Guard component
 * Protects pages/components that require authentication
 * Redirects unauthenticated users to login
 */

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuthSession();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Redirect to login if not authenticated
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            fallback || (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            )
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
