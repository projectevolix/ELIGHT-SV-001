/**
 * Event Status Enum
 */
export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  COMPLETED = "COMPLETED",
  LOCKED = "LOCKED",
  REG_CLOSED = "REG_CLOSED",
  CANCELLED = "CANCELLED",
}

/**
 * Event Type Enum
 */
export enum EventType {
  INDIVIDUAL = "INDIVIDUAL",
  TEAM = "TEAM",
}

/**
 * Discipline Enum - KATA and KUMITE
 */
export enum Discipline {
  KATA = "KATA",
  KUMITE = "KUMITE",
}

/**
 * Pagination metadata from API
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Event DTO from API
 */
export interface EventDTO {
  id: number;
  discipline: string; // KATA or KUMITE
  ageCategory: string; // U15, 12-15, etc - free text
  gender: string; // Male, Female, MALE, FEMALE - normalized to uppercase
  weightClass: string; // 50-60, 44KG, etc - free text
  eventType: EventType;
  rounds: number; // 0+
  status: EventStatus;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

/**
 * Create Event Payload
 */
export interface CreateEventPayload {
  discipline: string;
  ageCategory: string;
  gender: string;
  weightClass: string;
  eventType: EventType;
  rounds: number;
  status: EventStatus;
}

/**
 * Update Event Payload
 */
export interface UpdateEventPayload {
  discipline: string;
  ageCategory: string;
  gender: string;
  weightClass: string;
  eventType: EventType;
  rounds: number;
  status: EventStatus;
}

/**
 * Query Parameters for fetching events by tournament
 */
export interface FetchEventsByTournamentParams {
  tournamentId: number;
  page?: number;
  limit?: number;
}

/**
 * Query Parameters for fetching events by status
 */
export interface FetchEventsByStatusParams {
  status: EventStatus;
  page?: number;
  limit?: number;
}

/**
 * List Events Response wrapper
 */
export interface EventListResponse {
  data: EventDTO[];
  pagination: PaginationMetadata;
}

/**
 * Single Event Response wrapper (no pagination)
 */
export interface EventDetailResponse {
  data: EventDTO;
  pagination: null;
}
