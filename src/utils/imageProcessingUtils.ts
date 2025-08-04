// utils/imageProcessingUtils.ts
import type { CanvasData } from '../types/importExport';

export interface ExtractedShape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  label?: string;
  serviceType?: string;
  serviceName?: string;
  icon?: string;
}

// Function to create a file input for image files
export const createImageFileInput = (): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.svg,.png,.jpg,.jpeg,.gif,.bmp,.webp';
  input.multiple = false;
  input.style.display = 'none';
  return input;
};

// Function to process SVG files and extract shapes
export const processSVGFile = (file: File): Promise<ExtractedShape[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const svgContent = event.target?.result as string;
        
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        
        if (svgElement.tagName !== 'svg') {
          throw new Error('Invalid SVG file: root element is not <svg>');
        }
        
        // Check for parsing errors
        const parserError = svgDoc.querySelector('parsererror');
        if (parserError) {
          throw new Error('SVG parsing failed: ' + parserError.textContent);
        }
        
        const shapes = extractShapesFromSVG(svgElement);
        resolve(shapes);
      } catch (error) {
        console.error('SVG processing error:', error);
        reject(new Error(`Failed to process SVG file: ${error instanceof Error ? error.message : String(error)}`));
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read SVG file'));
    };
    
    reader.readAsText(file);
  });
};

// Function to process image files (PNG, JPEG, etc.) and extract shapes
export const processImageFile = (file: File): Promise<ExtractedShape[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const img = new Image();
        img.onload = () => {
          try {
            console.log('Image loaded successfully:', img.width, 'x', img.height);
            const shapes = extractShapesFromImage(img, file.name);
            console.log('Extracted shapes from image:', shapes.length);
            resolve(shapes);
          } catch (error) {
            console.error('Image shape extraction error:', error);
            reject(new Error(`Failed to extract shapes from image: ${error instanceof Error ? error.message : String(error)}`));
          }
        };
        
        img.onerror = (error) => {
          console.error('Image load error:', error);
          reject(new Error('Failed to load image'));
        };
        
        img.src = event.target?.result as string;
      } catch (error) {
        console.error('Image processing error:', error);
        reject(new Error(`Failed to process image file: ${error instanceof Error ? error.message : String(error)}`));
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Function to extract shapes from SVG elements
const extractShapesFromSVG = (svgElement: Element): ExtractedShape[] => {
  const shapes: ExtractedShape[] = [];
  const shapeElements = svgElement.querySelectorAll('rect, circle, ellipse, polygon, path, line, polyline');
  
  shapeElements.forEach((element, index) => {
    const shape = createShapeFromSVGElement(element, index);
    if (shape) {
      shapes.push(shape);
    }
  });
  
  // If no shapes found, create a default shape from the SVG bounds
  if (shapes.length === 0) {
    const bounds = getSVGBounds(svgElement);
    shapes.push({
      id: `imported_shape_${Date.now()}_0`,
      type: 'rectangle',
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      label: 'Imported Shape'
    });
  }
  
  return shapes;
};

// Function to create a shape from SVG element
const createShapeFromSVGElement = (element: Element, index: number): ExtractedShape | null => {
  const id = `imported_shape_${Date.now()}_${index}`;
  
  switch (element.tagName.toLowerCase()) {
    case 'rect':
      return createRectangleFromSVG(element as SVGElement, id);
    case 'circle':
      return createCircleFromSVG(element as SVGElement, id);
    case 'ellipse':
      return createEllipseFromSVG(element as SVGElement, id);
    case 'polygon':
    case 'polyline':
      return createPolygonFromSVG(element as SVGElement, id);
    case 'path':
      return createPathFromSVG(element as SVGElement, id);
    case 'line':
      return createLineFromSVG(element as SVGElement, id);
    default:
      return null;
  }
};

// Helper functions for different SVG elements
const createRectangleFromSVG = (element: SVGElement, id: string): ExtractedShape => {
  const x = parseFloat(element.getAttribute('x') || '0');
  const y = parseFloat(element.getAttribute('y') || '0');
  const width = parseFloat(element.getAttribute('width') || '100');
  const height = parseFloat(element.getAttribute('height') || '100');
  
  return {
    id,
    type: 'rectangle',
    x,
    y,
    width,
    height,
    fill: element.getAttribute('fill') || '#ffffff',
    stroke: element.getAttribute('stroke') || '#000000',
    strokeWidth: parseFloat(element.getAttribute('stroke-width') || '2'),
    label: 'Rectangle'
  };
};

const createCircleFromSVG = (element: SVGElement, id: string): ExtractedShape => {
  const cx = parseFloat(element.getAttribute('cx') || '0');
  const cy = parseFloat(element.getAttribute('cy') || '0');
  const r = parseFloat(element.getAttribute('r') || '50');
  
  return {
    id,
    type: 'circle',
    x: cx - r,
    y: cy - r,
    width: r * 2,
    height: r * 2,
    fill: element.getAttribute('fill') || '#ffffff',
    stroke: element.getAttribute('stroke') || '#000000',
    strokeWidth: parseFloat(element.getAttribute('stroke-width') || '2'),
    label: 'Circle'
  };
};

const createEllipseFromSVG = (element: SVGElement, id: string): ExtractedShape => {
  const cx = parseFloat(element.getAttribute('cx') || '0');
  const cy = parseFloat(element.getAttribute('cy') || '0');
  const rx = parseFloat(element.getAttribute('rx') || '50');
  const ry = parseFloat(element.getAttribute('ry') || '30');
  
  return {
    id,
    type: 'ellipse',
    x: cx - rx,
    y: cy - ry,
    width: rx * 2,
    height: ry * 2,
    fill: element.getAttribute('fill') || '#ffffff',
    stroke: element.getAttribute('stroke') || '#000000',
    strokeWidth: parseFloat(element.getAttribute('stroke-width') || '2'),
    label: 'Ellipse'
  };
};

const createPolygonFromSVG = (element: SVGElement, id: string): ExtractedShape => {
  const points = element.getAttribute('points') || '';
  const bounds = getPolygonBounds(points);
  
  return {
    id,
    type: 'polygon',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fill: element.getAttribute('fill') || '#ffffff',
    stroke: element.getAttribute('stroke') || '#000000',
    strokeWidth: parseFloat(element.getAttribute('stroke-width') || '2'),
    label: 'Polygon'
  };
};

const createPathFromSVG = (element: SVGElement, id: string): ExtractedShape => {
  const d = element.getAttribute('d') || '';
  const bounds = getPathBounds(d);
  
  return {
    id,
    type: 'path',
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fill: element.getAttribute('fill') || '#ffffff',
    stroke: element.getAttribute('stroke') || '#000000',
    strokeWidth: parseFloat(element.getAttribute('stroke-width') || '2'),
    label: 'Path'
  };
};

const createLineFromSVG = (element: SVGElement, id: string): ExtractedShape => {
  const x1 = parseFloat(element.getAttribute('x1') || '0');
  const y1 = parseFloat(element.getAttribute('y1') || '0');
  const x2 = parseFloat(element.getAttribute('x2') || '100');
  const y2 = parseFloat(element.getAttribute('y2') || '0');
  
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  
  return {
    id,
    type: 'line',
    x,
    y,
    width: Math.max(width, 2),
    height: Math.max(height, 2),
    stroke: element.getAttribute('stroke') || '#000000',
    strokeWidth: parseFloat(element.getAttribute('stroke-width') || '2'),
    label: 'Line'
  };
};

// Function to extract shapes from image files
const extractShapesFromImage = (img: HTMLImageElement, fileName: string): ExtractedShape[] => {
  // For image files, we create a simple rectangle shape that represents the image
  const shapes: ExtractedShape[] = [];
  
  // Create a canvas to analyze the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  
  // Analyze the image for potential shapes
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const shapesFound = analyzeImageForShapes(imageData);
  
  if (shapesFound.length > 0) {
    shapes.push(...shapesFound);
  } else {
    // Create a default shape from the image
    shapes.push({
      id: `imported_image_${Date.now()}`,
      type: 'rectangle',
      x: 100,
      y: 100,
      width: img.width,
      height: img.height,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      label: fileName.replace(/\.[^/.]+$/, '') || 'Imported Image',
      icon: img.src // Store the image as an icon
    });
  }
  
  return shapes;
};

// Function to analyze image data for shapes
const analyzeImageForShapes = (imageData: ImageData): ExtractedShape[] => {
  const shapes: ExtractedShape[] = [];
  const { data, width, height } = imageData;
  
  // Simple shape detection based on color boundaries
  const visited = new Set<number>();
  const shapesFound: Array<{ x: number; y: number; width: number; height: number; color: string }> = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const pixelKey = `${x},${y}`;
      
      if (visited.has(index)) continue;
      
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];
      
      // Skip transparent or white pixels
      if (a < 128 || (r > 240 && g > 240 && b > 240)) continue;
      
      // Find connected pixels of similar color
      const shape = floodFill(data, width, height, x, y, r, g, b, visited);
      if (shape && shape.width > 10 && shape.height > 10) {
        shapesFound.push(shape);
      }
    }
  }
  
  // Convert found shapes to ExtractedShape format
  shapesFound.forEach((shape, index) => {
    shapes.push({
      id: `detected_shape_${Date.now()}_${index}`,
      type: 'rectangle',
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      fill: shape.color,
      stroke: '#000000',
      strokeWidth: 1,
      label: `Shape ${index + 1}`
    });
  });
  
  return shapes;
};

// Flood fill algorithm to find connected regions
const floodFill = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
  targetR: number,
  targetG: number,
  targetB: number,
  visited: Set<number>
): { x: number; y: number; width: number; height: number; color: string } | null => {
  const stack: Array<[number, number]> = [[startX, startY]];
  const pixels: Array<[number, number]> = [];
  let minX = startX, maxX = startX, minY = startY, maxY = startY;
  
  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const index = (y * width + x) * 4;
    
    if (visited.has(index)) continue;
    visited.add(index);
    
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    
    // Check if pixel color is similar to target
    const colorDiff = Math.abs(r - targetR) + Math.abs(g - targetG) + Math.abs(b - targetB);
    if (colorDiff > 50) continue;
    
    pixels.push([x, y]);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    
    // Add neighboring pixels
    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const neighborIndex = (ny * width + nx) * 4;
        if (!visited.has(neighborIndex)) {
          stack.push([nx, ny]);
        }
      }
    }
  }
  
  if (pixels.length < 50) return null; // Too small to be a meaningful shape
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    color: `rgb(${targetR}, ${targetG}, ${targetB})`
  };
};

// Helper functions for bounds calculation
const getSVGBounds = (svgElement: Element): { x: number; y: number; width: number; height: number } => {
  const viewBox = svgElement.getAttribute('viewBox');
  if (viewBox) {
    const [, , width, height] = viewBox.split(' ').map(Number);
    return { x: 0, y: 0, width, height };
  }
  
  const width = parseFloat(svgElement.getAttribute('width') || '800');
  const height = parseFloat(svgElement.getAttribute('height') || '600');
  return { x: 0, y: 0, width, height };
};

const getPolygonBounds = (points: string): { x: number; y: number; width: number; height: number } => {
  const coords = points.split(/[,\s]+/).map(Number);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  for (let i = 0; i < coords.length; i += 2) {
    const x = coords[i];
    const y = coords[i + 1];
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

const getPathBounds = (d: string): { x: number; y: number; width: number; height: number } => {
  // Simple path bounds calculation - this is a simplified version
  // In a real implementation, you'd want to parse the path commands more thoroughly
  const numbers = d.match(/[-+]?\d*\.?\d+/g)?.map(Number) || [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  for (let i = 0; i < numbers.length; i += 2) {
    const x = numbers[i];
    const y = numbers[i + 1];
    if (!isNaN(x) && !isNaN(y)) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  
  if (minX === Infinity) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

// Main function to process any image file
export const processImageFileForShapes = async (file: File): Promise<ExtractedShape[]> => {
  try {
    console.log('Processing file:', file.name, file.type, file.size);
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    console.log('File extension:', fileExtension);
    
    if (fileExtension === 'svg' || file.type === 'image/svg+xml') {
      console.log('Processing as SVG file');
      return await processSVGFile(file);
    } else {
      console.log('Processing as image file');
      return await processImageFile(file);
    }
  } catch (error) {
    console.error('Error in processImageFileForShapes:', error);
    throw error;
  }
}; 