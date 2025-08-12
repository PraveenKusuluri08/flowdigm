// utils/importExportUtils.ts
import type { Node, Edge } from 'reactflow';
import type { CanvasData } from '../types/importExport';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { Document as DocxDocument, Packer, Paragraph, TextRun, ImageRun } from 'docx';
import { saveAs } from 'file-saver';

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

/**
 * Comprehensive exportFile function that supports multiple formats like draw.io
 * @param format - The export format: 'png', 'jpeg', 'webp', 'svg', 'pdf', 'pptx', 'docx', 'html', 'xml', 'url'
 * @param filename - Optional custom filename (without extension)
 * @param options - Additional export options
 */
export const exportFile = async (
  format: 'png' | 'jpeg' | 'webp' | 'svg' | 'pdf' | 'pptx' | 'docx' | 'html' | 'xml' | 'url',
  filename?: string,
  options: {
    quality?: number;
    scale?: number;
    width?: string | number;
    height?: string | number;
    backgroundColor?: string;
    transparent?: boolean;
    border?: number;
    includeGrid?: boolean;
    cropToContent?: boolean;
    embedImages?: boolean;
    includeMetadata?: boolean;
  } = {}
): Promise<void> => {
  try {
    console.log(`🔄 Starting comprehensive export in format: ${format}`);
    
    // Get the ReactFlow instance and canvas element
    const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
    const canvasElement = document.querySelector('.react-flow') as HTMLElement;
    
    if (!reactFlowInstance || !canvasElement) {
      throw new Error('ReactFlow instance or canvas element not found. Please refresh the page and try again.');
    }
    
    // Get current nodes and edges
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    
    console.log(`📊 Found ${nodes.length} nodes and ${edges.length} edges`);
    
    if (nodes.length === 0) {
      throw new Error('No content found to export. Please add some shapes to the canvas first.');
    }
    
    // Generate filename with timestamp if not provided
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const baseFilename = filename || `flowdigm-diagram-${timestamp}`;
    
    // Set default options
    const exportOptions = {
      quality: options.quality || 1.0,
      scale: options.scale || 2,
      backgroundColor: options.backgroundColor || '#ffffff',
      includeMetadata: options.includeMetadata !== false,
      ...options
    };
    
    // Prepare the canvas for high-quality export
    await prepareCanvasForExport(reactFlowInstance, canvasElement);
    
    // Export based on format
    switch (format) {
      case 'png':
        await exportAsPNGHighQuality(canvasElement, baseFilename, exportOptions);
        break;
      
      case 'jpeg':
        await exportAsJPEGHighQuality(canvasElement, baseFilename, exportOptions);
        break;
      
      case 'webp':
        await exportAsWebP(canvasElement, baseFilename, exportOptions);
        break;
      
      case 'svg':
        await exportAsSVGAdvanced(nodes, edges, baseFilename, exportOptions);
        break;
      
      case 'pdf':
        await exportAsPDF(canvasElement, baseFilename, exportOptions);
        break;
      
      case 'pptx':
        await exportAsPPTX(canvasElement, nodes, baseFilename, exportOptions);
        break;
      
      case 'docx':
        await exportAsDOCX(canvasElement, nodes, baseFilename, exportOptions);
        break;
      
      case 'html':
        await exportAsHTML(nodes, edges, baseFilename, exportOptions);
        break;
      
      case 'xml':
        await exportAsXML(nodes, edges, baseFilename, exportOptions);
        break;
      
      case 'url':
        await exportAsURL(nodes, edges, baseFilename, exportOptions);
        break;
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    console.log(`✅ Export completed successfully: ${baseFilename}.${format}`);
    
  } catch (error) {
    console.error('❌ Comprehensive export failed:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Prepares the canvas for high-quality export
 */
const prepareCanvasForExport = async (reactFlowInstance: any, canvasElement: HTMLElement): Promise<void> => {
  try {
    // Fit view to ensure all content is visible
    reactFlowInstance.fitView({ padding: 0.1 });
    
    // Wait for ReactFlow to finish rendering
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Ensure all elements are visible
    const nodeElements = canvasElement.querySelectorAll('.react-flow__node');
    nodeElements.forEach((node: any) => {
      node.style.visibility = 'visible';
      node.style.opacity = '1';
      node.style.display = 'block';
    });
    
    const edgeElements = canvasElement.querySelectorAll('.react-flow__edge');
    edgeElements.forEach((edge: any) => {
      edge.style.visibility = 'visible';
      edge.style.opacity = '1';
      edge.style.display = 'block';
    });
    
    // Wait a bit more for rendering to stabilize
    await new Promise(resolve => setTimeout(resolve, 500));
    
  } catch (error) {
    console.warn('Warning: Could not fully prepare canvas for export:', error);
  }
};

/**
 * High-quality PNG export using multiple fallback methods
 */
const exportAsPNGHighQuality = async (
  canvasElement: HTMLElement, 
  filename: string, 
  options: any
): Promise<void> => {
  try {
    console.log('🖼️ Starting high-quality PNG export...');
    
    let canvas: HTMLCanvasElement;
    
    // Try dom-to-image first (best for ReactFlow)
    try {
      const dataUrl = await domtoimage.toPng(canvasElement, {
        quality: options.quality,
        bgcolor: options.backgroundColor,
        width: canvasElement.scrollWidth * options.scale,
        height: canvasElement.scrollHeight * options.scale,
        style: {
          'transform': `scale(${options.scale})`,
          'transform-origin': 'top left'
        },
        filter: (node: any) => {
          const className = node.className;
          const classNameStr = typeof className === 'string' ? className : (className ? String(className) : '');
          return !classNameStr.includes('react-flow__controls') && 
                 !classNameStr.includes('react-flow__minimap') &&
                 !classNameStr.includes('react-flow__panel') &&
                 !classNameStr.includes('react-flow__selection');
        }
      });
      
      // Convert data URL to blob and download
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      
      console.log('✅ PNG export completed using dom-to-image');
      return;
      
    } catch (domError) {
      console.warn('dom-to-image failed, trying html2canvas:', domError);
    }
    
    // Fallback to html2canvas
    canvas = await html2canvas(canvasElement, {
      backgroundColor: options.backgroundColor,
      scale: options.scale,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: false,
      width: canvasElement.scrollWidth,
      height: canvasElement.scrollHeight,
      ignoreElements: (element) => {
        const className = element.className;
        const classNameStr = typeof className === 'string' ? className : (className ? String(className) : '');
        return classNameStr.includes('react-flow__controls') || 
               classNameStr.includes('react-flow__minimap') ||
               classNameStr.includes('react-flow__panel') ||
               classNameStr.includes('react-flow__selection');
      }
    });
    
    // Download the canvas
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}.png`);
        console.log('✅ PNG export completed using html2canvas');
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('PNG export error:', error);
    throw new Error(`Failed to export PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * High-quality JPEG export
 */
const exportAsJPEGHighQuality = async (
  canvasElement: HTMLElement, 
  filename: string, 
  options: any
): Promise<void> => {
  try {
    console.log('🖼️ Starting high-quality JPEG export...');
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: options.backgroundColor,
      scale: options.scale,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: false,
      ignoreElements: (element) => {
        const className = element.className; const classNameStr = typeof className === 'string' ? className : (className ? String(className) : '');
        return classNameStr.includes('react-flow__controls') || 
               classNameStr.includes('react-flow__minimap') ||
               classNameStr.includes('react-flow__panel') ||
               classNameStr.includes('react-flow__selection');
      }
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}.jpeg`);
        console.log('✅ JPEG export completed');
      }
    }, 'image/jpeg', options.quality);
    
  } catch (error) {
    console.error('JPEG export error:', error);
    throw new Error(`Failed to export JPEG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Advanced SVG export with better rendering
 */
const exportAsSVGAdvanced = async (
  nodes: Node[], 
  edges: Edge[], 
  filename: string, 
  options: any
): Promise<void> => {
  try {
    console.log('📐 Starting advanced SVG export...');
    
    // Calculate canvas bounds
    const bounds = calculateCanvasBounds(nodes);
    const padding = 50;
    const width = bounds.maxX - bounds.minX + padding * 2;
    const height = bounds.maxY - bounds.minY + padding * 2;
    
    // Generate high-quality SVG
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="${options.backgroundColor}"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>`;
    
    // Add edges with better styling
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const x1 = sourceNode.position.x + (sourceNode.data?.width || 80) / 2 - bounds.minX + padding;
        const y1 = sourceNode.position.y + (sourceNode.data?.height || 60) / 2 - bounds.minY + padding;
        const x2 = targetNode.position.x + (targetNode.data?.width || 80) / 2 - bounds.minX + padding;
        const y2 = targetNode.position.y + (targetNode.data?.height || 60) / 2 - bounds.minY + padding;
        
        svg += `
  <g class="edge" id="edge-${edge.id}">
    <path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
  </g>`;
      }
    });
    
    // Add arrow marker definition
    svg += `
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/>
    </marker>
  </defs>`;
    
    // Add nodes with high-quality rendering
    nodes.forEach(node => {
      const x = node.position.x - bounds.minX + padding;
      const y = node.position.y - bounds.minY + padding;
      const width = node.data?.width || 80;
      const height = node.data?.height || 60;
      const fill = node.data?.fill || '#ffffff';
      const stroke = node.data?.stroke || '#000000';
      const strokeWidth = node.data?.strokeWidth || 2;
      const label = node.data?.label || node.type || '';
      
      svg += `
  <g class="node" id="node-${node.id}">`;
      
      // Render different shapes based on node type
      if (node.type === 'circle') {
        const radius = Math.min(width, height) / 2;
        svg += `<circle cx="${x + width/2}" cy="${y + height/2}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      } else if (node.type === 'diamond') {
        svg += `<polygon points="${x + width/2},${y} ${x + width},${y + height/2} ${x + width/2},${y + height} ${x},${y + height/2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
      } else {
        svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="4"/>`;
      }
      
      if (label) {
        svg += `<text x="${x + width/2}" y="${y + height/2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="12" fill="#333">${label}</text>`;
      }
      
      svg += `
  </g>`;
    });
    
    // Add metadata if requested
    if (options.includeMetadata) {
      svg += `
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description>
        <dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">${filename}</dc:title>
        <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">FlowDigm</dc:creator>
        <dc:date xmlns:dc="http://purl.org/dc/elements/1.1/">${new Date().toISOString()}</dc:date>
      </rdf:Description>
    </rdf:RDF>
  </metadata>`;
    }
    
    svg += '</svg>';
    
    // Download SVG
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    saveAs(blob, `${filename}.svg`);
    
    console.log('✅ SVG export completed');
    
  } catch (error) {
    console.error('SVG export error:', error);
    throw new Error(`Failed to export SVG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * PDF export using jsPDF
 */
const exportAsPDF = async (
  canvasElement: HTMLElement, 
  filename: string, 
  options: any
): Promise<void> => {
  try {
    console.log('📄 Starting PDF export...');
    
    // First, capture the canvas as image
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: options.backgroundColor,
      scale: options.scale,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: false,
      ignoreElements: (element) => {
        const className = element.className; const classNameStr = typeof className === 'string' ? className : (className ? String(className) : '');
        return classNameStr.includes('react-flow__controls') || 
               classNameStr.includes('react-flow__minimap') ||
               classNameStr.includes('react-flow__panel') ||
               classNameStr.includes('react-flow__selection');
      }
    });
    
    // Create PDF document
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    // Add title page with metadata
    if (options.includeMetadata) {
      pdf.setFontSize(20);
      pdf.text('FlowDigm Diagram Export', 40, 40);
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 40, 60);
      pdf.text(`Filename: ${filename}`, 40, 80);
      pdf.addPage();
    }
    
    // Add the diagram image
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
    
    console.log('✅ PDF export completed');
    
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * PowerPoint (PPTX) export using PptxGenJS
 */
const exportAsPPTX = async (
  canvasElement: HTMLElement, 
  nodes: Node[], 
  filename: string, 
  options: any
): Promise<void> => {
  try {
    console.log('📊 Starting PPTX export...');
    
    // Create new presentation
    const pres = new PptxGenJS();
    
    // Set presentation properties
    pres.author = 'FlowDigm';
    pres.company = 'FlowDigm';
    pres.title = filename;
    pres.subject = 'Diagram Export';
    
    // Create title slide
    if (options.includeMetadata) {
      const titleSlide = pres.addSlide();
      titleSlide.addText('FlowDigm Diagram', { 
        x: 1, y: 1, w: 8, h: 1, 
        fontSize: 24, bold: true, align: 'center' 
      });
      titleSlide.addText(`Generated: ${new Date().toLocaleString()}`, { 
        x: 1, y: 2.5, w: 8, h: 0.5, 
        fontSize: 14, align: 'center' 
      });
    }
    
    // Create diagram slide
    const diagramSlide = pres.addSlide();
    
    // Capture canvas as image
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: options.backgroundColor,
      scale: 1, // Lower scale for PPTX compatibility
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: false,
      ignoreElements: (element) => {
        const className = element.className; const classNameStr = typeof className === 'string' ? className : (className ? String(className) : '');
        return classNameStr.includes('react-flow__controls') || 
               classNameStr.includes('react-flow__minimap') ||
               classNameStr.includes('react-flow__panel') ||
               classNameStr.includes('react-flow__selection');
      }
    });
    
    // Add image to slide
    const imgData = canvas.toDataURL('image/png');
    diagramSlide.addImage({ 
      data: imgData,
      x: 0.5, y: 0.5, w: 9, h: 6.5,
      sizing: { type: 'contain', w: 9, h: 6.5 }
    });
    
    // Add slide with node details if requested
    if (options.includeMetadata && nodes.length > 0) {
      const detailsSlide = pres.addSlide();
      detailsSlide.addText('Diagram Components', { 
        x: 1, y: 0.5, w: 8, h: 0.5, 
        fontSize: 18, bold: true 
      });
      
      let yPos = 1.5;
      nodes.forEach((node, index) => {
        if (yPos > 6) {
          // Add new slide if content overflows
          pres.addSlide();
          yPos = 1;
        }
        
        const label = node.data?.label || node.type || `Node ${index + 1}`;
        detailsSlide.addText(`• ${label} (${node.type})`, { 
          x: 1, y: yPos, w: 8, h: 0.3, 
          fontSize: 12 
        });
        yPos += 0.4;
      });
    }
    
    // Save the presentation
    await pres.writeFile({ fileName: `${filename}.pptx` });
    
    console.log('✅ PPTX export completed');
    
  } catch (error) {
    console.error('PPTX export error:', error);
    throw new Error(`Failed to export PPTX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Word Document (DOCX) export using docx library
 */
const exportAsDOCX = async (
  canvasElement: HTMLElement, 
  nodes: Node[], 
  filename: string, 
  options: any
): Promise<void> => {
  try {
    console.log('📝 Starting enhanced DOCX export...');
    
    // Capture canvas as image with high quality
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: options.backgroundColor || '#ffffff',
      scale: options.scale || 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: false,
      width: options.width ? parseInt(options.width) : undefined,
      height: options.height ? parseInt(options.height) : undefined,
      ignoreElements: (element) => {
        const className = element.className;
        const classNameStr = typeof className === 'string' ? className : (className ? String(className) : '');
        return classNameStr.includes('react-flow__controls') || 
               classNameStr.includes('react-flow__minimap') ||
               classNameStr.includes('react-flow__panel') ||
               classNameStr.includes('react-flow__selection');
      }
    });
    
    // Convert canvas to buffer
    const imgData = canvas.toDataURL('image/png');
    const base64Data = imgData.split(',')[1];
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Create document sections
    const children: any[] = [];
    
    // Add document title
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: filename || 'FlowDigm Diagram',
            bold: true,
            size: 36,
            color: '1976d2'
          })
        ],
        spacing: { after: 400 }
      })
    );
    
    // Add metadata section if requested
    if (options.includeMetadata) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Document Information',
              bold: true,
              size: 24,
              color: '424242'
            })
          ],
          spacing: { before: 200, after: 200 }
        })
      );
      
      const metadata = [
        `Generated: ${new Date().toLocaleString()}`,
        `Filename: ${filename}`,
        `Total Components: ${nodes.length}`,
        `Export Quality: ${options.quality || 100}%`,
        `Scale: ${options.scale || 2}x`
      ];
      
      metadata.forEach(info => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${info}`,
                size: 20,
                color: '666666'
              })
            ],
            spacing: { after: 100 }
          })
        );
      });
    }
    
    // Add diagram section
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Diagram',
            bold: true,
            size: 24,
            color: '424242'
          })
        ],
        spacing: { before: 400, after: 200 }
      })
    );
    
    // Add diagram image with better error handling
    try {
      // Calculate optimal dimensions for Word document (max 6.5 inches wide)
      const maxWidth = 468; // 6.5 inches in points
      const maxHeight = 350; // Keep reasonable height
      
      let imageWidth = canvas.width;
      let imageHeight = canvas.height;
      
      // Scale down if too large
      if (imageWidth > maxWidth) {
        const scale = maxWidth / imageWidth;
        imageWidth = maxWidth;
        imageHeight = imageHeight * scale;
      }
      
      if (imageHeight > maxHeight) {
        const scale = maxHeight / imageHeight;
        imageHeight = maxHeight;
        imageWidth = imageWidth * scale;
      }
      
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: {
                width: Math.round(imageWidth),
                height: Math.round(imageHeight)
              },
              type: 'png'
            } as any)
          ],
          spacing: { after: 400 }
        })
      );
      
      console.log(`✅ Diagram image added to DOCX (${Math.round(imageWidth)}x${Math.round(imageHeight)})`);
      
    } catch (imageError) {
      console.warn('Failed to add image to DOCX, adding text placeholder instead:', imageError);
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '[Diagram image could not be embedded - please export as PNG for image format]',
              size: 20,
              italics: true,
              color: 'ff6b6b'
            })
          ],
          spacing: { after: 400 }
        })
      );
    }
    
    // Add detailed component list if requested
    if (options.includeMetadata && nodes.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Diagram Components',
              bold: true,
              size: 24,
              color: '424242'
            })
          ],
          spacing: { before: 400, after: 200 }
        })
      );
      
      nodes.forEach((node, index) => {
        const label = node.data?.label || node.type || `Component ${index + 1}`;
        const nodeType = node.type || 'default';
        const position = `(${Math.round(node.position?.x || 0)}, ${Math.round(node.position?.y || 0)})`;
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. `,
                bold: true,
                size: 20,
                color: '1976d2'
              }),
              new TextRun({
                text: `${label}`,
                bold: true,
                size: 20,
                color: '424242'
              }),
              new TextRun({
                text: ` - Type: ${nodeType}, Position: ${position}`,
                size: 18,
                color: '666666'
              })
            ],
            spacing: { after: 100 }
          })
        );
      });
    }
    
    // Add footer
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated by FlowDigm - Professional Diagram Tool`,
            size: 16,
            italics: true,
            color: '999999'
          })
        ],
        spacing: { before: 600 }
      })
    );
    
    // Create document with better formatting
    const doc = new DocxDocument({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,    // 1 inch
                right: 720,  // 1 inch  
                bottom: 720, // 1 inch
                left: 720    // 1 inch
              }
            }
          },
          children: children
        }
      ]
    });
    
    // Generate and save document
    console.log('📦 Generating DOCX file...');
    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([new Uint8Array(buffer)], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    saveAs(blob, `${filename}.docx`);
    
    console.log('✅ Enhanced DOCX export completed successfully');
    
  } catch (error) {
    console.error('❌ Enhanced DOCX export error:', error);
    throw new Error(`Failed to export DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  
  // (removed debug lines)
  
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
  // Draw only actual edges if they exist
  
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
        const className = node.className;
        const classNameStr = typeof className === 'string' ? className : (className ? String(className) : '');
        return !classNameStr.includes('react-flow__controls') && 
               !classNameStr.includes('react-flow__minimap') &&
               !classNameStr.includes('react-flow__panel') &&
               !classNameStr.includes('react-flow__selection');
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

// Save as FlowDigm native file (.flowdigm)
export const exportAsFlowdigm = (canvasData: CanvasData, fileName: string): void => {
  try {
    const jsonContent = JSON.stringify(canvasData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${fileName}.flowdigm`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting as FlowDigm:', error);
    throw new Error('Failed to export as FlowDigm');
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

/**
 * Import from FlowDigm native format (.flowdigm)
 */
export const importFromFlowdigm = (file: File): Promise<CanvasData> => {
  return importFromJSON(file); // Same as JSON for now
};

/**
 * Import from SVG format
 */
export const importFromSVG = (file: File): Promise<CanvasData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(content, 'image/svg+xml');
        
        // Extract shapes from SVG
        const canvasData = parseSVGToCanvasData(svgDoc, file.name);
        resolve(canvasData);
      } catch (error) {
        reject(new Error('Failed to parse SVG file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read SVG file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Import from XML format (Draw.io, Visio, etc.)
 */
export const importFromXML = (file: File): Promise<CanvasData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'application/xml');
        
        // Check for parser errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          throw new Error('Invalid XML format');
        }
        
        // Detect XML format and parse accordingly
        const canvasData = parseXMLToCanvasData(xmlDoc, file.name);
        resolve(canvasData);
      } catch (error) {
        reject(new Error('Failed to parse XML file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read XML file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Import from CSV format (node/edge lists)
 */
export const importFromCSV = (file: File): Promise<CanvasData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const canvasData = parseCSVToCanvasData(content, file.name);
        resolve(canvasData);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read CSV file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Import from TXT format (simple node lists)
 */
export const importFromTXT = (file: File): Promise<CanvasData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const canvasData = parseTXTToCanvasData(content, file.name);
        resolve(canvasData);
      } catch (error) {
        reject(new Error('Failed to parse TXT file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read TXT file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Import from image formats (PNG, JPG, etc.) - extract text and create nodes
 */
export const importFromImage = (file: File): Promise<CanvasData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const dataUrl = event.target?.result as string;
        
        // Create a single image node
        const canvasData: CanvasData = {
          nodes: [
            {
              id: 'image-1',
              type: 'image',
              position: { x: 100, y: 100 },
              data: {
                label: file.name,
                imageUrl: dataUrl,
                width: 300,
                height: 200,
                fill: '#ffffff',
                stroke: '#000000',
                strokeWidth: 2
              }
            }
          ],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 },
          grid: { visible: true, size: 20, snap: false },
          fileName: file.name.replace(/\.[^/.]+$/, ""),
          version: '1.0'
        };
        
        resolve(canvasData);
      } catch (error) {
        reject(new Error('Failed to process image file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Universal import function that detects file type and routes to appropriate handler
 */
export const importFile = async (file: File): Promise<CanvasData> => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  console.log(`🔄 Importing file: ${file.name} (${extension})`);
  
  try {
    switch (extension) {
      case 'json':
        // Check if it's FlowDigm format by reading a small part
        const preview = await file.slice(0, 1000).text();
        if (preview.includes('"flowdigm"') || preview.includes('"version"')) {
          return await importFromFlowdigm(file);
        }
        return await importFromJSON(file);
      
      case 'flowdigm':
        return await importFromFlowdigm(file);
      
      case 'svg':
        return await importFromSVG(file);
      
      case 'xml':
      case 'drawio':
      case 'vsdx':
        return await importFromXML(file);
      
      case 'csv':
        return await importFromCSV(file);
      
      case 'txt':
        return await importFromTXT(file);
      
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'webp':
        return await importFromImage(file);
      
      default:
        throw new Error(`Unsupported file format: ${extension}. Supported formats: JSON, FlowDigm, SVG, XML, Draw.io, CSV, TXT, PNG, JPG`);
    }
  } catch (error) {
    console.error(`❌ Import failed for ${file.name}:`, error);
    throw error;
  }
};

// Helper functions for parsing different formats

/**
 * Parse SVG content to CanvasData
 */
const parseSVGToCanvasData = (svgDoc: Document, fileName: string): CanvasData => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Extract shapes from SVG elements
  const shapes: NodeListOf<Element> = svgDoc.querySelectorAll('rect, circle, ellipse, polygon, path, text, g');
  
  shapes.forEach((shape: Element, index: number) => {
    const nodeId = `svg-node-${index}`;
    let x = 0, y = 0, width = 100, height = 80;
    let label = '';
    
    // Extract position and dimensions based on element type
    if (shape.tagName === 'rect') {
      x = parseFloat(shape.getAttribute('x') || '0');
      y = parseFloat(shape.getAttribute('y') || '0');
      width = parseFloat(shape.getAttribute('width') || '100');
      height = parseFloat(shape.getAttribute('height') || '80');
    } else if (shape.tagName === 'circle') {
      const cx = parseFloat(shape.getAttribute('cx') || '50');
      const cy = parseFloat(shape.getAttribute('cy') || '50');
      const r = parseFloat(shape.getAttribute('r') || '25');
      x = cx - r;
      y = cy - r;
      width = height = r * 2;
    } else if (shape.tagName === 'text') {
      x = parseFloat(shape.getAttribute('x') || '0');
      y = parseFloat(shape.getAttribute('y') || '0');
      label = shape.textContent || '';
      width = label.length * 8; // Estimate width
      height = 20;
    }
    
    // Extract text content for label
    if (!label) {
      const textElement = shape.querySelector('text');
      label = textElement?.textContent || shape.getAttribute('id') || `Shape ${index + 1}`;
    }
    
    nodes.push({
      id: nodeId,
      type: shape.tagName === 'circle' ? 'circle' : 'rect',
      position: { x, y },
      data: {
        label,
        width,
        height,
        fill: shape.getAttribute('fill') || '#e3f2fd',
        stroke: shape.getAttribute('stroke') || '#1976d2',
        strokeWidth: parseFloat(shape.getAttribute('stroke-width') || '2')
      }
    });
  });
  
  // If no shapes found, create a default node
  if (nodes.length === 0) {
    nodes.push({
      id: 'default-1',
      type: 'rect',
      position: { x: 100, y: 100 },
      data: {
        label: 'Imported SVG',
        width: 120,
        height: 80,
        fill: '#e3f2fd',
        stroke: '#1976d2',
        strokeWidth: 2
      }
    });
  }
  
  return {
    nodes,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 },
    grid: { visible: true, size: 20, snap: false },
    fileName: fileName.replace(/\.[^/.]+$/, ""),
    version: '1.0'
  };
};

/**
 * Parse XML content to CanvasData (Draw.io, Visio, etc.)
 */
const parseXMLToCanvasData = (xmlDoc: Document, fileName: string): CanvasData => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Try to detect and parse Draw.io format
  const mxFile = xmlDoc.querySelector('mxfile');
  const diagram = xmlDoc.querySelector('diagram');
  
  if (mxFile || diagram) {
    return parseDrawIOXML(xmlDoc, fileName);
  }
  
  // Try to parse generic XML with shape-like elements
  const shapes = xmlDoc.querySelectorAll('shape, object, node, element, rect, circle');
  
  shapes.forEach((shape, index) => {
    const nodeId = shape.getAttribute('id') || `xml-node-${index}`;
    
    // Extract attributes
    const x = parseFloat(shape.getAttribute('x') || '0');
    const y = parseFloat(shape.getAttribute('y') || '0');
    const width = parseFloat(shape.getAttribute('width') || '100');
    const height = parseFloat(shape.getAttribute('height') || '80');
    const label = shape.getAttribute('label') || shape.textContent || `Node ${index + 1}`;
    
    nodes.push({
      id: nodeId,
      type: 'rect',
      position: { x: x * 2, y: y * 2 }, // Scale up for better visibility
      data: {
        label,
        width,
        height,
        fill: '#e3f2fd',
        stroke: '#1976d2',
        strokeWidth: 2
      }
    });
  });
  
  // If no shapes found, create a default node
  if (nodes.length === 0) {
    nodes.push({
      id: 'default-1',
      type: 'rect',
      position: { x: 100, y: 100 },
      data: {
        label: 'Imported XML',
        width: 120,
        height: 80,
        fill: '#e3f2fd',
        stroke: '#1976d2',
        strokeWidth: 2
      }
    });
  }
  
  return {
    nodes,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 },
    grid: { visible: true, size: 20, snap: false },
    fileName: fileName.replace(/\.[^/.]+$/, ""),
    version: '1.0'
  };
};

/**
 * Parse Draw.io XML format
 */
const parseDrawIOXML = (xmlDoc: Document, fileName: string): CanvasData => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Find all mxCell elements
  const cells = xmlDoc.querySelectorAll('mxCell');
  
  cells.forEach((cell, index) => {
    const cellId = cell.getAttribute('id');
    const value = cell.getAttribute('value') || '';
    const style = cell.getAttribute('style') || '';
    const vertex = cell.getAttribute('vertex') === '1';
    const edge = cell.getAttribute('edge') === '1';
    
    if (vertex && cellId !== '0' && cellId !== '1') {
      // This is a vertex (node)
      const geometry = cell.querySelector('mxGeometry');
      const x = parseFloat(geometry?.getAttribute('x') || '0');
      const y = parseFloat(geometry?.getAttribute('y') || '0');
      const width = parseFloat(geometry?.getAttribute('width') || '100');
      const height = parseFloat(geometry?.getAttribute('height') || '80');
      
      // Parse style for colors
      let fill = '#e3f2fd';
      let stroke = '#1976d2';
      if (style.includes('fillColor=')) {
        const match = style.match(/fillColor=([^;]+)/);
        if (match) fill = match[1];
      }
      if (style.includes('strokeColor=')) {
        const match = style.match(/strokeColor=([^;]+)/);
        if (match) stroke = match[1];
      }
      
      nodes.push({
        id: cellId || `drawio-node-${index}`,
        type: style.includes('ellipse') ? 'circle' : 'rect',
        position: { x, y },
        data: {
          label: value || `Node ${index + 1}`,
          width,
          height,
          fill: fill.startsWith('#') ? fill : `#${fill}`,
          stroke: stroke.startsWith('#') ? stroke : `#${stroke}`,
          strokeWidth: 2
        }
      });
    } else if (edge) {
      // This is an edge
      const source = cell.getAttribute('source');
      const target = cell.getAttribute('target');
      
      if (source && target) {
        edges.push({
          id: cellId || `drawio-edge-${index}`,
          source,
          target,
          type: 'default',
          data: { label: value }
        });
      }
    }
  });
  
  return {
    nodes,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 },
    grid: { visible: true, size: 20, snap: false },
    fileName: fileName.replace(/\.[^/.]+$/, ""),
    version: '1.0'
  };
};

/**
 * Parse CSV content to CanvasData
 */
const parseCSVToCanvasData = (content: string, fileName: string): CanvasData => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0]?.split(',').map(h => h.trim().toLowerCase());
  
  if (!headers) {
    throw new Error('Empty CSV file');
  }
  
  // Check if this is a node list or edge list
  const isEdgeList = headers.includes('source') && headers.includes('target');
  
  if (isEdgeList) {
    // Parse as edge list
    const sourceIndex = headers.indexOf('source');
    const targetIndex = headers.indexOf('target');
    const labelIndex = headers.indexOf('label');
    
    const nodeSet = new Set<string>();
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const source = values[sourceIndex];
      const target = values[targetIndex];
      const label = labelIndex >= 0 ? values[labelIndex] : '';
      
      if (source && target) {
        nodeSet.add(source);
        nodeSet.add(target);
        
        edges.push({
          id: `edge-${i}`,
          source,
          target,
          type: 'default',
          data: { label }
        });
      }
    }
    
    // Create nodes from the edge endpoints
    Array.from(nodeSet).forEach((nodeId, index) => {
      nodes.push({
        id: nodeId,
        type: 'rect',
        position: { 
          x: 100 + (index % 5) * 150, 
          y: 100 + Math.floor(index / 5) * 120 
        },
        data: {
          label: nodeId,
          width: 120,
          height: 80,
          fill: '#e3f2fd',
          stroke: '#1976d2',
          strokeWidth: 2
        }
      });
    });
  } else {
    // Parse as node list
    const idIndex = headers.indexOf('id') || headers.indexOf('name') || 0;
    const labelIndex = headers.indexOf('label') || headers.indexOf('name') || idIndex;
    const typeIndex = headers.indexOf('type');
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const id = values[idIndex] || `node-${i}`;
      const label = values[labelIndex] || id;
      const type = typeIndex >= 0 ? values[typeIndex] : 'rect';
      
      nodes.push({
        id,
        type: type === 'circle' ? 'circle' : 'rect',
        position: { 
          x: 100 + (i % 5) * 150, 
          y: 100 + Math.floor(i / 5) * 120 
        },
        data: {
          label,
          width: 120,
          height: 80,
          fill: '#e3f2fd',
          stroke: '#1976d2',
          strokeWidth: 2
        }
      });
    }
  }
  
  return {
    nodes,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 },
    grid: { visible: true, size: 20, snap: false },
    fileName: fileName.replace(/\.[^/.]+$/, ""),
    version: '1.0'
  };
};

/**
 * Parse TXT content to CanvasData
 */
const parseTXTToCanvasData = (content: string, fileName: string): CanvasData => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  const lines = content.split('\n').filter(line => line.trim());
  
  // Check if lines contain arrows or connections (-> or -- or =>)
  const connectionPattern = /(.+?)(?:\s*(?:->|-->|=>|--)\s*)(.+)/;
  
  lines.forEach((line, index) => {
    const match = line.match(connectionPattern);
    
    if (match) {
      // This line represents a connection
      const source = match[1].trim();
      const target = match[2].trim();
      
      // Create nodes if they don't exist
      if (!nodes.find(n => n.id === source)) {
        nodes.push({
          id: source,
          type: 'rect',
          position: { 
            x: 100 + (nodes.length % 4) * 180, 
            y: 100 + Math.floor(nodes.length / 4) * 120 
          },
          data: {
            label: source,
            width: 140,
            height: 80,
            fill: '#e3f2fd',
            stroke: '#1976d2',
            strokeWidth: 2
          }
        });
      }
      
      if (!nodes.find(n => n.id === target)) {
        nodes.push({
          id: target,
          type: 'rect',
          position: { 
            x: 100 + (nodes.length % 4) * 180, 
            y: 100 + Math.floor(nodes.length / 4) * 120 
          },
          data: {
            label: target,
            width: 140,
            height: 80,
            fill: '#e3f2fd',
            stroke: '#1976d2',
            strokeWidth: 2
          }
        });
      }
      
      // Create edge
      edges.push({
        id: `edge-${index}`,
        source,
        target,
        type: 'default',
        data: { label: '' }
      });
    } else if (line.trim()) {
      // This line represents a standalone node
      const nodeId = line.trim();
      nodes.push({
        id: nodeId,
        type: 'rect',
        position: { 
          x: 100 + (index % 4) * 180, 
          y: 100 + Math.floor(index / 4) * 120 
        },
        data: {
          label: nodeId,
          width: 140,
          height: 80,
          fill: '#e3f2fd',
          stroke: '#1976d2',
          strokeWidth: 2
        }
      });
    }
  });
  
  // If no nodes were created, create a default one
  if (nodes.length === 0) {
    nodes.push({
      id: 'default-1',
      type: 'rect',
      position: { x: 100, y: 100 },
      data: {
        label: 'Imported Text',
        width: 120,
        height: 80,
        fill: '#e3f2fd',
        stroke: '#1976d2',
        strokeWidth: 2
      }
    });
  }
  
  return {
    nodes,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 },
    grid: { visible: true, size: 20, snap: false },
    fileName: fileName.replace(/\.[^/.]+$/, ""),
    version: '1.0'
  };
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

/**
 * WebP export using canvas conversion
 */
const exportAsWebP = async (
  canvasElement: HTMLElement, 
  filename: string, 
  options: any
): Promise<void> => {
  try {
    console.log('🖼️ Starting WebP export...');
    
    let canvas: HTMLCanvasElement;
    
    // Try html2canvas first for best quality
    canvas = await html2canvas(canvasElement, {
      backgroundColor: options.transparent ? null : (options.backgroundColor || '#ffffff'),
      scale: (options.scale || 100) / 100,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      removeContainer: true,
      logging: false,
      width: options.width ? parseInt(options.width) : canvasElement.scrollWidth,
      height: options.height ? parseInt(options.height) : canvasElement.scrollHeight,
      ignoreElements: (element) => {
        const className = element.className; const classNameStr = typeof className === 'string' ? className : (className ? String(className) : '');
        return classNameStr.includes('react-flow__controls') || 
               classNameStr.includes('react-flow__minimap') ||
               classNameStr.includes('react-flow__panel') ||
               classNameStr.includes('react-flow__selection');
      }
    });
    
    // Convert to WebP
    const quality = (options.quality || 100) / 100;
    const dataURL = canvas.toDataURL('image/webp', quality);
    
    // Download the file
    const link = document.createElement('a');
    link.download = `${filename}.webp`;
    link.href = dataURL;
    link.click();
    
    console.log('✅ WebP export completed');
    
  } catch (error) {
    console.error('❌ WebP export failed:', error);
    throw new Error(`WebP export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * HTML export - Creates a standalone HTML file with embedded diagram
 */
const exportAsHTML = async (
  nodes: any[], 
  edges: any[], 
  filename: string, 
  options: any
): Promise<void> => {
  try {
    console.log('🌐 Starting HTML export...');
    
    // Calculate diagram bounds
    let minX = 0, minY = 0, maxX = 800, maxY = 600;
    
    if (nodes.length > 0) {
      minX = Math.min(...nodes.map(n => n.position.x));
      minY = Math.min(...nodes.map(n => n.position.y));
      maxX = Math.max(...nodes.map(n => n.position.x + (n.data?.width || 100)));
      maxY = Math.max(...nodes.map(n => n.position.y + (n.data?.height || 80)));
    }
    
    const padding = (options.border || 20);
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    
    // Generate SVG content
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background-color: ${options.backgroundColor || '#ffffff'}">`;
    
    // Add grid if requested
    if (options.includeGrid) {
      svgContent += `
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />`;
    }
    
    // Add nodes
    nodes.forEach(node => {
      const x = node.position.x - minX + padding;
      const y = node.position.y - minY + padding;
      const nodeWidth = node.data?.width || 120;
      const nodeHeight = node.data?.height || 80;
      const fill = node.data?.fill || '#e3f2fd';
      const stroke = node.data?.stroke || '#1976d2';
      const label = node.data?.label || node.type || '';
      
      if (node.type === 'circle') {
        const radius = Math.min(nodeWidth, nodeHeight) / 2;
        svgContent += `
          <circle cx="${x + nodeWidth/2}" cy="${y + nodeHeight/2}" r="${radius}" 
                  fill="${fill}" stroke="${stroke}" stroke-width="2"/>
          <text x="${x + nodeWidth/2}" y="${y + nodeHeight/2}" text-anchor="middle" 
                dominant-baseline="middle" font-family="Arial, sans-serif" font-size="12" fill="#333">${label}</text>`;
      } else {
        svgContent += `
          <rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" 
                fill="${fill}" stroke="${stroke}" stroke-width="2" rx="4"/>
          <text x="${x + nodeWidth/2}" y="${y + nodeHeight/2}" text-anchor="middle" 
                dominant-baseline="middle" font-family="Arial, sans-serif" font-size="12" fill="#333">${label}</text>`;
      }
    });
    
    // Add edges
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceX = sourceNode.position.x - minX + padding + (sourceNode.data?.width || 120) / 2;
        const sourceY = sourceNode.position.y - minY + padding + (sourceNode.data?.height || 80) / 2;
        const targetX = targetNode.position.x - minX + padding + (targetNode.data?.width || 120) / 2;
        const targetY = targetNode.position.y - minY + padding + (targetNode.data?.height || 80) / 2;
        
        svgContent += `
          <line x1="${sourceX}" y1="${sourceY}" x2="${targetX}" y2="${targetY}" 
                stroke="#666" stroke-width="2" marker-end="url(#arrowhead)"/>`;
      }
    });
    
    svgContent += `
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
        </marker>
      </defs>
    </svg>`;
    
    // Create complete HTML document
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
        }
        .diagram-container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            display: inline-block;
        }
        .diagram-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #333;
        }
        .export-info {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="diagram-container">
        <div class="diagram-title">${filename}</div>
        ${svgContent}
        <div class="export-info">
            Exported from FlowDigm on ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;
    
    // Download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.html`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ HTML export completed');
    
  } catch (error) {
    console.error('❌ HTML export failed:', error);
    throw new Error(`HTML export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * XML export - Creates DrawIO-compatible XML format
 */
const exportAsXML = async (
  nodes: any[], 
  edges: any[], 
  filename: string, 
  _options: any
): Promise<void> => {
  try {
    console.log('📄 Starting XML export...');
    
    // Create DrawIO-compatible XML structure
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="FlowDigm" modified="${new Date().toISOString()}" agent="FlowDigm" etag="${Math.random().toString(36)}" version="1.0" type="device">
  <diagram id="${Math.random().toString(36)}" name="Page-1">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>`;
    
    // Add nodes
    nodes.forEach(node => {
      const x = node.position.x;
      const y = node.position.y;
      const width = node.data?.width || 120;
      const height = node.data?.height || 80;
      const label = node.data?.label || node.type || '';
      const fill = node.data?.fill || '#e3f2fd';
      const stroke = node.data?.stroke || '#1976d2';
      
      let style = `rounded=0;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${stroke};`;
      
      if (node.type === 'circle') {
        style = `ellipse;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${stroke};`;
      }
      
      xmlContent += `
        <mxCell id="${node.id}" value="${label}" style="${style}" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
        </mxCell>`;
    });
    
    // Add edges
    edges.forEach(edge => {
      xmlContent += `
        <mxCell id="${edge.id}" value="${edge.label || ''}" style="endArrow=classic;html=1;rounded=0;" edge="1" parent="1" source="${edge.source}" target="${edge.target}">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="400" y="320" as="sourcePoint"/>
            <mxPoint x="450" y="270" as="targetPoint"/>
          </mxGeometry>
        </mxCell>`;
    });
    
    xmlContent += `
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
    
    // Download the XML file
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.xml`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ XML export completed');
    
  } catch (error) {
    console.error('❌ XML export failed:', error);
    throw new Error(`XML export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * URL export - Creates a shareable URL with diagram data
 */
const exportAsURL = async (
  nodes: any[], 
  edges: any[], 
  filename: string, 
  _options: any
): Promise<void> => {
  try {
    console.log('🔗 Starting URL export...');
    
    // Create diagram data object
    const diagramData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default'
      })),
      metadata: {
        name: filename,
        created: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    // Compress and encode the data
    const jsonString = JSON.stringify(diagramData);
    const encodedData = btoa(encodeURIComponent(jsonString));
    
    // Create shareable URL
    const baseUrl = window.location.origin + window.location.pathname;
    const shareableUrl = `${baseUrl}?diagram=${encodedData}`;
    
    // Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareableUrl);
      console.log('✅ URL copied to clipboard');
      
      // Also create a downloadable text file with the URL
      const urlContent = `FlowDigm Diagram URL
      
Shareable Link:
${shareableUrl}

Instructions:
1. Copy the link above
2. Share it with others
3. Open the link to view the diagram

Diagram Name: ${filename}
Export Date: ${new Date().toLocaleString()}
Nodes: ${nodes.length}
Edges: ${edges.length}`;
      
      const blob = new Blob([urlContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}-url.txt`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      alert(`Shareable URL has been copied to clipboard and saved as a text file!\n\nURL: ${shareableUrl}`);
      
    } catch (clipboardError) {
      console.warn('Could not copy to clipboard, creating download instead');
      
      // Fallback: create downloadable text file
      const urlContent = `Shareable FlowDigm Diagram URL:\n\n${shareableUrl}`;
      const blob = new Blob([urlContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}-url.txt`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      alert(`Shareable URL has been saved as a text file!\n\nURL: ${shareableUrl}`);
    }
    
    console.log('✅ URL export completed');
    
  } catch (error) {
    console.error('❌ URL export failed:', error);
    throw new Error(`URL export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Load diagram from URL parameter (for shareable URLs)
 */
export const loadDiagramFromURL = (): any | null => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const diagramData = urlParams.get('diagram');
    
    if (diagramData) {
      console.log('🔗 Loading diagram from URL...');
      const decodedData = decodeURIComponent(atob(diagramData));
      const parsedData = JSON.parse(decodedData);
      
      console.log('✅ Diagram loaded from URL:', parsedData.metadata?.name || 'Unnamed');
      return parsedData;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Failed to load diagram from URL:', error);
    return null;
  }
};

// Export all functions to global scope for testing and external access
if (typeof window !== 'undefined') {
  (window as any).exportFile = exportFile;
  (window as any).exportCanvas = exportCanvas;
  (window as any).exportAsPNGSimple = exportAsPNGSimple;
  (window as any).exportAsJSON = exportAsJSON;
  (window as any).exportAsSVG = exportAsSVG;
  (window as any).exportAsWebP = exportAsWebP;
  (window as any).exportAsHTML = exportAsHTML;
  (window as any).exportAsXML = exportAsXML;
  (window as any).exportAsURL = exportAsURL;
  
  console.log('🚀 FlowDigm Export Functions Available:');
  console.log('  - window.exportFile(format, filename, options)');
  console.log('  - window.exportCanvas(format)');
  console.log('  - Available formats: png, jpeg, webp, svg, pdf, pptx, docx, html, xml, url');
  console.log('  - Advanced options: quality, scale, backgroundColor, transparent, border, etc.');
} 
