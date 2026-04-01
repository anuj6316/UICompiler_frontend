import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { FAQ_ITEMS } from './constants';

interface FAQSectionProps {}

export function FAQSection({}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-zinc-50 dark:bg-[#09090b]">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#111113]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-bold uppercase tracking-widest pr-4">
                    {item.question}
                  </span>
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-zinc-200 dark:border-white/[0.08]">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 text-zinc-500" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-zinc-500" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
