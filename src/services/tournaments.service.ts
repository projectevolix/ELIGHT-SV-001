/**
 * Tournaments service
 * Pure HTTP service for tournament management endpoints
 * Maps backend DTOs to UI-friendly domain models
 */

import { apiClient, type ApiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import type {
  Tournament,
  TournamentDTO,
  ListTournamentsResponse,
  GetTournamentResponse,
  CreateTournamentRequest,
  CreateTournamentResponse,
  UpdateTournamentRequest,
  UpdateTournamentResponse,
  UpdateTournamentStatusRequest,
  UpdateTournamentStatusResponse,
  ResendAdminInviteResponse,
  FetchTournamentsParams,
  FetchTournamentsByStatusParams,
  FetchTournamentsByDateRangeParams,
  TournamentStatus,
} from "@/types/api/tournaments";
import {
  mapTournamentDtoToModel,
  mapTournamentDtosToModels,
} from "@/types/api/tournaments";

/**
 * Fetch all tournaments with pagination
 */
export async function fetchTournaments(
  params: FetchTournamentsParams,
  client: ApiClient = apiClient
): Promise<{ tournaments: Tournament[]; pagination: any }> {
  const response = await client.get<TournamentDTO[]>(
    `${API_PATHS.TOURNAMENTS.LIST}?page=${params.page}&limit=${params.limit}`
  );

  // API client attaches pagination to array as array.pagination for list responses
  const pagination = (response as any).pagination || {};

  return {
    tournaments: mapTournamentDtosToModels(response),
    pagination,
  };
}

/**
 * Fetch single tournament by ID
 */
export async function fetchTournament(
  id: string | number,
  client: ApiClient = apiClient
): Promise<Tournament> {
  const dto = await client.get<GetTournamentResponse>(
    API_PATHS.TOURNAMENTS.GET(id)
  );
  return mapTournamentDtoToModel(dto);
}

/**
 * Fetch tournaments filtered by status with pagination
 */
export async function fetchTournamentsByStatus(
  params: FetchTournamentsByStatusParams,
  client: ApiClient = apiClient
): Promise<{ tournaments: Tournament[]; pagination: any }> {
  const response = await client.get<TournamentDTO[]>(
    `${API_PATHS.TOURNAMENTS.BY_STATUS}/${params.status}?page=${params.page}&limit=${params.limit}`
  );

  const pagination = (response as any).pagination || {};

  return {
    tournaments: mapTournamentDtosToModels(response),
    pagination,
  };
}

/**
 * Fetch tournaments filtered by date range with pagination
 * Returns tournaments that overlap with the date range
 */
export async function fetchTournamentsByDateRange(
  params: FetchTournamentsByDateRangeParams,
  client: ApiClient = apiClient
): Promise<{ tournaments: Tournament[]; pagination: any }> {
  const response = await client.get<TournamentDTO[]>(
    `${API_PATHS.TOURNAMENTS.BY_DATE_RANGE}?start=${params.startDate}&end=${params.endDate}&page=${params.page}&limit=${params.limit}`
  );

  const pagination = (response as any).pagination || {};

  return {
    tournaments: mapTournamentDtosToModels(response),
    pagination,
  };
}

/**
 * Create a new tournament
 */
export async function createTournament(
  payload: CreateTournamentRequest,
  client: ApiClient = apiClient
): Promise<Tournament> {
  const response = await client.post<CreateTournamentResponse>(
    API_PATHS.TOURNAMENTS.CREATE,
    payload
  );
  return mapTournamentDtoToModel(response);
}

/**
 * Update an existing tournament
 */
export async function updateTournament(
  id: string | number,
  payload: UpdateTournamentRequest,
  client: ApiClient = apiClient
): Promise<Tournament> {
  const response = await client.put<UpdateTournamentResponse>(
    API_PATHS.TOURNAMENTS.UPDATE(id),
    payload
  );
  return mapTournamentDtoToModel(response);
}

/**
 * Update tournament status only
 */
export async function updateTournamentStatus(
  id: string | number,
  status: TournamentStatus,
  client: ApiClient = apiClient
): Promise<Tournament> {
  const response = await client.put<UpdateTournamentStatusResponse>(
    `${API_PATHS.TOURNAMENTS.UPDATE_STATUS(id)}?status=${status}`,
    {}
  );
  return mapTournamentDtoToModel(response);
}

/**
 * Delete a tournament
 */
export async function deleteTournament(
  id: string | number,
  client: ApiClient = apiClient
): Promise<void> {
  await client.delete<void>(API_PATHS.TOURNAMENTS.DELETE(id));
}

/**
 * Resend admin invitation email
 */
export async function resendAdminInvite(
  id: string | number,
  client: ApiClient = apiClient
): Promise<ResendAdminInviteResponse> {
  const response = await client.post<ResendAdminInviteResponse>(
    API_PATHS.TOURNAMENTS.RESEND_ADMIN_INVITE(id),
    {}
  );
  return response;
}

/**
 * Filter tournaments by multiple criteria
 */
export async function filterTournaments(
  params: any, // FetchTournamentsByFilterParams
  client: ApiClient = apiClient
): Promise<{ tournaments: Tournament[]; pagination: any }> {
  // Build query string from filter params
  const queryParams = new URLSearchParams();
  queryParams.append("page", params.page?.toString() || "1");
  queryParams.append("limit", params.limit?.toString() || "10");
  if (params.name) queryParams.append("name", params.name);
  if (params.status) queryParams.append("status", params.status);
  if (params.grade) queryParams.append("grade", params.grade);
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);
  if (params.regStartDate)
    queryParams.append("regStartDate", params.regStartDate);
  if (params.regEndDate) queryParams.append("regEndDate", params.regEndDate);

  const response = await client.get<TournamentDTO[]>(
    `${API_PATHS.TOURNAMENTS.FILTER}?${queryParams.toString()}`
  );

  const pagination = (response as any).pagination || {};

  return {
    tournaments: mapTournamentDtosToModels(response),
    pagination,
  };
}
