import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { SKETCH_STYLES, UI_THEMES } from './constants';

interface StylePresetsProps {
  selectedSketchStyle: string;
  onSelectSketchStyle: (id: string) => void;
  selectedUITheme: string;
  onSelectUITheme: (id: string) => void;
}

export function StylePresets({
  selectedSketchStyle,
  onSelectSketchStyle,
  selectedUITheme,
  onSelectUITheme,
}: StylePresetsProps) {
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
            Choose Your Style
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Select a sketch style for your canvas and a UI theme for the generated output.
          </p>
        </motion.div>

        <div className="mb-16">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">
            Sketch Style
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SKETCH_STYLES.map((style, index) => {
              const Icon = style.icon;
              const isSelected = selectedSketchStyle === style.id;
              return (
                <motion.button
                  key={style.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectSketchStyle(style.id)}
                  className={`relative p-6 text-left border transition-all duration-300 group ${
                    isSelected
                      ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-white/[0.05]'
                      : 'border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.15]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                    </div>
                  )}
                  <div className={`w-12 h-12 flex items-center justify-center mb-4 ${style.bgColor}`}>
                    <Icon className={`w-5 h-5 ${style.color}`} />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">
                    {style.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {style.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">
            UI Theme
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {UI_THEMES.map((theme, index) => {
              const isSelected = selectedUITheme === theme.id;
              return (
                <motion.button
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectUITheme(theme.id)}
                  className={`relative p-6 text-left border transition-all duration-300 group ${
                    isSelected
                      ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-white/[0.05]'
                      : 'border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.15]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-4 h-4 text-zinc-900 dark:text-white" />
                    </div>
                  )}
                  <div className={`w-full h-16 mb-4 ${theme.preview} border border-zinc-200/50 dark:border-white/[0.05]`} />
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">
                    {theme.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {theme.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
