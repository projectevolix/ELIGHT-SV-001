import { useState, useMemo } from "react";
import { useTournaments } from "@/hooks/api/useTournaments";
import { useEventsByTournament } from "@/hooks/api/useEvents";
import { useDrawByTournamentAndEvent } from "@/hooks/api/useDraws";
import { TournamentData } from "@/utils/tournamentLayout";

export function useDrawsData() {
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | null
  >(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Fetch real tournaments
  const { data: tournamentsApiData, isLoading: tournamentsLoading } =
    useTournaments(1, 100);

  const tournaments = useMemo(() => {
    if (!tournamentsApiData?.tournaments) return [];
    return tournamentsApiData.tournaments.map((t) => ({
      ...t,
      id: t.id.toString(),
    }));
  }, [tournamentsApiData]);

  // Fetch real events for selected tournament
  const tournamentIdNum = selectedTournamentId
    ? parseInt(selectedTournamentId, 10)
    : null;
  const { data: eventsApiData, isLoading: eventsLoading } =
    useEventsByTournament(tournamentIdNum, 1, 100);

  const events = useMemo(() => {
    if (!eventsApiData) return [];
    return eventsApiData.map((e) => ({
      id: e.id.toString(),
      tournamentId: selectedTournamentId || "",
      name: `${e.discipline} - ${e.ageCategory} - ${e.gender}${
        e.weightClass ? ` - ${e.weightClass}` : ""
      }`,
    }));
  }, [eventsApiData, selectedTournamentId]);

  // Fetch draw data
  const eventIdNum = selectedEventId ? parseInt(selectedEventId, 10) : null;
  const { data: drawData, isPending: drawLoading } =
    useDrawByTournamentAndEvent(tournamentIdNum, eventIdNum);

  const selectedTournament = useMemo(
    () =>
      tournaments.find((t) => t.id.toString() === selectedTournamentId) || null,
    [selectedTournamentId, tournaments]
  );

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) || null,
    [selectedEventId, events]
  );

  // Transform API data to Layout data
  const tournamentLayoutData: TournamentData = useMemo(() => {
    if (!drawData || !drawData.drawData || !drawData.drawData.rounds) return {};

    const rounds = drawData.drawData.rounds;
    const transformed: TournamentData = {};

    Object.keys(rounds).forEach((roundKey) => {
      transformed[roundKey] = rounds[roundKey].map((match) => ({
        seed: match.seed,
        player1: match.player1 || "TBD",
        player2: match.player2 || "TBD",
        winner: match.winner,
        isBye: match.isBye,
        status:
          match.status === "in-progress"
            ? "ongoing"
            : match.status === "finished"
            ? "finished"
            : "not-started",
      }));
    });

    return transformed;
  }, [drawData]);

  return {
    tournaments,
    events,
    selectedTournamentId,
    setSelectedTournamentId,
    selectedEventId,
    setSelectedEventId,
    selectedTournament,
    selectedEvent,
    tournamentLayoutData,
    tournamentsLoading,
    eventsLoading,
    drawLoading,
  };
}
