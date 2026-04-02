import React from 'react';
import { motion } from 'motion/react';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';

interface GenerateWireframeButtonProps {
  selectedCount: number;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function GenerateWireframeButton({ selectedCount, isGenerating, onGenerate }: GenerateWireframeButtonProps) {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="h-8 px-4 rounded-none text-[10px] font-bold uppercase tracking-widest bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-300 transition-all shadow-lg shadow-zinc-200 dark:shadow-none"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-3.5 h-3.5 mr-2" />
            Generate Wireframe ({selectedCount})
          </>
        )}
      </Button>
    </motion.div>
  );
}
