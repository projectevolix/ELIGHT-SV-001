
'use client';

import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Bracket } from '@/components/draws/bracket';
import { FilterBar } from '@/components/draws/filter-bar';
import { KumiteScoreboard } from '@/components/draws/scoreboard-kumite';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { Tournament, Event } from '@/components/draws/types';
import { useTournaments } from '@/hooks/api/useTournaments';
import { useEventsByTournament } from '@/hooks/api/useEvents';
import { useDrawByTournamentAndEvent } from '@/hooks/api/useDraws';

const tournamentsData: Tournament[] = [
  { id: 1, name: 'National Karate Championship 2025' },
  { id: 2, name: 'Summer Open 2024' },
];

const eventsData: Event[] = [
  { id: 1, tournamentId: 1, name: 'Kata - U18 - Male - 55kg' },
  { id: 2, tournamentId: 1, name: 'Kumite - Senior - Female - 60kg' },
  { id: 3, tournamentId: 2, name: 'Kata - U15 - Female - 50kg' },
];

export default function DrawsPage() {
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [showKumiteScoreboard, setShowKumiteScoreboard] = useState(false);

  // Fetch real tournaments
  const { data: tournamentsApiData } = useTournaments(1, 100);
  const tournaments = tournamentsApiData?.tournaments || tournamentsData;

  // Fetch real events for selected tournament
  const { data: eventsApiData } = useEventsByTournament(selectedTournamentId, 1, 100);
  const events = eventsApiData && eventsApiData.length > 0 ? eventsApiData.map((e) => ({
    id: e.id,
    tournamentId: selectedTournamentId || 0,
    name: `${e.discipline} - ${e.ageCategory} - ${e.gender}${e.weightClass ? ` - ${e.weightClass}` : ''}`,
  })) : eventsData;

  // Fetch draw data
  const { data: drawData, isPending: drawLoading } = useDrawByTournamentAndEvent(selectedTournamentId, selectedEventId);

  // Console.log draw data when it changes
  useEffect(() => {
    if (drawData) {
      console.log('Draw Data:', drawData);
    }
  }, [drawData]);

  const selectedTournament = useMemo(() => {
    if (!selectedTournamentId) return null;
    return tournaments.find(t => t.id === selectedTournamentId) || null;
  }, [selectedTournamentId, tournaments]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    const found = events.find(e => e.id === selectedEventId);
    return found || null;
  }, [selectedEventId, events]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Draws
          </h1>
          {selectedTournamentId && selectedEventId && (
            <Button
              onClick={() => setShowKumiteScoreboard(true)}
              size="default"
            >
              Kumite Scoreboard
            </Button>
          )}
        </div>

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

        <Dialog open={showKumiteScoreboard} onOpenChange={setShowKumiteScoreboard}>
          <DialogContent className="max-w-7xl w-11/12 h-screen max-h-screen p-0 border-0">
            <button
              onClick={() => setShowKumiteScoreboard(false)}
              className="absolute right-4 top-4 z-10 rounded-md bg-gray-800 p-2 hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {selectedTournamentId && selectedEventId && (
              <KumiteScoreboard
                eventName={selectedEvent?.name || 'Kumite Event'}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
