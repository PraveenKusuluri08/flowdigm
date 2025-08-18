// Enhanced File Manager for ArchPlot - Draw.io-like functionality
import type { Node, Edge } from 'reactflow';
import { saveAs } from 'file-saver';
import { ArchPlotFileFormat, ArchPlotFile } from './archplotFileFormat';

export interface FlowDigmFile {
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
  metadata: {
    author?: string;
    tags?: string[];
    category?: string;
    thumbnail?: string;
  };
}

export interface FileManagerOptions {
  autoSave?: boolean;
  autoSaveInterval?: number; // milliseconds
  maxAutoSaveFiles?: number;
  enableVersioning?: boolean;
  compression?: boolean;
}

class FileManager {
  private currentFile: FlowDigmFile | null = null;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private options: FileManagerOptions;
  private unsavedChanges = false;

  constructor(options: FileManagerOptions = {}) {
    this.options = {
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds
      maxAutoSaveFiles: 10,
      enableVersioning: true,
      compression: true,
      ...options
    };
  }

  // Create a new file
  createNewFile(name: string = 'Untitled Diagram'): FlowDigmFile {
    const now = new Date().toISOString();
    this.currentFile = {
      version: '1.0.0',
      name,
      created: now,
      modified: now,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      metadata: {
        author: 'FlowDigm User',
        tags: [],
        category: 'diagram'
      }
    };
    this.unsavedChanges = false;
    this.startAutoSave();
    return this.currentFile;
  }

  // Save current diagram in ArchPlot format
  async saveFile(nodes: Node[], edges: Edge[], viewport?: any): Promise<void> {
    if (!this.currentFile) {
      this.createNewFile();
    }

    if (this.currentFile) {
      this.currentFile.nodes = nodes;
      this.currentFile.edges = edges;
      this.currentFile.modified = new Date().toISOString();
      if (viewport) {
        this.currentFile.viewport = viewport;
      }

      // Save in ArchPlot format
      await ArchPlotFileFormat.saveArchPlotFile(
        nodes, 
        edges, 
        this.currentFile.name,
        viewport
      );
      
      this.unsavedChanges = false;
      console.log('✅ ArchPlot file saved successfully:', this.currentFile.name);
    }
  }

  // Save as with custom name in ArchPlot format
  async saveAs(nodes: Node[], edges: Edge[], name: string, viewport?: any): Promise<void> {
    try {
      // Ensure filename has .archplot extension
      let finalName = name;
      if (!name.endsWith('.archplot')) {
        finalName = name + '.archplot';
      }
      
      // Save in ArchPlot format
      await ArchPlotFileFormat.saveArchPlotFile(nodes, edges, finalName, viewport);
      
      // Update current file
      this.currentFile = ArchPlotFileFormat.createArchPlotFile(nodes, edges, finalName, viewport);
      this.unsavedChanges = false;
      
      // Add to recent files
      this.addToRecentFiles(finalName);
      
      console.log('✅ ArchPlot file saved as:', finalName);
    } catch (error) {
      console.error('❌ Failed to save ArchPlot file:', error);
      throw error;
    }
  }

  // Load file from File object
  async loadFile(file: File): Promise<FlowDigmFile> {
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'archplot') {
        // Load ArchPlot format
        const archPlotFile = await ArchPlotFileFormat.loadArchPlotFile(file);
        this.currentFile = archPlotFile;
        this.unsavedChanges = false;
        this.startAutoSave();
        
        console.log('✅ ArchPlot file loaded successfully:', archPlotFile.name);
        return archPlotFile;
      } else {
        // Fallback to JSON format for backward compatibility
        const content = await this.readFileContent(file);
        const flowDigmFile = this.parseFileContent(content);
        
        this.currentFile = flowDigmFile;
        this.unsavedChanges = false;
        this.startAutoSave();
        
        console.log('✅ JSON file loaded successfully:', flowDigmFile.name);
        return flowDigmFile;
      }
    } catch (error) {
      console.error('❌ Failed to load file:', error);
      throw new Error(`Failed to load file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Import from various formats
  async importFromFormat(file: File, format: string): Promise<FlowDigmFile> {
    try {
      let importedData: any;

      switch (format.toLowerCase()) {
        case 'archplot':
          // Import ArchPlot format
          const archPlotFile = await ArchPlotFileFormat.loadArchPlotFile(file);
          this.currentFile = archPlotFile;
          this.unsavedChanges = true;
          this.startAutoSave();
          console.log('✅ ArchPlot file imported successfully:', archPlotFile.name);
          return archPlotFile;
        case 'json':
          importedData = await this.importFromJSON(file);
          break;
        case 'xml':
        case 'drawio':
          importedData = await this.importFromDrawIO(file);
          break;
        case 'svg':
          importedData = await this.importFromSVG(file);
          break;
        case 'png':
        case 'jpg':
        case 'jpeg':
          importedData = await this.importFromImage(file);
          break;
        default:
          throw new Error(`Unsupported import format: ${format}`);
      }

      const flowDigmFile = this.convertToFlowDigmFormat(importedData, file.name);
      this.currentFile = flowDigmFile;
      this.unsavedChanges = true;
      this.startAutoSave();

      console.log('✅ File imported successfully:', flowDigmFile.name);
      return flowDigmFile;
    } catch (error) {
      console.error('❌ Import failed:', error);
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export to various formats
  async exportToFormat(nodes: Node[], edges: Edge[], format: string, options: any = {}): Promise<void> {
    try {
      const filename = this.currentFile?.name || 'diagram';
      
      switch (format.toLowerCase()) {
        case 'png':
          await this.exportToPNG(nodes, edges, filename, options);
          break;
        case 'svg':
          await this.exportToSVG(nodes, edges, filename, options);
          break;
        case 'pdf':
          await this.exportToPDF(nodes, edges, filename, options);
          break;
        case 'json':
          await this.exportToJSON(nodes, edges, filename, options);
          break;
        case 'drawio':
          await this.exportToDrawIO(nodes, edges, filename, options);
          break;
        case 'html':
          await this.exportToHTML(nodes, edges, filename, options);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      console.log('✅ File exported successfully:', format);
    } catch (error) {
      console.error('❌ Export failed:', error);
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Auto-save functionality
  private startAutoSave(): void {
    if (!this.options.autoSave || !this.currentFile) return;

    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      if (this.unsavedChanges && this.currentFile) {
        this.performAutoSave();
      }
    }, this.options.autoSaveInterval);
  }

  private async performAutoSave(): Promise<void> {
    if (!this.currentFile) return;

    try {
      const autoSaveData = {
        ...this.currentFile,
        modified: new Date().toISOString(),
        metadata: {
          ...this.currentFile.metadata,
          autoSaved: true
        }
      };

      // Save to localStorage for auto-recovery
      const key = `flowdigm_autosave_${this.currentFile.name}`;
      localStorage.setItem(key, JSON.stringify(autoSaveData));

      // Clean up old auto-saves
      this.cleanupAutoSaves();

      console.log('💾 Auto-save completed');
    } catch (error) {
      console.warn('⚠️ Auto-save failed:', error);
    }
  }

  private cleanupAutoSaves(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('flowdigm_autosave_'));
    if (keys.length > this.options.maxAutoSaveFiles) {
      keys.sort().slice(0, keys.length - this.options.maxAutoSaveFiles).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  }

  // File content handling
  private createFileBlob(file: FlowDigmFile): Blob {
    const content = JSON.stringify(file, null, 2);
    return new Blob([content], { type: 'application/json' });
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private parseFileContent(content: string): FlowDigmFile {
    try {
      const parsed = JSON.parse(content);
      
      // Validate file structure
      if (!parsed.nodes || !parsed.edges || !parsed.name) {
        throw new Error('Invalid file format');
      }

      return parsed as FlowDigmFile;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  // Import handlers
  private async importFromJSON(file: File): Promise<any> {
    const content = await this.readFileContent(file);
    return JSON.parse(content);
  }

  private async importFromDrawIO(file: File): Promise<any> {
    const content = await this.readFileContent(file);
    // Parse DrawIO XML format
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'application/xml');
    
    // Extract nodes and edges from DrawIO format
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Parse mxGraphModel structure
    const cells = doc.querySelectorAll('mxCell');
    cells.forEach(cell => {
      const id = cell.getAttribute('id');
      const value = cell.getAttribute('value');
      const style = cell.getAttribute('style');
      
      if (cell.getAttribute('vertex') === '1') {
        // This is a node
        const geometry = cell.querySelector('mxGeometry');
        if (geometry) {
          const x = parseFloat(geometry.getAttribute('x') || '0');
          const y = parseFloat(geometry.getAttribute('y') || '0');
          const width = parseFloat(geometry.getAttribute('width') || '100');
          const height = parseFloat(geometry.getAttribute('height') || '80');
          
          nodes.push({
            id: id || `node_${Date.now()}`,
            type: 'rectangle',
            position: { x, y },
            data: { 
              label: value || 'Node',
              width,
              height
            }
          });
        }
      } else if (cell.getAttribute('edge') === '1') {
        // This is an edge
        const source = cell.getAttribute('source');
        const target = cell.getAttribute('target');
        
        if (source && target) {
          edges.push({
            id: id || `edge_${Date.now()}`,
            source,
            target,
            type: 'smoothstep'
          });
        }
      }
    });
    
    return { nodes, edges };
  }

  private async importFromSVG(file: File): Promise<any> {
    const content = await this.readFileContent(file);
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'image/svg+xml');
    
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Parse SVG elements
    const rects = doc.querySelectorAll('rect');
    const circles = doc.querySelectorAll('circle');
    const lines = doc.querySelectorAll('line');
    
    rects.forEach((rect, index) => {
      const x = parseFloat(rect.getAttribute('x') || '0');
      const y = parseFloat(rect.getAttribute('y') || '0');
      const width = parseFloat(rect.getAttribute('width') || '100');
      const height = parseFloat(rect.getAttribute('height') || '80');
      
      nodes.push({
        id: `node_${index}`,
        type: 'rectangle',
        position: { x, y },
        data: { 
          label: `Node ${index + 1}`,
          width,
          height
        }
      });
    });
    
    circles.forEach((circle, index) => {
      const cx = parseFloat(circle.getAttribute('cx') || '0');
      const cy = parseFloat(circle.getAttribute('cy') || '0');
      const r = parseFloat(circle.getAttribute('r') || '40');
      
      nodes.push({
        id: `circle_${index}`,
        type: 'circle',
        position: { x: cx - r, y: cy - r },
        data: { 
          label: `Circle ${index + 1}`,
          width: r * 2,
          height: r * 2
        }
      });
    });
    
    return { nodes, edges };
  }

  private async importFromImage(file: File): Promise<any> {
    // For image imports, we'll create a placeholder node with the image
    const imageUrl = URL.createObjectURL(file);
    
    const nodes: Node[] = [{
      id: 'imported_image',
      type: 'importedImage',
      position: { x: 100, y: 100 },
      data: { 
        label: file.name,
        imageUrl,
        width: 200,
        height: 150
      }
    }];
    
    return { nodes, edges: [] };
  }

  // Export handlers
  private async exportToPNG(nodes: Node[], edges: Edge[], filename: string, options: any): Promise<void> {
    // Use the existing export utilities
    const { exportAsPNGSimple } = await import('./importExportUtils');
    await exportAsPNGSimple(`${filename}.png`);
  }

  private async exportToSVG(nodes: Node[], edges: Edge[], filename: string, options: any): Promise<void> {
    const { exportAsSVG } = await import('./importExportUtils');
    exportAsSVG(nodes, edges, filename);
  }

  private async exportToPDF(nodes: Node[], edges: Edge[], filename: string, options: any): Promise<void> {
    const { exportFile } = await import('./importExportUtils');
    await exportFile('pdf', filename, options);
  }

  private async exportToJSON(nodes: Node[], edges: Edge[], filename: string, options: any): Promise<void> {
    const { exportAsJSON } = await import('./importExportUtils');
    const canvasData = {
      nodes,
      edges,
      viewport: { x: 0, y: 0, zoom: 1 },
      fileName: filename,
      version: '1.0'
    };
    exportAsJSON(canvasData, filename);
  }

  private async exportToDrawIO(nodes: Node[], edges: Edge[], filename: string, options: any): Promise<void> {
    const { exportFile } = await import('./importExportUtils');
    await exportFile('xml', filename, options);
  }

  private async exportToHTML(nodes: Node[], edges: Edge[], filename: string, options: any): Promise<void> {
    const { exportFile } = await import('./importExportUtils');
    await exportFile('html', filename, options);
  }

  // Utility methods
  private convertToFlowDigmFormat(data: any, filename: string): FlowDigmFile {
    return {
      version: '1.0.0',
      name: filename.replace(/\.[^/.]+$/, ''), // Remove extension
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      nodes: data.nodes || [],
      edges: data.edges || [],
      viewport: data.viewport || { x: 0, y: 0, zoom: 1 },
      metadata: {
        author: 'FlowDigm User',
        tags: [],
        category: 'diagram',
        imported: true
      }
    };
  }

  // Public getters
  getCurrentFile(): FlowDigmFile | null {
    return this.currentFile;
  }

  hasUnsavedChanges(): boolean {
    return this.unsavedChanges;
  }

  markAsChanged(): void {
    this.unsavedChanges = true;
  }

  // Add file to recent files
  private addToRecentFiles(filename: string): void {
    try {
      const recent = localStorage.getItem('archplot_recent_files');
      const recentFiles = recent ? JSON.parse(recent) : [];
      const updatedFiles = [filename, ...recentFiles.filter((f: string) => f !== filename)].slice(0, 10);
      localStorage.setItem('archplot_recent_files', JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Failed to save recent files:', error);
    }
  }

  // Cleanup
  destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
  }
}

// Create singleton instance
export const fileManager = new FileManager();

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).fileManager = fileManager;
}
