/**
 * Coaches API types
 */

export interface CoachDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: string; // ISO format: "2002-11-18"
  photo: string; // URL
  slkfId: string;
  wkfId: string;
  associationId: number;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  createdBy: string; // email
  updatedBy: string; // email
}

export interface CreateCoachPayload {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  photo: string;
  slkfId: string;
  wkfId: string;
}

export interface UpdateCoachPayload extends Partial<CreateCoachPayload> {}

export interface CoachApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination: null;
  httpStatus: number;
  count: number;
}
