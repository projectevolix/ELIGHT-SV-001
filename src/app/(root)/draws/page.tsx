
'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Bracket } from '@/components/draws/bracket';
import { FilterBar } from '@/components/draws/filter-bar';
import type { Tournament, Event } from '@/components/draws/types';

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

  const selectedTournament = useMemo(() =>
    tournamentsData.find(t => t.id === selectedTournamentId) || null,
    [selectedTournamentId]
  );

  const selectedEvent = useMemo(() =>
    eventsData.find(e => e.id === selectedEventId) || null,
    [selectedEventId]
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Draws
        </h1>
        <FilterBar
          tournaments={tournamentsData}
          events={eventsData}
          onTournamentChange={setSelectedTournamentId}
          onEventChange={setSelectedEventId}
          selectedTournamentId={selectedTournamentId}
        />

        {selectedTournament && selectedEvent && (
          <Bracket
            tournament={selectedTournament}
            event={selectedEvent}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
