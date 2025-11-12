/**
 * Associations API types
 * Request/response shapes for association CRUD endpoints
 */

import type { DateString, EntityTimestamps, EntityId } from "./common";

/**
 * Backend response shape from API
 * Maps directly to what the backend returns
 */
export interface AssociationDTO extends EntityTimestamps {
  id: EntityId;
  name: string;
  province: string;
  contactEmail: string;
  contactNumber: string;
  presidentName: string;
}

/**
 * UI/Domain model for Association
 * Mapped from AssociationDTO for consistency with UI expectations
 * e.g., contactEmail -> email, presidentName -> president
 */
export interface Association extends EntityTimestamps {
  id: EntityId;
  name: string;
  province: string;
  email: string;
  phone: string;
  president: string;
}

/**
 * Create association request payload
 */
export interface CreateAssociationRequest {
  name: string;
  province: string;
  contactEmail: string;
  contactNumber: string;
  presidentName: string;
}

/**
 * Update association request payload (same shape as create)
 */
export type UpdateAssociationRequest = Omit<CreateAssociationRequest, "id">;

/**
 * Search query parameters
 */
export interface SearchAssociationsParams {
  name: string;
}

/**
 * List associations response (array of AssociationDTO, wrapped in ApiResponse)
 */
export type ListAssociationsResponse = AssociationDTO[];

/**
 * Single association response (wrapped in ApiResponse)
 */
export type GetAssociationResponse = AssociationDTO;

/**
 * Create association response (wrapped in ApiResponse)
 */
export type CreateAssociationResponse = AssociationDTO;

/**
 * Update association response (wrapped in ApiResponse)
 */
export type UpdateAssociationResponse = AssociationDTO;

/**
 * Mapper function to convert DTO to UI model
 */
export function mapAssociationDtoToModel(dto: AssociationDTO): Association {
  return {
    id: dto.id,
    name: dto.name,
    province: dto.province,
    email: dto.contactEmail,
    phone: dto.contactNumber,
    president: dto.presidentName,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * Batch mapper for arrays
 */
export function mapAssociationDtosToModels(
  dtos: AssociationDTO[]
): Association[] {
  return dtos.map(mapAssociationDtoToModel);
}

/**
 * Mapper to convert UI model back to request shape (for create/update)
 */
export function mapModelToRequest(
  model: Partial<Association>
): Partial<CreateAssociationRequest> {
  return {
    name: model.name,
    province: model.province,
    contactEmail: model.email,
    contactNumber: model.phone,
    presidentName: model.president,
  };
}
