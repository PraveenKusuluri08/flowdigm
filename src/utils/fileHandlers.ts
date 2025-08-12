// File handlers for bidirectional integration
import type { DiagramData } from './bidirectionalIntegration';
import { convertFromPlatformFormat, convertToPlatformFormat } from './bidirectionalIntegration';

export interface FileHandler {
  extension: string;
  mimeType: string;
  platform: string;
  canImport: boolean;
  canExport: boolean;
  import: (file: File) => Promise<DiagramData>;
  export: (diagram: DiagramData) => Promise<Blob>;
}

// File parsing utilities
export async function parseXMLFile(file: File): Promise<Document> {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  
  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Invalid XML file');
  }
  
  return doc;
}

export async function parseJSONFile(file: File): Promise<any> {
  const text = await file.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON file');
  }
}

// Visio file handler
export const visioFileHandler: FileHandler = {
  extension: 'vsdx',
  mimeType: 'application/vnd.ms-visio.drawing.main+xml',
  platform: 'visio',
  canImport: true,
  canExport: true,
  
  async import(file: File): Promise<DiagramData> {
    // For VSDX files, we need to extract the XML from the ZIP
    const JSZip = await import('jszip');
    const zip = new JSZip.default();
    const content = await zip.loadAsync(file);
    
    // Extract the main document XML
    const pageXmlFile = content.file('visio/pages/page1.xml');
    if (!pageXmlFile) {
      throw new Error('Invalid Visio file format');
    }
    
    const pageXml = await pageXmlFile.async('string');
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageXml, 'application/xml');
    
    // Convert XML structure to our format
    const visioData = xmlToObject(doc);
    return convertFromPlatformFormat(visioData, 'visio');
  },
  
  async export(diagram: DiagramData): Promise<Blob> {
    const visioData = convertToPlatformFormat(diagram, 'visio');
    const xmlString = objectToXml(visioData);
    
    // Create a minimal VSDX structure
    const JSZip = await import('jszip');
    const zip = new JSZip.default();
    
    // Add required files for VSDX
    zip.file('[Content_Types].xml', createContentTypesXml());
    zip.file('_rels/.rels', createRelsXml());
    zip.file('visio/pages/page1.xml', xmlString);
    zip.file('visio/pages/_rels/page1.xml.rels', createPageRelsXml());
    
    return await zip.generateAsync({ type: 'blob' });
  }
};

// Lucidchart file handler
export const lucidchartFileHandler: FileHandler = {
  extension: 'json',
  mimeType: 'application/json',
  platform: 'lucidchart',
  canImport: true,
  canExport: true,
  
  async import(file: File): Promise<DiagramData> {
    const jsonData = await parseJSONFile(file);
    return convertFromPlatformFormat(jsonData, 'lucidchart');
  },
  
  async export(diagram: DiagramData): Promise<Blob> {
    const lucidchartData = convertToPlatformFormat(diagram, 'lucidchart');
    const jsonString = JSON.stringify(lucidchartData, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }
};

// Draw.io file handler
export const drawioFileHandler: FileHandler = {
  extension: 'drawio',
  mimeType: 'application/xml',
  platform: 'drawio',
  canImport: true,
  canExport: true,
  
  async import(file: File): Promise<DiagramData> {
    const doc = await parseXMLFile(file);
    const drawioData = xmlToObject(doc);
    return convertFromPlatformFormat(drawioData, 'drawio');
  },
  
  async export(diagram: DiagramData): Promise<Blob> {
    const drawioData = convertToPlatformFormat(diagram, 'drawio');
    const xmlString = objectToXml(drawioData);
    return new Blob([xmlString], { type: 'application/xml' });
  }
};

// Generic XML file handler for various formats
export const xmlFileHandler: FileHandler = {
  extension: 'xml',
  mimeType: 'application/xml',
  platform: 'generic',
  canImport: true,
  canExport: true,
  
  async import(file: File): Promise<DiagramData> {
    const doc = await parseXMLFile(file);
    
    // Try to detect the platform based on XML structure
    const rootElement = doc.documentElement;
    
    if (rootElement.tagName === 'mxfile' || rootElement.getAttribute('xmlns')?.includes('drawio')) {
      return drawioFileHandler.import(file);
    } else if (rootElement.getAttribute('xmlns')?.includes('visio')) {
      return visioFileHandler.import(file);
    } else {
      // Fallback to generic XML parsing
      const xmlData = xmlToObject(doc);
      return convertFromPlatformFormat(xmlData, 'drawio'); // Default to draw.io format
    }
  },
  
  async export(diagram: DiagramData): Promise<Blob> {
    // Export as Draw.io XML by default
    return drawioFileHandler.export(diagram);
  }
};

// File handler registry
export const FILE_HANDLERS: Record<string, FileHandler> = {
  'vsdx': visioFileHandler,
  'vsd': visioFileHandler,
  'json': lucidchartFileHandler,
  'drawio': drawioFileHandler,
  'xml': xmlFileHandler
};

// Main file import function
export async function importDiagramFile(file: File): Promise<DiagramData> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension) {
    throw new Error('File has no extension');
  }
  
  const handler = FILE_HANDLERS[extension];
  if (!handler || !handler.canImport) {
    throw new Error(`Unsupported file type: ${extension}`);
  }
  
  try {
    return await handler.import(file);
  } catch (error) {
    throw new Error(`Failed to import ${extension} file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main file export function
export async function exportDiagramFile(diagram: DiagramData, format: string): Promise<Blob> {
  const handler = FILE_HANDLERS[format];
  if (!handler || !handler.canExport) {
    throw new Error(`Unsupported export format: ${format}`);
  }
  
  try {
    return await handler.export(diagram);
  } catch (error) {
    throw new Error(`Failed to export ${format} file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility functions for XML processing
function xmlToObject(xml: Document | Element): any {
  let obj: any = {};
  
  if (xml.nodeType === 1) { // Element node
    const element = xml as Element;
    
    // Handle attributes
    if (element.attributes.length > 0) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        obj[`@_${attr.nodeName}`] = attr.nodeValue;
      }
    }
    
    // Handle child nodes
    if (element.hasChildNodes()) {
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i];
        const nodeName = child.nodeName;
        
        if (child.nodeType === 1) { // Element node
          if (obj[nodeName]) {
            if (!Array.isArray(obj[nodeName])) {
              obj[nodeName] = [obj[nodeName]];
            }
            obj[nodeName].push(xmlToObject(child as Element));
          } else {
            obj[nodeName] = xmlToObject(child as Element);
          }
        } else if (child.nodeType === 3 && child.nodeValue?.trim()) { // Text node
          obj['#text'] = child.nodeValue;
        }
      }
    }
  }
  
  return obj;
}

function objectToXml(obj: any, rootName: string = 'root'): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += objectToXmlElement(obj, rootName);
  return xml;
}

function objectToXmlElement(obj: any, name: string): string {
  if (obj === null || obj === undefined) {
    return `<${name}/>`;
  }
  
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return `<${name}>${obj}</${name}>`;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => objectToXmlElement(item, name)).join('');
  }
  
  let attributes = '';
  let content = '';
  
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('@_')) {
      attributes += ` ${key.substring(2)}="${value}"`;
    } else if (key === '#text') {
      content += value;
    } else if (Array.isArray(value)) {
      content += value.map(item => objectToXmlElement(item, key)).join('');
    } else {
      content += objectToXmlElement(value, key);
    }
  }
  
  if (content === '') {
    return `<${name}${attributes}/>`;
  } else {
    return `<${name}${attributes}>${content}</${name}>`;
  }
}

// VSDX file structure helpers
function createContentTypesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/visio/pages/page1.xml" ContentType="application/vnd.ms-visio.page+xml"/>
</Types>`;
}

function createRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.microsoft.com/visio/2010/relationships/document" Target="visio/document.xml"/>
</Relationships>`;
}

function createPageRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
}
