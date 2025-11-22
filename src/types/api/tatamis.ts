/**
 * Tatami Availability Status Enum
 */
export enum TatamiAvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
  BLOCKED = "BLOCKED",
}

/**
 * Tatami DTO from API
 */
export interface TatamiDTO {
  id: number;
  tournamentId: number;
  tournamentName: string;
  number: number;
  capacity: number;
  availabilityStatus: TatamiAvailabilityStatus;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
}

/**
 * Create Tatami Payload
 */
export interface CreateTatamiPayload {
  tournamentId: number;
  number: number;
  capacity: number;
  availabilityStatus: TatamiAvailabilityStatus;
}

/**
 * Update Tatami Payload
 */
export interface UpdateTatamiPayload {
  tournamentId: number;
  number: number;
  capacity: number;
  availabilityStatus: TatamiAvailabilityStatus;
}

/**
 * List Tatamis Response wrapper
 */
export interface TatamiListResponse {
  data: TatamiDTO[];
  pagination: null;
  success: boolean;
  message: string;
  httpStatus: number;
  count: number;
}

/**
 * Single Tatami Response wrapper
 */
export interface TatamiDetailResponse {
  data: TatamiDTO;
  pagination: null;
  success: boolean;
  message: string;
  httpStatus: number;
  count: number;
}
