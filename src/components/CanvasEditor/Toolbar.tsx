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
// import ValidationPanel from './ValidationPanel'; // Removed problematic import

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
    <div className="bg-gradient-to-r from-white via-gray-50/50 to-blue-50/30 border-b border-white/20 px-4 py-2 flex-shrink-0 z-10 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1 mr-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
              className={`
                p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border-2 border-transparent hover:border-blue-200
                ${state.tool === tool.id ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-600'}
              `}
            >
              <tool.icon size={16} />
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-gray-400 mr-4" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={handleZoomOut}
            title="Zoom Out (Ctrl+-)"
            className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 text-gray-600 border-2 border-transparent hover:border-green-200 transition-all duration-300"
          >
            <ZoomOut size={16} />
          </button>
          <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border-2 border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-700 min-w-12 text-center">
              {Math.round(state.stage.scale * 100)}%
            </span>
          </div>
          <button
            onClick={handleZoomIn}
            title="Zoom In (Ctrl++)"
            className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-600 border-2 border-transparent hover:border-blue-200 transition-all duration-300"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomFit}
            title="Fit to Screen"
            className="p-2 text-sm font-medium bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-lg text-gray-600 border-2 border-transparent hover:border-orange-200 transition-all duration-300"
          >
            100%
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-gray-400 mr-6" />

        {/* Delete Tool */}
        <div className="flex items-center gap-2 mr-6">
          <button
            onClick={handleTextEdit}
            title="Edit Text (Double-click shape)"
            disabled={state.selectedShapeIds.length === 0}
            className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-blue-600 border-2 border-transparent hover:border-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit3 size={20} />
          </button>
          <button
            onClick={handleDelete}
            title="Delete (Del)"
            disabled={state.selectedShapeIds.length === 0}
            className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-red-600 border-2 border-transparent hover:border-red-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-gray-400 mr-6" />

        {/* Validation Panel */}
        <div className="flex items-center gap-2 mr-6">
          <button
            onClick={() => setShowValidation(!showValidation)}
            title="Shape Validation"
            className={`
              p-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-300 border-2 border-transparent hover:border-indigo-200
              ${showValidation ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg' : 'text-gray-600'}
            `}
          >
            <Shield size={20} />
          </button>
        </div>

        {/* Separator */}
        <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-gray-400 mr-6" />

        {/* Grid Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleGrid}
            title="Toggle Grid (Ctrl+Shift+G)"
            className={`
              p-3 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border-2 border-transparent hover:border-green-200
              ${state.grid.visible ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : 'text-gray-600'}
            `}
          >
            <Grid3X3 size={20} />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Selection Info */}
        {state.selectedShapeIds.length > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-gray-200 shadow-sm">
              <span className="font-bold text-gray-700">
                {state.selectedShapeIds.length} shape{state.selectedShapeIds.length > 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Validation Panel */}
      {/* <ValidationPanel 
        isOpen={showValidation} 
        onClose={() => setShowValidation(false)} 
      /> */}
    </div>
  );
};

export default Toolbar;