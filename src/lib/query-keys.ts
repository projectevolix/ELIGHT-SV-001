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

/**
 * Query key factory for users (admin only)
 */
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters?: Record<string, any>) =>
    filters ? [...userKeys.lists(), filters] : ([...userKeys.lists()] as const),
  searches: () => [...userKeys.all, "search"] as const,
  search: (query: string) => [...userKeys.searches(), { query }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string | number | null | undefined) =>
    id !== null && id !== undefined
      ? [...userKeys.details(), id]
      : [...userKeys.details(), "undefined"],
  me: () => [...userKeys.all, "me"] as const,
} as const;

/**
 * Helper to invalidate all user-related queries
 * Useful after mutations (update, delete)
 */
export function getUserInvalidationKeys(id?: string | number) {
  if (id) {
    return [
      userKeys.lists(),
      userKeys.details(),
      userKeys.detail(id),
      userKeys.searches(),
    ];
  }
  return [userKeys.lists(), userKeys.searches()];
}

/**
 * Query key factory for tournaments
 */
export const tournamentKeys = {
  all: ["tournaments"] as const,
  lists: () => [...tournamentKeys.all, "list"] as const,
  list: (page: number = 1, limit: number = 10) =>
    [...tournamentKeys.lists(), { page, limit }] as const,
  details: () => [...tournamentKeys.all, "detail"] as const,
  detail: (id: string | number | null | undefined) =>
    id !== null && id !== undefined
      ? [...tournamentKeys.details(), id]
      : [...tournamentKeys.details(), "undefined"],
  byStatus: () => [...tournamentKeys.all, "status"] as const,
  status: (status: string, page: number = 1, limit: number = 10) =>
    [...tournamentKeys.byStatus(), { status, page, limit }] as const,
  byDateRange: () => [...tournamentKeys.all, "dateRange"] as const,
  dateRange: (
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 10
  ) =>
    [
      ...tournamentKeys.byDateRange(),
      { startDate, endDate, page, limit },
    ] as const,
  byFilter: () => [...tournamentKeys.all, "filter"] as const,
  filter: (
    filters: Record<string, any>,
    page: number = 1,
    limit: number = 10
  ) => [...tournamentKeys.byFilter(), { ...filters, page, limit }] as const,
} as const;

/**
 * Helper to invalidate all tournament-related queries
 * Useful after mutations (create, update, delete, status change)
 */
export function getTournamentInvalidationKeys(
  id?: string | number,
  status?: string,
  dateRange?: { startDate: string; endDate: string }
) {
  const keys: any[] = [
    tournamentKeys.lists(),
    tournamentKeys.byStatus(),
    tournamentKeys.byDateRange(),
    tournamentKeys.byFilter(),
  ];

  if (id) {
    keys.push(tournamentKeys.details(), tournamentKeys.detail(id));
  }

  if (status) {
    keys.push(tournamentKeys.byStatus());
  }

  if (dateRange) {
    keys.push(tournamentKeys.byDateRange());
  }

  return keys;
}

/**
 * Query key factory for events
 */
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (page: number = 1, limit: number = 10) =>
    [...eventKeys.lists(), { page, limit }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string | number | null | undefined) =>
    id !== null && id !== undefined
      ? [...eventKeys.details(), id]
      : [...eventKeys.details(), "undefined"],
  byTournament: (tournamentId: number) =>
    [...eventKeys.all, "tournament", tournamentId] as const,
  byTournamentList: (
    tournamentId: number,
    page: number = 1,
    limit: number = 10
  ) => [...eventKeys.byTournament(tournamentId), { page, limit }] as const,
  byStatus: () => [...eventKeys.all, "status"] as const,
  status: (status: string, page: number = 1, limit: number = 10) =>
    [...eventKeys.byStatus(), { status, page, limit }] as const,
} as const;

/**
 * Helper to invalidate all event-related queries
 * Useful after mutations (create, update, delete, status change)
 */
export function getEventInvalidationKeys(tournamentId?: number) {
  const keys: any[] = [eventKeys.lists(), eventKeys.byStatus()];

  if (tournamentId) {
    keys.push(eventKeys.byTournament(tournamentId));
  }

  return keys;
}

/**
 * Query key factory for coaches
 */
export const coachKeys = {
  all: ["coaches"] as const,
  lists: () => [...coachKeys.all, "list"] as const,
  list: (page: number = 1, limit: number = 10) =>
    [...coachKeys.lists(), { page, limit }] as const,
  details: () => [...coachKeys.all, "detail"] as const,
  detail: (id: string | number | null | undefined) =>
    id !== null && id !== undefined
      ? [...coachKeys.details(), id]
      : [...coachKeys.details(), "undefined"],
  byAssociation: (associationId: number) =>
    [...coachKeys.all, "association", associationId] as const,
  byAssociationList: (
    associationId: number,
    page: number = 1,
    limit: number = 10
  ) => [...coachKeys.byAssociation(associationId), { page, limit }] as const,
} as const;

/**
 * Helper to invalidate all coach-related queries
 * Useful after mutations (create, update, delete)
 */
export function getCoachInvalidationKeys(associationId?: number) {
  const keys: any[] = [coachKeys.lists()];

  if (associationId) {
    keys.push(
      coachKeys.byAssociation(associationId),
      coachKeys.byAssociationList(associationId)
    );
  }

  return keys;
}

/**
 * Query key factory for players
 */
export const playerKeys = {
  all: ["players"] as const,
  lists: () => [...playerKeys.all, "list"] as const,
  list: (page: number = 1, limit: number = 10) =>
    [...playerKeys.lists(), { page, limit }] as const,
  details: () => [...playerKeys.all, "detail"] as const,
  detail: (id: string | number | null | undefined) =>
    id !== null && id !== undefined
      ? [...playerKeys.details(), id]
      : [...playerKeys.details(), "undefined"],
  byAssociation: (associationId: number) =>
    [...playerKeys.all, "association", associationId] as const,
  byAssociationList: (
    associationId: number,
    page: number = 1,
    limit: number = 10
  ) => [...playerKeys.byAssociation(associationId), { page, limit }] as const,
} as const;

/**
 * Helper to invalidate all player-related queries
 * Useful after mutations (create, update, delete)
 */
export function getPlayerInvalidationKeys(associationId?: number) {
  const keys: any[] = [playerKeys.lists()];

  if (associationId) {
    keys.push(
      playerKeys.byAssociation(associationId),
      playerKeys.byAssociationList(associationId)
    );
  }

  return keys;
}

/**
 * Query key factory for registrations
 */
export const registrationKeys = {
  all: ["registrations"] as const,
  lists: () => [...registrationKeys.all, "list"] as const,
  list: (page: number = 1, limit: number = 10) =>
    [...registrationKeys.lists(), { page, limit }] as const,
  details: () => [...registrationKeys.all, "detail"] as const,
  detail: (id: string | number | null | undefined) =>
    id !== null && id !== undefined
      ? [...registrationKeys.details(), id]
      : [...registrationKeys.details(), "undefined"],
  byTournament: (tournamentId: number) =>
    [...registrationKeys.all, "tournament", tournamentId] as const,
  byTournamentList: (
    tournamentId: number,
    page: number = 1,
    limit: number = 10
  ) =>
    [...registrationKeys.byTournament(tournamentId), { page, limit }] as const,
  byPlayer: (playerId: number) =>
    [...registrationKeys.all, "player", playerId] as const,
  byPlayerList: (playerId: number, page: number = 1, limit: number = 10) =>
    [...registrationKeys.byPlayer(playerId), { page, limit }] as const,
  byEvent: (eventId: number) =>
    [...registrationKeys.all, "event", eventId] as const,
  byEventList: (eventId: number, page: number = 1, limit: number = 10) =>
    [...registrationKeys.byEvent(eventId), { page, limit }] as const,
} as const;

/**
 * Helper to invalidate all registration-related queries
 * Useful after mutations (create, update, delete, status change)
 */
export function getRegistrationInvalidationKeys(
  tournamentId?: number,
  playerId?: number,
  eventId?: number
) {
  const keys: any[] = [registrationKeys.lists()];

  if (tournamentId) {
    keys.push(
      registrationKeys.byTournament(tournamentId),
      registrationKeys.byTournamentList(tournamentId)
    );
  }

  if (playerId) {
    keys.push(
      registrationKeys.byPlayer(playerId),
      registrationKeys.byPlayerList(playerId)
    );
  }

  if (eventId) {
    keys.push(
      registrationKeys.byEvent(eventId),
      registrationKeys.byEventList(eventId)
    );
  }

  return keys;
}
