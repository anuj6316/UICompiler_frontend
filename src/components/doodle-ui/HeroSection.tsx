import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

interface HeroSectionProps {
  onStartCreating: () => void;
  onViewExamples: () => void;
}

export function HeroSection({ onStartCreating, onViewExamples }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-[#09090b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.06),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,219,255,0.06),transparent_40%)]" />
      
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, oklch(0.5 0 0 / 0.07) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-zinc-200 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            AI-Powered UI Generation
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent">
            Sketch to UI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Transform rough sketches into production-ready interfaces. Draw your vision, pick a style, and let AI compile your logic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={onStartCreating}
            className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-widest bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-300 transition-all duration-300 shadow-lg shadow-zinc-200 dark:shadow-none group"
          >
            Start Creating
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={onViewExamples}
            variant="outline"
            className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-widest border-zinc-300 dark:border-white/[0.15] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all duration-300"
          >
            View Examples
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 relative"
        >
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-pink-500/20 blur-3xl rounded-full" />
            <div className="relative bg-white dark:bg-[#111113] border border-zinc-200 dark:border-white/[0.08] p-8 shadow-2xl shadow-zinc-200/50 dark:shadow-none">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="ml-4 text-xs font-mono text-zinc-400">preview.ui</span>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3 space-y-3">
                  <div className="h-8 bg-zinc-100 dark:bg-white/[0.05]" />
                  <div className="h-4 bg-zinc-100 dark:bg-white/[0.05] w-3/4" />
                  <div className="h-4 bg-zinc-100 dark:bg-white/[0.05] w-2/3" />
                  <div className="h-4 bg-zinc-100 dark:bg-white/[0.05] w-4/5" />
                </div>
                <div className="col-span-9 space-y-4">
                  <div className="h-24 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-500/10 dark:to-purple-500/10" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-zinc-100 dark:bg-white/[0.05]" />
                    <div className="h-16 bg-zinc-100 dark:bg-white/[0.05]" />
                    <div className="h-16 bg-zinc-100 dark:bg-white/[0.05]" />
                  </div>
                  <div className="h-12 bg-zinc-100 dark:bg-white/[0.05] w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
