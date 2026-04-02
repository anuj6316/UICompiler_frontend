import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text as KonvaText, Transformer, Image as KonvaImage, Label, Tag } from 'react-konva';
import useImage from 'use-image';
import { PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FloatingToolbar } from './FloatingToolbar';
import { CanvasMinimap } from './CanvasMinimap';
import { CanvasControls } from './CanvasControls';
import { CanvasNavigator } from './CanvasNavigator';
import { CanvasConnections } from './CanvasConnections';
import { QuickStartTemplates } from '../../../components/doodle-ui/QuickStartTemplates';
import { CanvasStyleSelector } from '../../../components/doodle-ui/CanvasStyleSelector';
import { DrawingGuidance } from '../../../components/doodle-ui/DrawingGuidance';
import { CanvasStatusBar } from '../../../components/doodle-ui/CanvasStatusBar';
import { SelectionInfoBar } from '../../../components/doodle-ui/SelectionInfoBar';
import { ElementProperties } from '../../../components/doodle-ui/ElementProperties';
import { SketchStyle } from '../hooks/useCanvas';
import { useTheme } from '../../../contexts/ThemeContext';
import { toast } from 'sonner';

const URLImage = ({ shape, isSelected, onSelect, onChange, isSelectTool }: any) => {
  const [img] = useImage(shape.src);
  const shapeRef = useRef<any>(null);

  return (
    <KonvaImage
      image={img}
      id={shape.id}
      ref={shapeRef}
      draggable={isSelectTool}
      x={shape.x || 0}
      y={shape.y || 0}
      width={shape.width}
      height={shape.height}
      scaleX={shape.scaleX || 1}
      scaleY={shape.scaleY || 1}
      rotation={shape.rotation || 0}
      onMouseDown={isSelectTool ? onSelect : undefined}
      onTouchStart={isSelectTool ? onSelect : undefined}
      onDragEnd={(e: any) => {
        onChange({ ...shape, x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={(e: any) => {
        const node = shapeRef.current;
        onChange({ ...shape, x: node.x(), y: node.y(), scaleX: node.scaleX(), scaleY: node.scaleY(), rotation: node.rotation() });
      }}
    />
  );
};

const RenderElement = ({ shape, isSelected, onSelect, onChange, isSelectTool, stageScale = 1, tension = 0.5 }: any) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  let labelX = shape.x || 0;
  let labelY = shape.y || 0;

  if (shape.type === 'pen' && shape.points && shape.points.length > 0) {
    let minX = shape.points[0];
    let minY = shape.points[1];
    for (let i = 0; i < shape.points.length; i += 2) {
      if (shape.points[i] < minX) minX = shape.points[i];
      if (shape.points[i + 1] < minY) minY = shape.points[i + 1];
    }
    labelX += minX;
    labelY += minY;
  } else if (shape.type === 'circle') {
    labelX -= (shape.radius || 0);
    labelY -= (shape.radius || 0);
  }

  const commonProps = {
    id: shape.id,
    ref: shapeRef,
    stroke: shape.stroke,
    strokeWidth: shape.strokeWidth,
    draggable: isSelectTool,
    x: shape.x || 0,
    y: shape.y || 0,
    scaleX: shape.scaleX || 1,
    scaleY: shape.scaleY || 1,
    rotation: shape.rotation || 0,
    onMouseDown: isSelectTool ? (e: any) => onSelect() : undefined,
    onTouchStart: isSelectTool ? (e: any) => onSelect() : undefined,
    onDragEnd: (e: any) => {
      onChange({ ...shape, x: e.target.x(), y: e.target.y() });
    },
    onTransformEnd: (e: any) => {
      const node = shapeRef.current;
      onChange({ ...shape, x: node.x(), y: node.y(), scaleX: node.scaleX(), scaleY: node.scaleY(), rotation: node.rotation() });
    },
  };

  return (
    <React.Fragment>
      {shape.type === 'pen' && (
        <Line {...commonProps} points={shape.points} tension={tension} lineCap="round" lineJoin="round" hitStrokeWidth={10} />
      )}
      {shape.type === 'rect' && (
        <Rect {...commonProps} width={shape.width} height={shape.height} fill={shape.fill} />
      )}
      {shape.type === 'circle' && (
        <Circle {...commonProps} radius={shape.radius} fill={shape.fill} />
      )}
      {shape.type === 'text' && (
        <KonvaText {...commonProps} text={shape.text} fontSize={shape.fontSize} fontFamily={shape.fontFamily} fill={shape.stroke} />
      )}
      {shape.type === 'image' && (
        <URLImage shape={shape} isSelected={isSelected} onSelect={onSelect} onChange={onChange} isSelectTool={isSelectTool} />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          borderStroke="#0ea5e9"
          borderStrokeWidth={2}
          anchorSize={8}
          anchorFill="#ffffff"
          anchorStroke="#0ea5e9"
          anchorStrokeWidth={2}
          anchorCornerRadius={4}
          padding={5}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) return oldBox;
            return newBox;
          }}
        />
      )}
      {isSelected && (
        <Label x={labelX + (15 / stageScale)} y={labelY - (5 / stageScale)} scaleX={1 / stageScale} scaleY={1 / stageScale}>
          <Tag fill="#0ea5e9" cornerRadius={4} pointerDirection="down" pointerWidth={6} pointerHeight={6} />
          <KonvaText text={`${shape.type} | ${shape.id.slice(-4)}`} fontFamily="monospace" fontSize={10} padding={4} fill="white" />
        </Label>
      )}
    </React.Fragment>
  );
};

interface CanvasAreaProps {
  canvasState: any;
  generated: boolean;
  selectedStyle: SketchStyle;
  onSelectStyle: (style: SketchStyle) => void;
  genState?: any;
  onGenerateWireframe?: () => void;
}

export function CanvasArea({ canvasState, generated, selectedStyle, onSelectStyle, genState, onGenerateWireframe }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const { isDark } = useTheme();
  const [showGuidance, setShowGuidance] = useState(true);
  const hasDrawn = canvasState.elements.length > 0;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasDrawn && showGuidance) setShowGuidance(false);
  }, [hasDrawn, showGuidance]);

  useEffect(() => {
    canvasState.setSelectedStyle(selectedStyle);
  }, [selectedStyle, canvasState]);

  const onFitToScreen = () => {
    if (canvasState.elements.length === 0) {
      canvasState.setStageScale(1);
      canvasState.setStagePos({ x: 0, y: 0 });
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    canvasState.elements.forEach((el: any) => {
      const x = el.x || 0;
      const y = el.y || 0;
      const w = el.width || el.radius || 100;
      const h = el.height || el.radius || 100;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    });

    const padding = 100;
    const w = (maxX - minX) + padding * 2;
    const h = (maxY - minY) + padding * 2;
    const scale = Math.min(stageSize.width / w, stageSize.height / h);

    canvasState.setStageScale(Math.min(1.5, Math.max(0.1, scale)));
    canvasState.setStagePos({
      x: -minX * scale + (stageSize.width - (maxX - minX) * scale) / 2,
      y: -minY * scale + (stageSize.height - (maxY - minY) * scale) / 2
    });
  };

  const cursorClass = canvasState.tool === 'select' ? 'cursor-default' :
    canvasState.tool === 'pan' ? 'cursor-grab' :
    canvasState.tool === 'text' ? 'cursor-text' :
    'cursor-crosshair';

  return (
    <div ref={containerRef} className={`absolute inset-0 ${cursorClass}`}>
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 2px, transparent 0),
            radial-gradient(${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 1px, transparent 0)
          `,
          backgroundSize: `${120 * canvasState.stageScale}px ${120 * canvasState.stageScale}px, ${24 * canvasState.stageScale}px ${24 * canvasState.stageScale}px`,
          backgroundPosition: `${canvasState.stagePos.x}px ${canvasState.stagePos.y}px, ${canvasState.stagePos.x}px ${canvasState.stagePos.y}px`,
        }}
      />
      
      {/* Paper Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" 
        style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')` }} 
      />

      {/* Konva Stage - interactive layer, z-index 10 */}
      {stageSize.width > 0 && stageSize.height > 0 && (
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          x={canvasState.stagePos.x}
          y={canvasState.stagePos.y}
          scaleX={canvasState.stageScale}
          scaleY={canvasState.stageScale}
          onWheel={canvasState.handleWheel}
          onMouseDown={canvasState.handleMouseDown}
          onMouseMove={canvasState.handleMouseMove}
          onMouseUp={canvasState.handleMouseUp}
          onTouchStart={canvasState.handleMouseDown}
          onTouchMove={canvasState.handleMouseMove}
          onTouchEnd={canvasState.handleMouseUp}
          className="absolute inset-0"
          style={{ zIndex: 10 }}
        >
          <Layer>
            {canvasState.elements.map((el: any, i: number) => (
              <RenderElement
                key={el.id}
                shape={el}
                isSelected={el.id === canvasState.selectedId || canvasState.selectedIds?.includes(el.id)}
                isSelectTool={canvasState.tool === 'select'}
                stageScale={canvasState.stageScale}
                tension={canvasState.styleConfig?.tension || 0.5}
                onSelect={(e: any) => {
                  if (canvasState.tool === 'select') {
                    if (e?.evt?.shiftKey) {
                      canvasState.addToSelection(el.id);
                    } else {
                      canvasState.setSelectedId(el.id);
                    }
                  }
                }}
                onChange={(newAttrs: any) => {
                  const newElements = canvasState.elements.slice();
                  newElements[i] = newAttrs;
                  canvasState.setElements(newElements);
                }}
              />
            ))}
            <CanvasConnections elements={canvasState.elements} />
          </Layer>
          
          {/* Active Drawing Layer */}
          <Layer id="active-drawing-layer">
            <Line
              ref={canvasState.activeLineRef}
              stroke={canvasState.styleConfig?.stroke || (isDark ? '#ffffff' : '#000000')}
              strokeWidth={(canvasState.styleConfig?.strokeWidth || 3) / canvasState.stageScale}
              tension={canvasState.styleConfig?.tension || 0.5}
              lineCap="round"
              lineJoin="round"
              points={[]}
            />
          </Layer>
          
          {/* Draft Element Preview Layer */}
          {canvasState.draftElement && (
            <Layer id="draft-element-layer">
              <RenderElement
                shape={canvasState.draftElement}
                isSelected={false}
                isSelectTool={false}
                stageScale={canvasState.stageScale}
                tension={canvasState.styleConfig?.tension || 0.5}
                onSelect={() => {}}
                onChange={() => {}}
              />
            </Layer>
          )}
          
          {/* Drag Select Rectangle Overlay */}
          {canvasState.isDragSelecting && canvasState.dragSelectStart && canvasState.dragSelectEnd && (
            <Layer id="drag-select-layer">
              <Rect
                x={Math.min(canvasState.dragSelectStart.x, canvasState.dragSelectEnd.x)}
                y={Math.min(canvasState.dragSelectStart.y, canvasState.dragSelectEnd.y)}
                width={Math.abs(canvasState.dragSelectEnd.x - canvasState.dragSelectStart.x)}
                height={Math.abs(canvasState.dragSelectEnd.y - canvasState.dragSelectStart.y)}
                stroke="#0ea5e9"
                strokeWidth={2 / canvasState.stageScale}
                dash={[5 / canvasState.stageScale, 5 / canvasState.stageScale]}
                fill="rgba(14, 165, 233, 0.08)"
              />
            </Layer>
          )}
        </Stage>
      )}

      {/* Empty State - behind Stage (z-index 5), non-blocking */}
      <AnimatePresence>
        {!hasDrawn && showGuidance && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 5 }}
          >
            <div className="text-center max-w-lg px-6 pointer-events-none">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08]"
              >
                <PenTool className="w-8 h-8 text-zinc-400 dark:text-zinc-600" />
              </motion.div>
              
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">
                Start Sketching
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8">
                Draw your interface idea or pick a template below
              </p>
              
              {/* Quick Templates - pointer-events-auto to allow clicking */}
              <div className="pointer-events-auto mb-6">
                <QuickStartTemplates onSelect={(elements) => {
                  canvasState.loadTemplate(elements);
                  toast.success('Template loaded');
                }} />
              </div>
              
              {/* Tool hints */}
              <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded-none bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] text-zinc-500">P</kbd> PEN
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded-none bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] text-zinc-500">R</kbd> RECT
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded-none bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] text-zinc-500">?</kbd> SHORTCUTS
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool-Specific Guidance */}
      <AnimatePresence>
        {hasDrawn && showGuidance && canvasState.elements.length < 3 && (
          <DrawingGuidance 
            tool={canvasState.tool} 
            onDismiss={() => setShowGuidance(false)} 
          />
        )}
      </AnimatePresence>

      {/* Floating Toolbar */}
      <div style={{ zIndex: 30 }}>
        <FloatingToolbar
          tool={canvasState.tool} setTool={canvasState.setTool}
          selectedId={canvasState.selectedId}
          elements={canvasState.elements} setElements={canvasState.setElements}
          fillColor={canvasState.fillColor} setFillColor={canvasState.setFillColor}
          fontSize={canvasState.fontSize} setFontSize={canvasState.setFontSize}
          fontFamily={canvasState.fontFamily} setFontFamily={canvasState.setFontFamily}
          onImageUpload={canvasState.handleImageUpload}
          undo={canvasState.undo} redo={canvasState.redo} clearCanvas={canvasState.clearCanvasBase}
        />
      </div>

      {/* Canvas Controls */}
      <div style={{ zIndex: 30 }} className="absolute top-0 right-0">
        <CanvasControls 
          stageScale={canvasState.stageScale} 
          setStageScale={canvasState.setStageScale}
          setStagePos={canvasState.setStagePos}
          onFitToScreen={onFitToScreen}
          zoomLevel={canvasState.stageScale}
        />
      </div>

      {/* Canvas Navigator */}
      <div style={{ zIndex: 30 }}>
        <CanvasNavigator 
          elements={canvasState.elements}
          selectedId={canvasState.selectedId}
          setSelectedId={canvasState.setSelectedId}
          stageScale={canvasState.stageScale}
          setStagePos={canvasState.setStagePos}
          viewportSize={stageSize}
        />
      </div>

      {/* Minimap */}
      <div style={{ zIndex: 50 }} className="absolute bottom-0 right-0">
        <CanvasMinimap 
          elements={canvasState.elements}
          stagePos={canvasState.stagePos}
          stageScale={canvasState.stageScale}
          setStagePos={canvasState.setStagePos}
          viewportSize={stageSize}
        />
      </div>

      {/* Style Selector */}
      <div style={{ zIndex: 40 }} className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
        <CanvasStyleSelector 
          selectedStyle={selectedStyle}
          onSelect={onSelectStyle}
        />
      </div>

      {/* Status Bar */}
      <div style={{ zIndex: 40 }} className="absolute bottom-0 left-0">
        <CanvasStatusBar 
          elementCount={canvasState.elements.length}
          zoomLevel={canvasState.stageScale}
          currentTool={canvasState.tool}
          selectedCount={canvasState.selectedIds?.length || (canvasState.selectedId ? 1 : 0)}
        />
      </div>

      {/* Selection Info Bar */}
      <SelectionInfoBar
        selectedCount={canvasState.selectedIds?.length || (canvasState.selectedId ? 1 : 0)}
        selectedElement={canvasState.elements.find((el: any) => el.id === canvasState.selectedId)}
        onDelete={() => {
          const idsToDelete = canvasState.selectedIds.length > 0 ? canvasState.selectedIds : [canvasState.selectedId];
          const newElements = canvasState.elements.filter((el: any) => !idsToDelete.includes(el.id));
          canvasState.setElements(newElements);
          canvasState.setSelectedId(null);
          canvasState.setSelectedIds([]);
          toast.success('Elements deleted');
        }}
        onDuplicate={() => {
          const idsToDuplicate = canvasState.selectedIds.length > 0 ? canvasState.selectedIds : [canvasState.selectedId];
          const elementsToDuplicate = canvasState.elements.filter((el: any) => idsToDuplicate.includes(el.id));
          const newElements = [...canvasState.elements];
          elementsToDuplicate.forEach((el: any) => {
            newElements.push({ ...el, id: `dup-${Date.now()}-${Math.random()}`, x: (el.x || 0) + 20, y: (el.y || 0) + 20 });
          });
          canvasState.setElements(newElements);
          toast.success('Elements duplicated');
        }}
        onBringForward={() => {}}
        onSendBackward={() => {}}
        onPositionChange={() => {}}
        onGenerateWireframe={onGenerateWireframe || (() => {
          if (canvasState.elements.length > 0) {
            genState?.handleProcessStep?.('wireframe');
            genState?.setCurrentStep?.('wireframe');
            toast.success('Generating wireframe...');
          }
        })}
        isGenerating={genState?.generationState === 'processing'}
      />

      {/* Element Properties Panel */}
      <ElementProperties
        element={canvasState.elements.find((el: any) => el.id === canvasState.selectedId)}
        onUpdate={(updates) => {
          if (canvasState.selectedId) {
            const newElements = canvasState.elements.map((el: any) =>
              el.id === canvasState.selectedId ? { ...el, ...updates } : el
            );
            canvasState.setElements(newElements);
          }
        }}
        onClose={() => canvasState.setSelectedId(null)}
        isOpen={!!canvasState.selectedId && canvasState.tool === 'select'}
      />
    </div>
  );
}
