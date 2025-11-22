import { useRef, useMemo, useEffect } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { KonvaCard } from '@/components/KonvaCard';
import { ZoomControls } from '@/components/ZoomControls';
import { useStageSize } from '@/hooks/useStageSize';
import { useStageZoom } from '@/hooks/useStageZoom';
import { useStageControls } from '@/hooks/useStageControls';
import { usePathHighlighting } from '@/utils/pathHighlighting';
import { useKonvaColors } from '@/hooks/useKonvaColors';
import { calculateConnectingLines, calculateTreePositions, defaultLayoutConfig, TournamentData } from '@/utils/tournamentLayout';

interface DrawCanvasProps {
    tournamentLayoutData: TournamentData;
}

export function DrawCanvas({ tournamentLayoutData }: DrawCanvasProps) {
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
        <div
            ref={containerRef}
            className="flex justify-center items-center w-full border rounded-lg overflow-hidden bg-background relative"
            style={{
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
    );
}
