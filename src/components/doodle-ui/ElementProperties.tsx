import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Move, Type, Palette } from 'lucide-react';

interface ElementPropertiesProps {
  element: any;
  onUpdate: (updates: Partial<any>) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function ElementProperties({ element, onUpdate, onClose, isOpen }: ElementPropertiesProps) {
  if (!element) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-6 right-6 z-50 w-64"
        >
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-white/[0.05]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Properties
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-white/[0.05] rounded-none transition-colors"
                aria-label="Close properties"
              >
                <X className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>

            <div className="p-3 space-y-4">
              {/* Element Type */}
              <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                {element.type === 'text' ? (
                  <Type className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <Palette className="w-3.5 h-3.5 text-zinc-500" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                  {element.type}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 ml-auto">
                  {element.id.slice(-6)}
                </span>
              </div>

              {/* Position */}
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                  Position
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                    <span className="text-[9px] font-bold text-zinc-400">X</span>
                    <input
                      type="number"
                      value={Math.round(element.x || 0)}
                      onChange={(e) => onUpdate({ x: parseInt(e.target.value) || 0 })}
                      className="w-full bg-transparent text-[10px] font-mono text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                    <span className="text-[9px] font-bold text-zinc-400">Y</span>
                    <input
                      type="number"
                      value={Math.round(element.y || 0)}
                      onChange={(e) => onUpdate({ y: parseInt(e.target.value) || 0 })}
                      className="w-full bg-transparent text-[10px] font-mono text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Size */}
              {(element.width !== undefined || element.height !== undefined) && (
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                    Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                      <span className="text-[9px] font-bold text-zinc-400">W</span>
                      <input
                        type="number"
                        value={Math.round(element.width || 0)}
                        onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 0 })}
                        className="w-full bg-transparent text-[10px] font-mono text-zinc-900 dark:text-zinc-100 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                      <span className="text-[9px] font-bold text-zinc-400">H</span>
                      <input
                        type="number"
                        value={Math.round(element.height || 0)}
                        onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 0 })}
                        className="w-full bg-transparent text-[10px] font-mono text-zinc-900 dark:text-zinc-100 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Radius for circles */}
              {element.radius !== undefined && (
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                    Radius
                  </label>
                  <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                    <span className="text-[9px] font-bold text-zinc-400">R</span>
                    <input
                      type="number"
                      value={Math.round(element.radius || 0)}
                      onChange={(e) => onUpdate({ radius: parseInt(e.target.value) || 0 })}
                      className="w-full bg-transparent text-[10px] font-mono text-zinc-900 dark:text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Stroke Width */}
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                  Stroke Width
                </label>
                <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05]">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={element.strokeWidth || 2}
                    onChange={(e) => onUpdate({ strokeWidth: parseFloat(e.target.value) })}
                    className="w-full accent-zinc-900 dark:accent-zinc-200"
                  />
                  <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 w-8 text-right">
                    {element.strokeWidth || 2}
                  </span>
                </div>
              </div>

              {/* Text content */}
              {element.type === 'text' && (
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
                    Text Content
                  </label>
                  <textarea
                    value={element.text || ''}
                    onChange={(e) => onUpdate({ text: e.target.value })}
                    className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05] text-[10px] font-mono text-zinc-900 dark:text-zinc-100 outline-none resize-none min-h-[60px]"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
