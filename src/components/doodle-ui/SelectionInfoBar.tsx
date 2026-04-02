import React from 'react';
import { motion } from 'motion/react';
import { Trash2, Copy, ArrowUp, ArrowDown, Move } from 'lucide-react';
import { GenerateWireframeButton } from './GenerateWireframeButton';

interface SelectionInfoBarProps {
  selectedCount: number;
  selectedElement: any;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onPositionChange: (x: number, y: number) => void;
  onGenerateWireframe: () => void;
  isGenerating: boolean;
}

export function SelectionInfoBar({
  selectedCount,
  selectedElement,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onPositionChange,
  onGenerateWireframe,
  isGenerating,
}: SelectionInfoBarProps) {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="flex items-center gap-3 px-4 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] shadow-lg">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          {selectedCount} selected
        </span>

        {selectedCount === 1 && selectedElement && (
          <>
            <div className="w-px h-4 bg-zinc-200 dark:bg-white/[0.1]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-400">
                X: {Math.round(selectedElement.x || 0)}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Y: {Math.round(selectedElement.y || 0)}
              </span>
              {selectedElement.width && selectedElement.height && (
                <>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {Math.round(selectedElement.width)}×{Math.round(selectedElement.height)}
                  </span>
                </>
              )}
              {selectedElement.radius && (
                <span className="text-[10px] font-mono text-zinc-400">
                  R: {Math.round(selectedElement.radius)}
                </span>
              )}
            </div>
          </>
        )}

        <div className="w-px h-4 bg-zinc-200 dark:bg-white/[0.1]" />

        <GenerateWireframeButton
          selectedCount={selectedCount}
          isGenerating={isGenerating}
          onGenerate={onGenerateWireframe}
        />

        <div className="w-px h-4 bg-zinc-200 dark:bg-white/[0.1]" />

        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicate}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-none transition-colors"
            title="Duplicate"
            aria-label="Duplicate selected element"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          </button>
          <button
            onClick={onBringForward}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-none transition-colors"
            title="Bring Forward"
            aria-label="Bring selected element forward"
          >
            <ArrowUp className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          </button>
          <button
            onClick={onSendBackward}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-none transition-colors"
            title="Send Backward"
            aria-label="Send selected element backward"
          >
            <ArrowDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          </button>
          <div className="w-px h-4 bg-zinc-200 dark:bg-white/[0.1]" />
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-none transition-colors"
            title="Delete"
            aria-label="Delete selected elements"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
