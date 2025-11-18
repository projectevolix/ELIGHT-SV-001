import { apiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import {
  EventDTO,
  CreateEventPayload,
  UpdateEventPayload,
  EventStatus,
} from "@/types/api/events";

/**
 * Fetch all events with pagination
 */
export async function fetchAllEvents(
  page: number = 1,
  limit: number = 10
): Promise<EventDTO[]> {
  const response = await apiClient.get<EventDTO[]>(
    `${API_PATHS.EVENTS.LIST}?page=${page}&limit=${limit}`
  );
  return response;
}

/**
 * Fetch single event by ID
 */
export async function fetchEventById(id: number): Promise<EventDTO> {
  const response = await apiClient.get<EventDTO>(
    `${API_PATHS.EVENTS.DETAIL}/${id}`
  );
  return response;
}

/**
 * Fetch events for a specific tournament
 */
export async function fetchEventsByTournament(
  tournamentId: number,
  page: number = 1,
  limit: number = 10
): Promise<EventDTO[]> {
  const response = await apiClient.get<EventDTO[]>(
    `${API_PATHS.EVENTS.BY_TOURNAMENT}/${tournamentId}?page=${page}&limit=${limit}`
  );
  return response;
}

/**
 * Fetch events filtered by status
 */
export async function fetchEventsByStatus(
  status: EventStatus,
  page: number = 1,
  limit: number = 10
): Promise<EventDTO[]> {
  const response = await apiClient.get<EventDTO[]>(
    `${API_PATHS.EVENTS.BY_STATUS}/${status}?page=${page}&limit=${limit}`
  );
  return response;
}

/**
 * Create event for a tournament
 */
export async function createEvent(
  tournamentId: number,
  payload: CreateEventPayload
): Promise<EventDTO> {
  const response = await apiClient.post<EventDTO>(
    `${API_PATHS.EVENTS.CREATE}?tournamentId=${tournamentId}`,
    payload
  );
  return response;
}

/**
 * Update event
 */
export async function updateEvent(
  id: number,
  tournamentId: number,
  payload: UpdateEventPayload
): Promise<EventDTO> {
  const response = await apiClient.put<EventDTO>(
    `${API_PATHS.EVENTS.UPDATE}/${id}?tournamentId=${tournamentId}`,
    payload
  );
  return response;
}

/**
 * Update event status
 */
export async function updateEventStatus(
  id: number,
  status: EventStatus
): Promise<EventDTO> {
  const response = await apiClient.put<EventDTO>(
    `${API_PATHS.EVENTS.STATUS}/${id}/status?status=${status}`,
    {}
  );
  return response;
}

/**
 * Delete event
 */
export async function deleteEvent(id: number): Promise<void> {
  await apiClient.delete(`${API_PATHS.EVENTS.DELETE}/${id}`);
}
