/**
 * Tournament types and DTOs
 * Defines all tournament-related API contracts and UI models
 */

/**
 * Tournament grade levels
 */
export enum TournamentGrade {
  NATIONAL = "NATIONAL",
  LOCAL = "LOCAL",
  INTERNATIONAL = "INTERNATIONAL",
  REGIONAL = "REGIONAL",
  ELITE = "ELITE",
}

/**
 * Tournament status
 */
export enum TournamentStatus {
  SCHEDULED = "SCHEDULED",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
}

/**
 * Tournament DTO - Direct mapping from API response
 * Contains all fields as returned by the backend
 */
export interface TournamentDTO {
  id: number;
  name: string;
  grade: string;
  venue: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  regStartDate: string; // ISO date string
  regEndDate: string; // ISO date string
  status: string;
  bannerUrl: string | null;
  adminId: number;
  adminName?: string; // Optional - only in list/detail responses, not in create response
  adminEmail?: string; // Optional - only in list/detail responses, not in create response
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * Tournament model - UI-friendly structure
 * Normalized field names and typed enums
 */
export interface Tournament {
  id: number;
  name: string;
  grade: TournamentGrade;
  venue: string;
  startDate: Date;
  endDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  status: TournamentStatus;
  bannerUrl: string | null;
  adminId: number;
  adminName: string;
  adminEmail: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

/**
 * Pagination metadata from API response
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
 * List tournaments response with pagination
 */
export interface ListTournamentsResponse {
  data: TournamentDTO[];
  pagination: PaginationMetadata;
}

/**
 * Get single tournament response
 */
export interface GetTournamentResponse extends TournamentDTO {}

/**
 * Create tournament request payload
 */
export interface CreateTournamentRequest {
  name: string;
  grade: TournamentGrade;
  venue: string;
  startDate: string; // ISO date format YYYY-MM-DD
  endDate: string;
  regStartDate: string;
  regEndDate: string;
  status: TournamentStatus;
  bannerUrl: string | null;
  adminId: number;
}

/**
 * Create tournament response
 */
export interface CreateTournamentResponse extends TournamentDTO {}

/**
 * Update tournament request payload
 */
export interface UpdateTournamentRequest {
  name: string;
  grade: TournamentGrade;
  venue: string;
  startDate: string;
  endDate: string;
  regStartDate: string;
  regEndDate: string;
  status: TournamentStatus;
  bannerUrl: string | null;
  adminId: number;
}

/**
 * Update tournament response
 */
export interface UpdateTournamentResponse extends TournamentDTO {}

/**
 * Update tournament status request
 */
export interface UpdateTournamentStatusRequest {
  status: TournamentStatus;
}

/**
 * Update tournament status response
 */
export interface UpdateTournamentStatusResponse extends TournamentDTO {}

/**
 * Resend admin invite response
 */
export interface ResendAdminInviteResponse {
  id: number;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  errorMessage: string | null;
  sentAt: string;
  tournamentId: number | null;
  userId: number | null;
}

/**
 * Query parameters for fetching tournaments
 */
export interface FetchTournamentsParams {
  page: number;
  limit: number;
}

/**
 * Query parameters for fetching tournaments by status
 */
export interface FetchTournamentsByStatusParams extends FetchTournamentsParams {
  status: TournamentStatus;
}

/**
 * Query parameters for fetching tournaments by date range
 */
export interface FetchTournamentsByDateRangeParams
  extends FetchTournamentsParams {
  startDate: string; // ISO date format YYYY-MM-DD
  endDate: string;
}

/**
 * Query parameters for filtering tournaments (new endpoint)
 */
export interface FetchTournamentsByFilterParams extends FetchTournamentsParams {
  name?: string;
  status?: TournamentStatus;
  grade?: TournamentGrade;
  startDate?: string; // ISO date format YYYY-MM-DD
  endDate?: string;
  regStartDate?: string;
  regEndDate?: string;
}

/**
 * Mapper: Convert DTO to UI model
 * Handles date parsing and enum conversion
 */
export function mapTournamentDtoToModel(dto: TournamentDTO): Tournament {
  return {
    id: dto.id,
    name: dto.name,
    grade: (dto.grade as TournamentGrade) || TournamentGrade.LOCAL,
    venue: dto.venue,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    registrationStartDate: new Date(dto.regStartDate),
    registrationEndDate: new Date(dto.regEndDate),
    status: (dto.status as TournamentStatus) || TournamentStatus.SCHEDULED,
    bannerUrl: dto.bannerUrl || null,
    adminId: dto.adminId,
    adminName: dto.adminName || "",
    adminEmail: dto.adminEmail || "",
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    createdBy: dto.createdBy,
    updatedBy: dto.updatedBy,
  };
}

/**
 * Mapper: Convert array of DTOs to UI models
 */
export function mapTournamentDtosToModels(dtos: TournamentDTO[]): Tournament[] {
  return dtos.map(mapTournamentDtoToModel);
}

/**
 * Mapper: Convert UI model to create request
 * Converts Date objects back to ISO strings
 */
export function mapTournamentToCreateRequest(
  tournament: Omit<
    Tournament,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  >
): CreateTournamentRequest {
  return {
    name: tournament.name,
    grade: tournament.grade,
    venue: tournament.venue,
    startDate: tournament.startDate.toISOString().split("T")[0],
    endDate: tournament.endDate.toISOString().split("T")[0],
    regStartDate: tournament.registrationStartDate.toISOString().split("T")[0],
    regEndDate: tournament.registrationEndDate.toISOString().split("T")[0],
    status: tournament.status,
    bannerUrl: tournament.bannerUrl,
    adminId: tournament.adminId,
  };
}

/**
 * Mapper: Convert UI model to update request
 */
export function mapTournamentToUpdateRequest(
  tournament: Omit<
    Tournament,
    | "createdAt"
    | "updatedAt"
    | "createdBy"
    | "updatedBy"
    | "adminName"
    | "adminEmail"
  >
): UpdateTournamentRequest {
  return {
    name: tournament.name,
    grade: tournament.grade,
    venue: tournament.venue,
    startDate: tournament.startDate.toISOString().split("T")[0],
    endDate: tournament.endDate.toISOString().split("T")[0],
    regStartDate: tournament.registrationStartDate.toISOString().split("T")[0],
    regEndDate: tournament.registrationEndDate.toISOString().split("T")[0],
    status: tournament.status,
    bannerUrl: tournament.bannerUrl,
    adminId: tournament.adminId,
  };
}
