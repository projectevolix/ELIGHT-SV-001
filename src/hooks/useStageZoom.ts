import { useState, useCallback } from "react";

export const useStageZoom = () => {
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // Limit zoom levels
    newScale = Math.max(0.1, Math.min(newScale, 5));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setStageScale(newScale);
    setStagePosition(newPos);
  }, []);

  // Programmatic zoom functions
  const zoomIn = useCallback(() => {
    const newScale = Math.min(stageScale * 1.2, 5);
    setStageScale(newScale);
  }, [stageScale]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(stageScale / 1.2, 0.1);
    setStageScale(newScale);
  }, [stageScale]);

  const resetZoom = useCallback(() => {
    setStageScale(1);
    setStagePosition({ x: 0, y: 50 });
  }, []);

  const fitToScreen = useCallback(
    (
      stageWidth: number,
      stageHeight: number,
      contentWidth: number,
      contentHeight: number,
      padding = 50
    ) => {
      if (contentWidth === 0 || contentHeight === 0) return;

      const scaleX = (stageWidth - padding * 2) / contentWidth;
      const scaleY = (stageHeight - padding * 2) / contentHeight;
      const scale = Math.min(scaleX, scaleY);

      // Center the content
      const x = (stageWidth - contentWidth * scale) / 2;
      const y = (stageHeight - contentHeight * scale) / 2;

      setStageScale(scale);
      setStagePosition({ x, y });
    },
    []
  );

  return {
    stageScale,
    stagePosition,
    setStagePosition,
    handleWheel,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
  };
};
