import { useCallback, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

export function usePanning() {
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastPosition = useRef<Position | null>(null);

  const startPanning = useCallback((x: number, y: number) => {
    isPanning.current = true;
    lastPosition.current = { x, y };
  }, []);

  const pan = useCallback((x: number, y: number) => {
    if (!isPanning.current || !lastPosition.current) return;

    const deltaX = x - lastPosition.current.x;
    const deltaY = y - lastPosition.current.y;

    setOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));

    lastPosition.current = { x, y };
  }, []);

  const stopPanning = useCallback(() => {
    isPanning.current = false;
    lastPosition.current = null;
  }, []);

  return {
    offset,
    startPanning,
    pan,
    stopPanning
  };
} 