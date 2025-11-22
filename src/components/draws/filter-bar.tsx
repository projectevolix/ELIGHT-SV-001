
'use client';

import { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tournament, Event } from './types';

type FilterBarProps = {
  tournaments: Tournament[];
  events: Event[];
  onTournamentChange: (id: number | null) => void;
  onEventChange: (id: number | null) => void;
  selectedTournamentId: number | null;
  eventsLoading?: boolean;
};

export function FilterBar({ tournaments, events, onTournamentChange, onEventChange, selectedTournamentId, eventsLoading = false }: FilterBarProps) {

  const availableEvents = useMemo(() => {
    if (!selectedTournamentId) return [];
    return events.filter(e => e.tournamentId === selectedTournamentId);
  }, [events, selectedTournamentId]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Tournament</label>
            <Select onValueChange={(val) => { onTournamentChange(val ? Number(val) : null); onEventChange(null); }}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Event</label>
            <Select onValueChange={(val) => onEventChange(val ? Number(val) : null)} disabled={!selectedTournamentId || availableEvents.length === 0 || eventsLoading}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder={eventsLoading ? "Loading events..." : availableEvents.length === 0 && selectedTournamentId ? "No events" : "Select an event"} />
              </SelectTrigger>
              <SelectContent>
                {eventsLoading ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading events...</div>
                ) : availableEvents.length === 0 && selectedTournamentId ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">No events available</div>
                ) : (
                  availableEvents.map(e => <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>)
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
