// components/Canvas/Toolbar.jsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from 'react';
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
  Copy,
  ClipboardPaste,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { useCanvas } from '../../hooks/useCanvas';

const Toolbar = () => {
  const { 
    state, 
    setTool, 
    updateStage, 
    copyShapes, 
    pasteShapes, 
    deleteSelectedShapes,
    dispatch 
  } = useCanvas();

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

  const handleCopy = () => {
    if (state.selectedShapeIds.length > 0) {
      copyShapes();
    }
  };

  const handlePaste = () => {
    if (state.clipboard.length > 0) {
      pasteShapes();
    }
  };

  const handleDelete = () => {
    if (state.selectedShapeIds.length > 0) {
      deleteSelectedShapes();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
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

        {/* Edit Tools */}
        <div className="flex items-center gap-1 mr-4">
          <button
            onClick={handleCopy}
            title="Copy (Ctrl+C)"
            disabled={state.selectedShapeIds.length === 0}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={handlePaste}
            title="Paste (Ctrl+V)"
            disabled={state.clipboard.length === 0}
            className="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ClipboardPaste size={18} />
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

        {/* View Options */}
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

        {/* Right Side - Current Selection Info */}
        {state.selectedShapeIds.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              {state.selectedShapeIds.length} shape{state.selectedShapeIds.length > 1 ? 's' : ''} selected
            </span>
            
            {state.selectedShapeIds.length === 1 && (
              <>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center gap-1">
                  <button
                    title="Align Left"
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                  >
                    <AlignLeft size={14} />
                  </button>
                  <button
                    title="Align Center"
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                  >
                    <AlignCenter size={14} />
                  </button>
                  <button
                    title="Align Right"
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                  >
                    <AlignRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;