'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-t-lg shadow-lg px-4 py-2 flex items-center gap-2"
      >
        {isExpanded ? (
          <>
            <ChevronDownIcon className="w-5 h-5" />
            <span>收起工具栏</span>
          </>
        ) : (
          <>
            <ChevronUpIcon className="w-5 h-5" />
            <span>展开工具栏</span>
          </>
        )}
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[200px]' : 'max-h-0'}`}>
        <div className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* 颜色和画笔大小部分 */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500 w-16">颜色：</span>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-blue-500' : ''} hover:scale-110 transition-transform`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500 w-16">粗细：</span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={`w-8 h-8 rounded flex items-center justify-center ${
                    brushSize === s ? 'bg-blue-100' : 'bg-gray-100'
                  } hover:scale-110 transition-transform`}
                  onClick={() => setBrushSize(s)}
                >
                  <div
                    className="rounded-full bg-black"
                    style={{ width: s, height: s }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 工具和操作按钮部分 */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded ${
                  mode === 'draw' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                } hover:scale-105 transition-transform`}
                onClick={() => setMode('draw')}
              >
                画笔
              </button>
              
              <button
                className={`px-4 py-2 rounded ${
                  mode === 'erase' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                } hover:scale-105 transition-transform`}
                onClick={() => setMode('erase')}
              >
                橡皮擦
              </button>
            </div>

            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded ${canUndo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'} hover:scale-105 transition-transform`}
                onClick={onUndo}
                disabled={!canUndo}
              >
                撤销
              </button>
              
              <button
                className={`px-4 py-2 rounded ${canRedo ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'} hover:scale-105 transition-transform`}
                onClick={onRedo}
                disabled={!canRedo}
              >
                重做
              </button>
            </div>

            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:scale-105 transition-transform"
                onClick={onClear}
              >
                清空
              </button>

              <button
                className="px-4 py-2 rounded bg-green-500 text-white hover:scale-105 transition-transform"
                onClick={onSave}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 