
'use client';

import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Bracket } from '@/components/draws/bracket';
import { FilterBar } from '@/components/draws/filter-bar';
import type { Tournament, Event } from '@/components/draws/types';
import { useTournaments } from '@/hooks/api/useTournaments';
import { useEventsByTournament } from '@/hooks/api/useEvents';
import { useDrawByTournamentAndEvent } from '@/hooks/api/useDraws';

const tournamentsData: Tournament[] = [
  { id: '1', name: 'National Karate Championship 2025' },
  { id: '2', name: 'Summer Open 2024' },
];

const eventsData: Event[] = [
  { id: '1', tournamentId: '1', name: 'Kata - U18 - Male - 55kg' },
  { id: '2', tournamentId: '1', name: 'Kumite - Senior - Female - 60kg' },
  { id: '3', tournamentId: '2', name: 'Kata - U15 - Female - 50kg' },
];

export default function DrawsPage() {
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Fetch real tournaments
  const { data: tournamentsApiData } = useTournaments(1, 100);
  const tournaments = tournamentsApiData?.tournaments || tournamentsData;

  // Fetch real events for selected tournament
  const tournamentIdNum = selectedTournamentId ? parseInt(selectedTournamentId, 10) : null;
  const { data: eventsApiData } = useEventsByTournament(tournamentIdNum, 1, 100);
  const events = eventsApiData && eventsApiData.length > 0 ? eventsApiData.map((e, idx) => ({
    id: e.id.toString(),
    tournamentId: selectedTournamentId || '',
    name: `${e.discipline} - ${e.ageCategory} - ${e.gender}${e.weightClass ? ` - ${e.weightClass}` : ''}`,
  })) : eventsData;

  // Fetch draw data
  const eventIdNum = selectedEventId ? parseInt(selectedEventId, 10) : null;
  const { data: drawData, isPending: drawLoading } = useDrawByTournamentAndEvent(tournamentIdNum, eventIdNum);

  // Console.log draw data when it changes
  useEffect(() => {
    if (drawData) {
      console.log('Draw Data:', drawData);
    }
  }, [drawData]);

  const selectedTournament = useMemo(() =>
    tournaments.find(t => t.id.toString() === selectedTournamentId) || null,
    [selectedTournamentId, tournaments]
  );

  const selectedEvent = useMemo(() =>
    events.find(e => e.id === selectedEventId) || null,
    [selectedEventId, events]
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Draws
        </h1>
        <FilterBar
          tournaments={tournaments as any}
          events={events as any}
          onTournamentChange={setSelectedTournamentId}
          onEventChange={setSelectedEventId}
          selectedTournamentId={selectedTournamentId}
          eventsLoading={eventsApiData === undefined && selectedTournamentId !== null}
        />

        {selectedTournament && selectedEvent && drawData && (
          <Bracket
            tournament={selectedTournament}
            event={selectedEvent}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
