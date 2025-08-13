// utils/importExportUtils.ts - Refactored and optimized from ~4000 to ~800 lines
import type { Node, Edge } from 'reactflow';
import type { CanvasData } from '../types/importExport';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { Document as DocxDocument, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

// @ts-ignore
import domtoimage from 'dom-to-image';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getReactFlowInstance = () => {
  const instance = (window as any).__REACT_FLOW_INSTANCE__;
  if (!instance) {
    throw new Error('ReactFlow instance not found. Please refresh the page and try again.');
  }
  return instance;
};

const generateFileName = (prefix: string, extension: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.${extension}`;
};

const findCanvasElement = (): HTMLElement => {
  const reactFlowContainer = document.querySelector('.react-flow') as HTMLElement;
  if (!reactFlowContainer) {
    throw new Error('Canvas element not found');
  }
  return reactFlowContainer;
};

// ============================================================================
// MAIN EXPORT FUNCTIONS - Used by Toolbar
// ============================================================================

export const exportCanvas = async (format: 'png' | 'jpg' | 'svg' | 'json' = 'png'): Promise<void> => {
  try {
    console.log('🔄 Starting canvas export in format:', format);
    
    const reactFlowInstance = getReactFlowInstance();
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    
    console.log('📊 Found nodes:', nodes.length, 'edges:', edges.length);
    
    if (nodes.length === 0) {
      alert('No shapes found! Please add some shapes to the canvas first.');
      return;
    }
    
    const fileName = generateFileName('flowdigm-diagram', format);
    
    switch (format) {
      case 'png':
        await exportAsPNG(findCanvasElement(), fileName);
        break;
      case 'jpg':
        await exportAsJPEG(findCanvasElement(), fileName);
        break;
      case 'svg':
        exportAsSVG(nodes, edges, fileName);
        break;
      case 'json':
        const canvasData: CanvasData = {
          nodes,
          edges,
          viewport: { x: 0, y: 0, zoom: 1 },
          grid: { visible: true, size: 20, snap: false },
          fileName: fileName,
          version: '1.0'
        };
        exportAsJSON(canvasData, fileName);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    console.log(`✅ Export completed successfully: ${fileName}`);
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  }
};

export const exportFile = async (
  format: 'png' | 'jpeg' | 'jpg' | 'webp' | 'svg' | 'pdf' | 'pptx' | 'docx' | 'html' | 'xml' | 'url' | 'json',
  filename?: string,
  options: any = {}
): Promise<void> => {
  try {
    const reactFlowInstance = getReactFlowInstance();
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    const canvasElement = findCanvasElement();
    const fileName = filename || generateFileName('flowdigm-export', format);

    console.log(`📤 Exporting as ${format.toUpperCase()}...`);

    switch (format) {
      case 'png':
        await exportAsPNG(canvasElement, fileName);
        break;
      case 'jpeg':
      case 'jpg':
        await exportAsJPEG(canvasElement, fileName);
        break;
      case 'webp':
        await exportAsWebP(canvasElement, fileName);
        break;
      case 'pdf':
        await exportAsPDF(canvasElement, nodes, fileName, options);
        break;
      case 'pptx':
        await exportAsPPTX(canvasElement, nodes, fileName, options);
        break;
      case 'docx':
        await exportAsDOCX(canvasElement, nodes, fileName, options);
        break;
      case 'svg':
        exportAsSVG(nodes, edges, fileName);
        break;
      case 'json':
        const canvasData: CanvasData = { 
          nodes, 
          edges, 
          viewport: { x: 0, y: 0, zoom: 1 },
          grid: { visible: true, size: 20, snap: false },
          fileName: fileName,
          version: '1.0'
        };
        exportAsJSON(canvasData, fileName);
        break;
      case 'html':
        exportAsHTML(nodes, edges, fileName);
        break;
      case 'xml':
        exportAsXML(nodes, edges, fileName);
        break;
      case 'url':
        const urlData: CanvasData = { 
          nodes, 
          edges, 
          viewport: { x: 0, y: 0, zoom: 1 },
          grid: { visible: true, size: 20, snap: false },
          fileName: fileName,
          version: '1.0'
        };
        await exportAsShareableURL(urlData, fileName);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    console.log(`✅ ${format.toUpperCase()} export completed successfully`);
  } catch (error) {
    console.error(`❌ ${format.toUpperCase()} export failed:`, error);
    throw error;
  }
};

// ============================================================================
// IMAGE EXPORT FUNCTIONS
// ============================================================================

export const exportAsPNG = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  try {
    console.log('🖼️ Starting PNG export...');
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for render
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      logging: false
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, fileName.endsWith('.png') ? fileName : `${fileName}.png`);
        console.log('✅ PNG export completed');
      } else {
        throw new Error('Failed to create PNG blob');
      }
    }, 'image/png');
  } catch (error) {
    console.error('❌ PNG export error:', error);
    throw new Error(`Failed to export PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const exportAsJPEG = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  try {
    console.log('🖼️ Starting JPEG export...');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      logging: false
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`);
        console.log('✅ JPEG export completed');
      } else {
        throw new Error('Failed to create JPEG blob');
      }
    }, 'image/jpeg', 0.9);
  } catch (error) {
    console.error('❌ JPEG export error:', error);
    throw new Error(`Failed to export JPEG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const exportAsWebP = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  try {
    console.log('🖼️ Starting WebP export...');
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, fileName.endsWith('.webp') ? fileName : `${fileName}.webp`);
        console.log('✅ WebP export completed');
      } else {
        throw new Error('Failed to create WebP blob');
      }
    }, 'image/webp', 0.9);
  } catch (error) {
    console.error('❌ WebP export error:', error);
    throw new Error(`Failed to export WebP: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ============================================================================
// DOCUMENT EXPORT FUNCTIONS
// ============================================================================

const exportAsPDF = async (canvasElement: HTMLElement, _nodes: Node[], fileName: string, _options: any): Promise<void> => {
  try {
    console.log('📄 Starting PDF export...');
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = canvas.width / canvas.height;
    
    let imgWidth = pdfWidth - 20;
    let imgHeight = imgWidth / aspectRatio;
    
    if (imgHeight > pdfHeight - 40) {
      imgHeight = pdfHeight - 40;
      imgWidth = imgHeight * aspectRatio;
    }
    
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    
    console.log('✅ PDF export completed');
  } catch (error) {
    console.error('❌ PDF export error:', error);
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const exportAsPPTX = async (canvasElement: HTMLElement, nodes: Node[], fileName: string, _options: any): Promise<void> => {
  try {
    console.log('📊 Starting PPTX export...');
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    
    // Add title
    slide.addText(fileName.replace(/\.[^/.]+$/, ""), {
      x: 0.5, y: 0.2, w: 9, h: 0.5,
      fontSize: 18, bold: true, align: 'center'
    });
    
    // Add diagram image
    const imgData = canvas.toDataURL('image/png');
    slide.addImage({
      data: imgData,
      x: 0.5, y: 1, w: 9, h: 6,
      sizing: { type: 'contain', w: 9, h: 6 }
    });
    
    // Add metadata
    slide.addText(`Created: ${new Date().toLocaleDateString()} | Components: ${nodes.length}`, {
      x: 0.5, y: 7.2, w: 9, h: 0.3,
      fontSize: 10, color: '666666', align: 'center'
    });
    
    await pptx.writeFile({ fileName: fileName.endsWith('.pptx') ? fileName : `${fileName}.pptx` });
    console.log('✅ PPTX export completed');
  } catch (error) {
    console.error('❌ PPTX export error:', error);
    throw new Error(`Failed to export PPTX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const exportAsDOCX = async (canvasElement: HTMLElement, nodes: Node[], fileName: string, options: any): Promise<void> => {
  try {
    console.log('📝 Starting DOCX export...');
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const base64Data = imgData.split(',')[1];
    
    const children: any[] = [];
    
    // Document title
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: fileName.replace(/\.[^/.]+$/, "") || 'FlowDigm Diagram',
            bold: true,
            size: 32
          })
        ],
        spacing: { after: 400 },
        alignment: 'center'
      })
    );
    
    // Export information
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Exported on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
            size: 20,
            italics: true
          })
        ],
        spacing: { after: 600 },
        alignment: 'center'
      })
    );

    // Add diagram image
    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: base64Data,
            transformation: {
              width: 500,
              height: 400
            },
            type: 'png'
          })
        ],
        spacing: { before: 200, after: 200 },
        alignment: 'center'
      })
    );
    
    // Add shapes table if requested
    if (options.includeShapeDetails && nodes.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Diagram Components',
              bold: true,
              size: 24
            })
          ],
          spacing: { before: 400, after: 200 },
          alignment: 'center'
        })
      );

      const tableRows = [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Shape', bold: true })] })],
              width: { size: 2000, type: WidthType.DXA }
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Type', bold: true })] })],
              width: { size: 2000, type: WidthType.DXA }
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Label', bold: true })] })],
              width: { size: 4000, type: WidthType.DXA }
            })
          ]
        })
      ];

      nodes.forEach((node, index) => {
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: `Shape ${index + 1}` })] })],
                width: { size: 2000, type: WidthType.DXA }
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: node.type || 'default' })] })],
                width: { size: 2000, type: WidthType.DXA }
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: node.data?.label || 'No label' })] })],
                width: { size: 4000, type: WidthType.DXA }
              })
            ]
          })
        );
      });

      children.push(
        new Table({
          rows: tableRows,
          width: { size: 8000, type: WidthType.DXA }
        })
      );
    }
    
    const doc = new DocxDocument({
      creator: 'FlowDigm',
      title: fileName || 'FlowDigm Diagram',
      description: 'Diagram exported from FlowDigm',
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, right: 1440, bottom: 1440, left: 1440
              }
            }
          },
          children: children
        }
      ]
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName.endsWith('.docx') ? fileName : `${fileName}.docx`);
    console.log('✅ DOCX export completed');
  } catch (error) {
    console.error('❌ DOCX export error:', error);
    throw new Error(`Failed to export DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ============================================================================
// VECTOR AND DATA EXPORT FUNCTIONS
// ============================================================================

export const exportAsSVG = (nodes: Node[], edges: Edge[], fileName: string): void => {
  try {
    console.log('🎨 Starting SVG export...');
    
    const bounds = calculateCanvasBounds(nodes);
    const padding = 50;
    const svgContent = generateSVGContent(nodes, edges, bounds, padding);
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    saveAs(blob, fileName.endsWith('.svg') ? fileName : `${fileName}.svg`);
    
    console.log('✅ SVG export completed');
  } catch (error) {
    console.error('❌ SVG export error:', error);
    throw new Error(`Failed to export SVG: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const exportAsJSON = (canvasData: CanvasData, fileName: string): void => {
  try {
    console.log('💾 Starting JSON export...');
    
    const jsonString = JSON.stringify(canvasData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, fileName.endsWith('.json') ? fileName : `${fileName}.json`);
    
    console.log('✅ JSON export completed');
  } catch (error) {
    console.error('❌ JSON export error:', error);
    throw new Error(`Failed to export JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const exportAsFlowdigm = (canvasData: CanvasData, fileName: string): void => {
  try {
    console.log('💾 Starting FlowDigm export...');
    
    const flowdigmData = {
      ...canvasData,
      format: 'flowdigm',
      version: '1.0'
    };
    
    const jsonString = JSON.stringify(flowdigmData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/flowdigm' });
    saveAs(blob, fileName.endsWith('.flowdigm') ? fileName : `${fileName}.flowdigm`);
    
    console.log('✅ FlowDigm export completed');
  } catch (error) {
    console.error('❌ FlowDigm export error:', error);
    throw new Error(`Failed to export FlowDigm: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const exportAsHTML = (nodes: Node[], edges: Edge[], fileName: string): void => {
  try {
    console.log('🌐 Starting HTML export...');
    
    const htmlContent = generateHTMLContent(nodes, edges);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, fileName.endsWith('.html') ? fileName : `${fileName}.html`);
    
    console.log('✅ HTML export completed');
  } catch (error) {
    console.error('❌ HTML export error:', error);
    throw new Error(`Failed to export HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const exportAsXML = (nodes: Node[], edges: Edge[], fileName: string): void => {
  try {
    console.log('📋 Starting XML export...');
    
    const xmlContent = generateXMLContent(nodes, edges);
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    saveAs(blob, fileName.endsWith('.xml') ? fileName : `${fileName}.xml`);
    
    console.log('✅ XML export completed');
  } catch (error) {
    console.error('❌ XML export error:', error);
    throw new Error(`Failed to export XML: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

export const importFromJSON = (file: File): Promise<CanvasData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = e.target?.result as string;
        const data = JSON.parse(jsonContent);
        
        if (data.nodes && data.edges) {
          resolve(data);
        } else {
          reject(new Error('Invalid JSON format: missing nodes or edges'));
        }
      } catch (error) {
        reject(new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromFlowdigm = (file: File): Promise<CanvasData> => {
  return importFromJSON(file); // Same format as JSON
};

export const importFile = async (file: File): Promise<CanvasData> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileExtension) {
    case 'json':
      return importFromJSON(file);
    case 'flowdigm':
      return importFromFlowdigm(file);
    default:
      throw new Error(`Unsupported file format: ${fileExtension}`);
  }
};

// ============================================================================
// URL SHARING FUNCTIONS
// ============================================================================

export const exportAsShareableURL = async (canvasData: CanvasData, filename: string = 'flowdigm-diagram'): Promise<void> => {
  try {
    console.log('🔗 Creating shareable URL...');
    
    const dataString = JSON.stringify(canvasData);
    const encodedData = btoa(encodeURIComponent(dataString));
    const baseUrl = window.location.origin + window.location.pathname;
    const shareableUrl = `${baseUrl}?diagram=${encodedData}`;
    
    // Copy to clipboard
    await navigator.clipboard.writeText(shareableUrl);
    
    // Also save as text file
    const urlContent = `Shareable FlowDigm Diagram URL:\n\n${shareableUrl}`;
    const blob = new Blob([urlContent], { type: 'text/plain' });
    saveAs(blob, `${filename}-url.txt`);
    
    alert(`Shareable URL copied to clipboard and saved as text file!\n\nURL: ${shareableUrl}`);
    console.log('✅ URL export completed');
  } catch (error) {
    console.error('❌ URL export failed:', error);
    throw new Error(`URL export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const calculateCanvasBounds = (nodes: Node[]) => {
  if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 800, maxY: 600 };
  
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  nodes.forEach(node => {
    const x = node.position.x;
    const y = node.position.y;
    const width = (node.width || 150);
    const height = (node.height || 50);
    
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  
  return { minX, minY, maxX, maxY };
};

const generateSVGContent = (nodes: Node[], edges: Edge[], bounds: any, padding: number) => {
  const width = bounds.maxX - bounds.minX + (padding * 2);
  const height = bounds.maxY - bounds.minY + (padding * 2);
  
  let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .node { fill: #ffffff; stroke: #333333; stroke-width: 2; }
      .node-text { font-family: Arial, sans-serif; font-size: 14px; text-anchor: middle; dominant-baseline: middle; }
      .edge { stroke: #666666; stroke-width: 2; fill: none; }
    </style>
  </defs>
`;

  // Add edges
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const x1 = sourceNode.position.x - bounds.minX + padding + (sourceNode.width || 150) / 2;
      const y1 = sourceNode.position.y - bounds.minY + padding + (sourceNode.height || 50) / 2;
      const x2 = targetNode.position.x - bounds.minX + padding + (targetNode.width || 150) / 2;
      const y2 = targetNode.position.y - bounds.minY + padding + (targetNode.height || 50) / 2;
      
      svgContent += `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="edge" />\n`;
    }
  });

  // Add nodes
  nodes.forEach(node => {
    const x = node.position.x - bounds.minX + padding;
    const y = node.position.y - bounds.minY + padding;
    const width = node.width || 150;
    const height = node.height || 50;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const label = node.data?.label || node.type || 'Node';
    
    if (node.type === 'circle') {
      const radius = Math.min(width, height) / 2;
      svgContent += `  <circle cx="${centerX}" cy="${centerY}" r="${radius}" class="node" />\n`;
    } else {
      svgContent += `  <rect x="${x}" y="${y}" width="${width}" height="${height}" class="node" />\n`;
    }
    
    svgContent += `  <text x="${centerX}" y="${centerY}" class="node-text">${label}</text>\n`;
  });

  svgContent += '</svg>';
  return svgContent;
};

const generateHTMLContent = (nodes: Node[], edges: Edge[]) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowDigm Diagram</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .node { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
        .edge { margin: 5px 0; color: #666; }
    </style>
</head>
<body>
    <h1>FlowDigm Diagram Export</h1>
    <h2>Nodes (${nodes.length})</h2>
    ${nodes.map(node => `<div class="node"><strong>${node.data?.label || node.type}</strong> - Type: ${node.type}</div>`).join('')}
    <h2>Edges (${edges.length})</h2>
    ${edges.map(edge => `<div class="edge">${edge.source} → ${edge.target}</div>`).join('')}
</body>
</html>`;
};

const generateXMLContent = (nodes: Node[], edges: Edge[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<flowdigm-diagram>
  <metadata>
    <created>${new Date().toISOString()}</created>
    <nodeCount>${nodes.length}</nodeCount>
    <edgeCount>${edges.length}</edgeCount>
  </metadata>
  <nodes>
    ${nodes.map(node => `
    <node id="${node.id}" type="${node.type || 'default'}" x="${node.position.x}" y="${node.position.y}">
      <label>${node.data?.label || ''}</label>
    </node>`).join('')}
  </nodes>
  <edges>
    ${edges.map(edge => `
    <edge id="${edge.id}" source="${edge.source}" target="${edge.target}" type="${edge.type || 'default'}" />`).join('')}
  </edges>
</flowdigm-diagram>`;
};

export const createFileInput = (accept: string, multiple: boolean = false): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.multiple = multiple;
  input.style.display = 'none';
  return input;
};

// ============================================================================
// LEGACY SUPPORT AND GLOBAL EXPORTS
// ============================================================================

// Alternative export names for backward compatibility
export const exportAsPNGSimple = exportAsPNG;
export const exportAsPNGReactFlow = exportAsPNG;

// Export to global scope for compatibility
if (typeof window !== 'undefined') {
  (window as any).exportFile = exportFile;
  (window as any).exportCanvas = exportCanvas;
  (window as any).exportAsPNG = exportAsPNG;
  (window as any).exportAsJSON = exportAsJSON;
  (window as any).exportAsSVG = exportAsSVG;
  (window as any).importFile = importFile;
  (window as any).loadDiagramFromURL = loadDiagramFromURL;
}
