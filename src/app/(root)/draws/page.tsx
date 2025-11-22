'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { FilterBar } from '@/components/draws/filter-bar';
import { useDrawsData } from '../../../hooks/useDrawsData';
import { DrawCanvas } from '../../../components/DrawCanvas';

export default function DrawsPage() {
  const {
    tournaments,
    events,
    selectedTournamentId,
    setSelectedTournamentId,
    selectedEventId,
    setSelectedEventId,
    selectedTournament,
    selectedEvent,
    tournamentLayoutData,
    eventsLoading,
    drawLoading,
  } = useDrawsData();

  return (
    <DashboardLayout>
      <div className="space-y-8 h-full flex flex-col">
        <div className="flex-none">
          <h1 className="text-3xl font-bold font-headline tracking-tight mb-6">
            Draws
          </h1>
          <FilterBar
            tournaments={tournaments}
            events={events}
            onTournamentChange={setSelectedTournamentId}
            onEventChange={setSelectedEventId}
            selectedTournamentId={selectedTournamentId}
            eventsLoading={eventsLoading}
          />
        </div>

        {/* Show loading state or empty state if no data */}
        {drawLoading && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a tournament and event to view the draw.
          </div>
        )}

        {!drawLoading && selectedTournament && selectedEvent && Object.keys(tournamentLayoutData).length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No draw data available for this event.
          </div>
        )}

        {!drawLoading && Object.keys(tournamentLayoutData).length > 0 && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <DrawCanvas
              tournamentLayoutData={tournamentLayoutData}
              tournamentName={selectedTournament?.name || "Tournament"}
              eventName={selectedEvent?.name || "Event"}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
