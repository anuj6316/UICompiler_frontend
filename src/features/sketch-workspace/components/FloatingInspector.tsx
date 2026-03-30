import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { GripVertical, X, Minimize2, Maximize2 } from 'lucide-react';
import { ResultPanel } from './ResultPanel';

interface FloatingInspectorProps {
  genState: any;
  theme: any;
}

const STORAGE_KEY = 'floating-inspector-position';

const INSPECTOR_WIDTH = 400;
const INSPECTOR_MINIMIZED_WIDTH = 200;
const INSPECTOR_HEADER_HEIGHT = 48;
const INSPECTOR_MINIMIZED_HEIGHT = 48;

export function FloatingInspector({ genState, theme }: FloatingInspectorProps) {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosition(parsed);
      } catch (e) {
        setPosition({ x: window.innerWidth - 420, y: 80 });
      }
    } else {
      setPosition({ x: window.innerWidth - 420, y: 80 });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetRef.current.x;
      const newY = e.clientY - offsetRef.current.y;
      
      const width = isMinimized ? INSPECTOR_MINIMIZED_WIDTH : INSPECTOR_WIDTH;
      const height = isMinimized ? INSPECTOR_MINIMIZED_HEIGHT : Math.min(500, window.innerHeight - 100);
      
      const maxX = window.innerWidth - width - 20;
      const maxY = window.innerHeight - height - 20;
      
      setPosition({
        x: Math.max(20, Math.min(newX, maxX)),
        y: Math.max(60, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMinimized]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMinimized) return;
    setIsDragging(true);
    const touch = e.touches[0];
    offsetRef.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const newX = touch.clientX - offsetRef.current.x;
      const newY = touch.clientY - offsetRef.current.y;
      
      const width = isMinimized ? INSPECTOR_MINIMIZED_WIDTH : INSPECTOR_WIDTH;
      const height = isMinimized ? INSPECTOR_MINIMIZED_HEIGHT : Math.min(500, window.innerHeight - 100);
      
      const maxX = window.innerWidth - width - 20;
      const maxY = window.innerHeight - height - 20;
      
      setPosition({
        x: Math.max(20, Math.min(newX, maxX)),
        y: Math.max(60, Math.min(newY, maxY)),
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isMinimized]);

  if (genState.currentStep === 'sketch') return null;

  return (
    <motion.div
      ref={dragRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
      }}
      className={`
        bg-white dark:bg-[#111113] 
        border border-zinc-200 dark:border-white/[0.08]
        shadow-2xl dark:shadow-black/50
        backdrop-blur-xl
        ${isMinimized ? 'w-48' : 'w-[400px]'}
        ${isMinimized ? 'h-12' : 'max-h-[80vh]'}
        ${isMinimized ? '' : 'rounded-xl'}
        overflow-hidden
        select-none
        ${isDragging ? 'cursor-grabbing' : ''}
      `}
    >
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`
          flex items-center gap-2 px-3 py-2.5 
          bg-zinc-50 dark:bg-[#18181b] 
          border-b border-zinc-200 dark:border-white/[0.05]
          cursor-grab active:cursor-grabbing
          ${isMinimized ? 'rounded-xl' : ''}
        `}
      >
        <GripVertical className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 flex-1">
          {isMinimized ? 'Inspector' : 'Wireframe Inspector'}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-zinc-200 dark:hover:bg-white/10 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="h-[400px] overflow-y-auto">
          <ResultPanel genState={genState} theme={theme} isFloating />
        </div>
      )}
    </motion.div>
  );
}