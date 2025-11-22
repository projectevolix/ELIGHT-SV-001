export const useStageControls = (setStagePosition: (position: { x: number; y: number }) => void) => {
  const handleDragStart = (e: any) => {
    e.target.getStage().container().style.cursor = 'grabbing';
  };

  const handleDragEnd = (e: any) => {
    e.target.getStage().container().style.cursor = 'grab';
    setStagePosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTouchMove = (e: any) => {
    e.evt.preventDefault();
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleTouchMove,
  };
};