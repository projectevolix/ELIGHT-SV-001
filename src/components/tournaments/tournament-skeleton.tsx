/**
 * Tournament skeleton loaders
 * Placeholder components for loading states
 */

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Skeleton for tournament card in grid view
 */
export function TournamentCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="relative h-48 w-full bg-muted">
                <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Skeleton for tournament row in list view
 */
export function TournamentRowSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8 rounded" />
        </div>
    );
}

/**
 * Skeleton grid for multiple tournament cards
 */
export function TournamentCardGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <TournamentCardSkeleton key={i} />
            ))}
        </div>
    );
}

/**
 * Skeleton list for multiple tournament rows
 */
export function TournamentRowListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="border rounded-lg divide-y">
            {Array.from({ length: count }).map((_, i) => (
                <TournamentRowSkeleton key={i} />
            ))}
        </div>
    );
}
