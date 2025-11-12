/**
 * Query key factory
 * Composable query key builders for React Query invalidation and caching
 * Ensures consistent key shapes across the app
 *
 * Usage:
 *   useQuery({
 *     queryKey: associationKeys.list(),
 *     queryFn: () => fetchAssociations(),
 *   })
 *
 *   queryClient.invalidateQueries({ queryKey: associationKeys.lists() })
 */

export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  signup: () => [...authKeys.all, "signup"] as const,
  me: () => [...authKeys.all, "me"] as const,
} as const;

export const associationKeys = {
  all: ["associations"] as const,
  lists: () => [...associationKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    filters
      ? [...associationKeys.lists(), filters]
      : ([...associationKeys.lists()] as const),
  searches: () => [...associationKeys.all, "search"] as const,
  search: (query: string) =>
    [...associationKeys.searches(), { query }] as const,
  details: () => [...associationKeys.all, "detail"] as const,
  detail: (id: string | number) => [...associationKeys.details(), id] as const,
  provinces: () => [...associationKeys.all, "province"] as const,
  province: (province: string) =>
    [...associationKeys.provinces(), province] as const,
} as const;

/**
 * Helper to invalidate all association-related queries
 * Useful after mutations (create, update, delete)
 */
export function getAssociationInvalidationKeys(id?: string | number) {
  if (id) {
    return [
      associationKeys.lists(),
      associationKeys.details(),
      associationKeys.detail(id),
      associationKeys.searches(),
      associationKeys.provinces(),
    ];
  }
  return [
    associationKeys.lists(),
    associationKeys.searches(),
    associationKeys.provinces(),
  ];
}
