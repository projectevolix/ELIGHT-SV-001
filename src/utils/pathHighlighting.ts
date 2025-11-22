import { useState } from "react";
import type { CardPosition } from "./tournamentLayout";

export interface PathHighlight {
  cardIndices: number[];
}

/**
 * Calculates which cards should be highlighted for a given tournament path
 * @param cardIndex - Index of the hovered card
 * @param positions - Array of all card positions
 * @returns Object containing indices of cards to highlight
 */
export const calculateHighlightPath = (
  cardIndex: number,
  positions: CardPosition[]
): PathHighlight => {
  const hoveredCard = positions[cardIndex];
  if (!hoveredCard) return { cardIndices: [] };

  const cardIndices: number[] = [cardIndex];

  // Trace path forward to the final round
  let currentRound = hoveredCard.roundIndex;
  let currentMatchIndex = hoveredCard.matchIndex;
  const maxRound = Math.max(...positions.map((p) => p.roundIndex));

  while (currentRound < maxRound) {
    const nextRound = currentRound + 1;
    const nextMatchIndex = Math.floor(currentMatchIndex / 2);

    // Find the card in the next round
    const nextCardIndex = positions.findIndex(
      (p) => p.roundIndex === nextRound && p.matchIndex === nextMatchIndex
    );

    if (nextCardIndex !== -1) {
      cardIndices.push(nextCardIndex);
    }

    currentRound = nextRound;
    currentMatchIndex = nextMatchIndex;
  }

  return { cardIndices };
};

/**
 * Hook for managing path highlighting state
 */
export const usePathHighlighting = () => {
  const [highlightedPath, setHighlightedPath] = useState<PathHighlight | null>(
    null
  );

  const highlightPath = (cardIndex: number, positions: CardPosition[]) => {
    const path = calculateHighlightPath(cardIndex, positions);
    setHighlightedPath(path);
  };

  const clearHighlight = () => {
    setHighlightedPath(null);
  };

  return {
    highlightedPath,
    highlightPath,
    clearHighlight,
  };
};
