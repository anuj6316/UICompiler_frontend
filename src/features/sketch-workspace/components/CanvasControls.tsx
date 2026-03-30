import React from 'react';
import { 
  Plus, Minus, Maximize2, RotateCcw, Crosshair
} from 'lucide-react';
import { motion } from 'motion/react';

interface CanvasControlsProps {
  stageScale: number;
  setStageScale: (s: number | ((prev: number) => number)) => void;
  setStagePos: (p: { x: number; y: number }) => void;
  onFitToScreen: () => void;
  zoomLevel: number;
}

export function CanvasControls({
  stageScale,
  setStageScale,
  setStagePos,
  onFitToScreen,
  zoomLevel
}: CanvasControlsProps) {
  const handleZoom = (direction: 'in' | 'out') => {
    setStageScale(prev => {
      const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.1, Math.min(10, newScale));
    });
  };

  const handleReset = () => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  return (
    <div className="absolute bottom-6 left-6 z-50 flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="flex items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] shadow-lg p-1">
        <ControlButton icon={Minus} onClick={() => handleZoom('out')} tooltip="Zoom Out" />
        <div className="px-3 min-w-[60px] text-center text-[10px] font-bold text-zinc-900 dark:text-zinc-100 tabular-nums uppercase tracking-widest">
          {Math.round(zoomLevel * 100)}%
        </div>
        <ControlButton icon={Plus} onClick={() => handleZoom('in')} tooltip="Zoom In" />
      </div>

      {/* Action Suite */}
      <div className="flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] shadow-lg p-1 w-fit">
        <ControlButton icon={Maximize2} onClick={onFitToScreen} tooltip="Fit to Screen" />
        <ControlButton icon={RotateCcw} onClick={handleReset} tooltip="Reset View" />
        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
        <ControlButton icon={Crosshair} onClick={() => {}} tooltip="Toggle Snap" disabled />
      </div>
    </div>
  );
}

function ControlButton({ 
  icon: Icon, 
  onClick, 
  tooltip, 
  disabled 
}: { 
  icon: any, 
  onClick: () => void, 
  tooltip: string, 
  disabled?: boolean 
}) {
  return (
    <motion.button
      whileHover={!disabled ? { backgroundColor: 'var(--color-accent)', scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`p-2 transition-all duration-200 ${disabled ? 'opacity-30 cursor-not-allowed' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
    >
      <Icon className="w-4 h-4" />
    </motion.button>
  );
}
