/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/CanvasContext.js - Fixed for Stable Positioning
import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import type { CanvasData } from '../types/importExport';
import { exportAsPNG, exportAsJPEG, exportAsSVG, exportAsJSON, importFromJSON, exportAsPNGSimple, exportAsPNGCanvas } from '../utils/importExportUtils';
import { saveFileToDevice, loadFileFromDevice, setupAutoSave, loadAutoSave, clearAutoSave, hasUnsavedWork } from '../utils/fileSystemUtils';
import { processImageFileForShapes, createImageFileInput, type ExtractedShape } from '../utils/imageProcessingUtils';

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
        console.log('ADD_SHAPE reducer called with payload:', action.payload);
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
        
        console.log('Created new shape:', newShape);
        console.log('Previous shapes count:', state.shapes.length);
        
        const newState = {
          ...state,
          shapes: [...state.shapes, newShape],
          selectedShapeIds: [newShape.id]
        };
        
        console.log('New shapes count:', newState.shapes.length);
        return newState;
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

    case 'IMPORT_CANVAS':
      return {
        ...state,
        shapes: action.payload.shapes || [],
        filename: action.payload.fileName || state.filename,
        grid: action.payload.grid || state.grid,
        stage: action.payload.viewport ? {
          ...state.stage,
          x: action.payload.viewport.x || 0,
          y: action.payload.viewport.y || 0,
          scale: action.payload.viewport.zoom || 1
        } : state.stage
      };

    case 'CLEAR_CANVAS':
      return {
        ...state,
        shapes: [],
        selectedShapeIds: [],
        stage: {
          ...state.stage,
          x: 0,
          y: 0,
          scale: 1
        }
      };

    default:
      return state;
  }
};

// Define context type
interface CanvasContextType {
  state: any;
  dispatch: any;
  // Helper functions
  addShape: (shapeData: any) => void;
  updateShape: (id: string, updates: any) => void;
  deleteSelectedShapes: () => void;
  selectShapes: (shapeIds: string[]) => void;
  clearSelection: () => void;
  updateStage: (updates: any) => void;
  setTool: (tool: string) => void;
  copyShapes: () => void;
  pasteShapes: () => void;
  snapToGrid: (value: number) => number;
  setFileNameContext: (name: string) => void;
  toggleGridSnap: () => void;
  setGridSize: (size: number) => void;
  // Import/Export functions
  importCanvas: (canvasData: any) => void;
  clearCanvas: () => void;
  exportCanvas: (format: string, canvasElement?: HTMLElement) => Promise<void>;
  importFromFile: (file: File) => Promise<void>;
  // Save/Load functions
  saveToDevice: (fileName?: string) => Promise<boolean>;
  loadFromDevice: () => Promise<boolean>;
  checkForAutoSave: () => any;
  clearAutoSaveData: () => void;
  checkUnsavedWork: () => boolean;
  // New functionality
  createNewDiagram: () => void;
  openImageFile: () => Promise<void>;
}

// Create context
const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

// Canvas Provider
const CanvasProvider = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialCanvasState);
  
  // Store context globally for export access
  useEffect(() => {
    (window as any).__CANVAS_CONTEXT__ = { state, dispatch };
  }, [state]);

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

  // Import/Export functions
  const importCanvas = useCallback((canvasData: CanvasData) => {
    dispatch({ type: 'IMPORT_CANVAS', payload: canvasData });
  }, []);

  const clearCanvas = useCallback(() => {
    dispatch({ type: 'CLEAR_CANVAS' });
  }, []);

  const exportCanvas = useCallback(async (format: string, canvasElement?: HTMLElement) => {
    try {
      const fileName = state.filename || 'Untitled Diagram';
      
      // Convert shapes to nodes format for export
      const nodes = state.shapes.map(shape => ({
        id: shape.id,
        type: shape.type,
        position: { x: shape.x, y: shape.y },
        data: {
          label: shape.text || shape.serviceName || shape.type,
          width: shape.width,
          height: shape.height,
          fill: shape.fill,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth,
          serviceType: shape.serviceType,
          serviceName: shape.serviceName,
        }
      }));

      const edges: any[] = []; // For now, edges are empty as they're handled separately in ReactFlow

      const canvasData: CanvasData = {
        nodes,
        edges,
        viewport: {
          x: state.stage.x,
          y: state.stage.y,
          zoom: state.stage.scale
        },
        grid: state.grid,
        fileName: state.filename,
        version: '1.0'
      };

      switch (format.toLowerCase()) {
        case 'png':
          // Try enhanced export method first
          try {
            await exportAsPNGSimple(fileName);
          } catch (error) {
            console.error('Enhanced export failed, trying canvas-based fallback:', error);
            try {
              const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
              if (reactFlowInstance) {
                const nodes = reactFlowInstance.getNodes();
                const edges = reactFlowInstance.getEdges();
                if (nodes.length > 0) {
                  await exportAsPNGCanvas(nodes, edges, fileName);
                } else {
                  // If no nodes, try basic html2canvas
                  if (canvasElement) {
                    await exportAsPNG(canvasElement, fileName);
                  }
                }
              } else {
                // Fallback to basic html2canvas
                if (canvasElement) {
                  await exportAsPNG(canvasElement, fileName);
                }
              }
            } catch (fallbackError) {
              console.error('All export methods failed:', fallbackError);
              throw new Error('Failed to export PNG: All methods failed');
            }
          }
          break;
        case 'jpeg':
        case 'jpg':
          if (canvasElement) {
            await exportAsJPEG(canvasElement, fileName);
          }
          break;
        case 'svg':
          // Get actual ReactFlow data for SVG export
          try {
            const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
            if (reactFlowInstance) {
              const reactFlowNodes = reactFlowInstance.getNodes();
              const reactFlowEdges = reactFlowInstance.getEdges();
              console.log('SVG Export - ReactFlow nodes:', reactFlowNodes.length, 'edges:', reactFlowEdges.length);
              exportAsSVG(reactFlowNodes, reactFlowEdges, fileName);
            } else {
              // Fallback to context data
              exportAsSVG(nodes, edges, fileName);
            }
          } catch (error) {
            console.error('SVG export failed:', error);
            // Fallback to context data
            exportAsSVG(nodes, edges, fileName);
          }
          break;
        case 'json':
          exportAsJSON(canvasData, fileName);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }, [state]);

  const importFromFile = useCallback(async (file: File) => {
    try {
      const canvasData = await importFromJSON(file);
      importCanvas(canvasData);
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  }, [importCanvas]);

  // Save/Load functions
  const saveToDevice = useCallback(async (fileName?: string) => {
    try {
      const currentFileName = fileName || state.filename || 'Untitled Diagram';
      
      // Convert shapes to nodes format for export
      const nodes = state.shapes.map(shape => ({
        id: shape.id,
        type: shape.type,
        position: { x: shape.x, y: shape.y },
        data: {
          label: shape.text || shape.serviceName || shape.type,
          width: shape.width,
          height: shape.height,
          fill: shape.fill,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth,
          serviceType: shape.serviceType,
          serviceName: shape.serviceName,
        }
      }));

      const edges: any[] = []; // For now, edges are empty as they're handled separately in ReactFlow

      const canvasData: CanvasData = {
        nodes,
        edges,
        viewport: {
          x: state.stage.x,
          y: state.stage.y,
          zoom: state.stage.scale
        },
        grid: state.grid,
        fileName: currentFileName,
        version: '1.0'
      };

      await saveFileToDevice(canvasData, currentFileName);
      
      // Setup auto-save after successful save
      setupAutoSave(canvasData, currentFileName);
      
      return true;
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  }, [state]);

  const loadFromDevice = useCallback(async () => {
    try {
      console.log('Attempting to load file from device...');
      const canvasData = await loadFileFromDevice();
      console.log('File loaded successfully:', canvasData);
      
      importCanvas(canvasData);
      
      // Update filename if available
      if (canvasData.fileName) {
        dispatch({ type: 'SET_FILENAME', payload: canvasData.fileName });
      }
      
      // Setup auto-save for the loaded file
      setupAutoSave(canvasData, canvasData.fileName);
      
      return true;
    } catch (error) {
      console.error('Load error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Invalid file format')) {
          throw new Error('The selected file is not a valid FlowDigm diagram file. Please select a .json file exported from FlowDigm.');
        } else if (error.message.includes('No file selected')) {
          throw new Error('No file was selected. Please try again and select a file.');
        } else if (error.message.includes('Failed to parse')) {
          throw new Error('The selected file could not be read. It may be corrupted or in an unsupported format.');
        } else {
          throw new Error(`Failed to load file: ${error.message}`);
        }
      } else {
        throw new Error('An unexpected error occurred while loading the file.');
      }
    }
  }, [importCanvas]);

  const checkForAutoSave = useCallback(() => {
    const autoSaveData = loadAutoSave();
    if (autoSaveData) {
      return autoSaveData;
    }
    return null;
  }, []);

  const clearAutoSaveData = useCallback(() => {
    clearAutoSave();
  }, []);

  const checkUnsavedWork = useCallback(() => {
    return hasUnsavedWork();
  }, []);

  // New diagram functionality
  const createNewDiagram = useCallback(() => {
    // Check for unsaved work
    if (hasUnsavedWork()) {
      const shouldProceed = window.confirm('You have unsaved changes. Do you want to create a new diagram anyway?');
      if (!shouldProceed) {
        return;
      }
    }
    
    // Clear the canvas and reset to initial state
    dispatch({ type: 'CLEAR_CANVAS' });
    dispatch({ type: 'SET_FILENAME', payload: 'Untitled Diagram' });
    
    // Clear auto-save data
    clearAutoSave();
  }, []);

  // Open image file functionality
  const openImageFile = useCallback(async () => {
    try {
      const input = createImageFileInput();
      
      input.onchange = async (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (file) {
          try {
            console.log('Processing file:', file.name, file.type, file.size);
            
            // Process the image file and extract shapes
            const extractedShapes = await processImageFileForShapes(file);
            console.log('Extracted shapes:', extractedShapes);
            
            if (extractedShapes.length > 0) {
              // Check for unsaved work
              if (hasUnsavedWork()) {
                const shouldProceed = window.confirm('You have unsaved changes. Do you want to open the image file anyway?');
                if (!shouldProceed) {
                  return;
                }
              }
              
              // Clear current canvas
              dispatch({ type: 'CLEAR_CANVAS' });
              
              // Wait a bit for the clear to complete
              await new Promise(resolve => setTimeout(resolve, 200));
              
              // Get ReactFlow instance
              const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
              
              // Add extracted shapes to canvas
              console.log('Adding extracted shapes to canvas:', extractedShapes.length);
              extractedShapes.forEach((shape, index) => {
                // Convert shape to ReactFlow node format
                const nodeData = {
                  id: shape.id || `imported_shape_${Date.now()}_${index}`,
                  type: shape.type === 'rectangle' ? 'rect' : shape.type,
                  position: { 
                    x: shape.x + (index * 60), // Better spacing
                    y: shape.y + (index * 60) 
                  },
                  data: {
                    label: shape.label || `Imported ${shape.type}`,
                    width: shape.width || 120,
                    height: shape.height || 80,
                    fill: shape.fill || '#e3f2fd',
                    stroke: shape.stroke || '#1976d2',
                    strokeWidth: shape.strokeWidth || 2,
                    serviceType: shape.serviceType,
                    serviceName: shape.serviceName,
                    icon: shape.icon
                  },
                  resizable: true,
                  minWidth: 50,
                  minHeight: 30
                };
                
                // Add to ReactFlow directly
                if (reactFlowInstance) {
                  const currentNodes = reactFlowInstance.getNodes();
                  reactFlowInstance.setNodes([...currentNodes, nodeData]);
                }
                
                // Also add to our state
                const shapeData = {
                  id: nodeData.id,
                  type: shape.icon ? 'imported-image' : shape.type,
                  x: nodeData.position.x,
                  y: nodeData.position.y,
                  width: shape.width,
                  height: shape.height,
                  fill: shape.fill,
                  stroke: shape.stroke,
                  strokeWidth: shape.strokeWidth,
                  text: shape.label,
                  serviceName: shape.serviceName,
                  serviceType: shape.serviceType,
                  icon: shape.icon
                };
                
                console.log(`Adding shape ${index + 1}:`, shapeData);
                dispatch({ 
                  type: 'ADD_SHAPE', 
                  payload: shapeData
                });
              });
              
              // Force ReactFlow to update with new shapes
              setTimeout(() => {
                if (reactFlowInstance) {
                  console.log('Forcing ReactFlow to update with imported shapes');
                  reactFlowInstance.fitView({ padding: 0.1 });
                }
              }, 300);
              
              // Update filename
              const fileName = file.name.replace(/\.[^/.]+$/, '') || 'Imported Diagram';
              dispatch({ type: 'SET_FILENAME', payload: fileName });
              
              // Setup auto-save
              const canvasData: CanvasData = {
                nodes: extractedShapes.map((shape, index) => ({
                  id: shape.id || `imported_shape_${Date.now()}_${index}`,
                  type: shape.type === 'rectangle' ? 'rect' : shape.type,
                  position: { x: shape.x + (index * 60), y: shape.y + (index * 60) },
                  data: {
                    label: shape.label || `Imported ${shape.type}`,
                    width: shape.width || 120,
                    height: shape.height || 80,
                    fill: shape.fill || '#e3f2fd',
                    stroke: shape.stroke || '#1976d2',
                    strokeWidth: shape.strokeWidth || 2,
                    serviceType: shape.serviceType,
                    serviceName: shape.serviceName,
                    icon: shape.icon
                  }
                })),
                edges: [],
                viewport: { x: 0, y: 0, zoom: 1 },
                grid: state.grid,
                fileName: fileName,
                version: '1.0'
              };
              
              setupAutoSave(canvasData, fileName);
              
              alert(`Successfully imported ${extractedShapes.length} shape(s) from ${file.name}`);
            } else {
              alert('No shapes found in the image file.');
            }
          } catch (error) {
            console.error('Error processing image file:', error);
            alert('Failed to process image file: ' + (error instanceof Error ? error.message : String(error)));
          }
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Error opening image file:', error);
      alert('Failed to open image file: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, [state.grid]);

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
    setGridSize,
    // Import/Export functions
    importCanvas,
    clearCanvas,
    exportCanvas,
    importFromFile,
    // Save/Load functions
    saveToDevice,
    loadFromDevice,
    checkForAutoSave,
    clearAutoSaveData,
    checkUnsavedWork,
    // New functionality
    createNewDiagram,
    openImageFile
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

// Export context and provider
export { CanvasContext, CanvasProvider };