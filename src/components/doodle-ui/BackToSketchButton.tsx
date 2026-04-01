import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

interface BackToSketchButtonProps {
  onClick: () => void;
}

export function BackToSketchButton({ onClick }: BackToSketchButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="h-8 px-3 rounded-none text-[10px] font-bold uppercase tracking-widest border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all"
    >
      <ArrowLeft className="w-3 h-3 mr-1.5" />
      Back to Sketch
    </Button>
  );
}
