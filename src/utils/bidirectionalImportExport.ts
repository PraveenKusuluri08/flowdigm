// Bidirectional Import/Export System for Multiple Diagram Formats
import { Node, Edge } from 'reactflow';

export interface ImportedDiagram {
  nodes: Node[];
  edges: Edge[];
  metadata?: {
    source: string;
    version?: string;
    title?: string;
    author?: string;
    created?: string;
  };
}

export interface ExportOptions {
  format: 'svg' | 'png' | 'pdf' | 'drawio' | 'vsdx' | 'json' | 'xml';
  quality?: number;
  scale?: number;
  backgroundColor?: string;
  includeMetadata?: boolean;
}

// Microsoft Visio (.vsdx) Import/Export
export class VisioHandler {
  static async importFromVsdx(file: File): Promise<ImportedDiagram> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await import('jszip').then(JSZip => new JSZip());
      const zipContent = await zip.loadAsync(arrayBuffer);
      
      // Extract Visio XML content
      const visioXml = await zipContent.file('visio/document.xml')?.async('string');
      if (!visioXml) {
        throw new Error('Invalid Visio file format');
      }

      // Parse Visio XML and convert to ReactFlow format
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(visioXml, 'text/xml');
      
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      
      // Extract shapes from Visio
      const shapes = xmlDoc.querySelectorAll('v:shape');
      shapes.forEach((shape, index) => {
        const id = shape.getAttribute('id') || `visio-shape-${index}`;
        const style = shape.getAttribute('style') || '';
        
        // Parse position from style
        const positionMatch = style.match(/left:(\d+)px;top:(\d+)px/);
        const widthMatch = style.match(/width:(\d+)px/);
        const heightMatch = style.match(/height:(\d+)px/);
        
        const position = {
          x: positionMatch ? parseInt(positionMatch[1]) : 0,
          y: positionMatch ? parseInt(positionMatch[2]) : 0
        };
        
        const node: Node = {
          id,
          type: 'default',
          position,
          data: {
            label: shape.getAttribute('alt') || `Shape ${index}`,
            width: widthMatch ? parseInt(widthMatch[1]) : 100,
            height: heightMatch ? parseInt(heightMatch[1]) : 100
          }
        };
        
        nodes.push(node);
      });

      return {
        nodes,
        edges,
        metadata: {
          source: 'visio',
          version: '1.0',
          title: file.name.replace('.vsdx', '')
        }
      };
    } catch (error) {
      console.error('Error importing Visio file:', error);
      throw new Error('Failed to import Visio file');
    }
  }

  static async exportToVsdx(nodes: Node[], edges: Edge[], options: ExportOptions): Promise<Blob> {
    // Implementation for exporting to Visio format
    // This would require a more complex implementation with proper Visio XML structure
    throw new Error('Visio export not yet implemented');
  }
}

// Draw.io (.drawio, .xml) Import/Export
export class DrawIOHandler {
  static async importFromDrawIO(file: File): Promise<ImportedDiagram> {
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      
      // Parse Draw.io XML structure
      const cells = xmlDoc.querySelectorAll('mxCell');
      cells.forEach((cell, index) => {
        const id = cell.getAttribute('id') || `drawio-cell-${index}`;
        const value = cell.getAttribute('value') || '';
        const style = cell.getAttribute('style') || '';
        const geometry = cell.querySelector('mxGeometry');
        
        if (geometry) {
          const x = parseFloat(geometry.getAttribute('x') || '0');
          const y = parseFloat(geometry.getAttribute('y') || '0');
          const width = parseFloat(geometry.getAttribute('width') || '100');
          const height = parseFloat(geometry.getAttribute('height') || '100');
          
          const node: Node = {
            id,
            type: 'default',
            position: { x, y },
            data: {
              label: value,
              width,
              height
            }
          };
          
          nodes.push(node);
        }
      });

      return {
        nodes,
        edges,
        metadata: {
          source: 'drawio',
          version: '1.0',
          title: file.name.replace(/\.(drawio|xml)$/, '')
        }
      };
    } catch (error) {
      console.error('Error importing Draw.io file:', error);
      throw new Error('Failed to import Draw.io file');
    }
  }

  static async exportToDrawIO(nodes: Node[], edges: Edge[], options: ExportOptions): Promise<Blob> {
    try {
      // Create Draw.io XML structure
      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="2024-01-01T00:00:00.000Z" agent="5.0" etag="xxx" version="22.1.16" type="device">
  <diagram name="Page-1" id="page-1">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        ${nodes.map(node => `
        <mxCell id="${node.id}" value="${node.data.label || ''}" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="${node.position.x}" y="${node.position.y}" width="${node.data.width || 100}" height="${node.data.height || 100}" as="geometry" />
        </mxCell>`).join('')}
        ${edges.map(edge => `
        <mxCell id="${edge.id}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="${edge.source}" target="${edge.target}">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>`).join('')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

      return new Blob([xmlContent], { type: 'application/xml' });
    } catch (error) {
      console.error('Error exporting to Draw.io format:', error);
      throw new Error('Failed to export to Draw.io format');
    }
  }
}

// Lucidchart Import/Export
export class LucidchartHandler {
  static async importFromLucidchart(file: File): Promise<ImportedDiagram> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      
      // Parse Lucidchart JSON structure
      if (data.document && data.document.objects) {
        data.document.objects.forEach((obj: any, index: number) => {
          if (obj.type === 'shape') {
            const node: Node = {
              id: obj.id || `lucid-shape-${index}`,
              type: 'default',
              position: {
                x: obj.x || 0,
                y: obj.y || 0
              },
              data: {
                label: obj.text || `Shape ${index}`,
                width: obj.width || 100,
                height: obj.height || 100
              }
            };
            nodes.push(node);
          }
        });
      }

      return {
        nodes,
        edges,
        metadata: {
          source: 'lucidchart',
          version: '1.0',
          title: file.name.replace(/\.(lucidchart|json)$/, '')
        }
      };
    } catch (error) {
      console.error('Error importing Lucidchart file:', error);
      throw new Error('Failed to import Lucidchart file');
    }
  }
}

// Universal Import Handler
export class UniversalImportHandler {
  static async importFile(file: File): Promise<ImportedDiagram> {
    const extension = file.name.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'vsdx':
        return await VisioHandler.importFromVsdx(file);
      
      case 'drawio':
      case 'xml':
        return await DrawIOHandler.importFromDrawIO(file);
      
      case 'json':
        // Try to detect if it's Lucidchart or generic JSON
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          
          if (data.document && data.document.objects) {
            return await LucidchartHandler.importFromLucidchart(file);
          } else {
            // Generic JSON format
            return {
              nodes: data.nodes || [],
              edges: data.edges || [],
              metadata: {
                source: 'json',
                title: file.name.replace('.json', '')
              }
            };
          }
        } catch (error) {
          throw new Error('Invalid JSON format');
        }
      
      case 'svg':
        return await this.importFromSVG(file);
      
      case 'png':
      case 'jpg':
      case 'jpeg':
        return await this.importFromImage(file);
      
      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }
  }

  static async importFromSVG(file: File): Promise<ImportedDiagram> {
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(text, 'image/svg+xml');
      
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      
      // Extract shapes from SVG
      const shapes = svgDoc.querySelectorAll('rect, circle, ellipse, polygon, path');
      shapes.forEach((shape, index) => {
        const id = shape.getAttribute('id') || `svg-shape-${index}`;
        const x = parseFloat(shape.getAttribute('x') || '0');
        const y = parseFloat(shape.getAttribute('y') || '0');
        const width = parseFloat(shape.getAttribute('width') || '100');
        const height = parseFloat(shape.getAttribute('height') || '100');
        
        const node: Node = {
          id,
          type: 'default',
          position: { x, y },
          data: {
            label: shape.getAttribute('title') || `SVG Shape ${index}`,
            width,
            height
          }
        };
        
        nodes.push(node);
      });

      return {
        nodes,
        edges,
        metadata: {
          source: 'svg',
          title: file.name.replace('.svg', '')
        }
      };
    } catch (error) {
      console.error('Error importing SVG file:', error);
      throw new Error('Failed to import SVG file');
    }
  }

  static async importFromImage(file: File): Promise<ImportedDiagram> {
    try {
      // For images, we create a single node containing the image
      const imageUrl = URL.createObjectURL(file);
      
      const node: Node = {
        id: 'imported-image',
        type: 'imageNode',
        position: { x: 0, y: 0 },
        data: {
          label: file.name,
          imageUrl,
          width: 300,
          height: 200
        }
      };

      return {
        nodes: [node],
        edges: [],
        metadata: {
          source: 'image',
          title: file.name
        }
      };
    } catch (error) {
      console.error('Error importing image file:', error);
      throw new Error('Failed to import image file');
    }
  }
}

// Universal Export Handler
export class UniversalExportHandler {
  static async exportDiagram(
    nodes: Node[], 
    edges: Edge[], 
    options: ExportOptions
  ): Promise<Blob> {
    switch (options.format) {
      case 'drawio':
        return await DrawIOHandler.exportToDrawIO(nodes, edges, options);
      
      case 'json':
        const jsonData = {
          nodes,
          edges,
          metadata: {
            exportedAt: new Date().toISOString(),
            source: 'flowdigm'
          }
        };
        return new Blob([JSON.stringify(jsonData, null, 2)], { 
          type: 'application/json' 
        });
      
      case 'svg':
        return await this.exportToSVG(nodes, edges, options);
      
      case 'png':
        return await this.exportToPNG(nodes, edges, options);
      
      case 'pdf':
        return await this.exportToPDF(nodes, edges, options);
      
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  static async exportToSVG(nodes: Node[], edges: Edge[], options: ExportOptions): Promise<Blob> {
    // Implementation for SVG export
    const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      ${nodes.map(node => `
        <rect x="${node.position.x}" y="${node.position.y}" 
              width="${node.data.width || 100}" height="${node.data.height || 100}" 
              fill="${options.backgroundColor || '#ffffff'}" stroke="#000000" stroke-width="2"/>
        <text x="${node.position.x + 50}" y="${node.position.y + 50}" text-anchor="middle">${node.data.label || ''}</text>
      `).join('')}
    </svg>`;
    
    return new Blob([svgContent], { type: 'image/svg+xml' });
  }

  static async exportToPNG(nodes: Node[], edges: Edge[], options: ExportOptions): Promise<Blob> {
    // Implementation for PNG export using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Fill background
    ctx.fillStyle = options.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw nodes
    nodes.forEach(node => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.fillRect(node.position.x, node.position.y, node.data.width || 100, node.data.height || 100);
      ctx.strokeRect(node.position.x, node.position.y, node.data.width || 100, node.data.height || 100);
      
      // Draw text
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.data.label || '', node.position.x + 50, node.position.y + 50);
    });
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png', options.quality ? options.quality / 100 : 1);
    });
  }

  static async exportToPDF(nodes: Node[], edges: Edge[], options: ExportOptions): Promise<Blob> {
    // Implementation for PDF export
    // This would require a PDF library like jsPDF
    throw new Error('PDF export not yet implemented');
  }
}

// Utility functions
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getSupportedFormats = () => ({
  import: ['.vsdx', '.drawio', '.xml', '.json', '.svg', '.png', '.jpg', '.jpeg'],
  export: ['svg', 'png', 'pdf', 'drawio', 'json']
});
