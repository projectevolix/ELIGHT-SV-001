import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { KonvaCard } from '@/components/KonvaCard';
import { ZoomControls } from '@/components/ZoomControls';
import { useStageSize } from '@/hooks/useStageSize';
import { useStageZoom } from '@/hooks/useStageZoom';
import { useStageControls } from '@/hooks/useStageControls';
import { usePathHighlighting } from '@/utils/pathHighlighting';
import { useKonvaColors } from '@/hooks/useKonvaColors';
import { calculateConnectingLines, calculateTreePositions, defaultLayoutConfig, TournamentData } from '@/utils/tournamentLayout';
import jsPDF from 'jspdf';

interface DrawCanvasProps {
    tournamentLayoutData: TournamentData;
    tournamentName: string;
    eventName: string;
    userName: string;
}

export function DrawCanvas({ tournamentLayoutData, tournamentName, eventName, userName }: DrawCanvasProps) {
    const colors = useKonvaColors();
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<any>(null);

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

    const handleExport = useCallback(() => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        // Save current state
        const oldScale = stage.scaleX();
        const oldPos = stage.position();

        // Hide view buttons for export
        stage.find('.view-button').forEach((node: any) => node.hide());

        // Extend player backgrounds to full width for export
        const playerBgs = stage.find('.player-bg');
        const originalWidths = playerBgs.map((node: any) => node.width());
        playerBgs.forEach((node: any) => node.width(297));

        // Align player labels to the right for export
        const playerLabels = stage.find('.player-label');
        const originalLabelXs = playerLabels.map((node: any) => node.x());
        playerLabels.forEach((node: any) => node.x(257));

        // Calculate total size of the tree to fit in PDF
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        tree.forEach(node => {
            minX = Math.min(minX, node.x);
            maxX = Math.max(maxX, node.x + defaultLayoutConfig.cardWidth);
            minY = Math.min(minY, node.y);
            maxY = Math.max(maxY, node.y + defaultLayoutConfig.cardHeight);
        });

        const padding = 50;
        const treeWidth = maxX - minX + padding * 2;
        const treeHeight = maxY - minY + padding * 2;

        // Set scale to 1 and position to include everything for capture
        stage.scale({ x: 1, y: 1 });
        stage.position({ x: -minX + padding, y: -minY + padding });

        const dataUrl = stage.toDataURL({
            pixelRatio: 2, // Higher quality
            x: -minX,
            y: -minY,
            width: treeWidth,
            height: treeHeight
        });

        // Restore state
        stage.scale({ x: oldScale, y: oldScale });
        stage.position(oldPos);

        // Show view buttons again
        stage.find('.view-button').forEach((node: any) => node.show());

        // Restore player background widths
        playerBgs.forEach((node: any, i: number) => node.width(originalWidths[i]));

        // Restore player label positions
        playerLabels.forEach((node: any, i: number) => node.x(originalLabelXs[i]));

        // Create PDF
        // A4 landscape: 297mm x 210mm
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Add Header
        pdf.setFontSize(18);
        pdf.text(tournamentName, 14, 20);

        pdf.setFontSize(14);
        pdf.setTextColor(100);
        pdf.text(eventName, 14, 30);

        // Add Footer (Timestamp and User)
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        const timestamp = new Date().toLocaleString();
        pdf.text(`Generated on: ${timestamp}`, 14, pageHeight - 10);
        pdf.text(`Generated by: ${userName}`, pageWidth - 14, pageHeight - 10, { align: 'right' });

        // Add Image
        // Calculate aspect ratio to fit in page
        const margin = 14;
        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - 50 - margin; // 50 for header/footer space

        const imgRatio = treeWidth / treeHeight;
        const pageRatio = availableWidth / availableHeight;

        let imgWidth, imgHeight;

        if (imgRatio > pageRatio) {
            imgWidth = availableWidth;
            imgHeight = availableWidth / imgRatio;
        } else {
            imgHeight = availableHeight;
            imgWidth = availableHeight * imgRatio;
        }

        // Center image
        const x = (pageWidth - imgWidth) / 2;
        const y = 40 + (availableHeight - imgHeight) / 2;

        pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);

        pdf.save(`${tournamentName.replace(/\s+/g, '_')}-${eventName.replace(/\s+/g, '_')}-draw.pdf`);

    }, [tree, tournamentName, eventName, userName]);

    return (
        <div
            ref={containerRef}
            className="flex justify-center items-center w-full border rounded-lg overflow-hidden bg-background relative"
            style={{
                cursor: "grab",
            }}
        >
            <Stage
                ref={stageRef}
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
                onExport={handleExport}
            />
        </div>
    );
}
