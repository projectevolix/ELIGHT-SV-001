
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { FilterBar } from '@/components/draws/filter-bar';
import { useTournaments } from '@/hooks/api/useTournaments';
import { useEventsByTournament } from '@/hooks/api/useEvents';
import { useDrawByTournamentAndEvent } from '@/hooks/api/useDraws';
import { useKonvaColors } from '@/hooks/useKonvaColors';
import { useStageSize } from '@/hooks/useStageSize';
import { useStageZoom } from '@/hooks/useStageZoom';
import { useStageControls } from '@/hooks/useStageControls';
import { usePathHighlighting } from '@/utils/pathHighlighting';
import { calculateConnectingLines, calculateTreePositions, defaultLayoutConfig, TournamentData, Match as LayoutMatch } from '@/utils/tournamentLayout';
import { Layer, Line, Text } from 'react-konva';
import { KonvaCard } from '@/components/KonvaCard';
import { ZoomControls } from '@/components/ZoomControls';
import { Stage } from 'react-konva';
import { DrawDTO } from '@/types/api/draws';

export default function DrawsPage() {
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Fetch real tournaments
  const { data: tournamentsApiData, isLoading: tournamentsLoading } = useTournaments(1, 100);

  const tournaments = useMemo(() => {
    if (!tournamentsApiData?.tournaments) return [];
    return tournamentsApiData.tournaments.map(t => ({
      ...t,
      id: t.id.toString()
    }));
  }, [tournamentsApiData]);

  // Fetch real events for selected tournament
  const tournamentIdNum = selectedTournamentId ? parseInt(selectedTournamentId, 10) : null;
  const { data: eventsApiData, isLoading: eventsLoading } = useEventsByTournament(tournamentIdNum, 1, 100);

  const events = useMemo(() => {
    if (!eventsApiData) return [];
    return eventsApiData.map((e) => ({
      id: e.id.toString(),
      tournamentId: selectedTournamentId || '',
      name: `${e.discipline} - ${e.ageCategory} - ${e.gender}${e.weightClass ? ` - ${e.weightClass}` : ''}`,
    }));
  }, [eventsApiData, selectedTournamentId]);

  // Fetch draw data
  const eventIdNum = selectedEventId ? parseInt(selectedEventId, 10) : null;
  const { data: drawData, isPending: drawLoading } = useDrawByTournamentAndEvent(tournamentIdNum, eventIdNum);

  const selectedTournament = useMemo(() =>
    tournaments.find(t => t.id.toString() === selectedTournamentId) || null,
    [selectedTournamentId, tournaments]
  );

  const selectedEvent = useMemo(() =>
    events.find(e => e.id === selectedEventId) || null,
    [selectedEventId, events]
  );

  const colors = useKonvaColors();
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom hooks for stage management
  const stageSize = useStageSize(containerRef);
  const {
    stageScale,
    stagePosition,
    setStagePosition,
    handleWheel,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
  } = useStageZoom();
  const { handleDragStart, handleDragEnd, handleTouchMove } =
    useStageControls(setStagePosition);
  const { highlightedPath, highlightPath, clearHighlight } =
    usePathHighlighting();

  // Transform API data to Layout data
  const tournamentLayoutData: TournamentData = useMemo(() => {
    if (!drawData || !drawData.drawData || !drawData.drawData.rounds) return {};

    const rounds = drawData.drawData.rounds;
    const transformed: TournamentData = {};

    Object.keys(rounds).forEach(roundKey => {
      transformed[roundKey] = rounds[roundKey].map(match => ({
        seed: match.seed,
        player1: match.player1 || "TBD",
        player2: match.player2 || "TBD",
        winner: match.winner,
        isBye: match.isBye,
        status: match.status === "in-progress" ? "ongoing" : match.status === "finished" ? "finished" : "not-started"
      }));
    });

    return transformed;
  }, [drawData]);

  // Calculate tournament layout
  const tree = useMemo(() =>
    calculateTreePositions(tournamentLayoutData, defaultLayoutConfig),
    [tournamentLayoutData]
  );

  const lines = useMemo(() =>
    calculateConnectingLines(tree, defaultLayoutConfig),
    [tree]
  );

  // Determine the final round index (last round)
  const finalRoundIndex = useMemo(() =>
    tree.length > 0 ? Math.max(...tree.map(p => p.roundIndex)) : 0,
    [tree]
  );

  // Auto-fit when tree changes
  const hasAutoFitted = useRef(false);

  useEffect(() => {
    if (tree.length > 0 && stageSize.width > 0 && stageSize.height > 0 && !hasAutoFitted.current) {
      // Calculate tree dimensions
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

      tree.forEach(node => {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x + defaultLayoutConfig.cardWidth);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y + defaultLayoutConfig.cardHeight);
      });

      const treeWidth = maxX - minX;
      const treeHeight = maxY - minY;

      fitToScreen(
        stageSize.width,
        stageSize.height,
        treeWidth,
        treeHeight,
        50 // padding
      );
      hasAutoFitted.current = true;
    }
  }, [stageSize.width, stageSize.height, tree, fitToScreen]);

  // Reset auto-fit when tournament or event changes
  useEffect(() => {
    hasAutoFitted.current = false;
  }, [selectedTournamentId, selectedEventId]);

  // Path highlighting handlers
  const handleCardMouseEnter = (cardIndex: number) => {
    highlightPath(cardIndex, tree);
  };

  const handleCardMouseLeave = () => {
    clearHighlight();
  };

  const handleViewClick = (matchData: {
    seed: string;
    player1: string;
    player2: string;
  }) => {
    console.log("Tournament Match Data:", matchData);
  };

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
            Loading draw...
          </div>
        )}

        {!drawLoading && selectedTournament && selectedEvent && Object.keys(tournamentLayoutData).length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No draw data available for this event.
          </div>
        )}

        {!drawLoading && Object.keys(tournamentLayoutData).length > 0 && (
          <div
            ref={containerRef}
            className="flex-1 w-full border rounded-lg overflow-hidden bg-background relative"
            style={{
              minHeight: "600px",
              cursor: "grab",
            }}
          >
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              scaleX={stageScale}
              scaleY={stageScale}
              x={stagePosition.x}
              y={stagePosition.y}
              onWheel={handleWheel}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onTouchMove={handleTouchMove}
              draggable
            >
              <Layer>
                {[...lines]
                  .sort((a, b) => {
                    const aHighlighted =
                      highlightedPath?.cardIndices?.includes(a.sourceIndex) &&
                      highlightedPath?.cardIndices?.includes(a.targetIndex);
                    const bHighlighted =
                      highlightedPath?.cardIndices?.includes(b.sourceIndex) &&
                      highlightedPath?.cardIndices?.includes(b.targetIndex);

                    if (aHighlighted && !bHighlighted) return 1;
                    if (!aHighlighted && bHighlighted) return -1;
                    return 0;
                  })
                  .map((line, i) => {
                    const isHighlighted =
                      highlightedPath?.cardIndices?.includes(line.sourceIndex) &&
                      highlightedPath?.cardIndices?.includes(line.targetIndex);

                    return (
                      <Line
                        key={i}
                        points={line.points}
                        stroke={isHighlighted ? colors.primary : colors.border}
                        strokeWidth={isHighlighted ? 4 : 3}
                      />
                    );
                  })}

                {/* Round Headers */}
                {Object.keys(tournamentLayoutData).map((roundKey, i) => (
                  <Text
                    key={roundKey}
                    x={defaultLayoutConfig.startX + i * defaultLayoutConfig.roundSpacing}
                    y={defaultLayoutConfig.startY - 50}
                    text={roundKey}
                    fontSize={20}
                    fontFamily="Arial, sans-serif"
                    fontStyle="bold"
                    fill={colors.foreground}
                    width={defaultLayoutConfig.cardWidth}
                    align="center"
                  />
                ))}

                {tree.map((p, i) => (
                  <KonvaCard
                    key={i}
                    x={p.x}
                    y={p.y}
                    colors={colors}
                    {...p.match}
                    matchNumber={i + 1}
                    cardIndex={i}
                    isFinal={p.roundIndex === finalRoundIndex}
                    isHighlighted={highlightedPath?.cardIndices.includes(i) || false}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                    onViewClick={handleViewClick}
                  />
                ))}
              </Layer>
            </Stage>

            <ZoomControls
              stageScale={stageScale}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onResetZoom={resetZoom}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
