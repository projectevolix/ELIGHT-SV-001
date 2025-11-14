/**
 * Users service
 * Pure HTTP service for user management endpoints (admin only)
 * Maps backend DTOs to UI-friendly domain models
 */

import { apiClient, type ApiClient } from "@/lib/api/client";
import { API_PATHS } from "@/lib/api/config";
import type {
  User,
  UserDTO,
  UpdateUserRequest,
  SearchUsersParams,
  ListUsersResponse,
  GetUserResponse,
  UpdateUserResponse,
  SearchUsersResponse,
  GetCurrentUserResponse,
} from "@/types/api/users";
import { mapUserDtoToModel, mapUserDtosToModels } from "@/types/api/users";

/**
 * Fetch all users (admin only)
 */
export async function fetchUsers(
  client: ApiClient = apiClient
): Promise<User[]> {
  const dtos = await client.get<ListUsersResponse>(API_PATHS.USERS.LIST);
  return mapUserDtosToModels(dtos);
}

/**
 * Fetch single user by ID (admin only)
 */
export async function fetchUser(
  id: string | number,
  client: ApiClient = apiClient
): Promise<User> {
  const dto = await client.get<GetUserResponse>(API_PATHS.USERS.GET(id));
  return mapUserDtoToModel(dto);
}

/**
 * Get current authenticated user
 */
export async function fetchCurrentUser(
  client: ApiClient = apiClient
): Promise<User> {
  const dto = await client.get<GetCurrentUserResponse>(API_PATHS.USERS.ME);
  return mapUserDtoToModel(dto);
}

/**
 * Search users by name or email (admin only)
 */
export async function searchUsers(
  params: SearchUsersParams,
  client: ApiClient = apiClient
): Promise<User[]> {
  const queryString = new URLSearchParams(
    params as unknown as Record<string, string>
  ).toString();
  const dtos = await client.get<SearchUsersResponse>(
    `${API_PATHS.USERS.SEARCH}?${queryString}`
  );
  return mapUserDtosToModels(dtos);
}

/**
 * Update user (admin only)
 */
export async function updateUser(
  id: string | number,
  data: UpdateUserRequest,
  client: ApiClient = apiClient
): Promise<User> {
  const dto = await client.put<UpdateUserResponse>(
    API_PATHS.USERS.UPDATE(id),
    data
  );
  return mapUserDtoToModel(dto);
}

/**
 * Delete user (admin only)
 */
export async function deleteUser(
  id: string | number,
  client: ApiClient = apiClient
): Promise<void> {
  await client.delete(API_PATHS.USERS.DELETE(id));
}
