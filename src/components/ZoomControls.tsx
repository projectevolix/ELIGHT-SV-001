"use client";
import React from "react";

interface ZoomControlsProps {
  stageScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  stageScale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  const zoomPercentage = Math.round(stageScale * 100);

  return (
    <div className="zoom-controls">
      <button
        className="zoom-btn"
        onClick={onZoomIn}
        disabled={stageScale >= 5}
        aria-label="Zoom in"
      >
        +
      </button>

      <div
        className="zoom-indicator"
        style={{
          fontFamily: "Arial, sans-serif",
        }}
        onClick={onResetZoom}
        role="button"
        tabIndex={0}
        aria-label={`Current zoom: ${zoomPercentage}%. Click to reset.`}
      >
        {zoomPercentage}%
      </div>

      <button
        className="zoom-btn"
        onClick={onZoomOut}
        disabled={stageScale <= 0.1}
        aria-label="Zoom out"
      >
        -
      </button>
    </div>
  );
};
