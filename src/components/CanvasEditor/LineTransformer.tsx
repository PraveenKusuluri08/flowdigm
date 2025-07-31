// components/Canvas/LineTransformer.jsx - Complete optimized version
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useState, useCallback, useMemo } from 'react';
import { Circle, Group } from 'react-konva';
import { useCanvas } from '../../hooks/useCanvas';

// Magnetic attachment utilities (embedded for completeness)
const SNAP_DISTANCE = 15;

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const getShapeConnectionPoints = (shape) => {
  if (!shape || !shape.connectionPoints) return [];
  
  const points = [];
  Object.entries(shape.connectionPoints).forEach(([anchor, offset]) => {
    points.push({
      id: `${shape.id}-${anchor}`,
      shapeId: shape.id,
      anchor,
      x: shape.x + (shape.width * offset.x),
      y: shape.y + (shape.height * offset.y),
      shape
    });
  });
  
  return points;
};

const findNearestConnectionPoint = (x, y, shapes, excludeShapeId = null) => {
  let nearestPoint = null;
  let minDistance = SNAP_DISTANCE;
  
  shapes.forEach(shape => {
    if (shape.id === excludeShapeId) return;
    
    const connectionPoints = getShapeConnectionPoints(shape);
    connectionPoints.forEach(point => {
      const distance = getDistance(x, y, point.x, point.y);
      if (distance < minDistance) {
        nearestPoint = point;
        minDistance = distance;
      }
    });
  });
  
  return nearestPoint;
};

const getSnapPosition = (x, y, shapes, excludeShapeId = null) => {
  const nearestPoint = findNearestConnectionPoint(x, y, shapes, excludeShapeId);
  
  if (nearestPoint) {
    return {
      x: nearestPoint.x,
      y: nearestPoint.y,
      snapped: true,
      connectionPoint: nearestPoint
    };
  }
  
  return { x, y, snapped: false, connectionPoint: null };
};

const LineTransformer = ({ lineShape }) => {
  const { updateShape, state, snapToGrid } = useCanvas();
  const [dragState, setDragState] = useState({ 
    isDragging: false, 
    pointType: null,
    dragStartPos: { x: 0, y: 0 }
  });
  
  // Early returns for invalid data
  if (!lineShape || lineShape.type !== 'line' || !lineShape.points) {
    return null;
  }

  const points = lineShape.points;
  if (points.length < 4) return null;

  const startX = points[0];
  const startY = points[1];
  const endX = points[points.length - 2];
  const endY = points[points.length - 1];

  // Memoize other shapes for performance
  const otherShapes = useMemo(() => 
    state.shapes.filter(s => s.id !== lineShape.id && s.type !== 'line'),
    [state.shapes, lineShape.id]
  );

  // Optimized drag handlers with useCallback
  const handleStartDragStart = useCallback((e) => {
    const pos = e.target.getStage().getPointerPosition();
    setDragState({ 
      isDragging: true, 
      pointType: 'start',
      dragStartPos: { x: pos.x, y: pos.y }
    });
  }, []);

  const handleStartDrag = useCallback((e) => {
    const rawX = e.target.x();
    const rawY = e.target.y();
    
    // Check for magnetic attachment
    const snapResult = getSnapPosition(rawX, rawY, otherShapes);
    
    // Update visual position immediately for smooth feedback
    e.target.x(snapResult.x);
    e.target.y(snapResult.y);
    
    // Update line points with debounced state update
    const newPoints = [...points];
    newPoints[0] = snapResult.x;
    newPoints[1] = snapResult.y;
    
    // Immediate visual update without triggering full re-render
    const stage = e.target.getStage();
    stage.batchDraw();
    
    // Throttled state update for performance
    updateShape(lineShape.id, { 
      points: newPoints,
      attachments: {
        ...lineShape.attachments,
        start: snapResult.snapped ? snapResult.connectionPoint : null
      }
    });
  }, [points, otherShapes, lineShape.id, lineShape.attachments, updateShape]);

  const handleStartDragEnd = useCallback(() => {
    setDragState({ isDragging: false, pointType: null, dragStartPos: { x: 0, y: 0 } });
  }, []);

  const handleEndDragStart = useCallback((e) => {
    const pos = e.target.getStage().getPointerPosition();
    setDragState({ 
      isDragging: true, 
      pointType: 'end',
      dragStartPos: { x: pos.x, y: pos.y }
    });
  }, []);

  const handleEndDrag = useCallback((e) => {
    const rawX = e.target.x();
    const rawY = e.target.y();
    
    // Check for magnetic attachment
    const snapResult = getSnapPosition(rawX, rawY, otherShapes);
    
    // Update visual position immediately
    e.target.x(snapResult.x);
    e.target.y(snapResult.y);
    
    // Update line points
    const newPoints = [...points];
    newPoints[newPoints.length - 2] = snapResult.x;
    newPoints[newPoints.length - 1] = snapResult.y;
    
    // Immediate visual update
    const stage = e.target.getStage();
    stage.batchDraw();
    
    updateShape(lineShape.id, { 
      points: newPoints,
      attachments: {
        ...lineShape.attachments,
        end: snapResult.snapped ? snapResult.connectionPoint : null
      }
    });
  }, [points, otherShapes, lineShape.id, lineShape.attachments, updateShape]);

  const handleEndDragEnd = useCallback(() => {
    setDragState({ isDragging: false, pointType: null, dragStartPos: { x: 0, y: 0 } });
  }, []);

  // Optimized middle points handler
  const handleMiddlePointDrag = useCallback((e, pointIndex) => {
    const rawX = e.target.x();
    const rawY = e.target.y();
    
    // Middle points can snap to grid but not to connection points
    const newX = state.grid.snap ? snapToGrid(rawX) : rawX;
    const newY = state.grid.snap ? snapToGrid(rawY) : rawY;
    
    // Update position immediately for smooth movement
    e.target.x(newX);
    e.target.y(newY);
    
    const newPoints = [...points];
    newPoints[pointIndex] = newX;
    newPoints[pointIndex + 1] = newY;
    
    // Immediate visual update
    const stage = e.target.getStage();
    stage.batchDraw();
    
    updateShape(lineShape.id, { points: newPoints });
  }, [points, state.grid.snap, snapToGrid, lineShape.id, updateShape]);

  // Generate middle points for multi-segment lines
  const middlePoints = useMemo(() => {
    const points_array = [];
    for (let i = 2; i < points.length - 2; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      const pointIndex = i;
      
      points_array.push(
        <Circle
          key={`middle-${i}`}
          x={x}
          y={y}
          radius={4}
          fill="#ffffff"
          stroke="#0066cc"
          strokeWidth={2}
          draggable={true}
          onDragMove={(e) => handleMiddlePointDrag(e, pointIndex)}
          perfectDrawEnabled={false} // Performance optimization
          shadowForStrokeEnabled={false}
        />
      );
    }
    return points_array;
  }, [points, handleMiddlePointDrag]);

  // Generate nearby connection points when dragging
  const nearbyConnectionPoints = useMemo(() => {
    if (!dragState.isDragging) return [];
    
    const connectionPoints = [];
    otherShapes.forEach(shape => {
      if (shape.connectionPoints) {
        Object.entries(shape.connectionPoints).forEach(([anchor, offset]) => {
          const cpX = shape.x + (shape.width * offset.x);
          const cpY = shape.y + (shape.height * offset.y);
          
          let distance = Infinity;
          
          if (dragState.pointType === 'start') {
            distance = getDistance(startX, startY, cpX, cpY);
          } else if (dragState.pointType === 'end') {
            distance = getDistance(endX, endY, cpX, cpY);
          }
          
          if (distance < 25) { // Show if within 25px for better UX
            connectionPoints.push(
              <Circle
                key={`cp-${shape.id}-${anchor}`}
                x={cpX}
                y={cpY}
                radius={distance < 15 ? 8 : 6}
                fill={distance < 15 ? '#ff6b6b' : 'transparent'}
                stroke="#4dabf7"
                strokeWidth={2}
                opacity={distance < 15 ? 1 : 0.6}
                listening={false}
                perfectDrawEnabled={false}
                shadowForStrokeEnabled={false}
              />
            );
          }
        });
      }
    });
    return connectionPoints;
  }, [dragState.isDragging, dragState.pointType, otherShapes, startX, startY, endX, endY]);

  return (
    <Group>
      {/* Show nearby connection points when dragging */}
      {nearbyConnectionPoints}
      
      {/* Start point control */}
      <Circle
        x={startX}
        y={startY}
        radius={5}
        fill={lineShape.attachments?.start ? '#ff6b6b' : '#0066cc'}
        stroke="#ffffff"
        strokeWidth={2}
        draggable={true}
        onDragStart={handleStartDragStart}
        onDragMove={handleStartDrag}
        onDragEnd={handleStartDragEnd}
        perfectDrawEnabled={false} // Performance boost
        shadowForStrokeEnabled={false}
      />
      
      {/* End point control */}
      <Circle
        x={endX}
        y={endY}
        radius={5}
        fill={lineShape.attachments?.end ? '#ff6b6b' : '#0066cc'}
        stroke="#ffffff"
        strokeWidth={2}
        draggable={true}
        onDragStart={handleEndDragStart}
        onDragMove={handleEndDrag}
        onDragEnd={handleEndDragEnd}
        perfectDrawEnabled={false} // Performance boost
        shadowForStrokeEnabled={false}
      />
      
      {/* Middle points for multi-segment lines */}
      {middlePoints}
      
      {/* Visual indicators for attached points */}
      {lineShape.attachments?.start && (
        <Circle
          x={startX}
          y={startY}
          radius={8}
          fill="transparent"
          stroke="#ff6b6b"
          strokeWidth={1}
          dash={[2, 2]}
          listening={false}
          perfectDrawEnabled={false}
          shadowForStrokeEnabled={false}
        />
      )}
      
      {lineShape.attachments?.end && (
        <Circle
          x={endX}
          y={endY}
          radius={8}
          fill="transparent"
          stroke="#ff6b6b"
          strokeWidth={1}
          dash={[2, 2]}
          listening={false}
          perfectDrawEnabled={false}
          shadowForStrokeEnabled={false}
        />
      )}
      
      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && dragState.isDragging && (
        <Group>
          {/* Add any debug visual indicators here if needed */}
        </Group>
      )}
    </Group>
  );
};

export default LineTransformer;