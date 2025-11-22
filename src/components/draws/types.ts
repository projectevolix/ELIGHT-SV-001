
export type Tournament = {
  id: string;
  name: string;
};

export type Event = {
  id: string;
  tournamentId: string;
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