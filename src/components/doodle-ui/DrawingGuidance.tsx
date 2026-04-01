import React from 'react';
import { motion } from 'motion/react';
import { PenTool, MousePointer2, Square, Circle, Type, X } from 'lucide-react';

interface DrawingGuidanceProps {
  tool: string;
  onDismiss: () => void;
}

const GUIDANCE_CONFIG: Record<string, { title: string; description: string; shortcut: string; icon: any }> = {
  pen: {
    title: 'Start Sketching',
    description: 'Click and drag to sketch freely. Your strokes will be captured as smooth vector paths.',
    shortcut: 'P',
    icon: PenTool,
  },
  select: {
    title: 'Select Elements',
    description: 'Click on any element to select it. Drag to move, use handles to resize or rotate.',
    shortcut: 'V',
    icon: MousePointer2,
  },
  rect: {
    title: 'Draw Rectangles',
    description: 'Click and drag to draw rectangles. Perfect for UI containers, cards, and buttons.',
    shortcut: 'R',
    icon: Square,
  },
  circle: {
    title: 'Draw Circles',
    description: 'Click and drag from center to draw circles. Great for avatars, badges, and icons.',
    shortcut: 'O',
    icon: Circle,
  },
  text: {
    title: 'Add Text',
    description: 'Click anywhere on the canvas to place text. Use the toolbar to adjust size and font.',
    shortcut: 'T',
    icon: Type,
  },
  pan: {
    title: 'Pan Canvas',
    description: 'Click and drag to move around the canvas. Use scroll wheel to zoom in and out.',
    shortcut: 'H',
    icon: MousePointer2,
  },
};

export function DrawingGuidance({ tool, onDismiss }: DrawingGuidanceProps) {
  const config = GUIDANCE_CONFIG[tool] || GUIDANCE_CONFIG.pen;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
    >
      <div className="text-center max-w-sm px-6">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08]"
        >
          <Icon className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
        </motion.div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-3">
          {config.title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
          {config.description}
        </p>

        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08]">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/[0.1]">
              {config.shortcut}
            </kbd>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {tool.toUpperCase()}
            </span>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="mt-6 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors pointer-events-auto"
          aria-label="Dismiss guidance"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
