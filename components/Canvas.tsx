'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { useDrawing } from '@/lib/useDrawing';
import { usePanning } from '@/lib/usePanning';

interface CanvasProps {
  color: string;
  brushSize: number;
  mode: 'draw' | 'erase';
  onSave?: () => void;
}

const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 3000;

// 计算实际绘画内容的边界
const getContentBounds = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let hasContent = false;

  // 遍历像素数据，找出非白色像素的边界
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      // 检查像素是否为非白色（考虑透明度）
      if (a > 0 && (r !== 255 || g !== 255 || b !== 255)) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        hasContent = true;
      }
    }
  }

  // 如果没有内容，返回null
  if (!hasContent) {
    return null;
  }

  // 添加一些padding
  const padding = 20;
  return {
    x: Math.max(0, minX - padding),
    y: Math.max(0, minY - padding),
    width: Math.min(width - minX, maxX - minX + padding * 2),
    height: Math.min(height - minY, maxY - minY + padding * 2)
  };
};

// 保存画布内容为图片
const saveCanvasAsImage = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 获取实际内容的边界
  const bounds = getContentBounds(ctx, canvas.width, canvas.height);
  if (!bounds) {
    alert('画布是空的！');
    return;
  }

  // 创建一个新的canvas来存储裁剪后的内容
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = bounds.width;
  tempCanvas.height = bounds.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // 将内容复制到新canvas
  tempCtx.drawImage(
    canvas,
    bounds.x, bounds.y, bounds.width, bounds.height,
    0, 0, bounds.width, bounds.height
  );

  // 创建下载链接
  try {
    const dataUrl = tempCanvas.toDataURL('image/png');
    const filename = `whiteboard-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;

    // 检测是否是移动设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 移动端：打开新窗口显示图片，用户可以长按保存
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>保存图片</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body {
                  margin: 0;
                  padding: 16px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  background: #f3f4f6;
                  min-height: 100vh;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .tip {
                  margin-top: 16px;
                  padding: 12px;
                  background: white;
                  border-radius: 8px;
                  text-align: center;
                  color: #374151;
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="画板内容">
              <div class="tip">
                长按图片即可保存到相册
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        // 如果无法打开新窗口，回退到直接显示图片
        window.location.href = dataUrl;
      }
    } else {
      // 桌面端：使用常规下载方式
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    }
  } catch (error) {
    console.error('保存图片失败:', error);
    alert('保存图片失败，请检查浏览器权限设置。');
  }
};

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

    // 暴露保存方法给父组件
    useEffect(() => {
      const canvas = ref as React.RefObject<HTMLCanvasElement>;
      if (!canvas.current) return;
      
      // @ts-ignore
      canvas.current.saveAsImage = () => {
        saveCanvasAsImage(canvas.current!);
      };
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