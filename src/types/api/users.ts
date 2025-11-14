/**
 * Users API types
 * Request/response shapes for user management endpoints (admin only)
 */

import type { DateString, EntityTimestamps, EntityId } from "./common";

/**
 * User roles enumeration
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

/**
 * User authentication provider type
 */
export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
}

/**
 * Backend response shape from API
 * Maps directly to what the backend returns
 */
export interface UserDTO extends EntityTimestamps {
  id: EntityId;
  name: string;
  email: string;
  imageUrl: string | null;
  emailVerified: boolean;
  role: UserRole | string;
  provider: AuthProvider | string;
  providerId: string | null;
  createdBy: string;
  updatedBy: string;
}

/**
 * UI/Domain model for User
 * Mapped from UserDTO for consistency
 */
export interface User extends EntityTimestamps {
  id: EntityId;
  name: string;
  email: string;
  imageUrl: string | null;
  emailVerified: boolean;
  role: UserRole;
  provider: AuthProvider;
  providerId: string | null;
  createdBy: string;
  updatedBy: string;
}

/**
 * List users response from API
 */
export type ListUsersResponse = UserDTO[];

/**
 * Get single user response
 */
export type GetUserResponse = UserDTO;

/**
 * Update user request payload
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  imageUrl?: string | null;
  emailVerified?: boolean;
  role?: UserRole | string;
}

/**
 * Update user response
 */
export type UpdateUserResponse = UserDTO;

/**
 * Search users query parameters
 */
export interface SearchUsersParams {
  q: string; // Search query for name or email
}

/**
 * Search users response
 */
export type SearchUsersResponse = UserDTO[];

/**
 * Current user (me) response
 */
export type GetCurrentUserResponse = UserDTO;

/**
 * DTO to Domain Model mapper
 * Converts backend UserDTO to UI User type
 */
export function mapUserDtoToModel(dto: UserDTO): User {
  return {
    ...dto,
    role: (dto.role as UserRole) || UserRole.USER,
    provider: (dto.provider as AuthProvider) || AuthProvider.LOCAL,
  };
}

/**
 * Map multiple UserDTOs to User models
 */
export function mapUserDtosToModels(dtos: UserDTO[]): User[] {
  return dtos.map(mapUserDtoToModel);
}

/**
 * Map UI User to request payload
 */
export function mapModelToRequest(
  data: Partial<User>
): Partial<UpdateUserRequest> {
  return {
    name: data.name,
    email: data.email,
    imageUrl: data.imageUrl,
    emailVerified: data.emailVerified,
    role: data.role,
  };
}
