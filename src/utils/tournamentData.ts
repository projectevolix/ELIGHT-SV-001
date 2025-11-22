import type { TournamentData } from "./tournamentLayout";

// export const sampleTournamentData: TournamentData = {
//   "Round-01": [
//     {
//       seed: "1 vs 2",
//       player1: "Amal",
//       player2: "Kavindu",
//       winner: "Amal",
//       status: "finished",
//     },
//     {
//       seed: "3 vs 4",
//       player1: "Dilan",
//       player2: "Naveen",
//       winner: "Dilan",
//       status: "finished",
//     },
//     {
//       seed: "5 vs 6",
//       player1: "Sameera",
//       player2: "Ishan",
//       winner: "Sameera",
//       status: "finished",
//     },
//     {
//       seed: "BYE",
//       player1: "Tharindu",
//       isBye: true,
//       winner: "Tharindu",
//       status: "finished",
//     },
//   ],
//   "Round-02": [
//     {
//       seed: "1 vs 3",
//       player1: "Amal",
//       player2: "Dilan",
//       winner: "",
//       status: "ongoing",
//     },
//     {
//       seed: "5 vs BYE",
//       player1: "Sameera",
//       player2: "Tharindu",
//       winner: "",
//       status: "ongoing",
//     },
//   ],
//   "Round-03": [
//     {
//       seed: "Final",
//       player1: "__",
//       player2: "__",
//       winner: "",
//       status: "not-started",
//     },
//   ],
// };

export const sampleTournamentData: TournamentData = {
  "Round-01": [
    {
      seed: "1 vs 2",
      player1: "Amal",
      player2: "Kavindu",
      winner: "Amal",
      status: "finished",
    },
    {
      seed: "3 vs 4",
      player1: "Dilan",
      player2: "Naveen",
      winner: "Dilan",
      status: "finished",
    },
    {
      seed: "BYE",
      player1: "Tharindu",
      isBye: true,
      winner: "Tharindu",
      status: "finished",
    },
  ],
  "Round-02": [
    {
      seed: "1 vs 3",
      player1: "Amal",
      player2: "Dilan",
      winner: "Amal",
      status: "finished",
    },
    {
      seed: "BYE",
      player1: "Tharindu",
      isBye: true,
      winner: "Tharindu",
      status: "finished",
    },
  ],
  "Round-03": [
    {
      seed: "Final",
      player1: "Amal",
      player2: "Tharindu",
      winner: "Amal",
      status: "finished",
    },
  ],
};
