import { apiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import {
  CoachDTO,
  CreateCoachPayload,
  UpdateCoachPayload,
  CoachApiResponse,
} from "@/types/api/coaches";

/**
 * Fetch all coaches with pagination
 */
export async function fetchAllCoaches(
  page: number = 1,
  limit: number = 10
): Promise<CoachDTO[]> {
  const response = await apiClient.get<CoachDTO[]>(
    `${API_PATHS.COACHES.LIST}?page=${page}&limit=${limit}`
  );
  return response;
}

/**
 * Fetch single coach by ID
 */
export async function fetchCoachById(id: number): Promise<CoachDTO> {
  const response = await apiClient.get<CoachDTO>(API_PATHS.COACHES.GET(id));
  return response;
}

/**
 * Fetch coaches for a specific association
 */
export async function fetchCoachesByAssociation(
  associationId: number,
  page: number = 1,
  limit: number = 10
): Promise<CoachDTO[]> {
  const response = await apiClient.get<CoachDTO[]>(
    `${API_PATHS.COACHES.BY_ASSOCIATION(
      associationId
    )}?page=${page}&limit=${limit}`
  );
  return response;
}

/**
 * Create a new coach for an association
 */
export async function createCoach(
  associationId: number,
  payload: CreateCoachPayload
): Promise<CoachDTO> {
  const response = await apiClient.post<CoachDTO>(
    `${API_PATHS.COACHES.CREATE}?associationId=${associationId}`,
    payload
  );
  return response;
}

/**
 * Update an existing coach
 */
export async function updateCoach(
  id: number,
  associationId: number,
  payload: UpdateCoachPayload
): Promise<CoachDTO> {
  const response = await apiClient.put<CoachDTO>(
    `${API_PATHS.COACHES.UPDATE(id)}?associationId=${associationId}`,
    payload
  );
  return response;
}

/**
 * Delete a coach
 */
export async function deleteCoach(id: number): Promise<void> {
  await apiClient.delete<null>(API_PATHS.COACHES.DELETE(id));
}
