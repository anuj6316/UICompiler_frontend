import React, { useRef } from 'react';
import { 
  MousePointer2, PenTool, Square, Circle as CircleIcon, 
  Type, Image as ImageIcon, Undo, Redo, Trash2 
} from 'lucide-react';
import { motion } from 'motion/react';

export function ToolButton({ icon: Icon, active, onClick, tooltip, shortcut }: { icon: any, active: boolean, onClick: () => void, tooltip: string, shortcut?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      onClick={onClick}
      title={tooltip}
      className={`p-2.5 rounded-none transition-all duration-300 relative group ${
        active 
          ? 'bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-900 shadow-xl shadow-zinc-400/20 dark:shadow-none' 
          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/[0.05] hover:text-zinc-900 dark:hover:text-zinc-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {shortcut && (
        <span className="absolute -top-1 -right-1 text-[8px] font-bold px-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
          {shortcut}
        </span>
      )}
      {active && (
        <motion.div 
          layoutId="activeTool"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-none bg-current"
        />
      )}
    </motion.button>
  );
}

interface FloatingToolbarProps {
  tool: string;
  setTool: (t: any) => void;
  selectedId: string | null;
  elements: any[];
  setElements: (elements: any[]) => void;
  fillColor: string;
  setFillColor: (c: string) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  fontFamily: string;
  setFontFamily: (f: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

export function FloatingToolbar({
  tool, setTool, selectedId, elements, setElements,
  fillColor, setFillColor, fontSize, setFontSize,
  fontFamily, setFontFamily, onImageUpload,
  undo, redo, clearCanvas
}: FloatingToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e);
      e.target.value = '';
    }
  };

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5 p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-none border border-zinc-200 dark:border-white/[0.08] shadow-lg">
      <div className="flex flex-col items-center gap-1">
        <ToolButton icon={MousePointer2} active={tool === 'select'} onClick={() => setTool('select')} tooltip="Select (V)" shortcut="V" />
        <ToolButton icon={PenTool} active={tool === 'pen'} onClick={() => setTool('pen')} tooltip="Draw (P)" shortcut="P" />
        <ToolButton icon={Square} active={tool === 'rect'} onClick={() => setTool('rect')} tooltip="Rectangle (R)" shortcut="R" />
        <ToolButton icon={CircleIcon} active={tool === 'circle'} onClick={() => setTool('circle')} tooltip="Circle (O)" shortcut="O" />
        <ToolButton icon={Type} active={tool === 'text'} onClick={() => setTool('text')} tooltip="Text (T)" shortcut="T" />
        <ToolButton icon={ImageIcon} active={false} onClick={handleImageClick} tooltip="Upload Image (I)" shortcut="I" />
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      <div className="w-6 h-px bg-zinc-200 dark:bg-[#222228] my-0.5" />

      <div className="flex flex-col items-center gap-2">
        {(tool === 'text' || (selectedId && elements.find(el => el.id === selectedId)?.type === 'text')) && (
          <div className="flex flex-col items-center gap-1.5 py-1 border-b border-zinc-200 dark:border-white/[0.1]">
            <select 
              value={fontSize}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setFontSize(size);
                if (selectedId) {
                  setElements(elements.map(el => el.id === selectedId ? { ...el, fontSize: size } : el));
                }
              }}
              className="text-[10px] font-bold bg-transparent border border-zinc-200 dark:border-white/[0.1] rounded-none px-2 h-8 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
            >
              {[12, 14, 16, 18, 20, 24, 32, 48].map(s => <option key={s} value={s} className="bg-white dark:bg-zinc-900">{s}px</option>)}
            </select>
            <select 
              value={fontFamily}
              onChange={(e) => {
                const family = e.target.value;
                setFontFamily(family);
                if (selectedId) {
                  setElements(elements.map(el => el.id === selectedId ? { ...el, fontFamily: family } : el));
                }
              }}
              className="text-[10px] font-bold bg-transparent border border-zinc-200 dark:border-white/[0.1] rounded-none px-2 h-8 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all"
            >
              <option value="sans-serif" className="bg-white dark:bg-zinc-900">Sans</option>
              <option value="serif" className="bg-white dark:bg-zinc-900">Serif</option>
              <option value="monospace" className="bg-white dark:bg-zinc-900">Mono</option>
            </select>
          </div>
        )}

        <div className="flex flex-col items-center gap-2 py-1">
          <input 
            type="color" 
            value={fillColor === 'transparent' ? '#ffffff' : fillColor}
            onChange={(e) => {
              const newColor = e.target.value;
              setFillColor(newColor);
              if (selectedId) {
                setElements(elements.map(el => 
                  el.id === selectedId && (el.type === 'rect' || el.type === 'circle') 
                    ? { ...el, fill: newColor } 
                    : el
                ));
              }
            }}
            className="w-6 h-6 rounded-none cursor-pointer border-0 p-0 bg-transparent overflow-hidden shadow-sm"
            title="Fill Color"
          />
          <button 
            onClick={() => {
              setFillColor('transparent');
              if (selectedId) {
                setElements(elements.map(el => 
                  el.id === selectedId && (el.type === 'rect' || el.type === 'circle') 
                    ? { ...el, fill: 'transparent' } 
                    : el
                ));
              }
            }}
            className={`w-6 h-6 rounded-none border flex items-center justify-center transition-all ${fillColor === 'transparent' ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-zinc-200' : 'border-zinc-200 dark:border-white/[0.1] hover:bg-zinc-100 dark:hover:bg-white/[0.05]'}`}
            title="Transparent Fill"
          >
            <div className="w-full h-full relative overflow-hidden rounded-none">
              <div className={`absolute inset-0 ${fillColor === 'transparent' ? 'bg-zinc-900 dark:bg-zinc-200' : 'bg-white dark:bg-zinc-900'}`} />
              <div className="absolute top-0 left-0 w-full h-full border-t border-red-500 transform rotate-45 origin-top-left" />
            </div>
          </button>
        </div>
      </div>

      <div className="w-6 h-px bg-zinc-200 dark:bg-[#222228] my-0.5" />

      <div className="flex flex-col items-center gap-1">
        <ToolButton icon={Undo} active={false} onClick={undo} tooltip="Undo (Ctrl+Z)" shortcut="⌘Z" />
        <ToolButton icon={Redo} active={false} onClick={redo} tooltip="Redo (Ctrl+Y)" shortcut="⌘⇧Z" />
        <div className="w-4 h-px bg-zinc-200 dark:bg-[#222228] my-0.5" />
        <ToolButton icon={Trash2} active={false} onClick={clearCanvas} tooltip="Clear Canvas" />
      </div>
    </div>
  );
}
