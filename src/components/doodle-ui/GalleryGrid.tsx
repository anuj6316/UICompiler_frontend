import React from 'react';
import { motion } from 'motion/react';
import { GALLERY_ITEMS } from './constants';
import { Badge } from '@/components/ui';

interface GalleryGridProps {}

export function GalleryGrid({}: GalleryGridProps) {
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
            Gallery Wall
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            See how sketches transform into polished interfaces across different categories.
          </p>
        </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {GALLERY_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="relative overflow-hidden border border-zinc-200 dark:border-white/[0.08] transition-all duration-300 group-hover:border-zinc-300 dark:group-hover:border-white/[0.15] group-hover:shadow-lg">
                <div className={`${item.aspectRatio} bg-gradient-to-br ${item.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-[#111113]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest">
                      {item.title}
                    </h3>
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest px-2 py-0">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
