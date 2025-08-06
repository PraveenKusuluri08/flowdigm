// components/Canvas/Toolbar.jsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React, { useState } from 'react';
import { 
  MousePointer, 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  Type,
  Hand,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Trash2,
  Edit3,
  Shield
} from 'lucide-react';
import { useCanvas } from '../../hooks/useCanvas';
import ValidationPanel from './ValidationPanel';

const Toolbar = () => {
  const { 
    state, 
    setTool, 
    updateStage, 
    deleteSelectedShapes,
    dispatch 
  } = useCanvas();

  const [showValidation, setShowValidation] = useState(false);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select', shortcut: 'V' },
    { id: 'hand', icon: Hand, label: 'Pan', shortcut: 'H' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { id: 'circle', icon: Circle, label: 'Circle', shortcut: 'C' },
    { id: 'triangle', icon: Triangle, label: 'Triangle', shortcut: 'T' },
    { id: 'line', icon: Minus, label: 'Line', shortcut: 'L' },
    { id: 'text', icon: Type, label: 'Text', shortcut: 'T' }
  ];

  const handleToolSelect = (toolId) => {
    setTool(toolId);
  };

  const handleZoomIn = () => {
    const newScale = Math.min(5, state.stage.scale * 1.2);
    updateStage({ scale: newScale });
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.1, state.stage.scale / 1.2);
    updateStage({ scale: newScale });
  };

  const handleZoomFit = () => {
    // Reset to 100% zoom and center
    updateStage({ 
      scale: 1, 
      x: 0, 
      y: 0 
    });
  };

  const handleToggleGrid = () => {
    dispatch({ type: 'TOGGLE_GRID' });
  };

  const handleDelete = () => {
    if (state.selectedShapeIds.length > 0) {
      deleteSelectedShapes();
    }
  };

  const handleTextEdit = () => {
    if (state.selectedShapeIds.length > 0) {
      // Trigger text editing for the first selected shape
      const selectedShapeId = state.selectedShapeIds[0];
      console.log('🎯 Triggering text edit for shape:', selectedShapeId);
      
      // Find the node in ReactFlow and trigger its text editing
      const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
      if (reactFlowInstance) {
        const nodes = reactFlowInstance.getNodes();
        const selectedNode = nodes.find((node: any) => node.id === selectedShapeId);
        if (selectedNode && selectedNode.data.onChange) {
          // This will trigger the text editing mode in the BPMN nodes
          console.log('🎯 Found selected node, triggering text edit');
          // The actual text editing will be handled by the node's double-click handler
        } else {
          console.log('❌ Selected node not found or no onChange function');
        }
      }
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0 z-10">
      <div className="flex items-center gap-1">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1 mr-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
              className={`
                p-2 rounded hover:bg-gray-100 transition-colors
                ${state.tool === tool.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}
              `}
            >
              <tool.icon size={18} />
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mr-4" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={handleZoomOut}
            title="Zoom Out (Ctrl+-)"
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-sm min-w-12 text-center text-gray-600">
            {Math.round(state.stage.scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In (Ctrl++)"
            className="p-2 rounded hover:bg-gray-100 text-gray-600"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleZoomFit}
            title="Fit to Screen"
            className="p-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
          >
            100%
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mr-4" />

        {/* Delete Tool */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={handleTextEdit}
            title="Edit Text (Double-click shape)"
            disabled={state.selectedShapeIds.length === 0}
            className="p-2 rounded hover:bg-gray-100 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={handleDelete}
            title="Delete (Del)"
            disabled={state.selectedShapeIds.length === 0}
            className="p-2 rounded hover:bg-gray-100 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mr-4" />

        {/* Validation Panel */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={() => setShowValidation(!showValidation)}
            title="Shape Validation"
            className={`
              p-2 rounded hover:bg-gray-100 transition-colors
              ${showValidation ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}
            `}
          >
            <Shield size={18} />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mr-4" />

        {/* Grid Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleGrid}
            title="Toggle Grid (Ctrl+Shift+G)"
            className={`
              p-2 rounded hover:bg-gray-100 transition-colors
              ${state.grid.visible ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}
            `}
          >
            <Grid3X3 size={18} />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Selection Info */}
        {state.selectedShapeIds.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              {state.selectedShapeIds.length} shape{state.selectedShapeIds.length > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>
      
      {/* Validation Panel */}
      <ValidationPanel 
        isOpen={showValidation} 
        onClose={() => setShowValidation(false)} 
      />
    </div>
  );
};

export default Toolbar;