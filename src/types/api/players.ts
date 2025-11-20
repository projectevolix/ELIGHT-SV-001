/**
 * Players API types
 */

export interface PlayerDTO {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string; // ISO format: "2004-05-20"
  kyuLevel: string; // e.g., "Black belt", "White belt"
  associationId: number;
  weight: number;
  photoUrl: string | null;
  email: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  createdBy: string; // email
  updatedBy: string; // email
}

export interface CreatePlayerPayload {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  kyuLevel: string;
  associationId: number;
  weight: number;
  photoUrl?: string;
  email: string;
}

export interface UpdatePlayerPayload extends Partial<CreatePlayerPayload> {}

export interface PlayerApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination: null;
  httpStatus: number;
  count: number;
}

export enum KyuLevel {
  WHITE_BELT = "White belt",
  YELLOW_BELT = "Yellow belt",
  ORANGE_BELT = "Orange belt",
  GREEN_BELT = "Green belt",
  PURPLE_BELT = "Purple belt",
  BROWN_BELT = "Brown belt",
  BLACK_BELT = "Black belt",
}

export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}
