// utils/fileValidation.ts
import type { CanvasData } from '../types/importExport';

export const validateFlowDigmFile = (data: any): data is CanvasData => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check if it has the basic structure
  if (!('nodes' in data) || !('edges' in data) || !('version' in data)) {
    return false;
  }

  // Check if nodes is an array
  if (!Array.isArray(data.nodes)) {
    return false;
  }

  // Check if edges is an array
  if (!Array.isArray(data.edges)) {
    return false;
  }

  // Validate viewport if present
  if (data.viewport) {
    if (typeof data.viewport !== 'object' || 
        typeof data.viewport.x !== 'number' || 
        typeof data.viewport.y !== 'number' || 
        typeof data.viewport.zoom !== 'number') {
      return false;
    }
  }

  // Validate grid if present
  if (data.grid) {
    if (typeof data.grid !== 'object' || 
        typeof data.grid.visible !== 'boolean' || 
        typeof data.grid.size !== 'number') {
      return false;
    }
  }

  return true;
};

export const createFileHeader = (canvasData: CanvasData): string => {
  const header = {
    fileType: 'FlowDigm Diagram',
    application: 'FlowDigm',
    version: canvasData.version || '1.0',
    createdAt: new Date().toISOString(),
    nodeCount: canvasData.nodes.length,
    edgeCount: canvasData.edges.length
  };

  return JSON.stringify({
    ...header,
    data: canvasData
  }, null, 2);
};

export const parseFlowDigmFile = (content: string): CanvasData => {
  let parsedData: any;
  
  try {
    parsedData = JSON.parse(content);
  } catch (error) {
    throw new Error('Invalid JSON format: The file contains malformed JSON data.');
  }

  // Check if it's a file with header
  if (parsedData.fileType === 'FlowDigm Diagram' && parsedData.data) {
    parsedData = parsedData.data;
  }

  if (!validateFlowDigmFile(parsedData)) {
    throw new Error('Invalid FlowDigm file: The file does not contain valid FlowDigm diagram data.');
  }

  return parsedData as CanvasData;
};

export const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : '';
};

export const isValidFileType = (filename: string): boolean => {
  const extension = getFileExtension(filename);
  return extension === 'json' || extension === 'flowdigm';
};
