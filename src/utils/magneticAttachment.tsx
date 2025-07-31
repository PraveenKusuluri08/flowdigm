// utils/magneticAttachment.js - Fixed imports and performance


// Magnetic attachment configuration
const SNAP_DISTANCE = 15;
const CONNECTION_POINT_RADIUS = 8;

// Calculate distance between two points
export const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Get all connection points for a shape
export const getShapeConnectionPoints = (shape) => {
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

// Find nearest connection point to a given position
export const findNearestConnectionPoint = (x, y, shapes, excludeShapeId = null) => {
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

// Check if a line endpoint should snap to a connection point
export const getSnapPosition = (x, y, shapes, excludeShapeId = null) => {
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

// Create attachment info for line endpoints
export const createLineAttachment = (lineShape, shapes) => {
  if (!lineShape.points || lineShape.points.length < 4) return lineShape;
  
  const points = [...lineShape.points];
  const startX = points[0];
  const startY = points[1];
  const endX = points[points.length - 2];
  const endY = points[points.length - 1];
  
  // Check start point attachment
  const startSnap = getSnapPosition(startX, startY, shapes, lineShape.id);
  if (startSnap.snapped) {
    points[0] = startSnap.x;
    points[1] = startSnap.y;
  }
  
  // Check end point attachment
  const endSnap = getSnapPosition(endX, endY, shapes, lineShape.id);
  if (endSnap.snapped) {
    points[points.length - 2] = endSnap.x;
    points[points.length - 1] = endSnap.y;
  }
  
  return {
    ...lineShape,
    points,
    attachments: {
      start: startSnap.snapped ? startSnap.connectionPoint : null,
      end: endSnap.snapped ? endSnap.connectionPoint : null
    }
  };
};

// Update line when attached shape moves
export const updateAttachedLines = (movedShapeId, shapes, connections) => {
  const movedShape = shapes.find(s => s.id === movedShapeId);
  if (!movedShape) return { shapes, connections };
  
  const updatedShapes = shapes.map(shape => {
    if (shape.type === 'line' && shape.attachments) {
      let needsUpdate = false;
      const newPoints = [...shape.points];
      
      // Update start point if attached to moved shape
      if (shape.attachments.start && shape.attachments.start.shapeId === movedShapeId) {
        const newConnectionPoints = getShapeConnectionPoints(movedShape);
        const matchingPoint = newConnectionPoints.find(p => p.anchor === shape.attachments.start.anchor);
        
        if (matchingPoint) {
          newPoints[0] = matchingPoint.x;
          newPoints[1] = matchingPoint.y;
          needsUpdate = true;
        }
      }
      
      // Update end point if attached to moved shape
      if (shape.attachments.end && shape.attachments.end.shapeId === movedShapeId) {
        const newConnectionPoints = getShapeConnectionPoints(movedShape);
        const matchingPoint = newConnectionPoints.find(p => p.anchor === shape.attachments.end.anchor);
        
        if (matchingPoint) {
          newPoints[newPoints.length - 2] = matchingPoint.x;
          newPoints[newPoints.length - 1] = matchingPoint.y;
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        return { ...shape, points: newPoints };
      }
    }
    
    return shape;
  });
  
  return { shapes: updatedShapes, connections };
};

// Hook for magnetic attachment functionality
export const useMagneticAttachment = () => {
  // This will be imported from CanvasContext
  // For now, return empty functions to prevent errors
  return {
    snapLineToConnectionPoints: () => {},
    updateAttachedLinesForShape: () => {},
    findNearestConnectionPoint: () => null,
    getSnapPosition: () => ({ x: 0, y: 0, snapped: false })
  };
};