import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';

export type ElementType = 'pen' | 'rect' | 'circle' | 'text' | 'image' | 'result';

export type SketchStyle = 'graphite' | 'blueprint' | 'wireframe' | 'lineart';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string;
  stroke: string;
  strokeWidth: number;
  fill?: string;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  // Metadata for results
  generationId?: string;
  sourceSketchId?: string;
}

const STYLE_CONFIGS: Record<SketchStyle, {
  stroke: string;
  darkStroke: string;
  strokeWidth: number;
  tension: number;
}> = {
  graphite: {
    stroke: '#52525b',
    darkStroke: '#a1a1aa',
    strokeWidth: 2.5,
    tension: 0.5,
  },
  blueprint: {
    stroke: '#2563eb',
    darkStroke: '#60a5fa',
    strokeWidth: 1.5,
    tension: 0,
  },
  wireframe: {
    stroke: '#0891b2',
    darkStroke: '#22d3ee',
    strokeWidth: 2,
    tension: 0,
  },
  lineart: {
    stroke: '#09090b',
    darkStroke: '#ffffff',
    strokeWidth: 1.5,
    tension: 0.3,
  },
};

export function useCanvas() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'select' | 'rect' | 'circle' | 'text' | 'pan'>('pen');
  const [fillColor, setFillColor] = useState<string>('transparent');
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  
  // Pan and Zoom state
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });
  
  // Performance & Native Drawing Refs
  const rafRef = useRef<number | null>(null);
  const activeLineRef = useRef<any>(null);
  const currentPointsRef = useRef<number[]>([]);

  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  // Style state - stable hook, updates trigger re-render
  const [selectedStyle, setSelectedStyleState] = useState<SketchStyle>('wireframe');

  const setSelectedStyle = useCallback((style: SketchStyle) => {
    setSelectedStyleState(style);
  }, []);

  const styleConfig = useMemo(() => {
    const isDark = document.documentElement.classList.contains('dark');
    const config = STYLE_CONFIGS[selectedStyle] || STYLE_CONFIGS.wireframe;
    return {
      stroke: isDark ? config.darkStroke : config.stroke,
      strokeWidth: config.strokeWidth,
      tension: config.tension,
    };
  }, [selectedStyle]);

  const undo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      setElements(history[historyStep - 1]);
    }
  }, [history, historyStep]);

  const redo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prev => prev + 1);
      setElements(history[historyStep + 1]);
    }
  }, [history, historyStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' && !e.repeat) {
        setIsSpaceDown(true);
        if (tool !== 'pan') document.body.style.cursor = 'grab';
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          setElements(elements.filter(el => el.id !== selectedId));
          setSelectedId(null);
        }
      }
      if (e.key === 'v') setTool('select');
      if (e.key === 'p') setTool('pen');
      if (e.key === 'r') setTool('rect');
      if (e.key === 'o') setTool('circle');
      if (e.key === 't') setTool('text');
      if (e.key === 'h') setTool('pan');
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false);
        setIsPanning(false);
        if (tool !== 'pan') document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [historyStep, history, selectedId, elements, undo, redo]);

  const handleMouseDown = useCallback((e: any) => {
      
    if (tool === 'pan' || isSpaceDown) {
      if (tool === 'pan' || isSpaceDown) document.body.style.cursor = 'grabbing';
      setIsPanning(true);
      setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
      return;
    }

    if (tool === 'select') {
      const clickedId = e.target.id();
      const isShape = elements.some(el => el.id === clickedId);
      const isTransformer = e.target.getParent()?.className === 'Transformer';
      
      if (!isShape && !isTransformer) {
        setSelectedId(null);
      }
      return;
    }

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = (pos.x - stagePos.x) / stageScale;
    const y = (pos.y - stagePos.y) / stageScale;

    const id = Date.now().toString();
    const stroke = styleConfig.stroke;
    const strokeWidth = styleConfig.strokeWidth / stageScale;

    if (tool === 'pen') {
      currentPointsRef.current = [x, y];
      setIsDrawing(true);
      return;
    }

    setIsDrawing(true);
    setSelectedId(null);

    if (tool === 'rect') {
      setElements([...elements, { id, type: 'rect', x, y, width: 0, height: 0, stroke, strokeWidth, fill: fillColor }]);
    } else if (tool === 'circle') {
      setElements([...elements, { id, type: 'circle', x, y, radius: 0, stroke, strokeWidth, fill: fillColor }]);
    } else if (tool === 'text') {
      const text = prompt('Enter text:') || 'Text';
      setElements([...elements, { id, type: 'text', x, y, text, fontSize: fontSize / stageScale, fontFamily, stroke, strokeWidth: 1 }]);
      setIsDrawing(false);
    }
  }, [tool, elements, fillColor, fontSize, fontFamily, stagePos, stageScale, isSpaceDown, styleConfig]);

   const handleMouseMove = useCallback((e: any) => {
    if (isPanning) {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        const dx = e.evt.clientX - lastPanPos.x;
        const dy = e.evt.clientY - lastPanPos.y;
        setStagePos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastPanPos({ x: e.evt.clientX, y: e.evt.clientY });
        rafRef.current = null;
      });
      return;
    }

    if (!isDrawing) return;

    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      const x = (pos.x - stagePos.x) / stageScale;
      const y = (pos.y - stagePos.y) / stageScale;
      
      let lastElement = { ...elements[elements.length - 1] };

      if (tool === 'pen') {
        lastElement.points = lastElement.points!.concat([x, y]);
      } else if (tool === 'rect') {
        lastElement.width = x - lastElement.x!;
        lastElement.height = y - lastElement.y!;
      } else if (tool === 'circle') {
        const dx = x - lastElement.x!;
        const dy = y - lastElement.y!;
        lastElement.radius = Math.sqrt(dx * dx + dy * dy);
      }

      const newElements = [...elements];
      newElements[elements.length - 1] = lastElement;
      setElements(newElements);
      rafRef.current = null;
    });
  }, [isDrawing, elements, tool, isPanning, lastPanPos, stagePos, stageScale]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      if (tool !== 'pan' && !isSpaceDown) {
        document.body.style.cursor = 'default';
      } else if (tool === 'pan' || isSpaceDown) {
        document.body.style.cursor = 'grab';
      }
      return;
    }
    
    if (!isDrawing) return;
    
    if (tool === 'pen' && currentPointsRef.current.length > 0) {
      const stroke = styleConfig.stroke;
      const strokeWidth = styleConfig.strokeWidth / stageScale;
      const id = Date.now().toString();
      const newElement: CanvasElement = { 
        id, 
        type: 'pen', 
        points: currentPointsRef.current, 
        stroke, 
        strokeWidth 
      };
      
      const newElements = [...elements, newElement];
      setElements(newElements);
      
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
      
      currentPointsRef.current = [];
      if (activeLineRef.current) activeLineRef.current.points([]);
    }
    
    setIsDrawing(false);
  }, [elements, history, historyStep, isPanning, tool, isSpaceDown, isDrawing, styleConfig, stageScale]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const id = Date.now().toString();
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Put the image in the center of the viewport
          const x = (window.innerWidth / 2 - stagePos.x) / stageScale - img.width / 8;
          const y = (window.innerHeight / 2 - stagePos.y) / stageScale - img.height / 8;
          
          const newElement: CanvasElement = { 
            id, 
            type: 'image',
            x, 
            y, 
            width: img.width / 4, 
            height: img.height / 4, 
            stroke: 'transparent', 
            strokeWidth: 0,
            src: img.src
          };
          const newElements = [...elements, newElement];
          setElements(newElements);
          
          const newHistory = history.slice(0, historyStep + 1);
          newHistory.push(newElements);
          setHistory(newHistory);
          setHistoryStep(newHistory.length - 1);
          
          toast.success('Image uploaded successfully');
        };
      };
      reader.readAsDataURL(file);
    }
  }, [elements, history, historyStep]);

  const clearCanvasBase = useCallback(() => {
    setElements([]);
    setSelectedId(null);
    setHistory([[]]);
    setHistoryStep(0);
    setStagePos({ x: 0, y: 0 });
    setStageScale(1);
  }, []);

  const loadTemplate = useCallback((templateElements: any[]) => {
    const isDark = document.documentElement.className.includes('dark');
    const stroke = isDark ? '#ffffff' : '#000000';
    
    const processedElements = templateElements.map((el, index) => {
      let elementStroke = el.stroke;
      let elementFill = el.fill || 'transparent';
      
      if (el.stroke === '#000000') {
        elementStroke = stroke;
      }
      if (el.fill === '#000000') {
        elementFill = stroke;
      } else if (el.fill === '#ffffff') {
        elementFill = isDark ? '#ffffff' : '#000000';
      } else if (el.fill === '#999999') {
        elementFill = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
      }
      
      return {
        ...el,
        id: `template-${Date.now()}-${index}`,
        stroke: elementStroke,
        strokeWidth: el.strokeWidth || 2,
        fill: elementFill,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      };
    });
    
    setElements(processedElements);
    setHistory([processedElements]);
    setHistoryStep(0);
    setStagePos({ x: 0, y: 0 });
    setStageScale(1);
  }, []);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stageScale;

    // Get pointer position relative to canvas
    const pointer = stage.getPointerPosition();

    // Mouse point relative to local coords
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    // How to scale
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Limits
    if (newScale < 0.1 || newScale > 10) return;
    
    setStageScale(newScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, [stagePos, stageScale]);

  return {
    elements, setElements,
    selectedId, setSelectedId,
    isDrawing, setIsDrawing,
    tool, setTool,
    fillColor, setFillColor,
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    history, historyStep,
    handleMouseDown, handleMouseMove, handleMouseUp, handleWheel,
    undo, redo, clearCanvasBase, handleImageUpload, loadTemplate,
    stagePos, setStagePos, stageScale, setStageScale, isSpaceDown,
    activeLineRef, styleConfig, setSelectedStyle
  };
}
