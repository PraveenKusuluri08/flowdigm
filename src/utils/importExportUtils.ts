// utils/importExportUtils.ts
import type { Node, Edge } from 'reactflow';
import type { CanvasData } from '../types/importExport';
import html2canvas from 'html2canvas';

// @ts-ignore
import domtoimage from 'dom-to-image';

// Main export function that the Toolbar uses
export const exportCanvas = async (format: 'png' | 'jpg' | 'svg' | 'json' = 'png'): Promise<void> => {
  try {
    console.log('🔄 Starting canvas export in format:', format);
    
    // Get the ReactFlow instance
    const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
    if (!reactFlowInstance) {
      throw new Error('ReactFlow instance not found. Please refresh the page and try again.');
    }
    
    // Get current nodes and edges
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    
    console.log('📊 Found nodes:', nodes.length, 'edges:', edges.length);
    
    if (nodes.length === 0) {
      alert('No shapes found! Please add some shapes to the canvas first.');
      return;
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `flowdigm-diagram-${timestamp}`;
    
    // Export based on format
    switch (format) {
      case 'png':
        await exportAsPNGSimple(`${fileName}.png`);
        break;
      case 'jpg':
        await exportAsJPEG(document.querySelector('.react-flow') as HTMLElement, `${fileName}.jpg`);
        break;
      case 'svg':
        exportAsSVG(nodes, edges, `${fileName}.svg`);
        break;
      case 'json':
        // Create canvas data for JSON export
        const canvasData: CanvasData = {
          nodes: nodes.map((node: any) => ({
            id: node.id,
            type: node.type || 'default',
            position: node.position,
            data: node.data
          })),
          edges: edges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || 'default'
          })),
          viewport: {
            x: 0,
            y: 0,
            zoom: 1
          },
          grid: {
            visible: true,
            size: 20,
            snap: false
          },
          fileName: fileName,
          version: '1.0'
        };
        exportAsJSON(canvasData, `${fileName}.json`);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    console.log('✅ Export completed successfully');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export functions
export const exportAsPNG = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  try {
    console.log('Starting PNG export...', { canvasElement, fileName });
    
    if (!canvasElement) {
      throw new Error('Canvas element is null or undefined');
    }
    
    // Find the ReactFlow container specifically
    const reactFlowContainer = canvasElement.querySelector('.react-flow') as HTMLElement;
    const targetElement = reactFlowContainer || canvasElement;
    
    console.log('Target element for export:', targetElement);
    
    // Wait for ReactFlow to finish rendering
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Force ReactFlow to render all nodes
    const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.1 });
      // Wait a bit more for the fit view to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Use html2canvas with better configuration for ReactFlow
    const canvas = await html2canvas(targetElement, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: true, // Enable logging for debugging
      width: targetElement.scrollWidth || 1200,
      height: targetElement.scrollHeight || 800,
      scrollX: 0,
      scrollY: 0,
      windowWidth: targetElement.scrollWidth || 1200,
      windowHeight: targetElement.scrollHeight || 800,
      ignoreElements: (element) => {
        // Ignore UI elements that shouldn't be in the export
        return element.classList.contains('react-flow__controls') || 
               element.classList.contains('react-flow__minimap') ||
               element.classList.contains('react-flow__panel') ||
               element.classList.contains('react-flow__selection') ||
               element.classList.contains('react-flow__selection-rect') ||
               (element.classList.contains('react-flow__node') && (element as HTMLElement).style.display === 'none');
      },
      onclone: (clonedDoc) => {
        // Clean up the cloned document for better export
        const clonedElement = clonedDoc.querySelector('.react-flow') as HTMLElement;
        if (clonedElement) {
          // Make sure the background is visible
          clonedElement.style.backgroundColor = '#ffffff';
          
          // Remove any problematic styles
          const styleSheets = Array.from(clonedDoc.styleSheets);
          styleSheets.forEach(sheet => {
            try {
              const rules = Array.from(sheet.cssRules || sheet.rules);
              rules.forEach(rule => {
                if (rule instanceof CSSStyleRule) {
                  // Convert modern color functions to hex
                  if (rule.style.color && rule.style.color.includes('oklch')) {
                    rule.style.color = '#000000';
                  }
                  if (rule.style.backgroundColor && rule.style.backgroundColor.includes('oklch')) {
                    rule.style.backgroundColor = '#ffffff';
                  }
                }
              });
            } catch (e) {
              // Ignore CORS errors with external stylesheets
            }
          });
          
          // Force all nodes to be visible
          const nodes = clonedElement.querySelectorAll('.react-flow__node');
          nodes.forEach(node => {
            (node as HTMLElement).style.display = 'block';
            (node as HTMLElement).style.visibility = 'visible';
            (node as HTMLElement).style.opacity = '1';
          });
          
          // Force all edges to be visible
          const edges = clonedElement.querySelectorAll('.react-flow__edge');
          edges.forEach(edge => {
            (edge as HTMLElement).style.display = 'block';
            (edge as HTMLElement).style.visibility = 'visible';
            (edge as HTMLElement).style.opacity = '1';
          });
        }
      }
    });
    
    console.log('Canvas created:', canvas);
    
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    console.log('PNG export completed successfully');
  } catch (error) {
    console.error('Detailed error exporting as PNG:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to export as PNG: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const exportAsJPEG = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  try {
    console.log('Starting JPEG export...', { canvasElement, fileName });
    
    if (!canvasElement) {
      throw new Error('Canvas element is null or undefined');
    }
    
    // Find the ReactFlow container specifically
    const reactFlowContainer = canvasElement.querySelector('.react-flow') as HTMLElement;
    const targetElement = reactFlowContainer || canvasElement;
    
    console.log('Target element for export:', targetElement);
    
    // Use html2canvas with better configuration for ReactFlow
    const canvas = await html2canvas(targetElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: true, // Enable logging for debugging
      ignoreElements: (element) => {
        // Ignore UI elements that shouldn't be in the export
        return element.classList.contains('react-flow__controls') || 
               element.classList.contains('react-flow__minimap') ||
               element.classList.contains('react-flow__panel') ||
               element.classList.contains('react-flow__background');
      },
      onclone: (clonedDoc) => {
        // Clean up the cloned document for better export
        const clonedElement = clonedDoc.querySelector('.react-flow') as HTMLElement;
        if (clonedElement) {
          // Remove any problematic styles
          const styleSheets = Array.from(clonedDoc.styleSheets);
          styleSheets.forEach(sheet => {
            try {
              const rules = Array.from(sheet.cssRules || sheet.rules);
              rules.forEach(rule => {
                if (rule instanceof CSSStyleRule) {
                  // Convert modern color functions to hex
                  if (rule.style.color && rule.style.color.includes('oklch')) {
                    rule.style.color = '#000000';
                  }
                  if (rule.style.backgroundColor && rule.style.backgroundColor.includes('oklch')) {
                    rule.style.backgroundColor = '#ffffff';
                  }
                }
              });
            } catch (e) {
              // Ignore CORS errors with external stylesheets
            }
          });
        }
      }
    });
    
    console.log('Canvas created:', canvas);
    
    const link = document.createElement('a');
    link.download = `${fileName}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
    
    console.log('JPEG export completed successfully');
  } catch (error) {
    console.error('Detailed error exporting as JPEG:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to export as JPEG: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const exportAsSVG = (nodes: Node[], edges: Edge[], fileName: string): void => {
  try {
    // Calculate canvas bounds
    const bounds = calculateCanvasBounds(nodes);
    const padding = 50;
    
    const svgContent = generateSVGContent(nodes, edges, bounds, padding);
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${fileName}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting as SVG:', error);
    throw new Error('Failed to export as SVG');
  }
};

// Alternative export method using ReactFlow's built-in capabilities
export const exportAsPNGReactFlow = async (reactFlowInstance: any, fileName: string): Promise<void> => {
  try {
    console.log('Starting ReactFlow PNG export...', { fileName });
    
    if (!reactFlowInstance) {
      throw new Error('ReactFlow instance is required');
    }
    
    // Get the ReactFlow container
    const container = reactFlowInstance.getContainer();
    if (!container) {
      throw new Error('ReactFlow container not found');
    }
    
    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use html2canvas on the ReactFlow container
    const canvas = await html2canvas(container, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: true,
      width: container.scrollWidth || 1200,
      height: container.scrollHeight || 800,
      scrollX: 0,
      scrollY: 0,
      windowWidth: container.scrollWidth || 1200,
      windowHeight: container.scrollHeight || 800,
      ignoreElements: (element) => {
        return element.classList.contains('react-flow__controls') || 
               element.classList.contains('react-flow__minimap') ||
               element.classList.contains('react-flow__panel') ||
               element.classList.contains('react-flow__background') ||
               element.classList.contains('react-flow__selection') ||
               element.classList.contains('react-flow__selection-rect');
      },
      onclone: (clonedDoc) => {
        // Ensure all ReactFlow elements are visible in the clone
        const clonedContainer = clonedDoc.querySelector('.react-flow') as HTMLElement;
        if (clonedContainer) {
          clonedContainer.style.overflow = 'visible';
          clonedContainer.style.position = 'relative';
          
          // Make sure all nodes are visible
          const nodes = clonedContainer.querySelectorAll('.react-flow__node');
          nodes.forEach((node: any) => {
            node.style.visibility = 'visible';
            node.style.opacity = '1';
          });
        }
      }
    });
    
    console.log('Canvas created:', canvas);
    
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    console.log('ReactFlow PNG export completed successfully');
  } catch (error) {
    console.error('Error in ReactFlow PNG export:', error);
    throw new Error(`Failed to export as PNG: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// NEW: Canvas-based export that renders nodes manually
// ULTIMATE PNG export - guaranteed to work
export const exportAsPNGSimple = async (fileName: string): Promise<void> => {
  try {
    console.log('=== ULTIMATE PNG EXPORT STARTING ===');
    
      // Method 1: Try to get ReactFlow instance
  const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
  console.log('ReactFlow instance found:', !!reactFlowInstance);
  console.log('ReactFlow instance:', reactFlowInstance);
  
  if (reactFlowInstance) {
    try {
      const nodes = reactFlowInstance.getNodes();
      const edges = reactFlowInstance.getEdges();
      console.log('ReactFlow nodes found:', nodes.length);
      console.log('ReactFlow edges found:', edges.length);
      console.log('All nodes:', nodes);
      console.log('All edges:', edges);
      
      if (nodes.length > 0) {
        console.log('Using ReactFlow data for export');
        await exportFromReactFlowData(nodes, edges, fileName);
        return;
      }
    } catch (error) {
      console.error('Error getting ReactFlow data:', error);
    }
  }
    
    // Method 2: Try to get shapes from context
    console.log('Trying to get shapes from context...');
    const canvasContext = (window as any).__CANVAS_CONTEXT__;
    if (canvasContext && canvasContext.state && canvasContext.state.shapes) {
      const shapes = canvasContext.state.shapes;
      console.log('Context shapes found:', shapes.length);
      
      if (shapes.length > 0) {
        console.log('Using context data for export');
        await exportFromContextData(shapes, fileName);
        return;
      }
    }
    
    // Method 3: Create a test export with sample data
    console.log('No shapes found, creating test export...');
    await createTestExport(fileName);
    
  } catch (error) {
    console.error('Error in ultimate PNG export:', error);
    throw new Error(`Failed to export as PNG: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Helper function to export from ReactFlow data
const exportFromReactFlowData = async (nodes: any[], edges: any[], fileName: string) => {
  console.log('=== EXPORTING FROM REACTFLOW DATA ===');
  console.log('Nodes:', nodes);
  console.log('Edges:', edges);
  
  // Calculate canvas bounds
  let minX = 0, minY = 0, maxX = 800, maxY = 600;
  
  if (nodes.length > 0) {
    minX = Math.min(...nodes.map(n => n.position.x));
    minY = Math.min(...nodes.map(n => n.position.y));
    maxX = Math.max(...nodes.map(n => n.position.x + (n.data?.width || 100)));
    maxY = Math.max(...nodes.map(n => n.position.y + (n.data?.height || 80)));
  }
  
  // Add padding
  const padding = 50;
  const canvasWidth = Math.max(800, maxX - minX + padding * 2);
  const canvasHeight = Math.max(600, maxY - minY + padding * 2);
  
  console.log('Canvas dimensions:', { canvasWidth, canvasHeight, minX, minY, maxX, maxY });
  
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw grid
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvasWidth; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  for (let y = 0; y < canvasHeight; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }
  
  // Draw a test line to verify canvas drawing works
  ctx.strokeStyle = '#00ff00'; // Bright green
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(50, 50);
  ctx.lineTo(200, 200);
  ctx.stroke();
  console.log('Test line drawn from (50,50) to (200,200)');
  
  // Draw multiple test connection lines to ensure they appear
  ctx.strokeStyle = '#ff0000'; // Bright red
  ctx.lineWidth = 5;
  ctx.setLineDash([10, 5]);
  
  // Test connection 1
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(300, 150);
  ctx.stroke();
  
  // Test connection 2
  ctx.beginPath();
  ctx.moveTo(150, 200);
  ctx.lineTo(350, 250);
  ctx.stroke();
  
  // Test connection 3
  ctx.beginPath();
  ctx.moveTo(200, 300);
  ctx.lineTo(400, 350);
  ctx.stroke();
  
  ctx.setLineDash([]);
  console.log('Test connection lines drawn in red');
  
  // Draw nodes at their actual positions
  nodes.forEach((node: any, index: number) => {
    const x = node.position.x - minX + padding;
    const y = node.position.y - minY + padding;
    const width = node.data?.width || 100;
    const height = node.data?.height || 80;
    
    console.log(`Drawing node ${index}:`, { 
      id: node.id,
      x, 
      y, 
      width, 
      height, 
      type: node.type,
      label: node.data?.label,
      position: node.position
    });
    
    // Draw shape
    ctx.fillStyle = node.data?.fill || '#e3f2fd';
    ctx.strokeStyle = node.data?.stroke || '#1976d2';
    ctx.lineWidth = 2;
    
    if (node.type === 'rect' || node.type === 'rectangle') {
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
    } else if (node.type === 'circle') {
      ctx.beginPath();
      ctx.arc(x + width/2, y + height/2, Math.min(width, height)/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (node.type === 'triangle') {
      // Draw triangle using polygon - match the SVG triangle
      ctx.beginPath();
      ctx.moveTo(x + width/2, y + 10);
      ctx.lineTo(x + width - 10, y + height - 10);
      ctx.lineTo(x + 10, y + height - 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (node.type === 'diamond') {
      // Draw diamond
      ctx.beginPath();
      ctx.moveTo(x + width/2, y);
      ctx.lineTo(x + width, y + height/2);
      ctx.lineTo(x + width/2, y + height);
      ctx.lineTo(x, y + height/2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (node.type === 'hexagon') {
      // Draw hexagon
      const centerX = x + width/2;
      const centerY = y + height/2;
      const radius = Math.min(width, height)/2 - 5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = centerX + radius * Math.cos(angle);
        const py = centerY + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (node.type === 'star') {
      // Draw star
      const centerX = x + width/2;
      const centerY = y + height/2;
      const outerRadius = Math.min(width, height)/2 - 5;
      const innerRadius = outerRadius * 0.4;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = centerX + radius * Math.cos(angle);
        const py = centerY + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Default rectangle for any other type
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
    }
    
    // Draw label
    if (node.data?.label) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.data.label, x + width/2, y + height/2);
    }
  });
  
  // Draw edges/connections with better visibility
  console.log('=== DRAWING CONNECTIONS ===');
  console.log('Total edges found:', edges.length);
  console.log('All edges:', edges);
  
  // ALWAYS draw test connections between adjacent nodes for debugging
  console.log('Drawing test connections between adjacent nodes');
  for (let i = 0; i < nodes.length - 1; i++) {
    const sourceNode = nodes[i];
    const targetNode = nodes[i + 1];
    
    const sourceX = sourceNode.position.x - minX + padding;
    const sourceY = sourceNode.position.y - minY + padding;
    const sourceWidth = sourceNode.data?.width || 100;
    const sourceHeight = sourceNode.data?.height || 80;
    
    const targetX = targetNode.position.x - minX + padding;
    const targetY = targetNode.position.y - minY + padding;
    const targetWidth = targetNode.data?.width || 100;
    const targetHeight = targetNode.data?.height || 80;
    
    const sourceCenterX = sourceX + sourceWidth / 2;
    const sourceCenterY = sourceY + sourceHeight / 2;
    const targetCenterX = targetX + targetWidth / 2;
    const targetCenterY = targetY + targetHeight / 2;
    
    // Draw test connection
    ctx.strokeStyle = '#ff0000'; // Red for test connections
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(sourceCenterX, sourceCenterY);
    ctx.lineTo(targetCenterX, targetCenterY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    console.log('Test connection drawn from', sourceCenterX, sourceCenterY, 'to', targetCenterX, targetCenterY);
  }
  
  // Also draw actual edges if they exist
  if (edges.length > 0) {
    edges.forEach((edge: any, index: number) => {
      console.log(`Processing edge ${index}:`, edge);
      
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      console.log('Source node:', sourceNode);
      console.log('Target node:', targetNode);
      
      if (sourceNode && targetNode) {
        console.log('Drawing connection:', { source: edge.source, target: edge.target });
        
        // Calculate connection points at shape edges
        const sourceX = sourceNode.position.x - minX + padding;
        const sourceY = sourceNode.position.y - minY + padding;
        const sourceWidth = sourceNode.data?.width || 100;
        const sourceHeight = sourceNode.data?.height || 80;
        
        const targetX = targetNode.position.x - minX + padding;
        const targetY = targetNode.position.y - minY + padding;
        const targetWidth = targetNode.data?.width || 100;
        const targetHeight = targetNode.data?.height || 80;
        
        // Find the best connection points (center of edges)
        const sourceCenterX = sourceX + sourceWidth / 2;
        const sourceCenterY = sourceY + sourceHeight / 2;
        const targetCenterX = targetX + targetWidth / 2;
        const targetCenterY = targetY + targetHeight / 2;
        
        // Draw connection line with very visible styling
        ctx.strokeStyle = '#ff0000'; // Bright red for maximum visibility
        ctx.lineWidth = 5; // Thicker line
        ctx.setLineDash([15, 8]); // Longer dashes
        ctx.beginPath();
        ctx.moveTo(sourceCenterX, sourceCenterY);
        ctx.lineTo(targetCenterX, targetCenterY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw arrow at the end
        const angle = Math.atan2(targetCenterY - sourceCenterY, targetCenterX - sourceCenterX);
        const arrowLength = 20;
        const arrowAngle = Math.PI / 6;
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(targetCenterX, targetCenterY);
        ctx.lineTo(
          targetCenterX - arrowLength * Math.cos(angle - arrowAngle),
          targetCenterY - arrowLength * Math.sin(angle - arrowAngle)
        );
        ctx.moveTo(targetCenterX, targetCenterY);
        ctx.lineTo(
          targetCenterX - arrowLength * Math.cos(angle + arrowAngle),
          targetCenterY - arrowLength * Math.sin(angle + arrowAngle)
        );
        ctx.stroke();
        
        console.log('Connection drawn from', sourceCenterX, sourceCenterY, 'to', targetCenterX, targetCenterY);
      } else {
        console.log('Could not find source or target node for edge:', edge);
      }
    });
  }
  
  // Download
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  console.log('ReactFlow data export completed with actual positions');
};

// Helper function to export from context data
const exportFromContextData = async (shapes: any[], fileName: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw grid
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (let x = 0; x < 800; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  for (let y = 0; y < 600; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }
  
  // Draw shapes in grid
  const shapesPerRow = 3;
  const shapeWidth = 150;
  const shapeHeight = 100;
  const margin = 50;
  
  shapes.forEach((shape: any, index: number) => {
    const row = Math.floor(index / shapesPerRow);
    const col = index % shapesPerRow;
    const x = margin + col * (shapeWidth + margin);
    const y = margin + row * (shapeHeight + margin);
    
    // Draw shape
    ctx.fillStyle = shape.fill || '#e3f2fd';
    ctx.strokeStyle = shape.stroke || '#1976d2';
    ctx.lineWidth = 2;
    
    if (shape.type === 'rect' || shape.type === 'rectangle') {
      ctx.fillRect(x, y, shapeWidth, shapeHeight);
      ctx.strokeRect(x, y, shapeWidth, shapeHeight);
    } else if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(x + shapeWidth/2, y + shapeHeight/2, Math.min(shapeWidth, shapeHeight)/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(x, y, shapeWidth, shapeHeight);
      ctx.strokeRect(x, y, shapeWidth, shapeHeight);
    }
    
    // Draw label
    if (shape.text) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(shape.text, x + shapeWidth/2, y + shapeHeight/2);
    }
  });
  
  // Download
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  console.log('Context data export completed');
};

// Helper function to create test export
const createTestExport = async (fileName: string) => {
  console.log('=== CREATING TEST EXPORT ===');
  
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 600);
  
  // Draw grid
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (let x = 0; x < 800; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  for (let y = 0; y < 600; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.stroke();
  }
  
  // Draw test shapes
  ctx.fillStyle = '#e3f2fd';
  ctx.strokeStyle = '#1976d2';
  ctx.lineWidth = 2;
  
  // Rectangle
  ctx.fillRect(100, 100, 150, 100);
  ctx.strokeRect(100, 100, 150, 100);
  
  // Circle
  ctx.beginPath();
  ctx.arc(350, 150, 50, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  
  // Triangle
  ctx.beginPath();
  ctx.moveTo(550, 100);
  ctx.lineTo(650, 200);
  ctx.lineTo(450, 200);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Diamond
  ctx.beginPath();
  ctx.moveTo(400, 350);
  ctx.lineTo(450, 400);
  ctx.lineTo(400, 450);
  ctx.lineTo(350, 400);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Text
  ctx.fillStyle = '#000000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Test Export - Add shapes to canvas', 400, 300);
  ctx.fillText('Rectangle', 175, 150);
  ctx.fillText('Circle', 350, 150);
  ctx.fillText('Triangle', 550, 150);
  ctx.fillText('Diamond', 400, 400);
  ctx.fillText('No shapes found in canvas - this is a test export', 400, 500);
  
  // Download
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  console.log('Test export completed - no shapes found in canvas');
};

// NEW: DOM-to-Image based export (most reliable for ReactFlow)
export const exportAsPNGDomToImage = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  try {
    console.log('Starting DOM-to-Image PNG export...', { canvasElement, fileName });
    
    if (!canvasElement) {
      throw new Error('Canvas element is null or undefined');
    }
    
    // Find the ReactFlow container specifically
    const reactFlowContainer = canvasElement.querySelector('.react-flow') as HTMLElement;
    const targetElement = reactFlowContainer || canvasElement;
    
    console.log('Target element for export:', targetElement);
    
    // Wait for ReactFlow to finish rendering
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Force ReactFlow to render all nodes
    const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.1 });
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Use dom-to-image for better ReactFlow compatibility
    const dataUrl = await domtoimage.toPng(targetElement, {
      quality: 1.0,
      bgcolor: '#ffffff',
      width: targetElement.scrollWidth || 1200,
      height: targetElement.scrollHeight || 800,
      style: {
        'transform': 'scale(1)',
        'transform-origin': 'top left'
      },
      filter: (node: any) => {
        // Filter out UI elements that shouldn't be in the export
        const className = node.className || '';
        return !className.includes('react-flow__controls') && 
               !className.includes('react-flow__minimap') &&
               !className.includes('react-flow__panel') &&
               !className.includes('react-flow__selection');
      }
    });
    
    console.log('DOM-to-Image data URL created');
    
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
    
    console.log('DOM-to-Image PNG export completed successfully');
  } catch (error) {
    console.error('Error in DOM-to-Image PNG export:', error);
    throw new Error(`Failed to export as PNG: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const exportAsPNGCanvas = async (reactFlowNodes: any[], reactFlowEdges: any[], fileName: string): Promise<void> => {
  try {
    console.log('Starting Canvas-based PNG export...', { fileName, nodesCount: reactFlowNodes.length });
    console.log('ReactFlow nodes:', reactFlowNodes);
    console.log('ReactFlow edges:', reactFlowEdges);
    
    if (!reactFlowNodes || reactFlowNodes.length === 0) {
      console.warn('No nodes found for export. Creating a default canvas.');
      // Create a default canvas even if no nodes
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      canvas.width = 800;
      canvas.height = 600;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 600);
      
      // Draw grid
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < 800; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 600);
        ctx.stroke();
      }
      for (let y = 0; y < 600; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }
      
      // Add a message
      ctx.fillStyle = '#666666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No shapes to export', 400, 300);
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
      console.log('Default canvas exported successfully');
      return;
    }
    
    // Calculate canvas bounds from ReactFlow nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    reactFlowNodes.forEach((node: any) => {
      const nodeWidth = node.width || node.data?.width || 100;
      const nodeHeight = node.height || node.data?.height || 80;
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
    });
    
    // Ensure we have valid bounds
    if (minX === Infinity) {
      minX = 0;
      minY = 0;
      maxX = 800;
      maxY = 600;
    }
    
    const padding = 50;
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const canvasWidth = Math.max(800, contentWidth + 2 * padding);
    const canvasHeight = Math.max(600, contentHeight + 2 * padding);
    
    console.log('Canvas dimensions:', { canvasWidth, canvasHeight, minX, minY, maxX, maxY });
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Set canvas size with high resolution
    const scale = 2;
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
    ctx.scale(scale, scale);
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
    
    // Draw edges first (so they appear behind nodes)
    if (reactFlowEdges && reactFlowEdges.length > 0) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      reactFlowEdges.forEach((edge: any) => {
        const sourceNode = reactFlowNodes.find((n: any) => n.id === edge.source);
        const targetNode = reactFlowNodes.find((n: any) => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          const sourceWidth = sourceNode.width || sourceNode.data?.width || 100;
          const sourceHeight = sourceNode.height || sourceNode.data?.height || 80;
          const targetWidth = targetNode.width || targetNode.data?.width || 100;
          const targetHeight = targetNode.height || targetNode.data?.height || 80;
          
          const x1 = sourceNode.position.x + sourceWidth / 2 - minX + padding;
          const y1 = sourceNode.position.y + sourceHeight / 2 - minY + padding;
          const x2 = targetNode.position.x + targetWidth / 2 - minX + padding;
          const y2 = targetNode.position.y + targetHeight / 2 - minY + padding;
          
          // Draw curved line
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          const curve = Math.abs(x2 - x1) * 0.3;
          ctx.quadraticCurveTo(midX - curve, y1, midX, midY);
          ctx.quadraticCurveTo(midX + curve, y2, x2, y2);
          ctx.stroke();
        }
      });
    }
    
    // Draw nodes
    reactFlowNodes.forEach((node: any) => {
      console.log('Drawing node:', node.id, node.type, node.position, node.data);
      
      const x = node.position.x - minX + padding;
      const y = node.position.y - minY + padding;
      const width = node.width || node.data?.width || 100;
      const height = node.height || node.data?.height || 80;
      const fill = node.data?.fill || '#ffffff';
      const stroke = node.data?.stroke || '#000000';
      const strokeWidth = node.data?.strokeWidth || 2;
      const label = node.data?.label || node.type || '';
      
      console.log('Node drawing params:', { x, y, width, height, fill, stroke, label });
      
      // Draw node based on type
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      
      if (node.type === 'circle' || node.type === 'terminator') {
        // Draw circle
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2 - strokeWidth, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else if (node.type === 'triangle') {
        // Draw triangle
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + strokeWidth);
        ctx.lineTo(x + strokeWidth, y + height - strokeWidth);
        ctx.lineTo(x + width - strokeWidth, y + height - strokeWidth);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (node.type === 'diamond' || node.type === 'decision') {
        // Draw diamond
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y + strokeWidth);
        ctx.lineTo(x + width - strokeWidth, y + height / 2);
        ctx.lineTo(x + width / 2, y + height - strokeWidth);
        ctx.lineTo(x + strokeWidth, y + height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Draw rectangle (default)
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
      }
      
      // Draw label
      if (label) {
        ctx.fillStyle = '#333333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + width / 2, y + height / 2);
      }
    });
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        console.log('Canvas-based PNG export completed successfully');
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('Error in Canvas-based PNG export:', error);
    throw new Error(`Failed to export as PNG: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const exportAsJSON = (canvasData: CanvasData, fileName: string): void => {
  try {
    const jsonContent = JSON.stringify(canvasData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${fileName}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting as JSON:', error);
    throw new Error('Failed to export as JSON');
  }
};

// Import functions
export const importFromJSON = (file: File): Promise<CanvasData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const canvasData = JSON.parse(content) as CanvasData;
        
        // Validate the imported data
        if (!canvasData.nodes || !canvasData.edges) {
          throw new Error('Invalid file format: missing nodes or edges');
        }
        
        resolve(canvasData);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Helper functions
const calculateCanvasBounds = (nodes: Node[]) => {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 800, maxY: 600 };
  }
  
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  nodes.forEach(node => {
    const x = node.position.x;
    const y = node.position.y;
    const width = node.data?.width || 80;
    const height = node.data?.height || 60;
    
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  
  return { minX, minY, maxX, maxY };
};

const generateSVGContent = (nodes: Node[], edges: Edge[], bounds: any, padding: number) => {
  const width = bounds.maxX - bounds.minX + padding * 2;
  const height = bounds.maxY - bounds.minY + padding * 2;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;
  
  // Add edges first (so they appear behind nodes)
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const x1 = sourceNode.position.x + (sourceNode.data?.width || 80) / 2 - bounds.minX + padding;
      const y1 = sourceNode.position.y + (sourceNode.data?.height || 60) / 2 - bounds.minY + padding;
      const x2 = targetNode.position.x + (targetNode.data?.width || 80) / 2 - bounds.minX + padding;
      const y2 = targetNode.position.y + (targetNode.data?.height || 60) / 2 - bounds.minY + padding;
      
      // Create a curved line for better visual appeal
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const curve = Math.abs(x2 - x1) * 0.3;
      
      svg += `<path d="M ${x1} ${y1} Q ${midX - curve} ${y1} ${midX} ${midY} T ${x2} ${y2}" stroke="#333" stroke-width="2" fill="none"/>`;
    }
  });
  
  // Add nodes
  nodes.forEach(node => {
    const x = node.position.x - bounds.minX + padding;
    const y = node.position.y - bounds.minY + padding;
    const width = node.data?.width || 80;
    const height = node.data?.height || 60;
    const fill = node.data?.fill || '#ffffff';
    const stroke = node.data?.stroke || '#000000';
    const strokeWidth = node.data?.strokeWidth || 2;
    
    // Create rectangle for each node
    svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    
    // Add text label
    const textX = x + width / 2;
    const textY = y + height / 2 + 4; // Center vertically with slight offset
    const label = node.data?.label || node.type || '';
    
    svg += `<text x="${textX}" y="${textY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#333">${label}</text>`;
  });
  
  svg += '</svg>';
  return svg;
};

// File input helper
export const createFileInput = (accept: string, multiple: boolean = false): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.multiple = multiple;
  input.style.display = 'none';
  return input;
}; 