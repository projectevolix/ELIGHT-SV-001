export type Tournament = {
  id: number;
  name: string;
};

export type Event = {
  id: number;
  tournamentId: number;
  name: string;
};

export type Match = {
  id: number;
  seeds: string;
  player1: string;
  player2: string;
};

export type Round = {
  name: string;
  matches: Match[];
};
