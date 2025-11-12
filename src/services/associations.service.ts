/**
 * Associations service
 * Pure HTTP service for association CRUD endpoints
 * Maps backend DTOs to UI-friendly domain models
 */

import { apiClient, type ApiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import type {
  Association,
  AssociationDTO,
  CreateAssociationRequest,
  UpdateAssociationRequest,
  SearchAssociationsParams,
  ListAssociationsResponse,
  GetAssociationResponse,
  CreateAssociationResponse,
  UpdateAssociationResponse,
} from "@/types/api/associations";
import {
  mapAssociationDtoToModel,
  mapAssociationDtosToModels,
  mapModelToRequest,
} from "@/types/api/associations";

/**
 * Fetch all associations
 */
export async function fetchAssociations(
  client: ApiClient = apiClient
): Promise<Association[]> {
  const dtos = await client.get<ListAssociationsResponse>(
    API_PATHS.ASSOCIATIONS.LIST
  );
  return mapAssociationDtosToModels(dtos);
}

/**
 * Search associations by name
 */
export async function searchAssociations(
  params: SearchAssociationsParams,
  client: ApiClient = apiClient
): Promise<Association[]> {
  const queryString = new URLSearchParams(
    params as unknown as Record<string, string>
  ).toString();
  const dtos = await client.get<ListAssociationsResponse>(
    `${API_PATHS.ASSOCIATIONS.SEARCH}?${queryString}`
  );
  return mapAssociationDtosToModels(dtos);
}

/**
 * Fetch single association by ID
 */
export async function fetchAssociation(
  id: string | number,
  client: ApiClient = apiClient
): Promise<Association> {
  const dto = await client.get<GetAssociationResponse>(
    API_PATHS.ASSOCIATIONS.GET(id)
  );
  return mapAssociationDtoToModel(dto);
}

/**
 * Fetch associations by province
 */
export async function fetchAssociationsByProvince(
  province: string,
  client: ApiClient = apiClient
): Promise<Association[]> {
  const dtos = await client.get<ListAssociationsResponse>(
    `${API_PATHS.ASSOCIATIONS.BY_PROVINCE}/${province}`
  );
  return mapAssociationDtosToModels(dtos);
}

/**
 * Create new association
 */
export async function createAssociation(
  data: CreateAssociationRequest,
  client: ApiClient = apiClient
): Promise<Association> {
  const dto = await client.post<CreateAssociationResponse>(
    API_PATHS.ASSOCIATIONS.CREATE,
    data
  );
  return mapAssociationDtoToModel(dto);
}

/**
 * Update association
 */
export async function updateAssociation(
  id: string | number,
  data: UpdateAssociationRequest,
  client: ApiClient = apiClient
): Promise<Association> {
  const dto = await client.put<UpdateAssociationResponse>(
    API_PATHS.ASSOCIATIONS.UPDATE(id),
    data
  );
  return mapAssociationDtoToModel(dto);
}

/**
 * Delete association
 */
export async function deleteAssociation(
  id: string | number,
  client: ApiClient = apiClient
): Promise<void> {
  await client.delete(API_PATHS.ASSOCIATIONS.DELETE(id));
}

/**
 * Helper to convert UI model to request payload
 */
export function createRequestFromModel(
  data: Partial<Association>
): Partial<CreateAssociationRequest> {
  return mapModelToRequest(data);
}
