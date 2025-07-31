// components/CanvasEditor/ShapeComponents.tsx - STABLE positioning
import React, { useRef, useCallback, useEffect } from 'react';
import { Rect, Circle, Line, RegularPolygon, Star, Text, Group, Ellipse } from 'react-konva';
import { useCanvas } from '../../hooks/useCanvas';

// Base Shape with STABLE positioning - no random movements
const BaseShape = ({ shape, children }) => {
  const { state, updateShape, selectShapes } = useCanvas();
  const shapeRef = useRef();
  const isSelected = state.selectedShapeIds?.includes(shape.id) || false;

  // Set the ID on the node so transformer can find it
  useEffect(() => {
    if (shapeRef.current) {
      shapeRef.current.id(shape.id);
    }
  }, [shape.id]);

  // Handle click - CLEAN selection
  const handleClick = useCallback((e) => {
    e.cancelBubble = true;
    
    if (state.tool === 'select') {
      if (e.evt.ctrlKey || e.evt.metaKey) {
        const newSelection = isSelected
          ? state.selectedShapeIds.filter(id => id !== shape.id)
          : [...(state.selectedShapeIds || []), shape.id];
        selectShapes(newSelection);
      } else {
        selectShapes([shape.id]);
      }
    }
  }, [state.tool, state.selectedShapeIds, isSelected, selectShapes, shape.id]);

  // Handle drag end - SIMPLE position update
  const handleDragEnd = useCallback((e) => {
    const node = e.target;
    updateShape(shape.id, { 
      x: node.x(), 
      y: node.y() 
    });
  }, [updateShape, shape.id]);

  // Handle double click for text editing
  const handleDoubleClick = useCallback((e) => {
    e.cancelBubble = true;
    if (shape.type === 'text') {
      const newText = prompt('Edit text:', shape.text || '');
      if (newText !== null) {
        updateShape(shape.id, { text: newText });
      }
    }
  }, [shape.type, shape.text, updateShape, shape.id]);

  // STABLE: Use absolute positioning for everything
  return (
    <Group
      ref={shapeRef}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      draggable={true}
      onClick={handleClick}
      onDblClick={handleDoubleClick}
      onDragEnd={handleDragEnd}
    >
      {React.cloneElement(children, {
        // CRITICAL: Use absolute coordinates, not relative
        x: 0,
        y: 0,
        width: shape.width,
        height: shape.height,
        stroke: isSelected ? '#0066ff' : shape.stroke,
        strokeWidth: isSelected ? Math.max(2, shape.strokeWidth || 1) : (shape.strokeWidth || 1),
      })}
    </Group>
  );
};

// STABLE Shapes - Fixed positioning
export const RectangleShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Rect
      fill={shape.fill}
      cornerRadius={shape.cornerRadius || 0}
    />
  </BaseShape>
);

export const CircleShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Circle
      x={shape.width / 2}
      y={shape.height / 2}
      radius={Math.min(shape.width, shape.height) / 2}
      fill={shape.fill}
    />
  </BaseShape>
);

export const TriangleShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <RegularPolygon
      x={shape.width / 2}
      y={shape.height / 2}
      sides={3}
      radius={Math.min(shape.width, shape.height) / 2}
      fill={shape.fill}
    />
  </BaseShape>
);

export const DiamondShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <RegularPolygon
      x={shape.width / 2}
      y={shape.height / 2}
      sides={4}
      radius={Math.min(shape.width, shape.height) / 2}
      fill={shape.fill}
      rotation={45}
    />
  </BaseShape>
);

export const HexagonShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <RegularPolygon
      x={shape.width / 2}
      y={shape.height / 2}
      sides={6}
      radius={Math.min(shape.width, shape.height) / 2}
      fill={shape.fill}
    />
  </BaseShape>
);

export const StarShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Star
      x={shape.width / 2}
      y={shape.height / 2}
      numPoints={5}
      innerRadius={Math.min(shape.width, shape.height) / 4}
      outerRadius={Math.min(shape.width, shape.height) / 2}
      fill={shape.fill}
    />
  </BaseShape>
);

// STABLE Line Shape - Special handling
export const LineShape = ({ shape }) => {
  const { state, selectShapes, updateShape } = useCanvas();
  const isSelected = state.selectedShapeIds?.includes(shape.id) || false;
  const lineRef = useRef();
  
  // Set ID for transformer
  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.id(shape.id);
    }
  }, [shape.id]);

  const points = shape.points || [0, 0, shape.width || 100, 0];

  const handleClick = useCallback((e) => {
    e.cancelBubble = true;
    if (state.tool === 'select') {
      selectShapes([shape.id]);
    }
  }, [state.tool, selectShapes, shape.id]);

  const handleDragEnd = useCallback((e) => {
    const node = e.target;
    updateShape(shape.id, { 
      x: node.x(), 
      y: node.y() 
    });
  }, [updateShape, shape.id]);

  return (
    <Line
      ref={lineRef}
      x={shape.x}
      y={shape.y}
      points={points}
      stroke={isSelected ? '#0066ff' : shape.stroke}
      strokeWidth={isSelected ? 3 : (shape.strokeWidth || 2)}
      lineCap="round"
      lineJoin="round"
      draggable={true}
      onClick={handleClick}
      onDragEnd={handleDragEnd}
    />
  );
};

export const TextShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Text
      text={shape.text || 'Text'}
      fontSize={shape.fontSize || 16}
      fontFamily={shape.fontFamily || 'Arial'}
      fill={shape.fill || '#000000'}
    />
  </BaseShape>
);

// STABLE AWS Service Shape
export const AWSServiceShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Group>
      {/* Main container */}
      <Rect
        x={0}
        y={0}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        cornerRadius={4}
      />
      
      {/* Service icon */}
      <Rect
        x={8}
        y={8}
        width={20}
        height={20}
        fill={shape.stroke}
        cornerRadius={2}
        opacity={0.9}
      />
      
      {/* AWS label */}
      <Text
        x={shape.width - 28}
        y={6}
        text="AWS"
        fontSize={8}
        fontFamily="Arial"
        fill={shape.stroke}
        fontStyle="bold"
        listening={false}
      />
      
      {/* Service name */}
      <Text
        x={4}
        y={shape.height - 16}
        text={shape.serviceName || shape.type?.replace('aws-', '').toUpperCase()}
        fontSize={9}
        fontFamily="Arial"
        fill="#333"
        width={shape.width - 8}
        align="center"
        listening={false}
      />
    </Group>
  </BaseShape>
);

export const AzureServiceShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Group>
      <Rect
        x={0}
        y={0}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        cornerRadius={4}
      />
      
      <Rect
        x={8}
        y={8}
        width={20}
        height={20}
        fill="#0078D4"
        cornerRadius={2}
        opacity={0.9}
      />
      
      <Text
        x={shape.width - 32}
        y={6}
        text="Azure"
        fontSize={7}
        fontFamily="Arial"
        fill="#0078D4"
        fontStyle="bold"
        listening={false}
      />
      
      <Text
        x={4}
        y={shape.height - 16}
        text={shape.serviceName || shape.type?.replace('azure-', '').toUpperCase()}
        fontSize={9}
        fontFamily="Arial"
        fill="#333"
        width={shape.width - 8}
        align="center"
        listening={false}
      />
    </Group>
  </BaseShape>
);

export const GCPServiceShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Group>
      <Rect
        x={0}
        y={0}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        cornerRadius={4}
      />
      
      <Rect
        x={8}
        y={8}
        width={20}
        height={20}
        fill="#4285F4"
        cornerRadius={2}
        opacity={0.9}
      />
      
      <Text
        x={shape.width - 22}
        y={6}
        text="GCP"
        fontSize={8}
        fontFamily="Arial"
        fill="#4285F4"
        fontStyle="bold"
        listening={false}
      />
      
      <Text
        x={4}
        y={shape.height - 16}
        text={shape.serviceName || shape.type?.replace('gcp-', '').toUpperCase()}
        fontSize={9}
        fontFamily="Arial"
        fill="#333"
        width={shape.width - 8}
        align="center"
        listening={false}
      />
    </Group>
  </BaseShape>
);

// STABLE Architecture Shapes
export const CloudShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Ellipse
      x={shape.width / 2}
      y={shape.height / 2}
      radiusX={shape.width / 2}
      radiusY={shape.height / 3}
      fill={shape.fill}
    />
  </BaseShape>
);

export const ServerShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Group>
      <Rect
        x={0}
        y={0}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        cornerRadius={3}
      />
      <Line
        points={[4, shape.height * 0.3, shape.width - 4, shape.height * 0.3]}
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
      <Line
        points={[4, shape.height * 0.6, shape.width - 4, shape.height * 0.6]}
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
    </Group>
  </BaseShape>
);

export const DatabaseShape = ({ shape }) => (
  <BaseShape shape={shape}>
    <Group>
      <Rect
        x={0}
        y={shape.height * 0.1}
        width={shape.width}
        height={shape.height * 0.8}
        fill={shape.fill}
      />
      <Ellipse
        x={shape.width / 2}
        y={shape.height * 0.1}
        radiusX={shape.width / 2}
        radiusY={shape.height * 0.1}
        fill={shape.fill}
        listening={false}
      />
      <Ellipse
        x={shape.width / 2}
        y={shape.height * 0.9}
        radiusX={shape.width / 2}
        radiusY={shape.height * 0.1}
        fill={shape.fill}
        listening={false}
      />
    </Group>
  </BaseShape>
);

// STABLE Shape Renderer
export const ShapeRenderer = ({ shape }) => {
  if (!shape?.type) return null;

  // Cloud Services
  if (shape.serviceType === 'aws' || shape.type?.startsWith('aws-')) {
    return <AWSServiceShape shape={shape} />;
  }
  
  if (shape.serviceType === 'azure' || shape.type?.startsWith('azure-')) {
    return <AzureServiceShape shape={shape} />;
  }
  
  if (shape.serviceType === 'gcp' || shape.type?.startsWith('gcp-')) {
    return <GCPServiceShape shape={shape} />;
  }

  // Basic Shapes
  switch (shape.type) {
    case 'rect':
    case 'rectangle':
    case 'process':
      return <RectangleShape shape={shape} />;
      
    case 'circle':
    case 'terminator':
      return <CircleShape shape={shape} />;
      
    case 'triangle':
      return <TriangleShape shape={shape} />;
      
    case 'diamond':
    case 'decision':
      return <DiamondShape shape={shape} />;
      
    case 'hexagon':
      return <HexagonShape shape={shape} />;
      
    case 'star':
      return <StarShape shape={shape} />;
      
    case 'line':
      return <LineShape shape={shape} />;
      
    case 'text':
      return <TextShape shape={shape} />;
      
    case 'cloud':
      return <CloudShape shape={shape} />;
      
    case 'server':
    case 'infrastructure':
      return <ServerShape shape={shape} />;
      
    case 'database':
      return <DatabaseShape shape={shape} />;
      
    case 'user':
    case 'users':
    case 'admin':
      return <CircleShape shape={shape} />;
      
    default:
      return <RectangleShape shape={shape} />;
  }
};