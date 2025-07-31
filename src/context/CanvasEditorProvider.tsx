/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/CanvasContext.js
import React, { createContext, useReducer, useCallback } from 'react';

// Initial canvas state
const initialCanvasState = {
  filename:"Untitleled Diagram",
  shapes: [],
  selectedShapeIds: [],
  stage: {
    scale: 1,
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight
  },
  grid: {
    visible: true,
    size: 20,
    snap: true
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

// Canvas reducer
const canvasReducer = (state, action) => {
  switch (action.type) {

    case 'SET_FILENAME':
      return {
        ...state,
        filename: action.payload
      };
    case 'ADD_SHAPE':
      { const newShape = {
        id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
      }; }

    case 'UPDATE_SHAPE':
      return {
        ...state,
        shapes: state.shapes.map(shape =>
          shape.id === action.payload.id
            ? { ...shape, ...action.payload.updates }
            : shape
        )
      };

    case 'DELETE_SHAPES':
      { const idsToDelete = action.payload;
      return {
        ...state,
        shapes: state.shapes.filter(shape => !idsToDelete.includes(shape.id)),
        selectedShapeIds: state.selectedShapeIds.filter(id => !idsToDelete.includes(id))
      }; }

    case 'SELECT_SHAPES':
      return {
        ...state,
        selectedShapeIds: action.payload
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedShapeIds: []
      };

    case 'UPDATE_STAGE':
      return {
        ...state,
        stage: { ...state.stage, ...action.payload }
      };

    case 'SET_TOOL':
      return {
        ...state,
        tool: action.payload
      };

    case 'TOGGLE_GRID':
      return {
        ...state,
        grid: { ...state.grid, visible: !state.grid.visible }
      };

    case 'SET_GRID_SIZE':
      return {
        ...state,
        grid: { ...state.grid, size: action.payload }
      };

    case 'TOGGLE_SNAP':
      return {
        ...state,
        grid: { ...state.grid, snap: !state.grid.snap }
      };

    case 'SET_DRAGGING':
      return {
        ...state,
        isDragging: action.payload
      };

    case 'SET_DRAWING':
      return {
        ...state,
        isDrawing: action.payload
      };

    case 'COPY_SHAPES':
      { const shapesToCopy = state.shapes.filter((shape: { id: any; }) => 
        state.selectedShapeIds.includes(shape.id)
      );
      return {
        ...state,
        clipboard: shapesToCopy
      }; }

    case 'PASTE_SHAPES':
      { const pastedShapes = state.clipboard.map(shape => ({
        ...shape,
        id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: shape.x + 20,
        y: shape.y + 20
      }));
      
      return {
        ...state,
        shapes: [...state.shapes, ...pastedShapes],
        selectedShapeIds: pastedShapes.map(shape => shape.id)
      }; }

    default:
      return state;
  }
};

// Create context
const CanvasContext = createContext();

// Canvas Provider
export const CanvasProvider = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialCanvasState);

  // Helper functions
  const addShape = useCallback((shapeData) => {
    dispatch({ type: 'ADD_SHAPE', payload: shapeData });
  }, []);

  const updateShape = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_SHAPE', payload: { id, updates } });
  }, []);

  const deleteSelectedShapes = useCallback(() => {
    dispatch({ type: 'DELETE_SHAPES', payload: state.selectedShapeIds });
  }, [state.selectedShapeIds]);

  const selectShapes = useCallback((shapeIds) => {
    dispatch({ type: 'SELECT_SHAPES', payload: shapeIds });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const updateStage = useCallback((updates) => {
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

  const snapToGrid = useCallback((value) => {
    if (!state.grid.snap) return value;
    return Math.round(value / state.grid.size) * state.grid.size;
  }, [state.grid.snap, state.grid.size]);

  //Function to set the filename in the context and update the value in the state
  const setFileNameContext = useCallback((name:string)=>{
    dispatch({ type: 'SET_FILENAME', payload: name });
  },[])

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
    setFileNameContext
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

// Custom hook
export {CanvasContext}