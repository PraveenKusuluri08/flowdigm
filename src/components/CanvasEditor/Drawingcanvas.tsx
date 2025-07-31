// components/CanvasEditor/DrawingCanvas.tsx - With Connection System
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { useCanvas } from '../../hooks/useCanvas';
import GridBackground from './GridBackground';
import { ShapeRenderer } from './ShapeComponents';
import SelectionTransformer from './SelectionTranformer';
import { findShapeById } from '../Sidebar/shapeDefinition';
import { ShapeSuggestionPopup, ConnectionLine, useConnections } from './ConnectionSystem';

const DrawingCanvas = () => {
  const stageRef = useRef();
  const layerRef = useRef();
  const { state, addShape, clearSelection, updateStage } = useCanvas();
  const {
    connectionState,
    updateConnection,
    showSuggestions,
    hideSuggestions,
    createShapeFromSuggestion,
    cancelConnection
  } = useConnections();
  
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth - 256,
    height: window.innerHeight - 120
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth - 256,
        height: window.innerHeight - 120
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate unique ID
  const generateId = () => `shape_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  // Create shape from sidebar - EXACT position where dropped
  const createShapeFromSidebar = useCallback((shapeId, dropPosition) => {
    const shapeDefinition = findShapeById(shapeId);
    if (!shapeDefinition) return null;

    // Calculate exact drop position accounting for shape size
    const shapeWidth = getShapeWidth(shapeId);
    const shapeHeight = getShapeHeight(shapeId);
    
    const exactPosition = {
      x: dropPosition.x - (shapeWidth / 2),  // Center horizontally
      y: dropPosition.y - (shapeHeight / 2)  // Center vertically
    };

    const baseShape = {
      id: generateId(),
      type: shapeId,
      x: exactPosition.x,
      y: exactPosition.y,
      width: shapeWidth,
      height: shapeHeight,
      fill: getShapeFill(shapeId),
      stroke: getShapeStroke(shapeId),
      strokeWidth: 2,
      rotation: 0
    };

    // Add shape-specific properties
    if (shapeId.startsWith('aws-')) {
      baseShape.serviceType = 'aws';
      baseShape.serviceName = shapeDefinition.name;
    } else if (shapeId.startsWith('azure-')) {
      baseShape.serviceType = 'azure';
      baseShape.serviceName = shapeDefinition.name;
    } else if (shapeId.startsWith('gcp-')) {
      baseShape.serviceType = 'gcp';
      baseShape.serviceName = shapeDefinition.name;
    }

    return baseShape;
  }, []);

  // Helper functions for shape properties
  const getShapeWidth = (shapeId) => {
    if (shapeId.startsWith('aws-') || shapeId.startsWith('azure-') || shapeId.startsWith('gcp-')) {
      return 120;
    }
    return shapeId === 'line' ? 100 : 80;
  };

  const getShapeHeight = (shapeId) => {
    if (shapeId.startsWith('aws-') || shapeId.startsWith('azure-') || shapeId.startsWith('gcp-')) {
      return 80;
    }
    return shapeId === 'line' ? 2 : 60;
  };

  const getShapeFill = (shapeId) => {
    if (shapeId === 'line' || shapeId.startsWith('arrow-')) return 'transparent';
    return '#ffffff';
  };

  const getShapeStroke = (shapeId) => {
    if (shapeId.startsWith('aws-')) return '#FF9900';
    if (shapeId.startsWith('azure-')) return '#0078D4';
    if (shapeId.startsWith('gcp-')) return '#4285F4';
    return '#000000';
  };

  // Handle drag and drop from sidebar - PERFECT positioning
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!dragData.shapeId) return;
      
      const stage = stageRef.current;
      const canvasRect = e.currentTarget.getBoundingClientRect();
      
      // Get EXACT mouse position relative to canvas
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;
      
      // Convert to stage coordinates (accounting for zoom and pan)
      const stageAttrs = stage.attrs;
      const stageX = stageAttrs.x || 0;
      const stageY = stageAttrs.y || 0;
      const stageScale = stageAttrs.scaleX || 1;
      
      const stagePosition = {
        x: (mouseX - stageX) / stageScale,
        y: (mouseY - stageY) / stageScale
      };
      
      // Create shape at EXACT drop position
      const newShape = createShapeFromSidebar(dragData.shapeId, stagePosition);
      
      if (newShape) {
        addShape(newShape);
      }
    } catch (error) {
      // Silently handle errors
    }
  }, [createShapeFromSidebar, addShape]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle stage click - CLEAN selection
  const handleStageClick = useCallback((e) => {
    // Cancel connection if clicking on empty canvas
    if (connectionState.isConnecting) {
      cancelConnection();
      return;
    }
    
    // Hide suggestions if clicking elsewhere
    if (connectionState.showSuggestions) {
      hideSuggestions();
      return;
    }
    
    // Only clear selection if clicked on empty canvas
    if (e.target === e.target.getStage() || e.target.getClassName() === 'Image') {
      clearSelection();
    }
  }, [clearSelection, connectionState.isConnecting, connectionState.showSuggestions, cancelConnection, hideSuggestions]);

  // Handle zoom with mouse wheel - ONLY when Ctrl is pressed
  const handleWheel = useCallback((e) => {
    // Only zoom when Ctrl key is pressed
    if (!e.evt.ctrlKey && !e.evt.metaKey) {
      return; // Allow normal page scrolling
    }
    
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };
    
    // Smooth zoom increments like professional tools
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Reasonable zoom limits
    const clampedScale = Math.max(0.1, Math.min(10, newScale));
    
    stage.scale({ x: clampedScale, y: clampedScale });
    
    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    
    stage.position(newPos);
    stage.batchDraw();
    
    updateStage({
      scale: clampedScale,
      x: newPos.x,
      y: newPos.y
    });
  }, [updateStage]);

  // Drawing tools - PRECISE positioning
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

  const handleMouseDown = useCallback((e) => {
    // Skip if not in drawing mode or if clicking on a shape
    if (state.tool === 'select' || e.target !== e.target.getStage()) return;
    
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const pos = stageTransform.point(pointer);
    
    setIsDrawing(true);
    
    switch (state.tool) {
      case 'rectangle':
        addShape({
          id: generateId(),
          type: 'rect',
          x: pos.x,
          y: pos.y,
          width: 100,
          height: 60,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2
        });
        break;
        
      case 'circle':
        addShape({
          id: generateId(),
          type: 'circle',
          x: pos.x,
          y: pos.y,
          width: 80,
          height: 80,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2
        });
        break;
        
      case 'line':
        setCurrentPath([pos.x, pos.y]);
        break;
    }
  }, [state.tool, addShape]);

  const handleMouseMove = useCallback((e) => {
    // Update connection line if we're connecting
    if (connectionState.isConnecting) {
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      const stageTransform = stage.getAbsoluteTransform().copy().invert();
      const pos = stageTransform.point(pointer);
      updateConnection(pos.x, pos.y);
      return;
    }
    
    if (!isDrawing || state.tool === 'select') return;
    
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const pos = stageTransform.point(pointer);
    
    if (state.tool === 'line') {
      setCurrentPath(prev => [...prev, pos.x, pos.y]);
    }
  }, [isDrawing, state.tool, connectionState.isConnecting, updateConnection]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (state.tool === 'line' && currentPath.length > 2) {
      addShape({
        id: generateId(),
        type: 'line',
        points: currentPath,
        stroke: '#000000',
        strokeWidth: 2
      });
      setCurrentPath([]);
    }
  }, [isDrawing, state.tool, currentPath, addShape]);

  // Pan the canvas - SMOOTH like draw.io
  const handleStageDrag = useCallback((e) => {
    updateStage({
      x: e.target.x(),
      y: e.target.y(),
      scale: e.target.scaleX()
    });
  }, [updateStage]);

  return (
    <div 
      className="flex-1 bg-white relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={state.stage?.scale || 1}
        scaleY={state.stage?.scale || 1}
        x={state.stage?.x || 0}
        y={state.stage?.y || 0}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragEnd={handleStageDrag}
        draggable={state.tool === 'select'}
      >
        <Layer ref={layerRef}>
          <GridBackground />
          
          {/* Render shapes - CLEAN and SIMPLE */}
          {state.shapes?.map((shape) => (
            <ShapeRenderer key={shape.id} shape={shape} />
          ))}
          
          {/* Connection line while connecting */}
          {connectionState.isConnecting && connectionState.startX && connectionState.currentX && (
            <ConnectionLine
              startX={connectionState.startX}
              startY={connectionState.startY}
              endX={connectionState.currentX}
              endY={connectionState.currentY}
              isTemporary={true}
            />
          )}
          
          {/* Shape suggestion popup */}
          {connectionState.showSuggestions && connectionState.suggestionPosition && (
            <ShapeSuggestionPopup
              x={connectionState.suggestionPosition.x}
              y={connectionState.suggestionPosition.y}
              direction={connectionState.suggestionPosition.direction}
              sourceShapeId={connectionState.suggestionPosition.shapeId}
              onShapeSelect={(suggestion) => {
                createShapeFromSuggestion(suggestion, connectionState.suggestionPosition);
              }}
              onClose={hideSuggestions}
            />
          )}
          
          <SelectionTransformer />
        </Layer>
      </Stage>
      
      {/* Clean status bar like draw.io */}
      <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded border shadow-sm text-xs text-gray-600">
        {Math.round((state.stage?.scale || 1) * 100)}% 
        {state.shapes?.length > 0 && ` • ${state.shapes.length} object${state.shapes.length !== 1 ? 's' : ''}`}
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-3 right-3 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-75">
        Hold Ctrl + Scroll to zoom
      </div>
    </div>
  );
};

export default DrawingCanvas;