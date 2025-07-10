'use client';

interface ToolbarProps {
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  mode: 'draw' | 'erase';
  setMode: (mode: 'draw' | 'erase') => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
  onSave: () => void;
}

const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const sizes = [2, 4, 6, 8, 10, 12, 14];

export default function Toolbar({
  color,
  setColor,
  brushSize,
  setBrushSize,
  mode,
  setMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  onSave
}: ToolbarProps) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 flex items-center gap-4">
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      
      <div className="h-8 w-px bg-gray-300" />
      
      <div className="flex gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            className={`w-8 h-8 rounded flex items-center justify-center ${
              brushSize === s ? 'bg-blue-100' : 'bg-gray-100'
            }`}
            onClick={() => setBrushSize(s)}
          >
            <div
              className="rounded-full bg-black"
              style={{ width: s, height: s }}
            />
          </button>
        ))}
      </div>
      
      <div className="h-8 w-px bg-gray-300" />
      
      <button
        className={`px-4 py-2 rounded ${
          mode === 'draw' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        onClick={() => setMode('draw')}
      >
        画笔
      </button>
      
      <button
        className={`px-4 py-2 rounded ${
          mode === 'erase' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        onClick={() => setMode('erase')}
      >
        橡皮擦
      </button>
      
      <div className="h-8 w-px bg-gray-300" />
      
      <button
        className={`px-4 py-2 rounded ${canUndo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
        onClick={onUndo}
        disabled={!canUndo}
      >
        撤销
      </button>
      
      <button
        className={`px-4 py-2 rounded ${canRedo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
        onClick={onRedo}
        disabled={!canRedo}
      >
        重做
      </button>
      
      <button
        className="px-4 py-2 rounded bg-red-500 text-white"
        onClick={onClear}
      >
        清空
      </button>

      <div className="h-8 w-px bg-gray-300" />
      
      <button
        className="px-4 py-2 rounded bg-green-500 text-white"
        onClick={onSave}
      >
        保存图片
      </button>
    </div>
  );
} 