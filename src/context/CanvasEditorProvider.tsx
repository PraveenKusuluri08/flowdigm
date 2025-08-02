/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/CanvasContext.js - Fixed for Stable Positioning
import React, { createContext, useReducer, useCallback } from 'react';

// Initial canvas state - STABLE defaults
const initialCanvasState = {
  filename: "Untitled Diagram",
  shapes: [],
  selectedShapeIds: [],
  stage: {
    scale: 1,
    x: 0,
    y: 0,
    width: window.innerWidth - 256, // Account for sidebar
    height: window.innerHeight - 120 // Account for toolbar
  },
  grid: {
    visible: true,
    size: 20,
    snap: false // Start with snap disabled to prevent initial issues
  },
  tool: 'select',
  history: {
    past: [],
    present: [],
    future: []
  },
  clipboard: [],
  isDragging: false,
  isDrawing: false
};

// Canvas reducer - STABLE operations
const canvasReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILENAME':
      return {
        ...state,
        filename: action.payload
      };

    case 'ADD_SHAPE':
      {
        const newShape = {
          id: action.payload.id || `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: action.payload.type,
          x: action.payload.x || 100,
          y: action.payload.y || 100,
          width: action.payload.width || 100,
          height: action.payload.height || 100,
          fill: action.payload.fill || '#ffffff',
          stroke: action.payload.stroke || '#000000',
          strokeWidth: action.payload.strokeWidth || 2,
          rotation: action.payload.rotation || 0,
          ...action.payload
        };
        
        return {
          ...state,
          shapes: [...state.shapes, newShape],
          selectedShapeIds: [newShape.id]
        };
      }

    case 'UPDATE_SHAPE':
      return {
        ...state,
        shapes: state.shapes.map(shape =>
          shape.id === action.payload.id
            ? { 
                ...shape, 
                ...action.payload.updates,
                // Ensure numeric values are actually numbers
                x: typeof action.payload.updates.x === 'number' ? action.payload.updates.x : shape.x,
                y: typeof action.payload.updates.y === 'number' ? action.payload.updates.y : shape.y,
                width: typeof action.payload.updates.width === 'number' ? action.payload.updates.width : shape.width,
                height: typeof action.payload.updates.height === 'number' ? action.payload.updates.height : shape.height,
                rotation: typeof action.payload.updates.rotation === 'number' ? action.payload.updates.rotation : shape.rotation
              }
            : shape
        )
      };

    case 'DELETE_SHAPES':
      {
        const idsToDelete = action.payload;
        return {
          ...state,
          shapes: state.shapes.filter(shape => !idsToDelete.includes(shape.id)),
          selectedShapeIds: state.selectedShapeIds.filter(id => !idsToDelete.includes(id))
        };
      }

    case 'SELECT_SHAPES':
      return {
        ...state,
        selectedShapeIds: Array.isArray(action.payload) ? action.payload : [action.payload]
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedShapeIds: []
      };

    case 'UPDATE_STAGE':
      return {
        ...state,
        stage: { 
          ...state.stage, 
          ...action.payload,
          // Ensure stage values are numbers and reasonable
          scale: typeof action.payload.scale === 'number' ? 
            Math.max(0.1, Math.min(10, action.payload.scale)) : state.stage.scale,
          x: typeof action.payload.x === 'number' ? action.payload.x : state.stage.x,
          y: typeof action.payload.y === 'number' ? action.payload.y : state.stage.y
        }
      };

    case 'SET_TOOL':
      return {
        ...state,
        tool: action.payload,
        // Clear selection when switching to drawing tools
        selectedShapeIds: action.payload === 'select' ? state.selectedShapeIds : []
      };

    case 'TOGGLE_GRID':
      return {
        ...state,
        grid: { ...state.grid, visible: !state.grid.visible }
      };

    case 'SET_GRID_SIZE':
      return {
        ...state,
        grid: { 
          ...state.grid, 
          size: Math.max(5, Math.min(100, action.payload)) // Reasonable grid size limits
        }
      };

    case 'TOGGLE_SNAP':
      return {
        ...state,
        grid: { ...state.grid, snap: !state.grid.snap }
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: !!action.payload
      };

    case 'SET_DRAWING':
      return {
        ...state,
        isDrawing: !!action.payload
      };

    case 'COPY_SHAPES':
      {
        const shapesToCopy = state.shapes.filter((shape) => 
          state.selectedShapeIds.includes(shape.id)
        );
        return {
          ...state,
          clipboard: shapesToCopy
        };
      }

    case 'PASTE_SHAPES':
      {
        const pastedShapes = state.clipboard.map(shape => ({
          ...shape,
          id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          x: shape.x + 20,
          y: shape.y + 20
        }));
        
        return {
          ...state,
          shapes: [...state.shapes, ...pastedShapes],
          selectedShapeIds: pastedShapes.map(shape => shape.id)
        };
      }

    default:
      return state;
  }
};

// Create context
const CanvasContext = createContext();

// Canvas Provider
export const CanvasProvider = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialCanvasState);

  // Helper functions - STABLE implementations
  const addShape = useCallback((shapeData) => {
    dispatch({ type: 'ADD_SHAPE', payload: shapeData });
  }, []);

  const updateShape = useCallback((id, updates) => {
    if (!id || !updates) return;
    dispatch({ type: 'UPDATE_SHAPE', payload: { id, updates } });
  }, []);

  const deleteSelectedShapes = useCallback(() => {
    if (state.selectedShapeIds.length === 0) return;
    dispatch({ type: 'DELETE_SHAPES', payload: state.selectedShapeIds });
  }, [state.selectedShapeIds]);

  const selectShapes = useCallback((shapeIds) => {
    dispatch({ type: 'SELECT_SHAPES', payload: shapeIds });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const updateStage = useCallback((updates) => {
    if (!updates) return;
    dispatch({ type: 'UPDATE_STAGE', payload: updates });
  }, []);

  const setTool = useCallback((tool) => {
    dispatch({ type: 'SET_TOOL', payload: tool });
  }, []);

  const copyShapes = useCallback(() => {
    dispatch({ type: 'COPY_SHAPES' });
  }, []);

  const pasteShapes = useCallback(() => {
    dispatch({ type: 'PASTE_SHAPES' });
  }, []);

  // FIXED snap to grid function - more reliable
  const snapToGrid = useCallback((value) => {
    if (!state.grid.snap || !state.grid.size) return value;
    
    // Ensure we're working with a number
    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const gridSize = state.grid.size;
    
    // Round to nearest grid point
    return Math.round(numValue / gridSize) * gridSize;
  }, [state.grid.snap, state.grid.size]);

  // Function to set the filename in the context
  const setFileNameContext = useCallback((name) => {
    if (typeof name === 'string') {
      dispatch({ type: 'SET_FILENAME', payload: name });
    }
  }, []);

  // Toggle grid snap with feedback
  const toggleGridSnap = useCallback(() => {
    dispatch({ type: 'TOGGLE_SNAP' });
  }, []);

  // Set grid size with validation
  const setGridSize = useCallback((size) => {
    const validSize = Math.max(5, Math.min(100, parseInt(size) || 20));
    dispatch({ type: 'SET_GRID_SIZE', payload: validSize });
  }, []);

  const value = {
    state,
    dispatch,
    // Helper functions
    addShape,
    updateShape,
    deleteSelectedShapes,
    selectShapes,
    clearSelection,
    updateStage,
    setTool,
    copyShapes,
    pasteShapes,
    snapToGrid,
    setFileNameContext,
    toggleGridSnap,
    setGridSize
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

// Custom hook
export { CanvasContext };