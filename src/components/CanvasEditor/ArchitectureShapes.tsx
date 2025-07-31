// components/Canvas/Shapes/ArchitectureShapes.jsx - All architecture shape implementations
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from 'react';
import { Rect, Circle, Line, RegularPolygon, Text, Group, Path, Ellipse } from 'react-konva';

// Import the BaseShape component (assuming it's in the main shapes file)
import { BaseShape } from './ShapeComponents';

// Cloud Shape Component
export const CloudShape = ({ shape }) => {
  const cloudPath = `M ${shape.x + shape.width * 0.25} ${shape.y + shape.height * 0.6}
    C ${shape.x + shape.width * 0.1} ${shape.y + shape.height * 0.6} 
      ${shape.x} ${shape.y + shape.height * 0.4} 
      ${shape.x + shape.width * 0.15} ${shape.y + shape.height * 0.3}
    C ${shape.x + shape.width * 0.1} ${shape.y + shape.height * 0.1} 
      ${shape.x + shape.width * 0.4} ${shape.y} 
      ${shape.x + shape.width * 0.5} ${shape.y + shape.height * 0.15}
    C ${shape.x + shape.width * 0.7} ${shape.y} 
      ${shape.x + shape.width * 0.9} ${shape.y + shape.height * 0.2} 
      ${shape.x + shape.width * 0.85} ${shape.y + shape.height * 0.4}
    C ${shape.x + shape.width} ${shape.y + shape.height * 0.5} 
      ${shape.x + shape.width * 0.9} ${shape.y + shape.height * 0.7} 
      ${shape.x + shape.width * 0.75} ${shape.y + shape.height * 0.6} Z`;

  return (
    <BaseShape shape={shape} showConnectionPoints={true}>
      <Path
        data={cloudPath}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        rotation={shape.rotation}
      />
    </BaseShape>
  );
};

// Server Shape Component
export const ServerShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* Main server body */}
      <Rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        cornerRadius={4}
      />
      {/* Server horizontal lines */}
      <Line
        points={[shape.x + 5, shape.y + shape.height * 0.25, shape.x + shape.width - 5, shape.y + shape.height * 0.25]}
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
      <Line
        points={[shape.x + 5, shape.y + shape.height * 0.5, shape.x + shape.width - 5, shape.y + shape.height * 0.5]}
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
      <Line
        points={[shape.x + 5, shape.y + shape.height * 0.75, shape.x + shape.width - 5, shape.y + shape.height * 0.75]}
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
      {/* Power indicators */}
      <Circle
        x={shape.x + shape.width - 15}
        y={shape.y + 10}
        radius={3}
        fill="#00ff00"
        listening={false}
      />
      <Circle
        x={shape.x + shape.width - 25}
        y={shape.y + 10}
        radius={3}
        fill="#ffff00"
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Database Shape Component  
export const DatabaseShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* Database cylinder body */}
      <Rect
        x={shape.x}
        y={shape.y + shape.height * 0.1}
        width={shape.width}
        height={shape.height * 0.8}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        listening={false}
      />
      {/* Top ellipse */}
      <Ellipse
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height * 0.1}
        radiusX={shape.width / 2}
        radiusY={shape.height * 0.1}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        listening={false}
      />
      {/* Bottom ellipse */}
      <Ellipse
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height * 0.9}
        radiusX={shape.width / 2}
        radiusY={shape.height * 0.1}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        listening={false}
      />
      {/* Middle line for visual effect */}
      <Ellipse
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height * 0.3}
        radiusX={shape.width / 2}
        radiusY={shape.height * 0.05}
        fill="transparent"
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Function/Lambda Shape Component
export const FunctionShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* Lambda symbol background */}
      <Rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        cornerRadius={8}
      />
      {/* Lambda symbol */}
      <Text
        x={shape.x + shape.width * 0.25}
        y={shape.y + shape.height * 0.25}
        text="λ"
        fontSize={shape.height * 0.5}
        fill={shape.stroke}
        fontFamily="Arial"
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Microservice Shape Component
export const MicroserviceShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* Hexagonal container */}
      <RegularPolygon
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height / 2}
        sides={6}
        radius={Math.min(shape.width, shape.height) / 2.2}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
      />
      {/* Service indicator dots */}
      <Circle
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height * 0.4}
        radius={2}
        fill={shape.stroke}
        listening={false}
      />
      <Circle
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height * 0.5}
        radius={2}
        fill={shape.stroke}
        listening={false}
      />
      <Circle
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height * 0.6}
        radius={2}
        fill={shape.stroke}
        listening={false}
      />
    </Group>
  </BaseShape>
);

// API Gateway Shape Component
export const APIShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* API Gateway body */}
      <Rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        cornerRadius={6}
      />
      {/* API text */}
      <Text
        x={shape.x + shape.width * 0.15}
        y={shape.y + shape.height * 0.35}
        text="API"
        fontSize={shape.height * 0.3}
        fill={shape.stroke}
        fontFamily="Arial Bold"
        listening={false}
      />
      {/* Connection lines */}
      <Line
        points={[shape.x + shape.width * 0.1, shape.y + shape.height * 0.7, shape.x + shape.width * 0.9, shape.y + shape.height * 0.7]}
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Load Balancer Shape Component
export const LoadBalancerShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* Load balancer body */}
      <Rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        cornerRadius={4}
      />
      {/* Distribution arrows */}
      <Line
        points={[shape.x + shape.width * 0.2, shape.y + shape.height * 0.3, shape.x + shape.width * 0.8, shape.y + shape.height * 0.3]}
        stroke={shape.stroke}
        strokeWidth={2}
        listening={false}
      />
      <Line
        points={[shape.x + shape.width * 0.2, shape.y + shape.height * 0.5, shape.x + shape.width * 0.8, shape.y + shape.height * 0.5]}
        stroke={shape.stroke}
        strokeWidth={2}
        listening={false}
      />
      <Line
        points={[shape.x + shape.width * 0.2, shape.y + shape.height * 0.7, shape.x + shape.width * 0.8, shape.y + shape.height * 0.7]}
        stroke={shape.stroke}
        strokeWidth={2}
        listening={false}
      />
      {/* LB text */}
      <Text
        x={shape.x + shape.width * 0.35}
        y={shape.y + shape.height * 0.8}
        text="LB"
        fontSize={shape.height * 0.15}
        fill={shape.stroke}
        fontFamily="Arial Bold"
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Security Shield Shape Component
export const SecurityShape = ({ shape }) => {
  const shieldPath = `M ${shape.x + shape.width / 2} ${shape.y}
    L ${shape.x + shape.width * 0.8} ${shape.y + shape.height * 0.3}
    L ${shape.x + shape.width * 0.8} ${shape.y + shape.height * 0.7}
    L ${shape.x + shape.width / 2} ${shape.y + shape.height}
    L ${shape.x + shape.width * 0.2} ${shape.y + shape.height * 0.7}
    L ${shape.x + shape.width * 0.2} ${shape.y + shape.height * 0.3}
    Z`;

  return (
    <BaseShape shape={shape} showConnectionPoints={true}>
      <Group>
        <Path
          data={shieldPath}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
        />
        {/* Security symbol */}
        <Text
          x={shape.x + shape.width * 0.4}
          y={shape.y + shape.height * 0.4}
          text="🛡"
          fontSize={shape.height * 0.3}
          listening={false}
        />
      </Group>
    </BaseShape>
  );
};

// User Shape Component
export const UserShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* User head */}
      <Circle
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height * 0.25}
        radius={shape.width * 0.2}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        listening={false}
      />
      {/* User body */}
      <Ellipse
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height * 0.7}
        radiusX={shape.width * 0.35}
        radiusY={shape.height * 0.25}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Container Shape Component
export const ContainerShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* Container body */}
      <Rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        cornerRadius={8}
        dash={[5, 5]}
      />
      {/* Container icon */}
      <Rect
        x={shape.x + shape.width * 0.3}
        y={shape.y + shape.height * 0.3}
        width={shape.width * 0.4}
        height={shape.height * 0.4}
        fill="transparent"
        stroke={shape.stroke}
        strokeWidth={1}
        cornerRadius={4}
        listening={false}
      />
      {/* Docker-like layers */}
      <Line
        points={[shape.x + shape.width * 0.35, shape.y + shape.height * 0.45, shape.x + shape.width * 0.65, shape.y + shape.height * 0.45]}
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
      <Line
        points={[shape.x + shape.width * 0.35, shape.y + shape.height * 0.55, shape.x + shape.width * 0.65, shape.y + shape.height * 0.55]}
        stroke={shape.stroke}
        strokeWidth={1}
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Queue/Message Shape Component
export const QueueShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* Queue body */}
      <Rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        cornerRadius={4}
      />
      {/* Queue items */}
      <Rect
        x={shape.x + shape.width * 0.1}
        y={shape.y + shape.height * 0.2}
        width={shape.width * 0.15}
        height={shape.height * 0.6}
        fill={shape.stroke}
        listening={false}
      />
      <Rect
        x={shape.x + shape.width * 0.3}
        y={shape.y + shape.height * 0.2}
        width={shape.width * 0.15}
        height={shape.height * 0.6}
        fill={shape.stroke}
        listening={false}
      />
      <Rect
        x={shape.x + shape.width * 0.5}
        y={shape.y + shape.height * 0.2}
        width={shape.width * 0.15}
        height={shape.height * 0.6}
        fill={shape.stroke}
        listening={false}
      />
      {/* Arrow indicating flow */}
      <Line
        points={[shape.x + shape.width * 0.7, shape.y + shape.height * 0.5, shape.x + shape.width * 0.9, shape.y + shape.height * 0.5]}
        stroke={shape.stroke}
        strokeWidth={2}
        pointerLength={8}
        pointerWidth={8}
        pointerAtEnding={true}
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Enterprise Building Shape Component
export const EnterpriseShape = ({ shape }) => (
  <BaseShape shape={shape} showConnectionPoints={true}>
    <Group>
      {/* Building base */}
      <Rect
        x={shape.x}
        y={shape.y + shape.height * 0.3}
        width={shape.width}
        height={shape.height * 0.7}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
      />
      {/* Building tower */}
      <Rect
        x={shape.x + shape.width * 0.3}
        y={shape.y}
        width={shape.width * 0.4}
        height={shape.height * 0.5}
        fill={shape.fill}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        listening={false}
      />
      {/* Windows */}
      <Rect
        x={shape.x + shape.width * 0.1}
        y={shape.y + shape.height * 0.4}
        width={shape.width * 0.15}
        height={shape.height * 0.2}
        fill={shape.stroke}
        listening={false}
      />
      <Rect
        x={shape.x + shape.width * 0.75}
        y={shape.y + shape.height * 0.4}
        width={shape.width * 0.15}
        height={shape.height * 0.2}
        fill={shape.stroke}
        listening={false}
      />
      <Rect
        x={shape.x + shape.width * 0.4}
        y={shape.y + shape.height * 0.15}
        width={shape.width * 0.2}
        height={shape.height * 0.15}
        fill={shape.stroke}
        listening={false}
      />
    </Group>
  </BaseShape>
);

// Export all architecture shapes
// export {
//   CloudShape,
//   ServerShape,
//   DatabaseShape,
//   FunctionShape,
//   MicroserviceShape,
//   APIShape,
//   LoadBalancerShape,
//   SecurityShape,
//   UserShape,
//   ContainerShape,
//   QueueShape,
//   EnterpriseShape
// };