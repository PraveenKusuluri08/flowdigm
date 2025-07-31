// components/Canvas/GridBackground.jsx
import React from 'react';
import { Line } from 'react-konva';
import { useCanvas } from '../../hooks/useCanvas';

const GridBackground = () => {
  const { state } = useCanvas();
  const { grid, stage } = state;

  if (!grid.visible) return null;

  const lines = [];
  const gridSize = grid.size;
  const stageWidth = stage.width;
  const stageHeight = stage.height;

  // Calculate visible area considering stage position and scale
  const startX = Math.floor((-stage.x) / stage.scale / gridSize) * gridSize;
  const endX = Math.ceil((stageWidth - stage.x) / stage.scale / gridSize) * gridSize;
  const startY = Math.floor((-stage.y) / stage.scale / gridSize) * gridSize;
  const endY = Math.ceil((stageHeight - stage.y) / stage.scale / gridSize) * gridSize;

  // Vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, startY, x, endY]}
        stroke="#e0e0e0"
        strokeWidth={0.5}
        listening={false}
      />
    );
  }

  // Horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[startX, y, endX, y]}
        stroke="#e0e0e0"
        strokeWidth={0.5}
        listening={false}
      />
    );
  }

  return <>{lines}</>;
};

export default GridBackground;