// components/CanvasEditor/ConnectionSystem.tsx - Draw.io style connections
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Group, Circle, Line, Rect, Text } from 'react-konva';
import { useCanvas } from '../../hooks/useCanvas';

// Connection Point with hover arrows like draw.io
export const ConnectionPoint = ({ 
  x, y, direction, shapeId, onConnectionStart, onSuggestionShow 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  // Arrow directions for each connection point
  const getArrowProps = (direction) => {
    const arrowLength = 15;
    const arrowOffset = 20;
    
    switch (direction) {
      case 'top':
        return {
          x: x,
          y: y - arrowOffset,
          points: [0, 0, 0, -arrowLength],
          arrowX: x,
          arrowY: y - arrowOffset - arrowLength
        };
      case 'right':
        return {
          x: x + arrowOffset,
          y: y,
          points: [0, 0, arrowLength, 0],
          arrowX: x + arrowOffset + arrowLength,
          arrowY: y
        };
      case 'bottom':
        return {
          x: x,
          y: y + arrowOffset,
          points: [0, 0, 0, arrowLength],
          arrowX: x,
          arrowY: y + arrowOffset + arrowLength
        };
      case 'left':
        return {
          x: x - arrowOffset,
          y: y,
          points: [0, 0, -arrowLength, 0],
          arrowX: x - arrowOffset - arrowLength,
          arrowY: y
        };
      default:
        return { x, y, points: [0, 0, 0, 0], arrowX: x, arrowY: y };
    }
  };

  const arrowProps = getArrowProps(direction);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowArrow(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowArrow(false);
  };

  const handleClick = () => {
    onConnectionStart && onConnectionStart(shapeId, direction, arrowProps.arrowX, arrowProps.arrowY);
  };

  const handleArrowClick = () => {
    onSuggestionShow && onSuggestionShow(arrowProps.arrowX, arrowProps.arrowY, direction, shapeId);
  };

  return (
    <Group>
      {/* Connection point */}
      <Circle
        x={x}
        y={y}
        radius={4}
        fill={isHovered ? '#0066ff' : '#ffffff'}
        stroke="#0066ff"
        strokeWidth={2}
        opacity={isHovered ? 1 : 0.7}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        perfectDrawEnabled={false}
      />
      
      {/* Hover arrow like draw.io */}
      {showArrow && (
        <Group>
          <Line
            x={arrowProps.x}
            y={arrowProps.y}
            points={arrowProps.points}
            stroke="#0066ff"
            strokeWidth={2}
            lineCap="round"
          />
          <Circle
            x={arrowProps.arrowX}
            y={arrowProps.arrowY}
            radius={6}
            fill="#0066ff"
            onClick={handleArrowClick}
            perfectDrawEnabled={false}
          />
        </Group>
      )}
    </Group>
  );
};

// Shape Suggestion Popup like draw.io
export const ShapeSuggestionPopup = ({ 
  x, y, direction, sourceShapeId, onShapeSelect, onClose 
}) => {
  const suggestions = getShapeSuggestions(sourceShapeId, direction);
  
  // Position popup based on direction
  const getPopupPosition = () => {
    const offset = 40;
    switch (direction) {
      case 'top':
        return { x: x - 60, y: y - 80 };
      case 'right':
        return { x: x + 20, y: y - 40 };
      case 'bottom':
        return { x: x - 60, y: y + 20 };
      case 'left':
        return { x: x - 140, y: y - 40 };
      default:
        return { x: x - 60, y: y - 40 };
    }
  };

  const popupPos = getPopupPosition();

  return (
    <Group x={popupPos.x} y={popupPos.y}>
      {/* Popup background */}
      <Rect
        x={0}
        y={0}
        width={120}
        height={suggestions.length * 30 + 20}
        fill="#ffffff"
        stroke="#cccccc"
        strokeWidth={1}
        cornerRadius={6}
        shadowColor="#000000"
        shadowBlur={10}
        shadowOpacity={0.2}
      />
      
      {/* Suggestion items */}
      {suggestions.map((suggestion, index) => (
        <Group key={suggestion.id} y={10 + index * 30}>
          <Rect
            x={5}
            y={0}
            width={110}
            height={25}
            fill="transparent"
            cornerRadius={3}
            onMouseEnter={(e) => {
              e.target.fill('#f0f8ff');
              e.target.getLayer().batchDraw();
            }}
            onMouseLeave={(e) => {
              e.target.fill('transparent');
              e.target.getLayer().batchDraw();
            }}
            onClick={() => onShapeSelect(suggestion)}
          />
          
          {/* Shape icon */}
          <Rect
            x={10}
            y={5}
            width={15}
            height={15}
            fill={suggestion.color}
            cornerRadius={2}
          />
          
          {/* Shape name */}
          <Text
            x={30}
            y={8}
            text={suggestion.name}
            fontSize={11}
            fontFamily="Arial"
            fill="#333333"
            listening={false}
          />
        </Group>
      ))}
    </Group>
  );
};

// Connection Line component
export const ConnectionLine = ({ startX, startY, endX, endY, isTemporary = false }) => {
  // Calculate smooth bezier curve like draw.io
  const controlPointOffset = Math.abs(endX - startX) * 0.5;
  
  const pathData = `M ${startX} ${startY} 
                   C ${startX + controlPointOffset} ${startY}, 
                     ${endX - controlPointOffset} ${endY}, 
                     ${endX} ${endY}`;

  return (
    <Line
      points={[startX, startY, endX, endY]}
      stroke={isTemporary ? "#0066ff" : "#666666"}
      strokeWidth={isTemporary ? 2 : 1.5}
      dash={isTemporary ? [5, 5] : []}
      lineCap="round"
      opacity={isTemporary ? 0.8 : 1}
      perfectDrawEnabled={false}
    />
  );
};

// Get shape suggestions based on source shape and direction
const getShapeSuggestions = (sourceShapeId, direction) => {
  // This would normally come from your shape definitions
  // For now, returning common suggestions
  const commonSuggestions = [
    { id: 'aws-ec2', name: 'EC2 Instance', color: '#FF9900', type: 'aws-compute' },
    { id: 'aws-s3', name: 'S3 Bucket', color: '#3F8624', type: 'aws-storage' },
    { id: 'aws-rds', name: 'RDS Database', color: '#3F48CC', type: 'aws-database' },
    { id: 'aws-lambda', name: 'Lambda Function', color: '#FF9900', type: 'aws-compute' },
    { id: 'rect', name: 'Rectangle', color: '#000000', type: 'basic' },
    { id: 'circle', name: 'Circle', color: '#000000', type: 'basic' }
  ];

  // You can customize suggestions based on source shape type
  if (sourceShapeId?.startsWith('aws-')) {
    return commonSuggestions.filter(s => s.type?.startsWith('aws-') || s.type === 'basic');
  }
  
  return commonSuggestions.slice(0, 4); // Limit to 4 suggestions
};

// Hook for connection state management
export const useConnections = () => {
  const { state, addShape, updateShape } = useCanvas();
  const [connectionState, setConnectionState] = useState({
    isConnecting: false,
    startShape: null,
    startDirection: null,
    startX: null,
    startY: null,
    currentX: null,
    currentY: null,
    showSuggestions: false,
    suggestionPosition: null
  });

  const startConnection = useCallback((shapeId, direction, x, y) => {
    setConnectionState({
      isConnecting: true,
      startShape: shapeId,
      startDirection: direction,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
      showSuggestions: false,
      suggestionPosition: null
    });
  }, []);

  const updateConnection = useCallback((x, y) => {
    if (connectionState.isConnecting) {
      setConnectionState(prev => ({
        ...prev,
        currentX: x,
        currentY: y
      }));
    }
  }, [connectionState.isConnecting]);

  const showSuggestions = useCallback((x, y, direction, shapeId) => {
    setConnectionState(prev => ({
      ...prev,
      showSuggestions: true,
      suggestionPosition: { x, y, direction, shapeId }
    }));
  }, []);

  const hideSuggestions = useCallback(() => {
    setConnectionState(prev => ({
      ...prev,
      showSuggestions: false,
      suggestionPosition: null
    }));
  }, []);

  const createShapeFromSuggestion = useCallback((suggestion, position) => {
    const newShape = {
      id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: suggestion.id,
      x: position.x - 60, // Center the new shape
      y: position.y - 40,
      width: suggestion.id.startsWith('aws-') ? 120 : 80,
      height: suggestion.id.startsWith('aws-') ? 80 : 60,
      fill: '#ffffff',
      stroke: suggestion.color,
      strokeWidth: 2
    };

    // Add shape-specific properties
    if (suggestion.id.startsWith('aws-')) {
      newShape.serviceType = 'aws';
      newShape.serviceName = suggestion.name;
    }

    addShape(newShape);
    hideSuggestions();
    
    return newShape;
  }, [addShape, hideSuggestions]);

  const finishConnection = useCallback((endShapeId) => {
    if (connectionState.isConnecting && connectionState.startShape !== endShapeId) {
      // Here you would create the actual connection
      // For now, just log the connection
      console.log('Connection created:', {
        from: connectionState.startShape,
        to: endShapeId,
        direction: connectionState.startDirection
      });
    }
    
    setConnectionState({
      isConnecting: false,
      startShape: null,
      startDirection: null,
      startX: null,
      startY: null,
      currentX: null,
      currentY: null,
      showSuggestions: false,
      suggestionPosition: null
    });
  }, [connectionState]);

  const cancelConnection = useCallback(() => {
    setConnectionState({
      isConnecting: false,
      startShape: null,
      startDirection: null,
      startX: null,
      startY: null,
      currentX: null,
      currentY: null,
      showSuggestions: false,
      suggestionPosition: null
    });
  }, []);

  return {
    connectionState,
    startConnection,
    updateConnection,
    showSuggestions,
    hideSuggestions,
    createShapeFromSuggestion,
    finishConnection,
    cancelConnection
  };
};