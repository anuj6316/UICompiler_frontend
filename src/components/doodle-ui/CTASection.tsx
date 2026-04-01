import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

interface CTASectionProps {
  onStartCreating: () => void;
}

export function CTASection({ onStartCreating }: CTASectionProps) {
  return (
    <section className="py-24 bg-white dark:bg-[#111113]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-zinc-900 dark:bg-white p-12 sm:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,119,198,0.1),transparent_50%)]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-white/20 dark:border-zinc-200/50">
              <Sparkles className="w-4 h-4 text-violet-400 dark:text-violet-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-600">
                Ready to Build?
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6 text-white dark:text-zinc-900">
              Transform your sketches into real interfaces
            </h2>
            
            <p className="text-zinc-400 dark:text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of designers and developers who ship faster with AI-powered UI generation.
            </p>
            
            <Button
              onClick={onStartCreating}
              className="h-12 px-8 rounded-none text-sm font-bold uppercase tracking-widest bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 group"
            >
              Start Creating Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
