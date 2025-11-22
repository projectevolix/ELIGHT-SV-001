
'use client';

import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Bracket } from '@/components/draws/bracket';
import { FilterBar } from '@/components/draws/filter-bar';
import { Scoreboard } from '@/components/draws/scoreboard';
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
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [akaScore, setAkaScore] = useState(1);
  const [aoScore, setAoScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('3.00');

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

  const handleAkaScore = (action: 'add' | 'subtract', value: number) => {
    setAkaScore(prev => action === 'add' ? prev + value : Math.max(0, prev - value));
  };

  const handleAoScore = (action: 'add' | 'subtract', value: number) => {
    setAoScore(prev => action === 'add' ? prev + value : Math.max(0, prev - value));
  };

  const handleTimerToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleTimerReset = () => {
    const durationMap: Record<string, number> = {
      '0.30': 30,
      '1.00': 60,
      '1.30': 90,
      '2.00': 120,
      '2.30': 150,
      '3.00': 180,
    };
    setTimeRemaining(durationMap[selectedDuration] || 180);
    setIsRunning(false);
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
    const durationMap: Record<string, number> = {
      '0.30': 30,
      '1.00': 60,
      '1.30': 90,
      '2.00': 120,
      '2.30': 150,
      '3.00': 180,
    };
    setTimeRemaining(durationMap[duration] || 180);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Draws
          </h1>
          {selectedTournamentId && selectedEventId && (
            <Button
              onClick={() => setShowScoreboard(true)}
              size="default"
            >
              Scoreboard
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

        <Dialog open={showScoreboard} onOpenChange={setShowScoreboard}>
          <DialogContent className="max-w-7xl w-11/12 h-screen max-h-screen p-0 border-0">
            <button
              onClick={() => setShowScoreboard(false)}
              className="absolute right-4 top-4 z-10 rounded-md bg-gray-800 p-2 hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {selectedTournamentId && selectedEventId && (
              <Scoreboard
                eventName={`${selectedEvent?.name || 'Kumite Match'}`}
                akaPlayer={{
                  name: 'Player 01',
                  organization: 'Kenshin Kai',
                  score: akaScore,
                }}
                aoPlayer={{
                  name: 'Player 02',
                  organization: 'Kenshin Kai',
                  score: aoScore,
                }}
                timeRemaining={timeRemaining}
                isRunning={isRunning}
                onTimerToggle={handleTimerToggle}
                onTimerReset={handleTimerReset}
                onAkaScore={handleAkaScore}
                onAoScore={handleAoScore}
                selectedDuration={selectedDuration}
                onDurationChange={handleDurationChange}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
