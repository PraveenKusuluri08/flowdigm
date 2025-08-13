/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/CanvasContext.js - Fixed for Stable Positioning
import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import type { CanvasData } from '../types/importExport';
import { exportAsJSON, importFile, exportAsPNG, exportAsJPEG, exportAsSVG, exportAsPNGSimple, exportFile } from '../utils/importExportUtils';
import { saveFileToDevice, loadFileFromDevice, setupAutoSave, loadAutoSave, clearAutoSave, hasUnsavedWork } from '../utils/fileSystemUtils';
import { processImageFileForShapes, createImageFileInput } from '../utils/imageProcessingUtils';

// Initial canvas state
const initialCanvasState = {
  filename: "Untitled Diagram",
  shapes: [] as any[],
  selectedShapeIds: [] as string[],
  stage: {
    scale: 1,
    x: 0,
    y: 0,
    width: window.innerWidth - 256,
    height: window.innerHeight - 120
  },
  grid: {
    visible: true,
    size: 20,
    snap: false
  },
  tool: 'select',
  history: {
    past: [] as any[],
    present: [] as any[],
    future: [] as any[]
  },
  clipboard: [] as any[],
  isDragging: false,
  isDrawing: false
};

// Canvas reducer
type CanvasState = typeof initialCanvasState;
type CanvasAction = { type: string; payload?: any };

const canvasReducer = (state: CanvasState, action: CanvasAction) => {
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
        
        const newState = {
          ...state,
          shapes: [...state.shapes, newShape],
          selectedShapeIds: [newShape.id]
        };
        
        return newState;
      }

    case 'UPDATE_SHAPE':
      return {
        ...state,
        shapes: state.shapes.map((shape: any) =>
          shape.id === action.payload.id
            ? { 
                ...shape, 
                ...action.payload.updates,
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
        const idsToDelete = action.payload as string[];
        return {
          ...state,
          shapes: state.shapes.filter((shape: any) => !idsToDelete.includes(shape.id)),
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
          size: Math.max(5, Math.min(100, action.payload))
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
        const shapesToCopy = state.shapes.filter((shape: any) => 
          state.selectedShapeIds.includes(shape.id)
        );
        return {
          ...state,
          clipboard: shapesToCopy
        };
      }

    case 'PASTE_SHAPES':
      {
        const pastedShapes = state.clipboard.map((shape: any) => ({
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
      {
        const payload = action.payload || {};
        const importedNodes = Array.isArray(payload.nodes) ? payload.nodes : [];
        const mappedShapes = importedNodes.map((node: any) => ({
          id: node.id,
          type: node.type === 'rect' ? 'rectangle' : (node.type || 'rectangle'),
          x: node.position?.x ?? 0,
          y: node.position?.y ?? 0,
          width: node.data?.width ?? 100,
          height: node.data?.height ?? 80,
          fill: node.data?.fill ?? '#ffffff',
          stroke: node.data?.stroke ?? '#000000',
          strokeWidth: node.data?.strokeWidth ?? 2,
          text: node.data?.label ?? '',
          serviceType: node.data?.serviceType,
          serviceName: node.data?.serviceName,
          icon: node.data?.icon
        }));

        return {
          ...state,
          shapes: payload.shapes && Array.isArray(payload.shapes) && payload.shapes.length > 0 ? payload.shapes : (mappedShapes as any[]),
          filename: payload.fileName || state.filename,
          grid: payload.grid || state.grid,
          stage: payload.viewport ? {
            ...state.stage,
            x: payload.viewport.x || 0,
            y: payload.viewport.y || 0,
            scale: payload.viewport.zoom || 1
          } : state.stage
        };
      }

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
  exportCanvas: (format: string, canvasElement?: HTMLElement, options?: any) => Promise<void>;
  importFromFile: (file: File) => Promise<void>;
    importImageFile: (file: File) => Promise<void>;
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
const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialCanvasState);
  
  // Store context globally for export access
  useEffect(() => {
    (window as any).__CANVAS_CONTEXT__ = { state, dispatch };
  }, [state]);

  // Helper functions
  const addShape = useCallback((shapeData: any) => {
    dispatch({ type: 'ADD_SHAPE', payload: shapeData });
  }, []);

  const updateShape = useCallback((id: string, updates: any) => {
    if (!id || !updates) return;
    dispatch({ type: 'UPDATE_SHAPE', payload: { id, updates } });
  }, []);

  const deleteSelectedShapes = useCallback(() => {
    if (state.selectedShapeIds.length === 0) return;
    dispatch({ type: 'DELETE_SHAPES', payload: state.selectedShapeIds });
  }, [state.selectedShapeIds]);

  const selectShapes = useCallback((shapeIds: string[]) => {
    dispatch({ type: 'SELECT_SHAPES', payload: shapeIds });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const updateStage = useCallback((updates: any) => {
    if (!updates) return;
    dispatch({ type: 'UPDATE_STAGE', payload: updates });
  }, []);

  const setTool = useCallback((tool: string) => {
    dispatch({ type: 'SET_TOOL', payload: tool });
  }, []);

  const copyShapes = useCallback(() => {
    dispatch({ type: 'COPY_SHAPES' });
  }, []);

  const pasteShapes = useCallback(() => {
    dispatch({ type: 'PASTE_SHAPES' });
  }, []);

  const snapToGrid = useCallback((value: number) => {
    if (!state.grid.snap || !state.grid.size) return value;
    
    const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    const gridSize = state.grid.size;
    
    return Math.round(numValue / gridSize) * gridSize;
  }, [state.grid.snap, state.grid.size]);

  // Function to set the filename in the context
  const setFileNameContext = useCallback((name: string) => {
    if (typeof name === 'string') {
      dispatch({ type: 'SET_FILENAME', payload: name });
    }
  }, []);

  // Toggle grid snap with feedback
  const toggleGridSnap = useCallback(() => {
    dispatch({ type: 'TOGGLE_SNAP' });
  }, []);

  // Set grid size with validation
  const setGridSize = useCallback((size: number | string) => {
    const validSize = Math.max(5, Math.min(100, parseInt(String(size)) || 20));
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
      
      // Get ReactFlow instance first
      const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
      
      let reactFlowNodes: any[] = [];
      let reactFlowEdges: any[] = [];
      
      if (reactFlowInstance) {
        reactFlowNodes = reactFlowInstance.getNodes() || [];
        reactFlowEdges = reactFlowInstance.getEdges() || [];
      }
      
      // Also get shapes from context as fallback
      const contextShapes = state.shapes || [];
      
      // Find the ReactFlow canvas element with multiple fallback methods
      let targetCanvasElement = canvasElement;
      if (!targetCanvasElement) {
        targetCanvasElement = document.querySelector('.react-flow') as HTMLElement;
      }
      if (!targetCanvasElement) {
        targetCanvasElement = document.querySelector('[data-testid="rf__wrapper"]') as HTMLElement;
      }
      if (!targetCanvasElement) {
        targetCanvasElement = document.querySelector('.react-flow__renderer') as HTMLElement;
      }
      if (!targetCanvasElement) {
        targetCanvasElement = document.querySelector('#canvas-container') as HTMLElement;
      }
      
      // Convert shapes to nodes format for export
      const nodes = contextShapes.map((shape: any) => ({
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

      const edges: any[] = []; // Empty edges array for context shapes

      const canvasData: CanvasData = {
        nodes: reactFlowNodes.length > 0 ? reactFlowNodes : nodes,
        edges: reactFlowEdges,
        viewport: {
          x: state.stage.x,
          y: state.stage.y,
          zoom: state.stage.scale
        },
        grid: state.grid,
        fileName: fileName,
        version: '1.0'
      };

      switch (format.toLowerCase()) {
        case 'png':
          try {
            const canvasElement = document.querySelector('.react-flow') as HTMLElement;
            if (canvasElement) {
              await exportAsPNG(canvasElement, fileName);
            } else {
              await exportAsPNGSimple(canvasElement, fileName);
            }
          } catch (error) {
            console.error('Enhanced export failed, trying canvas-based fallback:', error);
            try {
              if (reactFlowNodes.length > 0) {
                const canvasElement = document.querySelector('.react-flow') as HTMLElement;
                await exportAsPNG(canvasElement, fileName);
              } else if (targetCanvasElement) {
                await exportAsPNG(targetCanvasElement, fileName);
              }
            } catch (fallbackError) {
              console.error('All export methods failed:', fallbackError);
              throw new Error('Failed to export PNG: All methods failed');
            }
          }
          break;
        case 'jpeg':
        case 'jpg':
          if (targetCanvasElement) {
            await exportAsJPEG(targetCanvasElement, fileName);
          }
          break;
        case 'svg':
          try {
            if (reactFlowNodes.length > 0) {
              exportAsSVG(reactFlowNodes, reactFlowEdges, fileName);
            } else {
              exportAsSVG(nodes, edges, fileName);
            }
          } catch (error) {
            console.error('SVG export failed:', error);
            exportAsSVG(nodes, edges, fileName);
          }
          break;
        case 'json':
          exportAsJSON(canvasData, fileName);
          break;
        case 'webp':
        case 'pdf':
        case 'pptx':
        case 'docx':
        case 'html':
        case 'xml':
        case 'url':
          // Use the advanced exportFile function for comprehensive formats
          try {
            console.log(`🚀 Using advanced export for format: ${format}`);
            await exportFile(
              format as any,
              fileName,
              {
                quality: 1.0,
                scale: 2,
                backgroundColor: '#ffffff',
                includeMetadata: true,
                includeGrid: false,
                cropToContent: true
              }
            );
          } catch (error) {
            console.error(`❌ Advanced ${format} export failed:`, error);
            throw new Error(`Failed to export ${format.toUpperCase()}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('❌ Export error in CanvasEditorProvider:', error);
      throw error;
    }
  }, [state]);

  const importFromFile = useCallback(async (file: File) => {
    try {
      // Use the enhanced importFile function that supports multiple formats
      const canvasData = await importFile(file);
      importCanvas(canvasData);
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  }, [importCanvas]);

  // Import image/SVG file and append extracted shapes to canvas without clearing
  const importImageFile = useCallback(async (file: File) => {
    try {
      const extractedShapes = await processImageFileForShapes(file);
      if (!extractedShapes.length) {
        alert('No shapes found in the selected file.');
        return;
      }

      const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
      extractedShapes.forEach((shape, index) => {
        const id = shape.id || `imported_shape_${Date.now()}_${index}`;
        const nodeData: any = {
          id,
          type: shape.type === 'rectangle' ? 'rect' : shape.type,
          position: {
            x: (shape.x ?? 100) + index * 40,
            y: (shape.y ?? 100) + index * 40
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

        if (reactFlowInstance) {
          const currentNodes = reactFlowInstance.getNodes();
          reactFlowInstance.setNodes([...currentNodes, nodeData]);
        }

        dispatch({
          type: 'ADD_SHAPE',
          payload: {
            id: nodeData.id,
            type: shape.icon ? 'imported-image' : shape.type,
            x: nodeData.position.x,
            y: nodeData.position.y,
            width: shape.width ?? nodeData.data.width,
            height: shape.height ?? nodeData.data.height,
            fill: shape.fill ?? nodeData.data.fill,
            stroke: shape.stroke ?? nodeData.data.stroke,
            strokeWidth: shape.strokeWidth ?? nodeData.data.strokeWidth,
            text: shape.label,
            serviceName: shape.serviceName,
            serviceType: shape.serviceType,
            icon: shape.icon
          }
        });
      });

      setTimeout(() => {
        if ((window as any).__REACT_FLOW_INSTANCE__) {
          (window as any).__REACT_FLOW_INSTANCE__.fitView({ padding: 0.1 });
        }
      }, 200);

      const baseName = file.name.replace(/\.[^/.]+$/, '') || 'Imported Diagram';
      dispatch({ type: 'SET_FILENAME', payload: baseName });
    } catch (error) {
      console.error('Import image error:', error);
      throw error;
    }
  }, []);

  // Save/Load functions
  const saveToDevice = useCallback(async (fileName?: string) => {
    try {
      const currentFileName = fileName || state.filename || 'Untitled Diagram';
      
      // Convert shapes to nodes format for export
      const nodes = state.shapes.map((shape: any) => ({
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
      const canvasData = await loadFileFromDevice();
      
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
    
    // Provide user feedback
    setTimeout(() => {
      alert('New diagram created successfully!');
    }, 100);
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
            // Process the image file and extract shapes
            const extractedShapes = await processImageFileForShapes(file);
            
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
                
                dispatch({ 
                  type: 'ADD_SHAPE', 
                  payload: shapeData
                });
              });
              
              // Force ReactFlow to update with new shapes
              setTimeout(() => {
                if (reactFlowInstance) {
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
    importImageFile,
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