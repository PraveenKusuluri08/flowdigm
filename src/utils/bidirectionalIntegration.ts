// Bidirectional integration utilities for Visio, Lucidchart, and Draw.io
import type { ValidationResult } from './shapeValidation';
import { validateShapeLabel } from './shapeValidation';
import { findShapeById, getDefaultFill, getDefaultStroke } from '../components/CanvasEditor/shapeDefinition';

export interface IntegrationPlatform {
  id: string;
  name: string;
  apiEndpoint?: string;
  supportedFormats: string[];
  exportFormat: string;
  importFormat: string[];
}

export interface DiagramData {
  id: string;
  name: string;
  platform: string;
  lastModified: Date;
  version: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  metadata: DiagramMetadata;
}

export interface DiagramNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    shapeId: string;
    properties: Record<string, any>;
    style?: Record<string, any>;
  };
  platformSpecific?: Record<string, any>;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: {
    label?: string;
    style?: Record<string, any>;
  };
  platformSpecific?: Record<string, any>;
}

export interface DiagramMetadata {
  title: string;
  description?: string;
  author?: string;
  tags: string[];
  version: string;
  platform: string;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncTime?: Date;
}

export interface SyncResult {
  success: boolean;
  changes: SyncChange[];
  conflicts: SyncConflict[];
  errors: string[];
  timestamp: Date;
}

export interface SyncChange {
  type: 'added' | 'modified' | 'deleted';
  elementType: 'node' | 'edge' | 'metadata';
  elementId: string;
  oldValue?: any;
  newValue?: any;
  platform: string;
}

export interface SyncConflict {
  elementId: string;
  elementType: 'node' | 'edge' | 'metadata';
  localValue: any;
  remoteValue: any;
  platform: string;
  resolution?: 'local' | 'remote' | 'merge';
}

// Supported integration platforms
export const INTEGRATION_PLATFORMS: IntegrationPlatform[] = [
  {
    id: 'visio',
    name: 'Microsoft Visio',
    supportedFormats: ['vsdx', 'vsd', 'xml'],
    exportFormat: 'vsdx',
    importFormat: ['vsdx', 'vsd', 'xml']
  },
  {
    id: 'lucidchart',
    name: 'Lucidchart',
    apiEndpoint: 'https://api.lucidchart.com/documents',
    supportedFormats: ['lucidchart', 'json', 'xml'],
    exportFormat: 'json',
    importFormat: ['json', 'xml']
  },
  {
    id: 'drawio',
    name: 'Draw.io',
    supportedFormats: ['drawio', 'xml', 'svg', 'png'],
    exportFormat: 'xml',
    importFormat: ['xml', 'drawio']
  }
];

// Shape mapping between platforms
// Enhanced platform shape mapping using our centralized shape definitions
const PLATFORM_SHAPE_MAPPING: Record<string, Record<string, string>> = {
  visio: {
    // Basic shapes
    'rect': 'Process',
    'rectangle': 'Process',
    'circle': 'Connector',
    'diamond': 'Decision',
    'triangle': 'Manual Operation',
    'hexagon': 'Preparation',
    'star': 'Manual Operation',
    'line': 'Dynamic connector',
    'text': 'Text',
    
    // Flowchart shapes
    'process': 'Process',
    'terminator': 'Terminator',
    'decision': 'Decision',
    'document': 'Document',
    'data': 'Data',
    'connector': 'Connector',
    
    // Infrastructure shapes
    'server': 'Server',
    'database': 'Database',
    'cloud': 'Cloud',
    'user': 'Person',
    'users': 'Multiple People',
    'building': 'Building',
    'router': 'Router',
    'firewall': 'Firewall',
    
    // AWS shapes
    'aws-ec2': 'EC2 Instance',
    'aws-lambda': 'Lambda',
    'aws-s3': 'S3 Bucket',
    'aws-rds': 'RDS',
    'aws-vpc': 'VPC',
    
    // Azure shapes
    'azure-vm': 'Virtual Machine',
    'azure-functions': 'Function App',
    'azure-storage': 'Storage Account',
    
    // GCP shapes
    'gcp-compute-engine': 'Compute Engine',
    'gcp-cloud-functions': 'Cloud Functions',
    'gcp-cloud-storage': 'Cloud Storage'
  },
  lucidchart: {
    // Basic shapes
    'rect': 'process',
    'rectangle': 'process',
    'circle': 'start_end',
    'diamond': 'decision',
    'triangle': 'manual_operation',
    'hexagon': 'preparation',
    'star': 'custom_shape',
    'line': 'connector',
    'text': 'text',
    
    // Flowchart shapes
    'process': 'process',
    'terminator': 'start_end',
    'decision': 'decision',
    'document': 'document',
    'data': 'data_store',
    'connector': 'connector',
    
    // Infrastructure shapes
    'server': 'server',
    'database': 'database',
    'cloud': 'cloud',
    'user': 'person',
    'users': 'group',
    'building': 'building',
    'router': 'router',
    'firewall': 'firewall',
    
    // Cloud service shapes (use generic shapes with labels)
    'aws-ec2': 'aws_ec2',
    'aws-lambda': 'aws_lambda',
    'aws-s3': 'aws_s3',
    'azure-vm': 'azure_vm',
    'gcp-compute-engine': 'gcp_compute'
  },
  drawio: {
    // Basic shapes
    'rect': 'rectangle',
    'rectangle': 'rectangle',
    'circle': 'ellipse',
    'diamond': 'rhombus',
    'triangle': 'triangle',
    'hexagon': 'hexagon',
    'star': 'star',
    'line': 'line',
    'text': 'text',
    
    // Flowchart shapes
    'process': 'rectangle',
    'terminator': 'ellipse',
    'decision': 'rhombus',
    'document': 'document',
    'data': 'cylinder',
    'connector': 'ellipse',
    
    // Infrastructure shapes
    'server': 'image;image=img/lib/clip_art/computers/Server_128x128.png',
    'database': 'cylinder',
    'cloud': 'ellipse',
    'user': 'image;image=img/lib/clip_art/people/User_128x128.png',
    'users': 'image;image=img/lib/clip_art/people/Users_128x128.png',
    'building': 'rectangle',
    'router': 'image;image=img/lib/clip_art/networking/Router_128x128.png',
    'firewall': 'rectangle',
    
    // Cloud service shapes with icons
    'aws-ec2': 'image;image=img/lib/aws2/compute/ec2.svg',
    'aws-lambda': 'image;image=img/lib/aws2/compute/lambda.svg',
    'aws-s3': 'image;image=img/lib/aws2/storage/s3.svg',
    'azure-vm': 'image;image=img/lib/azure2/compute/virtual_machines.svg',
    'gcp-compute-engine': 'image;image=img/lib/gcp2/compute/compute_engine.svg'
  }
};

// Convert internal diagram format to platform-specific format
export function convertToPlatformFormat(diagram: DiagramData, targetPlatform: string): any {
  const platform = INTEGRATION_PLATFORMS.find(p => p.id === targetPlatform);
  if (!platform) {
    throw new Error(`Unsupported platform: ${targetPlatform}`);
  }

  switch (targetPlatform) {
    case 'visio':
      return convertToVisioFormat(diagram);
    case 'lucidchart':
      return convertToLucidchartFormat(diagram);
    case 'drawio':
      return convertToDrawioFormat(diagram);
    default:
      throw new Error(`Conversion not implemented for platform: ${targetPlatform}`);
  }
}

// Convert platform-specific format to internal diagram format
export function convertFromPlatformFormat(data: any, sourcePlatform: string): DiagramData {
  switch (sourcePlatform) {
    case 'visio':
      return convertFromVisioFormat(data);
    case 'lucidchart':
      return convertFromLucidchartFormat(data);
    case 'drawio':
      return convertFromDrawioFormat(data);
    default:
      throw new Error(`Conversion not implemented for platform: ${sourcePlatform}`);
  }
}

// Visio format conversion functions
function convertToVisioFormat(diagram: DiagramData): any {
  return {
    '@_xmlns': 'http://schemas.microsoft.com/office/visio/2012/main',
    'Pages': {
      'Page': {
        '@_ID': '0',
        '@_Name': diagram.name,
        'PageSheet': {
          'PageProps': {
            'PageWidth': { '@_V': '11' },
            'PageHeight': { '@_V': '8.5' }
          }
        },
        'Shapes': {
          'Shape': diagram.nodes.map(node => {
            const shapeDefinition = findShapeById(node.data.shapeId);
            const visioShapeType = PLATFORM_SHAPE_MAPPING.visio[node.data.shapeId] || 'Process';
            
            return {
              '@_ID': node.id,
              '@_Type': 'Shape',
              '@_Master': visioShapeType,
              'XForm': {
                'PinX': { '@_V': (node.position.x / 100).toString() },
                'PinY': { '@_V': (node.position.y / 100).toString() },
                'Width': { '@_V': (shapeDefinition.width / 100).toString() },
                'Height': { '@_V': (shapeDefinition.height / 100).toString() }
              },
              'Fill': {
                'FillForegnd': { '@_V': getDefaultFill(node.data.shapeId) },
                'FillPattern': { '@_V': '1' }
              },
              'Line': {
                'LineColor': { '@_V': getDefaultStroke(node.data.shapeId) },
                'LineWeight': { '@_V': '0.01' }
              },
              'Text': node.data.label,
              'Char': {
                'Font': { '@_V': 'Calibri' },
                'Size': { '@_V': '0.1' }
              },
              // Store original shape data for round-trip editing
              'User': {
                'Row': [
                  { '@_N': 'msvShapeCategories', '@_V': shapeDefinition.category || 'general' },
                  { '@_N': 'msvShapeType', '@_V': shapeDefinition.type },
                  { '@_N': 'msvOriginalShapeId', '@_V': node.data.shapeId },
                  { '@_N': 'msvShapeProperties', '@_V': JSON.stringify(node.data.properties || {}) }
                ]
              }
            };
          })
        },
        'Connects': diagram.edges.map((edge, index) => ({
          '@_ID': `connect-${index}`,
          '@_FromSheet': edge.source,
          '@_ToSheet': edge.target,
          '@_FromCell': 'PinX',
          '@_ToCell': 'PinX'
        }))
      }
    }
  };
}

function convertFromVisioFormat(data: any): DiagramData {
  const page = data.Pages?.Page || {};
  const shapes = Array.isArray(page.Shapes?.Shape) ? page.Shapes.Shape : [page.Shapes?.Shape].filter(Boolean);
  const connects = Array.isArray(page.Connects) ? page.Connects : [page.Connects].filter(Boolean);

  const nodes: DiagramNode[] = shapes.map((shape: any) => ({
    id: shape['@_ID'] || Math.random().toString(36).substr(2, 9),
    type: 'custom',
    position: {
      x: parseFloat(shape.XForm?.PinX?.['@_V'] || '0') * 100,
      y: parseFloat(shape.XForm?.PinY?.['@_V'] || '0') * 100
    },
    data: {
      label: shape.Text || '',
      shapeId: getInternalShapeId(shape['@_Master'] || 'Process', 'visio'),
      properties: {},
      style: {}
    },
    platformSpecific: { visio: shape }
  }));

  const edges: DiagramEdge[] = connects.map((connect: any, index: number) => ({
    id: `edge-${index}`,
    source: connect['@_FromSheet'],
    target: connect['@_ToSheet'],
    type: 'default',
    platformSpecific: { visio: connect }
  }));

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: page['@_Name'] || 'Imported Diagram',
    platform: 'visio',
    lastModified: new Date(),
    version: 1,
    nodes,
    edges,
    metadata: {
      title: page['@_Name'] || 'Imported Diagram',
      tags: ['visio', 'imported'],
      version: '1.0',
      platform: 'visio',
      syncStatus: 'synced',
      lastSyncTime: new Date()
    }
  };
}

// Lucidchart format conversion functions
function convertToLucidchartFormat(diagram: DiagramData): any {
  return {
    title: diagram.name,
    pages: [{
      title: diagram.name,
      objects: diagram.nodes.map(node => {
        const shapeDefinition = findShapeById(node.data.shapeId);
        const lucidchartShapeType = PLATFORM_SHAPE_MAPPING.lucidchart[node.data.shapeId] || 'process';
        
        return {
          id: node.id,
          class: lucidchartShapeType,
          x: node.position.x,
          y: node.position.y,
          w: shapeDefinition.width,
          h: shapeDefinition.height,
          text: node.data.label,
          style: {
            fill: getDefaultFill(node.data.shapeId),
            stroke: getDefaultStroke(node.data.shapeId),
            strokeWidth: 1,
            ...node.data.style
          },
          // Store original shape data for round-trip editing
          metadata: {
            originalShapeId: node.data.shapeId,
            shapeType: shapeDefinition.type,
            shapeCategory: shapeDefinition.category,
            shapeProperties: node.data.properties || {}
          }
        };
      }),
      lines: diagram.edges.map(edge => ({
        id: edge.id,
        endpoint1: { objectId: edge.source },
        endpoint2: { objectId: edge.target },
        style: {
          stroke: '#333333',
          strokeWidth: 1,
          ...edge.data?.style
        },
        label: edge.data?.label || ''
      }))
    }]
  };
}

function convertFromLucidchartFormat(data: any): DiagramData {
  const page = data.pages?.[0] || {};
  const objects = page.objects || [];
  const lines = page.lines || [];

  const nodes: DiagramNode[] = objects.map((obj: any) => ({
    id: obj.id || Math.random().toString(36).substr(2, 9),
    type: 'custom',
    position: { x: obj.x || 0, y: obj.y || 0 },
    data: {
      label: obj.text || '',
      shapeId: getInternalShapeId(obj.class || 'process', 'lucidchart'),
      properties: {},
      style: obj.style || {}
    },
    platformSpecific: { lucidchart: obj }
  }));

  const edges: DiagramEdge[] = lines.map((line: any) => ({
    id: line.id || Math.random().toString(36).substr(2, 9),
    source: line.endpoint1?.objectId || '',
    target: line.endpoint2?.objectId || '',
    type: 'default',
    data: { style: line.style || {} },
    platformSpecific: { lucidchart: line }
  }));

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: data.title || 'Imported Diagram',
    platform: 'lucidchart',
    lastModified: new Date(),
    version: 1,
    nodes,
    edges,
    metadata: {
      title: data.title || 'Imported Diagram',
      tags: ['lucidchart', 'imported'],
      version: '1.0',
      platform: 'lucidchart',
      syncStatus: 'synced',
      lastSyncTime: new Date()
    }
  };
}

// Draw.io format conversion functions
function convertToDrawioFormat(diagram: DiagramData): any {
  const cells: any[] = [
    { '@_id': '0' },
    { '@_id': '1', '@_parent': '0' }
  ];

  diagram.nodes.forEach(node => {
    const shapeDefinition = findShapeById(node.data.shapeId);
    const drawioShapeType = PLATFORM_SHAPE_MAPPING.drawio[node.data.shapeId] || 'rectangle';
    const fillColor = getDefaultFill(node.data.shapeId);
    const strokeColor = getDefaultStroke(node.data.shapeId);
    
    cells.push({
      '@_id': node.id,
      '@_value': node.data.label,
      '@_style': `shape=${drawioShapeType};fillColor=${fillColor};strokeColor=${strokeColor};strokeWidth=1;fontFamily=Helvetica;fontSize=12;`,
      '@_vertex': '1',
      '@_parent': '1',
      'mxGeometry': {
        '@_x': node.position.x.toString(),
        '@_y': node.position.y.toString(),
        '@_width': shapeDefinition.width.toString(),
        '@_height': shapeDefinition.height.toString(),
        '@_as': 'geometry'
      },
      // Store original shape data in user properties for round-trip editing
      'UserObject': {
        '@_originalShapeId': node.data.shapeId,
        '@_shapeType': shapeDefinition.type,
        '@_shapeCategory': shapeDefinition.category || 'general',
        '@_shapeProperties': JSON.stringify(node.data.properties || {})
      }
    });
  });

  diagram.edges.forEach(edge => {
    cells.push({
      '@_id': edge.id,
      '@_value': edge.data?.label || '',
      '@_style': 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#333333;',
      '@_edge': '1',
      '@_source': edge.source,
      '@_target': edge.target,
      '@_parent': '1',
      'mxGeometry': {
        '@_relative': '1',
        '@_as': 'geometry'
      }
    });
  });

  return {
    'mxfile': {
      'diagram': {
        '@_name': diagram.name,
        'mxGraphModel': {
          '@_dx': '1422',
          '@_dy': '754',
          '@_grid': '1',
          '@_gridSize': '10',
          '@_guides': '1',
          '@_tooltips': '1',
          '@_connect': '1',
          '@_arrows': '1',
          '@_fold': '1',
          '@_page': '1',
          '@_pageScale': '1',
          '@_pageWidth': '827',
          '@_pageHeight': '1169',
          '@_math': '0',
          '@_shadow': '0',
          'root': {
            'mxCell': cells
          }
        }
      }
    }
  };
}

function convertFromDrawioFormat(data: any): DiagramData {
  const cells = data.mxfile?.diagram?.mxGraphModel?.root?.mxCell || [];
  const cellArray = Array.isArray(cells) ? cells : [cells];

  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];

  cellArray.forEach((cell: any) => {
    if (cell['@_vertex'] === '1' && cell['@_id'] !== '1') {
      const geometry = cell.mxGeometry || {};
      nodes.push({
        id: cell['@_id'],
        type: 'custom',
        position: {
          x: parseInt(geometry['@_x'] || '0'),
          y: parseInt(geometry['@_y'] || '0')
        },
        data: {
          label: cell['@_value'] || '',
          shapeId: getInternalShapeId(extractShapeFromStyle(cell['@_style'] || ''), 'drawio'),
          properties: {},
          style: parseDrawioStyle(cell['@_style'] || '')
        },
        platformSpecific: { drawio: cell }
      });
    } else if (cell['@_edge'] === '1') {
      edges.push({
        id: cell['@_id'],
        source: cell['@_source'],
        target: cell['@_target'],
        type: 'default',
        data: {
          label: cell['@_value'] || '',
          style: parseDrawioStyle(cell['@_style'] || '')
        },
        platformSpecific: { drawio: cell }
      });
    }
  });

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: 'Imported Diagram',
    platform: 'drawio',
    lastModified: new Date(),
    version: 1,
    nodes,
    edges,
    metadata: {
      title: 'Imported Diagram',
      tags: ['drawio', 'imported'],
      version: '1.0',
      platform: 'drawio',
      syncStatus: 'synced',
      lastSyncTime: new Date()
    }
  };
}

// Helper functions
function getInternalShapeId(platformShape: string, platform: string): string {
  const mapping = PLATFORM_SHAPE_MAPPING[platform];
  if (!mapping) return 'rectangle';

  for (const [internal, external] of Object.entries(mapping)) {
    if (external.toLowerCase() === platformShape.toLowerCase()) {
      return internal;
    }
  }
  return 'rectangle';
}

function extractShapeFromStyle(style: string): string {
  const match = style.match(/shape=([^;]+)/);
  return match ? match[1] : 'swimlane';
}

function parseDrawioStyle(style: string): Record<string, any> {
  const styleObj: Record<string, any> = {};
  const pairs = style.split(';');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      styleObj[key] = value;
    }
  });
  
  return styleObj;
}

// Synchronization functions
export async function syncWithPlatform(
  localDiagram: DiagramData,
  platform: string,
  options: { direction: 'import' | 'export' | 'bidirectional' } = { direction: 'bidirectional' }
): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    changes: [],
    conflicts: [],
    errors: [],
    timestamp: new Date()
  };

  try {
    switch (platform) {
      case 'visio':
        return await syncWithVisio(localDiagram, options);
      case 'lucidchart':
        return await syncWithLucidchart(localDiagram, options);
      case 'drawio':
        return await syncWithDrawio(localDiagram, options);
      default:
        result.errors.push(`Unsupported platform: ${platform}`);
        return result;
    }
  } catch (error) {
    result.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}

async function syncWithVisio(diagram: DiagramData, options: any): Promise<SyncResult> {
  // Implementation for Visio synchronization
  // This would involve file system operations or COM interface calls
  // TODO: Implement actual Visio integration
  console.log('Syncing with Visio:', diagram.name, options);
  return {
    success: true,
    changes: [],
    conflicts: [],
    errors: [],
    timestamp: new Date()
  };
}

async function syncWithLucidchart(diagram: DiagramData, options: any): Promise<SyncResult> {
  // Implementation for Lucidchart API synchronization
  // This would involve REST API calls to Lucidchart
  // TODO: Implement actual Lucidchart integration
  console.log('Syncing with Lucidchart:', diagram.name, options);
  return {
    success: true,
    changes: [],
    conflicts: [],
    errors: [],
    timestamp: new Date()
  };
}

async function syncWithDrawio(diagram: DiagramData, options: any): Promise<SyncResult> {
  // Implementation for Draw.io synchronization
  // This would involve file operations or API calls
  // TODO: Implement actual Draw.io integration
  console.log('Syncing with Draw.io:', diagram.name, options);
  return {
    success: true,
    changes: [],
    conflicts: [],
    errors: [],
    timestamp: new Date()
  };
}

// Conflict resolution
export function resolveConflicts(conflicts: SyncConflict[], resolutions: Record<string, 'local' | 'remote' | 'merge'>): SyncConflict[] {
  return conflicts.map(conflict => {
    const resolution = resolutions[conflict.elementId];
    if (resolution) {
      conflict.resolution = resolution;
    }
    return conflict;
  });
}

// Validation integration
export function validateSyncedDiagram(diagram: DiagramData): ValidationResult[] {
  return diagram.nodes.map(node => validateShapeLabel(node.data));
}
