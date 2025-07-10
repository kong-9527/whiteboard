'use client';

import { forwardRef, useEffect } from 'react';
import { useDrawing } from '@/lib/useDrawing';

interface CanvasProps {
  color: string;
  brushSize: number;
  mode: 'draw' | 'erase';
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  function Canvas({ color, brushSize, mode }, ref) {
    const { startDrawing, draw, stopDrawing } = useDrawing(ref as React.RefObject<HTMLCanvasElement>);

    useEffect(() => {
      const canvas = ref as React.RefObject<HTMLCanvasElement>;
      if (!canvas.current) return;

      // 设置canvas尺寸为窗口大小
      const resizeCanvas = () => {
        if (!canvas.current) return;
        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    return (
      <canvas
        ref={ref}
        className="touch-none"
        onMouseDown={(e) => {
          const { offsetX, offsetY } = e.nativeEvent;
          startDrawing(offsetX, offsetY, color, brushSize, mode);
        }}
        onMouseMove={(e) => {
          const { offsetX, offsetY } = e.nativeEvent;
          draw(offsetX, offsetY);
        }}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const canvas = ref as React.RefObject<HTMLCanvasElement>;
          if (!canvas.current) return;
          const rect = canvas.current.getBoundingClientRect();
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          startDrawing(x, y, color, brushSize, mode);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const canvas = ref as React.RefObject<HTMLCanvasElement>;
          if (!canvas.current) return;
          const rect = canvas.current.getBoundingClientRect();
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          draw(x, y);
        }}
        onTouchEnd={stopDrawing}
      />
    );
  }
);

Canvas.displayName = 'Canvas';

export default Canvas; 