import React from 'react';
import { motion } from 'motion/react';
import { Wand2, Loader2 } from 'lucide-react';
import { Button, Textarea } from '@/components/ui';
import { SKETCH_STYLES } from './constants';

interface PromptAreaProps {
  prompt: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  selectedStyle: string;
}

export function PromptArea({
  prompt,
  onChange,
  onGenerate,
  isGenerating,
  selectedStyle,
}: PromptAreaProps) {
  const selectedStyleData = SKETCH_STYLES.find(s => s.id === selectedStyle);
  const charCount = prompt.length;
  const maxChars = 500;

  return (
    <section className="py-24 bg-zinc-50 dark:bg-[#09090b]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
            Describe Your UI
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Add a description to guide the AI. Style chemistry is auto-injected from your selection.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-[#111113] border border-zinc-200 dark:border-white/[0.08] p-6"
        >
          <Textarea
            placeholder="e.g., A dashboard with sidebar navigation, analytics cards at the top, and a data table below..."
            className="min-h-[140px] resize-none bg-transparent border-none focus-visible:ring-0 text-base placeholder:text-zinc-400 dark:placeholder:text-zinc-600 p-0"
            value={prompt}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxChars}
          />

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {charCount} / {maxChars}
              </span>
              {selectedStyleData && (
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-white/[0.03] px-2 py-1">
                  + {selectedStyleData.promptInjection.slice(0, 40)}...
                </span>
              )}
            </div>
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="h-10 px-6 rounded-none text-xs font-bold uppercase tracking-widest bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-300 transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate UI
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
