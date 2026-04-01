import React from 'react';
import { motion } from 'motion/react';
import { FEATURES } from './constants';

interface FeatureCardsProps {}

export function FeatureCards({}: FeatureCardsProps) {
  const getGridClass = (size: string) => {
    switch (size) {
      case 'large':
        return 'lg:col-span-2';
      case 'medium':
        return 'lg:col-span-1';
      case 'small':
        return 'lg:col-span-1';
      default:
        return 'lg:col-span-1';
    }
  };

  return (
    <section className="py-24 bg-zinc-50 dark:bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
            Built for Speed & Precision
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Every module keeps the workflow consistent and production-ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`${getGridClass(feature.size)} group relative p-8 bg-white dark:bg-[#111113] border border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.15] transition-all duration-300 hover:shadow-lg`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center mb-6 bg-zinc-100 dark:bg-white/[0.05]">
                    <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
