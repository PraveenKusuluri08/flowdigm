// components/CanvasEditor/SelectionTransformer.tsx - Fixed with resize handles
import React, { useRef, useEffect } from 'react';
import { Transformer } from 'react-konva';
import { useCanvas } from '../../hooks/useCanvas';

const SelectionTransformer = () => {
  const { state, updateShape } = useCanvas();
  const transformerRef = useRef();

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = transformer?.getStage();
    
    if (!transformer || !stage) return;

    // Get selected shapes
    const selectedShapes = state.selectedShapeIds || [];
    
    if (selectedShapes.length === 0) {
      transformer.nodes([]);
      return;
    }

    // Find the selected nodes on the stage
    const selectedNodes = selectedShapes
      .map(id => stage.findOne(`#${id}`))
      .filter(node => node); // Remove any null/undefined nodes

    if (selectedNodes.length > 0) {
      transformer.nodes(selectedNodes);
      transformer.getLayer()?.batchDraw();
    } else {
      transformer.nodes([]);
    }
  }, [state.selectedShapeIds]);

  // Handle transform end - STABLE dimension updates
  const handleTransformEnd = (e) => {
    const node = e.target;
    const shapeId = node.id();
    
    if (!shapeId) return;

    // Get current transform values
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();
    
    // Calculate new dimensions
    const newWidth = Math.max(10, node.width() * scaleX);
    const newHeight = Math.max(10, node.height() * scaleY);
    
    // CRITICAL: Reset scale to prevent accumulation
    node.scaleX(1);
    node.scaleY(1);
    
    // Update shape in state with new dimensions and position
    updateShape(shapeId, {
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      rotation: rotation
    });
    
    // Force layer redraw
    node.getLayer()?.batchDraw();
  };

  return (
    <Transformer
      ref={transformerRef}
      boundBoxFunc={(oldBox, newBox) => {
        // Limit resize to reasonable bounds
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox;
        }
        return newBox;
      }}
      onTransformEnd={handleTransformEnd}
      // Customize transformer appearance
      borderStroke="#0066ff"
      borderStrokeWidth={1}
      anchorStroke="#0066ff"
      anchorFill="#ffffff"
      anchorSize={8}
      anchorCornerRadius={2}
      // Enable all transformations
      enabledAnchors={[
        'top-left',
        'top-center', 
        'top-right',
        'middle-right',
        'bottom-right',
        'bottom-center',
        'bottom-left',
        'middle-left'
      ]}
      // Rotation settings
      rotateEnabled={true}
      rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
      rotationSnapTolerance={5}
      // Keep aspect ratio when holding shift
      keepRatio={false}
    />
  );
};

export default SelectionTransformer;