'use client';

import { useRef, useState } from 'react';
import Canvas from '@/components/Canvas';

export default function Home() {
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        <p>一个简单易用的在线画板应用，支持自由绘画、橡皮擦等功能。</p>
      </header>
      
      <section aria-label="画板区域" className="relative">
        <Canvas
          ref={canvasRef}
          color={color}
          brushSize={brushSize}
          mode={mode}
          setColor={setColor}
          setBrushSize={setBrushSize}
          setMode={setMode}
          onSave={handleSave}
        />
      </section>

      <footer className="sr-only">
        <p>版权所有 © {new Date().getFullYear()} 在线画板</p>
      </footer>
    </main>
  );
} 