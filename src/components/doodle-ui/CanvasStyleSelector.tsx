import React from 'react';
import { motion } from 'motion/react';
import { Pencil, PenTool, Layout, Minus } from 'lucide-react';

interface CanvasStyleSelectorProps {
  selectedStyle: string;
  onSelect: (style: string) => void;
}

const STYLES = [
  {
    id: 'graphite',
    name: 'Graphite',
    icon: Pencil,
    stroke: '#52525b',
    darkStroke: '#a1a1aa',
    description: 'Soft pencil strokes',
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    icon: PenTool,
    stroke: '#2563eb',
    darkStroke: '#60a5fa',
    description: 'Technical grid lines',
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    icon: Layout,
    stroke: '#0891b2',
    darkStroke: '#22d3ee',
    description: 'Clean UI outlines',
  },
  {
    id: 'lineart',
    name: 'Line Art',
    icon: Minus,
    stroke: '#09090b',
    darkStroke: '#ffffff',
    description: 'Minimal single-weight',
  },
];

export function CanvasStyleSelector({ selectedStyle, onSelect }: CanvasStyleSelectorProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-1 p-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] shadow-lg"
      >
        {STYLES.map((style) => {
          const Icon = style.icon;
          const isSelected = selectedStyle === style.id;
          return (
            <motion.button
              key={style.id}
              onClick={() => onSelect(style.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={style.description}
              className={`relative flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{style.name}</span>
              {isSelected && (
                <motion.div
                  layoutId="activeStyleIndicator"
                  className="absolute inset-0 bg-zinc-900 dark:bg-zinc-200 -z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
