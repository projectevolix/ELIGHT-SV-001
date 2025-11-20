import { TournamentDTO } from "./tournaments";
import { PlayerDTO } from "./players";
import { EventDTO } from "./events";

export enum RegistrationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface RegistrationDTO {
  id: number;
  tournament: TournamentDTO;
  player: PlayerDTO;
  event: EventDTO;
  status: RegistrationStatus;
  registeredBy: string;
  paymentStatus: string | null;
  createdAt: string;
}

export interface CreateRegistrationPayload {
  tournamentId: number;
  playerId: number;
  eventId: number;
  status: RegistrationStatus;
  registeredBy: string;
}

export interface UpdateRegistrationPayload
  extends Partial<CreateRegistrationPayload> {}

export interface RegistrationUpdateStatusPayload {
  status: RegistrationStatus;
}
