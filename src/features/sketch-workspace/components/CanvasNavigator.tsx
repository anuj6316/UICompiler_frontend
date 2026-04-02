import React from 'react';
import { 
  Layers, MousePointer2, Image as ImageIcon, Wand2, Type, 
  Square, Circle as CircleIcon, PenTool, Crosshair, Search,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CanvasElement } from '../hooks/useCanvas';

interface CanvasNavigatorProps {
  elements: CanvasElement[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  stageScale: number;
  setStagePos: (p: { x: number; y: number }) => void;
  viewportSize: { width: number; height: number };
}

export function CanvasNavigator({
  elements,
  selectedId,
  setSelectedId,
  stageScale,
  setStagePos,
  viewportSize
}: CanvasNavigatorProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const jumpToNode = (el: CanvasElement) => {
    setSelectedId(el.id);
    const x = el.x || 0;
    const y = el.y || 0;
    
    // Smoothly pan to the node
    setStagePos({
      x: -(x * stageScale) + (viewportSize.width / 2),
      y: -(y * stageScale) + (viewportSize.height / 2)
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pen': return PenTool;
      case 'rect': return Square;
      case 'circle': return CircleIcon;
      case 'text': return Type;
      case 'image': return ImageIcon;
      case 'result': return Wand2;
      default: return MousePointer2;
    }
  };

  return (
    <div className="absolute top-6 right-6 z-50 flex flex-col pointer-events-none">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 p-2 w-10 h-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] shadow-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 pointer-events-auto"
      >
        <Layers className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-64 max-h-[60vh] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/[0.08] shadow-2xl flex flex-col pointer-events-auto"
          >
            <div className="p-4 border-b border-zinc-200 dark:border-white/[0.05] flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Board Navigator</h3>
              <Badge count={elements.length} />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {elements.length === 0 ? (
                <div className="py-8 text-center text-[10px] font-medium text-zinc-400 uppercase tracking-widest italic">
                  Board is empty
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {elements.map((el) => {
                    const Icon = getIcon(el.type);
                    const isActive = selectedId === el.id;
                    return (
                      <button
                        key={el.id}
                        onClick={() => jumpToNode(el)}
                        className={`group flex items-center gap-3 px-3 py-2 w-full text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' 
                            : 'hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-current' : 'text-zinc-400'}`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider truncate flex-1 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                          {el.type === 'result' ? 'UI Variant' : (el.text || `${el.type} node`)}
                        </span>
                        <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-40'}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-zinc-50/50 dark:bg-black/20 border-t border-zinc-200 dark:border-white/[0.05]">
               <button 
                 onClick={() => setStagePos({ x: 0, y: 0 })}
                 className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
               >
                 <Crosshair className="w-3 h-3" />
                 Origin Reset
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <div className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] text-[9px] font-bold text-zinc-500">
      {count}
    </div>
  );
}
