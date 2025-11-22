"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw, Download } from "lucide-react";

interface ZoomControlsProps {
  stageScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onExport?: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  stageScale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onExport,
}) => {
  const zoomPercentage = Math.round(stageScale * 100);

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-background/90 backdrop-blur-sm p-2 rounded-lg border shadow-sm z-10">
      {onExport && (
        <Button
          variant="outline"
          size="icon"
          onClick={onExport}
          aria-label="Export diagram"
          className="h-8 w-8 mb-1"
          title="Export to PDF"
        >
          <Download className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        disabled={stageScale >= 5}
        aria-label="Zoom in"
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <div
        className="flex items-center justify-center text-xs font-medium py-1 cursor-pointer hover:bg-accent rounded"
        onClick={onResetZoom}
        role="button"
        tabIndex={0}
        aria-label={`Current zoom: ${zoomPercentage}%. Click to reset.`}
      >
        {zoomPercentage}%
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        disabled={stageScale <= 0.1}
        aria-label="Zoom out"
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onResetZoom}
        aria-label="Reset zoom"
        className="h-8 w-8 mt-1"
        title="Reset Zoom"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};
