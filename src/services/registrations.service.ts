/**
 * Registrations API Service
 * Handles all registration-related API calls
 */

import { apiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import {
  RegistrationDTO,
  CreateRegistrationPayload,
  UpdateRegistrationPayload,
  RegistrationStatus,
} from "@/types/api/registrations";

/**
 * Create a new registration
 */
export async function createRegistration(
  payload: CreateRegistrationPayload
): Promise<RegistrationDTO> {
  return apiClient.post<RegistrationDTO>(
    API_PATHS.REGISTRATIONS.CREATE,
    payload
  );
}

/**
 * Fetch all registrations with pagination
 */
export async function getRegistrations(
  page: number = 1,
  limit: number = 10
): Promise<RegistrationDTO[]> {
  return apiClient.get<RegistrationDTO[]>(
    `${API_PATHS.REGISTRATIONS.LIST}?page=${page}&limit=${limit}`
  );
}

/**
 * Fetch registrations for a specific tournament
 */
export async function getRegistrationsByTournament(
  tournamentId: number,
  page: number = 1,
  limit: number = 10
): Promise<RegistrationDTO[]> {
  return apiClient.get<RegistrationDTO[]>(
    `${API_PATHS.REGISTRATIONS.BY_TOURNAMENT(
      tournamentId
    )}?page=${page}&limit=${limit}`
  );
}

/**
 * Fetch registrations for a specific player
 */
export async function getRegistrationsByPlayer(
  playerId: number,
  page: number = 1,
  limit: number = 10
): Promise<RegistrationDTO[]> {
  return apiClient.get<RegistrationDTO[]>(
    `${API_PATHS.REGISTRATIONS.BY_PLAYER(playerId)}?page=${page}&limit=${limit}`
  );
}

/**
 * Fetch registrations for a specific event
 */
export async function getRegistrationsByEvent(
  eventId: number,
  page: number = 1,
  limit: number = 10
): Promise<RegistrationDTO[]> {
  return apiClient.get<RegistrationDTO[]>(
    `${API_PATHS.REGISTRATIONS.BY_EVENT(eventId)}?page=${page}&limit=${limit}`
  );
}

/**
 * Fetch a single registration by ID
 */
export async function getRegistrationById(
  id: number
): Promise<RegistrationDTO> {
  return apiClient.get<RegistrationDTO>(API_PATHS.REGISTRATIONS.GET(id));
}

/**
 * Update a registration
 */
export async function updateRegistration(
  id: number,
  payload: UpdateRegistrationPayload
): Promise<RegistrationDTO> {
  return apiClient.put<RegistrationDTO>(
    API_PATHS.REGISTRATIONS.UPDATE(id),
    payload
  );
}

/**
 * Update registration status
 */
export async function updateRegistrationStatus(
  id: number,
  status: RegistrationStatus
): Promise<RegistrationDTO> {
  return apiClient.put<RegistrationDTO>(
    `${API_PATHS.REGISTRATIONS.UPDATE_STATUS(id)}?status=${status}`,
    {}
  );
}

/**
 * Delete a registration
 */
export async function deleteRegistration(id: number): Promise<void> {
  await apiClient.delete(API_PATHS.REGISTRATIONS.DELETE(id));
}
