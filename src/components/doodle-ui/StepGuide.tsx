import React from 'react';
import { motion } from 'motion/react';
import { STEPS } from './constants';

interface StepGuideProps {}

export function StepGuide({}: StepGuideProps) {
  return (
    <section className="py-24 bg-white dark:bg-[#111113]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Four simple moves from sketch to production-ready code.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-zinc-200 dark:bg-white/[0.08]" />
          
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="relative z-10 w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08]">
                  <Icon className="w-8 h-8 text-zinc-700 dark:text-zinc-300" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 text-[9px] font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
