/**
 * Players API Service
 * Handles all player-related API calls
 */

import { apiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import type {
  PlayerDTO,
  CreatePlayerPayload,
  UpdatePlayerPayload,
} from "@/types/api/players";

/**
 * Create a new player
 */
export async function createPlayer(
  associationId: number,
  payload: CreatePlayerPayload
): Promise<PlayerDTO> {
  const response = await apiClient.post<PlayerDTO>(
    `${API_PATHS.PLAYERS.CREATE}?associationId=${associationId}`,
    payload
  );
  return response;
}

/**
 * Fetch all players with pagination
 */
export async function getPlayers(
  page: number = 1,
  limit: number = 10
): Promise<PlayerDTO[]> {
  const response = await apiClient.get<PlayerDTO[]>(
    `${API_PATHS.PLAYERS.LIST}?page=${page}&limit=${limit}`
  );
  return response;
}

/**
 * Fetch players for a specific association
 */
export async function getPlayersByAssociation(
  associationId: number,
  page: number = 1,
  limit: number = 10
): Promise<PlayerDTO[]> {
  const response = await apiClient.get<PlayerDTO[]>(
    `${API_PATHS.PLAYERS.BY_ASSOCIATION(
      associationId
    )}?page=${page}&limit=${limit}`
  );
  return response;
}

/**
 * Fetch a single player by ID
 */
export async function getPlayerById(id: number): Promise<PlayerDTO> {
  const response = await apiClient.get<PlayerDTO>(API_PATHS.PLAYERS.GET(id));
  return response;
}

/**
 * Update an existing player
 */
export async function updatePlayer(
  id: number,
  associationId: number,
  payload: UpdatePlayerPayload
): Promise<PlayerDTO> {
  const response = await apiClient.put<PlayerDTO>(
    `${API_PATHS.PLAYERS.UPDATE(id)}?associationId=${associationId}`,
    payload
  );
  return response;
}

/**
 * Delete a player
 */
export async function deletePlayer(id: number): Promise<void> {
  await apiClient.delete<null>(API_PATHS.PLAYERS.DELETE(id));
}
