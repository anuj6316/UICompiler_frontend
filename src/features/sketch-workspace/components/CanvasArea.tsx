import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text as KonvaText, Transformer, Image as KonvaImage, Label, Tag } from 'react-konva';
import { Html } from 'react-konva-utils';
import useImage from 'use-image';
import { PenTool } from 'lucide-react';
import { motion } from 'motion/react';
import { FloatingToolbar } from './FloatingToolbar';
import { CanvasMinimap } from './CanvasMinimap';
import { CanvasControls } from './CanvasControls';
import { CanvasNavigator } from './CanvasNavigator';
import { CanvasConnections } from './CanvasConnections';
import { ElementType, CanvasElement } from '../hooks/useCanvas';
import { useTheme } from '../../../contexts/ThemeContext';

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
        onChange({
          ...shape,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e: any) => {
        const node = shapeRef.current;
        onChange({
          ...shape,
          x: node.x(),
          y: node.y(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
          rotation: node.rotation(),
        });
      }}
    />
  );
};

const RenderElement = ({ shape, isSelected, onSelect, onChange, isSelectTool, stageScale = 1 }: any) => {
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
      onChange({
        ...shape,
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    onTransformEnd: (e: any) => {
      const node = shapeRef.current;
      onChange({
        ...shape,
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      });
    },
  };

  return (
    <React.Fragment>
      {shape.type === 'pen' && (
        <Line
          {...commonProps}
          points={shape.points}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          hitStrokeWidth={10}
        />
      )}
      {shape.type === 'rect' && (
        <Rect
          {...commonProps}
          width={shape.width}
          height={shape.height}
          fill={shape.fill}
        />
      )}
      {shape.type === 'circle' && (
        <Circle
          {...commonProps}
          radius={shape.radius}
          fill={shape.fill}
        />
      )}
      {shape.type === 'text' && (
        <KonvaText
          {...commonProps}
          text={shape.text}
          fontSize={shape.fontSize}
          fontFamily={shape.fontFamily}
          fill={shape.stroke}
        />
      )}
      {shape.type === 'image' && (
        <URLImage
          shape={shape}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          isSelectTool={isSelectTool}
        />
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
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
      {isSelected && (
        <Label
          x={labelX + (15 / stageScale)}
          y={labelY - (5 / stageScale)}
          scaleX={1 / stageScale}
          scaleY={1 / stageScale}
        >
          <Tag
            fill="#0ea5e9"
            cornerRadius={4}
            pointerDirection="down"
            pointerWidth={6}
            pointerHeight={6}
          />
          <KonvaText
            text={`${shape.type} | ${shape.id.slice(-4)}`}
            fontFamily="monospace"
            fontSize={10}
            padding={4}
            fill="white"
          />
        </Label>
      )}
    </React.Fragment>
  );
};

interface CanvasAreaProps {
  canvasState: any;
  generated: boolean;
}

export function CanvasArea({ canvasState, generated }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const { isDark } = useTheme();

  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [generated]);

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

    const scale = Math.min(
      stageSize.width / w,
      stageSize.height / h
    );

    canvasState.setStageScale(Math.min(1.5, Math.max(0.1, scale)));
    canvasState.setStagePos({
      x: -minX * scale + (stageSize.width - (maxX - minX) * scale) / 2,
      y: -minY * scale + (stageSize.height - (maxY - minY) * scale) / 2
    });
  };

  return (
    <div ref={containerRef} className="flex-1 relative bg-background overflow-hidden cursor-crosshair">
      <FloatingToolbar
        tool={canvasState.tool} setTool={canvasState.setTool}
        selectedId={canvasState.selectedId}
        elements={canvasState.elements} setElements={canvasState.setElements}
        fillColor={canvasState.fillColor} setFillColor={canvasState.setFillColor}
        fontSize={canvasState.fontSize} setFontSize={canvasState.setFontSize}
        fontFamily={canvasState.fontFamily} setFontFamily={canvasState.setFontFamily}
        handleImageUpload={canvasState.handleImageUpload}
        undo={canvasState.undo} redo={canvasState.redo} clearCanvas={canvasState.clearCanvasBase}
      />

      <CanvasControls 
        stageScale={canvasState.stageScale} 
        setStageScale={canvasState.setStageScale}
        setStagePos={canvasState.setStagePos}
        onFitToScreen={onFitToScreen}
        zoomLevel={canvasState.stageScale}
      />

      <CanvasMinimap 
        elements={canvasState.elements}
        stagePos={canvasState.stagePos}
        stageScale={canvasState.stageScale}
        setStagePos={canvasState.setStagePos}
        viewportSize={stageSize}
      />
      {/* Professional Dynamic Duo-Grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 2px, transparent 0),
            radial-gradient(${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 1px, transparent 0)
          `,
          backgroundSize: `
            ${120 * canvasState.stageScale}px ${120 * canvasState.stageScale}px,
            ${24 * canvasState.stageScale}px ${24 * canvasState.stageScale}px
          `,
          backgroundPosition: `
            ${canvasState.stagePos.x}px ${canvasState.stagePos.y}px,
            ${canvasState.stagePos.x}px ${canvasState.stagePos.y}px
          `,
          willChange: 'background-position'
        }}
      />
      
      {/* Subtle Paper Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" 
        style={{ 
          backgroundImage: `url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')`,
          willChange: 'opacity'
        }} 
      />
      
      {stageSize.width > 0 && (
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
          className="absolute inset-0 z-10"
        >
          <Layer>
            {canvasState.elements.map((el: any, i: number) => (
              <RenderElement
                key={el.id}
                shape={el}
                isSelected={el.id === canvasState.selectedId}
                isSelectTool={canvasState.tool === 'select'}
                stageScale={canvasState.stageScale}
                onSelect={() => {
                  if (canvasState.tool === 'select') {
                    canvasState.setSelectedId(el.id);
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
          
          {/* Native Active Drawing Layer (Bypasses React while drawing) */}
          <Layer id="active-drawing-layer">
            <Line
              ref={canvasState.activeLineRef}
              stroke={isDark ? '#ffffff' : '#000000'}
              strokeWidth={3 / canvasState.stageScale}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              points={[]}
            />
          </Layer>
        </Stage>
      )}

      <CanvasNavigator 
        elements={canvasState.elements}
        selectedId={canvasState.selectedId}
        setSelectedId={canvasState.setSelectedId}
        stageScale={canvasState.stageScale}
        setStagePos={canvasState.setStagePos}
        viewportSize={stageSize}
      />

      {canvasState.elements.length === 0 && !canvasState.isDrawing && !generated && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-0"
        >
          <div className="text-center max-w-xs">
            <div className="relative w-24 h-24 mx-auto mb-10">
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-zinc-100 dark:bg-white/[0.03] rounded-none rotate-6" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <PenTool className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
              </div>
            </div>
            <h3 className="text-xl font-heading font-bold text-zinc-900 dark:text-white mb-3 tracking-tight uppercase">Prime Canvas</h3>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500 leading-relaxed uppercase tracking-[0.05em]">
              Sketch your vision. The intelligence layer will infer structure and compile your logic.
            </p>
            <div className="mt-12 flex items-center justify-center gap-6 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              <span className="flex items-center gap-2"><kbd className="px-2 py-1 rounded-none bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] text-zinc-500">P</kbd> PEN</span>
              <span className="flex items-center gap-2"><kbd className="px-2 py-1 rounded-none bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.1] text-zinc-500">R</kbd> RECT</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
