import React from 'react';
import { Arrow, Group } from 'react-konva';
import { CanvasElement } from '../hooks/useCanvas';

interface CanvasConnectionsProps {
  elements: CanvasElement[];
}

export function CanvasConnections({ elements }: CanvasConnectionsProps) {
  // Find all 'result' elements that have a 'sourceSketchId'
  const connections = elements.filter(el => el.type === 'result' && el.sourceSketchId);

  return (
    <Group>
      {connections.map((result) => {
        const source = elements.find(el => el.id === result.sourceSketchId);
        if (!source) return null;

        // Calculate source center
        const sx = (source.x || 0) + (source.width || source.radius || 50) / 2;
        const sy = (source.y || 0) + (source.height || source.radius || 50) / 2;

        // Target (Result) top-left
        const tx = result.x || 0;
        const ty = result.y || 0;

        return (
          <Arrow
            key={`conn-${result.id}`}
            points={[sx, sy, tx, ty]}
            stroke="var(--color-border)"
            strokeWidth={1}
            opacity={0.3}
            dash={[5, 5]}
            pointerLength={5}
            pointerWidth={5}
            fill="var(--color-border)"
            tension={0.2}
          />
        );
      })}
    </Group>
  );
}
