'use client';

import { useCallback, useRef, useState } from 'react';

interface DrawingState {
  color: string;
  brushSize: number;
  mode: 'draw' | 'erase';
  points: { x: number; y: number }[];
}

const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 3000;

export function useDrawing(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const isDrawing = useRef(false);
  const [history, setHistory] = useState<DrawingState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const currentState = useRef<DrawingState | null>(null);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas?.getContext('2d');
  }, [canvasRef]);

  const startDrawing = useCallback((x: number, y: number, color: string, brushSize: number, mode: 'draw' | 'erase') => {
    const ctx = getContext();
    if (!ctx) return;

    isDrawing.current = true;
    currentState.current = {
      color,
      brushSize,
      mode,
      points: [{ x, y }]
    };

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
  }, [getContext]);

  const draw = useCallback((x: number, y: number) => {
    const ctx = getContext();
    if (!ctx || !isDrawing.current || !currentState.current) return;

    currentState.current.points.push({ x, y });
    
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [getContext]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing.current || !currentState.current) return;

    isDrawing.current = false;

    // 删除超出当前索引之后的历史记录
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, currentState.current]);
    setHistoryIndex(historyIndex + 1);
  }, [history, historyIndex]);

  const redrawCanvas = useCallback(() => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // 清空画布
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 重绘历史记录
    for (let i = 0; i <= historyIndex; i++) {
      const state = history[i];
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = state.mode === 'erase' ? '#FFFFFF' : state.color;
      ctx.lineWidth = state.brushSize;

      const points = state.points;
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let j = 1; j < points.length; j++) {
          ctx.lineTo(points[j].x, points[j].y);
        }
        ctx.stroke();
      }
    }
  }, [getContext, canvasRef, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex >= 0) {
      setHistoryIndex(historyIndex - 1);
      redrawCanvas();
    }
  }, [historyIndex, redrawCanvas]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      redrawCanvas();
    }
  }, [history.length, historyIndex, redrawCanvas]);

  const clear = useCallback(() => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHistory([]);
    setHistoryIndex(-1);
  }, [getContext, canvasRef]);

  return {
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clear,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1
  };
} 