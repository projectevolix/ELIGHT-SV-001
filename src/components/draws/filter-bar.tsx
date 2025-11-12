
'use client';

import { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tournament, Event } from './types';

type FilterBarProps = {
  tournaments: Tournament[];
  events: Event[];
  onTournamentChange: (id: string | null) => void;
  onEventChange: (id: string | null) => void;
  selectedTournamentId: string | null;
};

export function FilterBar({ tournaments, events, onTournamentChange, onEventChange, selectedTournamentId }: FilterBarProps) {
  
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
            <Select onValueChange={(val) => { onTournamentChange(val); onEventChange(null); }}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Event</label>
            <Select onValueChange={onEventChange} disabled={!selectedTournamentId || availableEvents.length === 0}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                 {availableEvents.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
