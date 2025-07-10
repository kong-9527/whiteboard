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

  const handleSave = () => {
    if (canvasRef.current) {
      // @ts-ignore
      canvasRef.current.saveAsImage();
    }
  };

  return (
    <main className="relative w-screen h-screen bg-white">
      <header className="sr-only">
        <h1>在线画板 - 免费简单的绘画工具</h1>
        <p>一个简单易用的在线画板应用，支持自由绘画、橡皮擦、撤销重做等功能。</p>
      </header>
      
      <section aria-label="画板区域" className="relative">
        <Canvas
          ref={canvasRef}
          color={color}
          brushSize={brushSize}
          mode={mode}
          aria-label="绘画画布"
        />
      </section>

      <nav aria-label="绘画工具栏" className="absolute">
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
          onSave={handleSave}
        />
      </nav>

      <footer className="sr-only">
        <p>版权所有 © {new Date().getFullYear()} 在线画板</p>
      </footer>
    </main>
  );
} 