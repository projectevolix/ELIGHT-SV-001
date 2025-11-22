/**
 * Draw types for tournament bracket management
 */

export enum DrawStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum DrawPolicy {
  STRICT = "STRICT",
  FLEXIBLE = "FLEXIBLE",
}

export enum BracketSize {
  AUTO = "AUTO",
  POWER_OF_2 = "POWER_OF_2",
  CUSTOM = "CUSTOM",
}

export interface MatchData {
  seed: string;
  player1: string | null;
  player2: string | null;
  winner: string;
  status: "not-started" | "in-progress" | "finished";
  isBye: boolean;
}

export interface DrawDataRounds {
  [roundName: string]: MatchData[];
}

export interface DrawData {
  rounds: DrawDataRounds;
}

export interface DrawDTO {
  id: string;
  eventId: number;
  status: DrawStatus;
  policy: DrawPolicy;
  bracketSize: BracketSize;
  seedUsed: string;
  generatedBy: string | null;
  generatedAt: string;
  publishedBy: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  drawData: DrawData;
}

export interface PublishDrawPayload {
  publishedBy?: string;
}
