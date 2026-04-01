import React from 'react';

interface CanvasStatusBarProps {
  elementCount: number;
  zoomLevel: number;
  currentTool: string;
}

const TOOL_LABELS: Record<string, string> = {
  pen: 'Pen',
  select: 'Select',
  rect: 'Rectangle',
  circle: 'Circle',
  text: 'Text',
  pan: 'Pan',
};

export function CanvasStatusBar({ elementCount, zoomLevel, currentTool }: CanvasStatusBarProps) {
  return (
    <div className="absolute bottom-6 left-6 z-40">
      <div className="flex items-center gap-3 px-3 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-600" />
          {elementCount} element{elementCount !== 1 ? 's' : ''}
        </span>
        <span className="w-px h-3 bg-zinc-200 dark:bg-white/[0.1]" />
        <span>{Math.round(zoomLevel * 100)}%</span>
        <span className="w-px h-3 bg-zinc-200 dark:bg-white/[0.1]" />
        <span className="uppercase tracking-widest">{TOOL_LABELS[currentTool] || currentTool}</span>
      </div>
    </div>
  );
}
