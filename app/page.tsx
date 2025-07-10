'use client';

import { useRef, useState } from 'react';
import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';
import { useDrawing } from '@/lib/useDrawing';

export default function Home() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { undo, redo, clear, canUndo, canRedo } = useDrawing(canvasRef);

  return (
    <main className="relative w-screen h-screen bg-white">
      <Canvas
        ref={canvasRef}
        color={color}
        brushSize={brushSize}
        mode={mode}
      />
      <Toolbar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        mode={mode}
        setMode={setMode}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onClear={clear}
      />
    </main>
  );
} 