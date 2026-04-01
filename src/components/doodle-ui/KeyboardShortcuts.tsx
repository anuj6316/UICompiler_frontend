import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    group: 'Tools',
    items: [
      { keys: ['P'], label: 'Pen Tool' },
      { keys: ['V'], label: 'Select Tool' },
      { keys: ['R'], label: 'Rectangle' },
      { keys: ['O'], label: 'Circle' },
      { keys: ['T'], label: 'Text' },
      { keys: ['H'], label: 'Pan' },
    ],
  },
  {
    group: 'Actions',
    items: [
      { keys: ['⌘', 'Z'], label: 'Undo' },
      { keys: ['⌘', '⇧', 'Z'], label: 'Redo' },
      { keys: ['Delete'], label: 'Delete Selected' },
      { keys: ['Space'], label: 'Hold to Pan' },
      { keys: ['⌘', 'K'], label: 'Command Palette' },
    ],
  },
];

export function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-[#111113] border border-zinc-200 dark:border-white/[0.08] z-[101] max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-white/[0.08]">
              <h2 className="text-sm font-bold uppercase tracking-widest">Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
                aria-label="Close shortcuts"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {SHORTCUT_GROUPS.map((section) => (
                <div key={section.group}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                    {section.group}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2">
                        <span className="text-sm">{item.label}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((key) => (
                            <kbd
                              key={key}
                              className="px-2 py-1 text-xs font-mono bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08]"
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
