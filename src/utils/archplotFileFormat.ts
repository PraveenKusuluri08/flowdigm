// Native ArchPlot File Format - Draw.io-like implementation
import type { Node, Edge } from 'reactflow';
import { saveAs } from 'file-saver';

export interface ArchPlotFile {
  version: string;
  name: string;
  description?: string;
  created: string;
  modified: string;
  nodes: Node[];
  edges: Edge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  canvas: {
    width: number;
    height: number;
    grid: {
      visible: boolean;
      size: number;
      snap: boolean;
    };
    background: {
      color: string;
      pattern: string;
    };
  };
  metadata: {
    author?: string;
    tags?: string[];
    category?: string;
    thumbnail?: string;
    version: string;
    application: string;
  };
}

export class ArchPlotFileFormat {
  private static readonly VERSION = '1.0.0';
  private static readonly APPLICATION = 'ArchPlot';

  // Create ArchPlot XML format (similar to draw.io)
  static createArchPlotXML(file: ArchPlotFile): string {
    const timestamp = new Date().toISOString();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<archplot version="${this.VERSION}" created="${file.created}" modified="${file.modified}" application="${this.APPLICATION}">
  <metadata>
    <name>${this.escapeXML(file.name)}</name>
    ${file.description ? `<description>${this.escapeXML(file.description)}</description>` : ''}
    <author>${this.escapeXML(file.metadata.author || 'ArchPlot User')}</author>
    <tags>${file.metadata.tags?.join(',') || ''}</tags>
    <category>${this.escapeXML(file.metadata.category || 'diagram')}</category>
  </metadata>
  
  <canvas width="${file.canvas.width}" height="${file.canvas.height}">
    <grid visible="${file.canvas.grid.visible}" size="${file.canvas.grid.size}" snap="${file.canvas.grid.snap}"/>
    <background color="${file.canvas.background.color}" pattern="${file.canvas.background.pattern}"/>
  </canvas>
  
  <viewport x="${file.viewport.x}" y="${file.viewport.y}" zoom="${file.viewport.zoom}"/>
  
  <elements>`;

    // Add nodes
    file.nodes.forEach(node => {
      xml += `
    <node id="${this.escapeXML(node.id)}" type="${this.escapeXML(node.type)}" x="${node.position.x}" y="${node.position.y}">
      <data>${this.escapeXML(JSON.stringify(node.data))}</data>
      ${node.style ? `<style>${this.escapeXML(JSON.stringify(node.style))}</style>` : ''}
    </node>`;
    });

    // Add edges
    file.edges.forEach(edge => {
      xml += `
    <edge id="${this.escapeXML(edge.id)}" source="${this.escapeXML(edge.source)}" target="${this.escapeXML(edge.target)}" type="${this.escapeXML(edge.type || 'default')}">
      ${edge.data ? `<data>${this.escapeXML(JSON.stringify(edge.data))}</data>` : ''}
      ${edge.style ? `<style>${this.escapeXML(JSON.stringify(edge.style))}</style>` : ''}
      ${edge.animated ? `<animated>true</animated>` : ''}
    </edge>`;
    });

    xml += `
  </elements>
</archplot>`;

    return xml;
  }

  // Parse ArchPlot XML format
  static parseArchPlotXML(xmlContent: string): ArchPlotFile {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'application/xml');
    
    if (doc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid ArchPlot XML format');
    }

    const root = doc.documentElement;
    const version = root.getAttribute('version') || this.VERSION;
    const created = root.getAttribute('created') || new Date().toISOString();
    const modified = root.getAttribute('modified') || new Date().toISOString();

    // Parse metadata
    const metadataElement = doc.querySelector('metadata');
    const name = this.getTextContent(metadataElement, 'name') || 'Untitled Diagram';
    const description = this.getTextContent(metadataElement, 'description');
    const author = this.getTextContent(metadataElement, 'author') || 'ArchPlot User';
    const tags = this.getTextContent(metadataElement, 'tags')?.split(',').filter(t => t.trim()) || [];
    const category = this.getTextContent(metadataElement, 'category') || 'diagram';

    // Parse canvas settings
    const canvasElement = doc.querySelector('canvas');
    const canvasWidth = parseInt(canvasElement?.getAttribute('width') || '1200');
    const canvasHeight = parseInt(canvasElement?.getAttribute('height') || '800');
    
    const gridElement = canvasElement?.querySelector('grid');
    const gridVisible = gridElement?.getAttribute('visible') === 'true';
    const gridSize = parseInt(gridElement?.getAttribute('size') || '20');
    const gridSnap = gridElement?.getAttribute('snap') === 'true';
    
    const backgroundElement = canvasElement?.querySelector('background');
    const bgColor = backgroundElement?.getAttribute('color') || '#ffffff';
    const bgPattern = backgroundElement?.getAttribute('pattern') || 'dots';

    // Parse viewport
    const viewportElement = doc.querySelector('viewport');
    const viewportX = parseFloat(viewportElement?.getAttribute('x') || '0');
    const viewportY = parseFloat(viewportElement?.getAttribute('y') || '0');
    const viewportZoom = parseFloat(viewportElement?.getAttribute('zoom') || '1');

    // Parse nodes
    const nodes: Node[] = [];
    const nodeElements = doc.querySelectorAll('elements node');
    nodeElements.forEach(nodeElement => {
      const id = nodeElement.getAttribute('id') || '';
      const type = nodeElement.getAttribute('type') || 'rectangle';
      const x = parseFloat(nodeElement.getAttribute('x') || '0');
      const y = parseFloat(nodeElement.getAttribute('y') || '0');
      
      const dataElement = nodeElement.querySelector('data');
      const data = dataElement ? JSON.parse(this.unescapeXML(dataElement.textContent || '{}')) : {};
      
      const styleElement = nodeElement.querySelector('style');
      const style = styleElement ? JSON.parse(this.unescapeXML(styleElement.textContent || '{}')) : undefined;

      nodes.push({
        id,
        type,
        position: { x, y },
        data,
        style
      });
    });

    // Parse edges
    const edges: Edge[] = [];
    const edgeElements = doc.querySelectorAll('elements edge');
    edgeElements.forEach(edgeElement => {
      const id = edgeElement.getAttribute('id') || '';
      const source = edgeElement.getAttribute('source') || '';
      const target = edgeElement.getAttribute('target') || '';
      const type = edgeElement.getAttribute('type') || 'default';
      
      const dataElement = edgeElement.querySelector('data');
      const data = dataElement ? JSON.parse(this.unescapeXML(dataElement.textContent || '{}')) : {};
      
      const styleElement = edgeElement.querySelector('style');
      const style = styleElement ? JSON.parse(this.unescapeXML(styleElement.textContent || '{}')) : undefined;
      
      const animatedElement = edgeElement.querySelector('animated');
      const animated = animatedElement?.textContent === 'true';

      edges.push({
        id,
        source,
        target,
        type,
        data,
        style,
        animated
      });
    });

    return {
      version,
      name,
      description,
      created,
      modified: new Date().toISOString(),
      nodes,
      edges,
      viewport: {
        x: viewportX,
        y: viewportY,
        zoom: viewportZoom
      },
      canvas: {
        width: canvasWidth,
        height: canvasHeight,
        grid: {
          visible: gridVisible,
          size: gridSize,
          snap: gridSnap
        },
        background: {
          color: bgColor,
          pattern: bgPattern
        }
      },
      metadata: {
        author,
        tags,
        category,
        version: this.VERSION,
        application: this.APPLICATION
      }
    };
  }

  // Create ArchPlot file from canvas data
  static createArchPlotFile(
    nodes: Node[], 
    edges: Edge[], 
    name: string, 
    viewport?: any,
    canvasSettings?: any
  ): ArchPlotFile {
    const now = new Date().toISOString();
    
    return {
      version: this.VERSION,
      name,
      created: now,
      modified: now,
      nodes,
      edges,
      viewport: viewport || { x: 0, y: 0, zoom: 1 },
      canvas: canvasSettings || {
        width: 1200,
        height: 800,
        grid: {
          visible: true,
          size: 20,
          snap: false
        },
        background: {
          color: '#ffffff',
          pattern: 'dots'
        }
      },
      metadata: {
        author: 'ArchPlot User',
        tags: [],
        category: 'diagram',
        version: this.VERSION,
        application: this.APPLICATION
      }
    };
  }

  // Save ArchPlot file
  static async saveArchPlotFile(
    nodes: Node[], 
    edges: Edge[], 
    filename: string, 
    viewport?: any,
    canvasSettings?: any
  ): Promise<void> {
    try {
      const archPlotFile = this.createArchPlotFile(nodes, edges, filename, viewport, canvasSettings);
      const xmlContent = this.createArchPlotXML(archPlotFile);
      
      // Create blob with proper MIME type
      const blob = new Blob([xmlContent], { 
        type: 'application/xml;charset=utf-8' 
      });
      
      // Save with .archplot extension
      const finalFilename = filename.endsWith('.archplot') ? filename : `${filename}.archplot`;
      saveAs(blob, finalFilename);
      
      console.log('✅ ArchPlot file saved successfully:', finalFilename);
    } catch (error) {
      console.error('❌ Failed to save ArchPlot file:', error);
      throw new Error(`Failed to save ArchPlot file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Load ArchPlot file
  static async loadArchPlotFile(file: File): Promise<ArchPlotFile> {
    try {
      const content = await this.readFileContent(file);
      const archPlotFile = this.parseArchPlotXML(content);
      
      console.log('✅ ArchPlot file loaded successfully:', archPlotFile.name);
      return archPlotFile;
    } catch (error) {
      console.error('❌ Failed to load ArchPlot file:', error);
      throw new Error(`Failed to load ArchPlot file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Convert from other formats to ArchPlot format
  static convertFromOtherFormat(data: any, filename: string): ArchPlotFile {
    // Handle JSON format
    if (data.nodes && data.edges) {
      return this.createArchPlotFile(
        data.nodes,
        data.edges,
        filename,
        data.viewport,
        data.canvas
      );
    }
    
    // Handle DrawIO format
    if (data.mxGraphModel) {
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      
      // Convert DrawIO cells to ArchPlot format
      const cells = data.mxGraphModel.root?.mxCell || [];
      cells.forEach((cell: any) => {
        if (cell.$.vertex === '1') {
          // This is a node
          const geometry = cell.mxGeometry?.[0]?.$;
          if (geometry) {
            nodes.push({
              id: cell.$.id,
              type: 'rectangle',
              position: {
                x: parseFloat(geometry.x || '0'),
                y: parseFloat(geometry.y || '0')
              },
              data: {
                label: cell.$.value || 'Node',
                width: parseFloat(geometry.width || '100'),
                height: parseFloat(geometry.height || '80')
              }
            });
          }
        } else if (cell.$.edge === '1') {
          // This is an edge
          edges.push({
            id: cell.$.id,
            source: cell.$.source,
            target: cell.$.target,
            type: 'smoothstep'
          });
        }
      });
      
      return this.createArchPlotFile(nodes, edges, filename);
    }
    
    throw new Error('Unsupported format for conversion');
  }

  // Utility methods
  private static escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private static unescapeXML(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  private static getTextContent(parent: Element | null, tagName: string): string | null {
    const element = parent?.querySelector(tagName);
    return element?.textContent || null;
  }

  private static async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Validate ArchPlot file
  static validateArchPlotFile(file: ArchPlotFile): boolean {
    return !!(
      file.version &&
      file.name &&
      file.nodes &&
      file.edges &&
      file.viewport &&
      file.canvas &&
      file.metadata
    );
  }

  // Get file extension
  static getFileExtension(): string {
    return '.archplot';
  }

  // Get MIME type
  static getMimeType(): string {
    return 'application/xml';
  }
}

// Export singleton instance
export const archPlotFileFormat = new ArchPlotFileFormat();

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).archPlotFileFormat = archPlotFileFormat;
}
