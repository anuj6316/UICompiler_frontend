import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { CanvasElement } from '../hooks/useCanvas';

interface CanvasMinimapProps {
  elements: CanvasElement[];
  stagePos: { x: number; y: number };
  stageScale: number;
  setStagePos: (pos: { x: number; y: number }) => void;
  viewportSize: { width: number; height: number };
}

const MINIMAP_SIZE = 180;
const PADDING = 20;

export function CanvasMinimap({
  elements,
  stagePos,
  stageScale,
  setStagePos,
  viewportSize
}: CanvasMinimapProps) {
  // 1. Calculate the bounding box of all elements
  const bounds = useMemo(() => {
    if (elements.length === 0) return { x: 0, y: 0, width: viewportSize.width, height: viewportSize.height };

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    elements.forEach(el => {
      const x = el.x || 0;
      const y = el.y || 0;
      const w = el.width || el.radius || 100;
      const h = el.height || el.radius || 100;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    });

    // Also include the current viewport in the bounds so the navigator doesn't get "lost"
    const viewX = -stagePos.x / stageScale;
    const viewY = -stagePos.y / stageScale;
    const viewW = viewportSize.width / stageScale;
    const viewH = viewportSize.height / stageScale;

    minX = Math.min(minX, viewX);
    minY = Math.min(minY, viewY);
    maxX = Math.max(maxX, viewX + viewW);
    maxY = Math.max(maxY, viewY + viewH);

    return {
      x: minX - PADDING,
      y: minY - PADDING,
      width: (maxX - minX) + PADDING * 2,
      height: (maxY - minY) + PADDING * 2
    };
  }, [elements, stagePos, stageScale, viewportSize]);

  // 2. Map coordinates to mini-map pixels
  const mapScale = Math.min(
    MINIMAP_SIZE / bounds.width,
    MINIMAP_SIZE / bounds.height
  );

  const getMapX = (x: number) => (x - bounds.x) * mapScale;
  const getMapY = (y: number) => (y - bounds.y) * mapScale;
  const getMapW = (w: number) => w * mapScale;
  const getMapH = (h: number) => h * mapScale;

  // 3. Viewport rectangle (the "you are here" box)
  const viewRect = {
    x: getMapX(-stagePos.x / stageScale),
    y: getMapY(-stagePos.y / stageScale),
    width: getMapW(viewportSize.width / stageScale),
    height: getMapH(viewportSize.height / stageScale),
  };

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Inverse mapping: Convert click to world coordinates
    const worldX = (clickX / mapScale) + bounds.x;
    const worldY = (clickY / mapScale) + bounds.y;

    // Center the viewport on the click
    setStagePos({
      x: -(worldX * stageScale) + (viewportSize.width / 2),
      y: -(worldY * stageScale) + (viewportSize.height / 2)
    });
  };

  return (
    <div 
      className="absolute bottom-6 right-6 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] shadow-2xl p-1 overflow-hidden pointer-events-auto cursor-crosshair group transition-all duration-300 hover:scale-105"
      style={{ width: MINIMAP_SIZE, height: MINIMAP_SIZE }}
      onClick={handleMinimapClick}
    >
      <div className="relative w-full h-full bg-zinc-50 dark:bg-black/20">
        {/* Render elements as simple dots/rects */}
        {elements.map((el) => (
          <div 
            key={el.id}
            className="absolute bg-zinc-400 dark:bg-zinc-600 opacity-40"
            style={{
              left: getMapX(el.x || 0),
              top: getMapY(el.y || 0),
              width: Math.max(2, getMapW(el.width || 10)),
              height: Math.max(2, getMapH(el.height || 10)),
            }}
          />
        ))}

        {/* Viewport Indicator */}
        <motion.div 
          className="absolute border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900/5 dark:bg-white/5"
          animate={{
            left: viewRect.x,
            top: viewRect.y,
            width: viewRect.width,
            height: viewRect.height
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </div>
      
      <div className="absolute top-1 left-2 text-[8px] font-bold uppercase tracking-widest text-zinc-400 pointer-events-none">
        Radar
      </div>
    </div>
  );
}
