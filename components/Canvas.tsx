'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { useDrawing } from '@/lib/useDrawing';
import { usePanning } from '@/lib/usePanning';

interface CanvasProps {
  color: string;
  brushSize: number;
  mode: 'draw' | 'erase';
}

const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 3000;

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  function Canvas({ color, brushSize, mode }, ref) {
    const { startDrawing, draw, stopDrawing } = useDrawing(ref as React.RefObject<HTMLCanvasElement>);
    const { offset, startPanning, pan, stopPanning } = usePanning();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const canvas = ref as React.RefObject<HTMLCanvasElement>;
      if (!canvas.current) return;

      // 设置canvas固定尺寸
      canvas.current.width = CANVAS_WIDTH;
      canvas.current.height = CANVAS_HEIGHT;

      // 初始化画布背景为白色
      const ctx = canvas.current.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }, []);

    const getCanvasCoordinates = (clientX: number, clientY: number) => {
      const canvas = ref as React.RefObject<HTMLCanvasElement>;
      if (!canvas.current) return { x: 0, y: 0 };
      const rect = canvas.current.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 bg-gray-100 overflow-hidden"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div 
          className="absolute"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          <canvas
            ref={ref}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="touch-none bg-white"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT
            }}
            onMouseDown={(e) => {
              if (e.button === 2) { // 右键
                const { clientX, clientY } = e;
                startPanning(clientX, clientY);
              } else {
                const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
                startDrawing(x, y, color, brushSize, mode);
              }
            }}
            onMouseMove={(e) => {
              if (e.buttons === 2) { // 右键按住
                const { clientX, clientY } = e;
                pan(clientX, clientY);
              } else {
                const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
                draw(x, y);
              }
            }}
            onMouseUp={(e) => {
              if (e.button === 2) {
                stopPanning();
              } else {
                stopDrawing();
              }
            }}
            onMouseOut={(e) => {
              stopDrawing();
              stopPanning();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              if (e.touches.length === 2) {
                const touch = e.touches[0];
                startPanning(touch.clientX, touch.clientY);
              } else {
                const touch = e.touches[0];
                const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);
                startDrawing(x, y, color, brushSize, mode);
              }
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              if (e.touches.length === 2) {
                const touch = e.touches[0];
                pan(touch.clientX, touch.clientY);
              } else {
                const touch = e.touches[0];
                const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);
                draw(x, y);
              }
            }}
            onTouchEnd={(e) => {
              if (e.touches.length === 0) {
                stopDrawing();
                stopPanning();
              }
            }}
          />
        </div>
      </div>
    );
  }
);

Canvas.displayName = 'Canvas';

export default Canvas; 