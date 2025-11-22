import { apiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import { DrawDTO, PublishDrawPayload } from "@/types/api/draws";

/**
 * Fetch draw for a specific tournament and event
 */
export async function fetchDrawByTournamentAndEvent(
  tournamentId: number,
  eventId: number
): Promise<DrawDTO> {
  const response = await apiClient.get<DrawDTO>(
    API_PATHS.DRAWS.BY_TOURNAMENT_AND_EVENT(tournamentId, eventId)
  );
  return response;
}

/**
 * Publish a draw
 */
export async function publishDraw(
  drawId: string,
  payload?: PublishDrawPayload
): Promise<DrawDTO> {
  const response = await apiClient.post<DrawDTO>(
    API_PATHS.DRAWS.PUBLISH(drawId),
    payload || {}
  );
  return response;
}
