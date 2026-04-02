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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
  const draftElementRef = useRef<CanvasElement | null>(null);
  const [draftElement, setDraftElement] = useState<CanvasElement | null>(null);
  const [isDragSelecting, setIsDragSelecting] = useState(false);
  const [dragSelectStart, setDragSelectStart] = useState<{ x: number; y: number } | null>(null);
  const [dragSelectEnd, setDragSelectEnd] = useState<{ x: number; y: number } | null>(null);

  const pushHistory = useCallback((newElements: CanvasElement[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(newElements);
      setHistoryStep(newHistory.length - 1);
      return newHistory;
    });
  }, [historyStep]);

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

  const addToSelection = useCallback((id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setSelectedId(null);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(elements.map(el => el.id));
  }, [elements]);

  const getSelectedElements = useCallback(() => {
    return elements.filter(el => selectedIds.includes(el.id));
  }, [elements, selectedIds]);

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
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selectAll();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const idsToDelete = selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : [];
        if (idsToDelete.length > 0) {
          const newElements = elements.filter(el => !idsToDelete.includes(el.id));
          setElements(newElements);
          pushHistory(newElements);
          setSelectedId(null);
          setSelectedIds([]);
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
  }, [historyStep, history, selectedId, elements, undo, redo, pushHistory]);

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
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        const x = (pos.x - stagePos.x) / stageScale;
        const y = (pos.y - stagePos.y) / stageScale;
        
        if (!e.evt.shiftKey) {
          setSelectedId(null);
          setSelectedIds([]);
        }
        setDragSelectStart({ x, y });
        setIsDragSelecting(true);
      } else if (!e.evt.shiftKey) {
        setSelectedId(clickedId);
        setSelectedIds([]);
      } else {
        addToSelection(clickedId);
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
      setDraftElement(null);
      draftElementRef.current = { id, type: 'rect', x, y, width: 0, height: 0, stroke, strokeWidth, fill: fillColor };
    } else if (tool === 'circle') {
      setDraftElement(null);
      draftElementRef.current = { id, type: 'circle', x, y, radius: 0, stroke, strokeWidth, fill: fillColor };
    } else if (tool === 'text') {
      const text = prompt('Enter text:') || 'Text';
      const newElements = [...elements, { id, type: 'text' as ElementType, x, y, text, fontSize: fontSize / stageScale, fontFamily, stroke, strokeWidth: 1 }];
      setElements(newElements);
      pushHistory(newElements);
      setIsDrawing(false);
    }
  }, [tool, elements, fillColor, fontSize, fontFamily, stagePos, stageScale, isSpaceDown, styleConfig, pushHistory]);

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

    if (isDragSelecting && dragSelectStart) {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      const x = (pos.x - stagePos.x) / stageScale;
      const y = (pos.y - stagePos.y) / stageScale;
      setDragSelectEnd({ x, y });
      return;
    }

    if (!isDrawing) return;

    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      const x = (pos.x - stagePos.x) / stageScale;
      const y = (pos.y - stagePos.y) / stageScale;
      
      if (tool === 'pen') {
        currentPointsRef.current = currentPointsRef.current.concat([x, y]);
        if (activeLineRef.current) {
          activeLineRef.current.points(currentPointsRef.current);
        }
        rafRef.current = null;
        return;
      }

      if (tool === 'rect' && draftElementRef.current) {
        draftElementRef.current = { ...draftElementRef.current, width: x - draftElementRef.current.x!, height: y - draftElementRef.current.y! };
        setDraftElement(draftElementRef.current);
      } else if (tool === 'circle' && draftElementRef.current) {
        const dx = x - draftElementRef.current.x!;
        const dy = y - draftElementRef.current.y!;
        draftElementRef.current = { ...draftElementRef.current, radius: Math.sqrt(dx * dx + dy * dy) };
        setDraftElement(draftElementRef.current);
      }

      rafRef.current = null;
    });
  }, [isDrawing, elements, tool, isPanning, lastPanPos, stagePos, stageScale, isDragSelecting, dragSelectStart]);

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
    
    if (isDragSelecting && dragSelectStart && dragSelectEnd) {
      const minX = Math.min(dragSelectStart.x, dragSelectEnd.x);
      const minY = Math.min(dragSelectStart.y, dragSelectEnd.y);
      const maxX = Math.max(dragSelectStart.x, dragSelectEnd.x);
      const maxY = Math.max(dragSelectStart.y, dragSelectEnd.y);
      
      const selectedInBox = elements.filter(el => {
        const elX = el.x || 0;
        const elY = el.y || 0;
        const elW = el.width || el.radius * 2 || 50;
        const elH = el.height || el.radius * 2 || 50;
        
        const elCenterX = elX + elW / 2;
        const elCenterY = elY + elH / 2;
        
        return elCenterX >= minX && elCenterX <= maxX && elCenterY >= minY && elCenterY <= maxY;
      }).map(el => el.id);
      
      setSelectedIds(selectedInBox);
      setIsDragSelecting(false);
      setDragSelectStart(null);
      setDragSelectEnd(null);
      return;
    }
    
    if (!isDrawing) return;
    
    let finalElements = elements;
    
    if (tool === 'pen' && currentPointsRef.current.length > 0) {
      const newElement: CanvasElement = { 
        id: Date.now().toString(), 
        type: 'pen', 
        points: currentPointsRef.current, 
        stroke: styleConfig.stroke, 
        strokeWidth: styleConfig.strokeWidth / stageScale 
      };
      finalElements = [...elements, newElement];
      setElements(finalElements);
      currentPointsRef.current = [];
      if (activeLineRef.current) activeLineRef.current.points([]);
    } else if ((tool === 'rect' || tool === 'circle') && draftElementRef.current) {
      finalElements = [...elements, draftElementRef.current];
      setElements(finalElements);
      setDraftElement(null);
      draftElementRef.current = null;
    }
    
    pushHistory(finalElements);
    setIsDrawing(false);
  }, [elements, history, historyStep, isPanning, tool, isSpaceDown, isDrawing, styleConfig, stageScale, pushHistory, isDragSelecting, dragSelectStart, dragSelectEnd]);

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
    selectedIds, setSelectedIds,
    isDrawing, setIsDrawing,
    tool, setTool,
    fillColor, setFillColor,
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    history, historyStep,
    handleMouseDown, handleMouseMove, handleMouseUp, handleWheel,
    undo, redo, clearCanvasBase, handleImageUpload, loadTemplate,
    stagePos, setStagePos, stageScale, setStageScale, isSpaceDown,
    activeLineRef, styleConfig, setSelectedStyle,
    addToSelection, clearSelection, selectAll, getSelectedElements,
    draftElement, isDragSelecting, dragSelectStart, dragSelectEnd
  };
}
