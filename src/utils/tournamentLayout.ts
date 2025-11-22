export interface Match {
  seed: string;
  player1: string;
  player2?: string;
  winner?: string;
  isBye?: boolean;
  status?: "not-started" | "ongoing" | "finished";
}

export interface TournamentData {
  [roundKey: string]: Match[];
}

export interface CardPosition {
  x: number;
  y: number;
  match: Match;
  roundIndex: number;
  matchIndex: number;
}

export interface LayoutConfig {
  cardWidth: number;
  cardHeight: number;
  roundSpacing: number;
  matchSpacing: number;
  startX: number;
  startY: number;
}

export interface ConnectionLine {
  points: number[];
  sourceIndex: number;
  targetIndex: number;
}

export const defaultLayoutConfig: LayoutConfig = {
  cardWidth: 300,
  cardHeight: 100,
  roundSpacing: 400,
  matchSpacing: 160,
  startX: 40,
  startY: 40,
};

/**
 * Calculates positions for all tournament cards in a tree structure
 * @param tournamentData - The tournament data object
 * @param config - Layout configuration
 * @returns Array of card positions
 */
export const calculateTreePositions = (
  tournamentData: TournamentData,
  config: LayoutConfig
): CardPosition[] => {
  const rounds = Object.keys(tournamentData);
  const positions: CardPosition[] = [];
  const roundY: number[][] = [];

  rounds.forEach((roundKey, r) => {
    const matches = tournamentData[roundKey];
    const x = config.startX + r * config.roundSpacing;
    roundY[r] = [];

    matches.forEach((match, i) => {
      let y: number;

      if (r === 0) {
        y = config.startY + i * config.matchSpacing;
      } else {
        const y1 = roundY[r - 1][i * 2];
        const y2 = roundY[r - 1][i * 2 + 1];
        if (y1 === undefined || y2 === undefined) {
          y = config.startY + i * config.matchSpacing * 2;
        } else {
          y = (y1 + y2) / 2;
        }
      }

      roundY[r][i] = y;

      positions.push({
        x,
        y,
        roundIndex: r,
        matchIndex: i,
        match,
      });
    });
  });

  return positions;
};

/**
 * Calculates connecting lines between tournament rounds
 * @param positions - Array of card positions
 * @param config - Layout configuration
 * @returns Array of line point arrays
 */
export const calculateConnectingLines = (
  positions: CardPosition[],
  config: LayoutConfig
): ConnectionLine[] => {
  const groups: { [roundIndex: number]: CardPosition[] } = {};
  positions.forEach((p) => {
    if (!groups[p.roundIndex]) groups[p.roundIndex] = [];
    groups[p.roundIndex].push(p);
  });

  const totalRounds = Object.keys(groups).length;
  const lines: ConnectionLine[] = [];

  for (let r = 0; r < totalRounds - 1; r++) {
    const curr = groups[r];
    const next = groups[r + 1];

    next.forEach((n, i) => {
      const c1 = curr[i * 2];
      const c2 = curr[i * 2 + 1];
      const targetIndex = positions.indexOf(n);

      // If both parent matches exist, draw the standard bracket lines
      if (c1 && c2) {
        const x1 = c1.x + config.cardWidth;
        const x2 = c2.x + config.cardWidth;
        const xMid = x1 + (n.x - x1) / 2;

        const y1 = c1.y + config.cardHeight / 2;
        const y2 = c2.y + config.cardHeight / 2;
        const yNext = n.y + config.cardHeight / 2;

        lines.push({
          points: [x1, y1, xMid, y1, xMid, yNext, n.x, yNext],
          sourceIndex: positions.indexOf(c1),
          targetIndex,
        });
        lines.push({
          points: [x2, y2, xMid, y2, xMid, yNext, n.x, yNext],
          sourceIndex: positions.indexOf(c2),
          targetIndex,
        });
      }
      // If only one parent exists (BYE case), draw a direct line
      else if (c1) {
        const x1 = c1.x + config.cardWidth;
        const xMid = x1 + (n.x - x1) / 2;
        const y1 = c1.y + config.cardHeight / 2;
        const yNext = n.y + config.cardHeight / 2;

        lines.push({
          points: [x1, y1, xMid, y1, xMid, yNext, n.x, yNext],
          sourceIndex: positions.indexOf(c1),
          targetIndex,
        });
      }
    });
  }

  return lines;
};
