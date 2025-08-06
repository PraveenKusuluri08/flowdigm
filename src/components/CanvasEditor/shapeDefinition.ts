// Shape Definition Utility for Canvas Editor
import { bpmnShapes } from '../constants/bpmnShapes';
import { 
  Square, 
  Circle, 
  Triangle, 
  Minus,
  Diamond,
  Hexagon,
  Star,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  Grid3x3,
  Type,
  Bookmark,
  Server,
  Database,
  Cloud,
  Globe,
  Monitor,
  Smartphone,
  Wifi,
  Shield,
  Lock,
  Users,
  User,
  Building
} from 'lucide-react';

// Shape definition interface
export interface ShapeDefinition {
  name: string;
  width: number;
  height: number;
  type: string;
  category?: string;
  tooltip?: string;
  serviceType?: string; // For cloud service shapes
  color?: string;
  description?: string;
  icon?: any;
}

// Basic shape definitions
export const basicShapes: Record<string, ShapeDefinition> = {
  rect: { name: 'Rectangle', width: 80, height: 60, type: 'basic' },
  rectangle: { name: 'Rectangle', width: 80, height: 60, type: 'basic' },
  circle: { name: 'Circle', width: 60, height: 60, type: 'basic' },
  triangle: { name: 'Triangle', width: 60, height: 60, type: 'basic' },
  diamond: { name: 'Diamond', width: 60, height: 60, type: 'basic' },
  hexagon: { name: 'Hexagon', width: 70, height: 60, type: 'basic' },
  star: { name: 'Star', width: 60, height: 60, type: 'basic' },
  line: { name: 'Line', width: 100, height: 2, type: 'basic' },
  text: { name: 'Text', width: 120, height: 40, type: 'basic' },
};

// Flowchart shape definitions
export const flowchartShapes: Record<string, ShapeDefinition> = {
  process: { name: 'Process', width: 100, height: 60, type: 'flowchart' },
  terminator: { name: 'Terminator', width: 100, height: 50, type: 'flowchart' },
  decision: { name: 'Decision', width: 80, height: 80, type: 'flowchart' },
  document: { name: 'Document', width: 80, height: 60, type: 'flowchart' },
  data: { name: 'Data', width: 80, height: 60, type: 'flowchart' },
  connector: { name: 'Connector', width: 20, height: 20, type: 'flowchart' },
};

// Arrow shape definitions
export const arrowShapes: Record<string, ShapeDefinition> = {
  'arrow-right': { name: 'Arrow Right', width: 60, height: 20, type: 'arrow' },
  'arrow-left': { name: 'Arrow Left', width: 60, height: 20, type: 'arrow' },
  'arrow-up': { name: 'Arrow Up', width: 20, height: 60, type: 'arrow' },
  'arrow-down': { name: 'Arrow Down', width: 20, height: 60, type: 'arrow' },
};

// Infrastructure shape definitions
export const infrastructureShapes: Record<string, ShapeDefinition> = {
  cloud: { name: 'Cloud', width: 80, height: 60, type: 'infrastructure' },
  server: { name: 'Server', width: 60, height: 80, type: 'infrastructure' },
  database: { name: 'Database', width: 60, height: 60, type: 'infrastructure' },
  router: { name: 'Router', width: 60, height: 40, type: 'infrastructure' },
  firewall: { name: 'Firewall', width: 60, height: 60, type: 'infrastructure' },
  user: { name: 'User', width: 50, height: 60, type: 'infrastructure' },
  users: { name: 'Users', width: 80, height: 60, type: 'infrastructure' },
  building: { name: 'Building', width: 80, height: 100, type: 'infrastructure' },
  monitor: { name: 'Monitor', width: 80, height: 60, type: 'infrastructure' },
  smartphone: { name: 'Smartphone', width: 40, height: 80, type: 'infrastructure' },
  wifi: { name: 'WiFi', width: 60, height: 40, type: 'infrastructure' },
  shield: { name: 'Shield', width: 50, height: 60, type: 'infrastructure' },
  lock: { name: 'Lock', width: 40, height: 50, type: 'infrastructure' },
  network: { name: 'Network', width: 80, height: 60, type: 'infrastructure' },
};

// AWS service shape definitions
export const awsShapes: Record<string, ShapeDefinition> = {
  'aws-ec2': { name: 'EC2 Instance', width: 80, height: 60, type: 'aws', category: 'compute' },
  'aws-lambda': { name: 'Lambda Function', width: 80, height: 60, type: 'aws', category: 'compute' },
  'aws-ecs': { name: 'ECS Container', width: 80, height: 60, type: 'aws', category: 'compute' },
  'aws-eks': { name: 'EKS Cluster', width: 80, height: 60, type: 'aws', category: 'compute' },
  'aws-s3': { name: 'S3 Bucket', width: 80, height: 60, type: 'aws', category: 'storage' },
  'aws-rds': { name: 'RDS Database', width: 80, height: 60, type: 'aws', category: 'database' },
  'aws-dynamodb': { name: 'DynamoDB', width: 80, height: 60, type: 'aws', category: 'database' },
  'aws-vpc': { name: 'VPC', width: 100, height: 80, type: 'aws', category: 'network' },
  'aws-alb': { name: 'Application Load Balancer', width: 80, height: 60, type: 'aws', category: 'network' },
  'aws-api-gateway': { name: 'API Gateway', width: 80, height: 60, type: 'aws', category: 'integration' },
  'aws-cloudfront': { name: 'CloudFront', width: 80, height: 60, type: 'aws', category: 'network' },
  'aws-iam': { name: 'IAM', width: 80, height: 60, type: 'aws', category: 'security' },
  'aws-cloudwatch': { name: 'CloudWatch', width: 80, height: 60, type: 'aws', category: 'monitoring' },
  'aws-sns': { name: 'SNS', width: 80, height: 60, type: 'aws', category: 'messaging' },
  'aws-sqs': { name: 'SQS', width: 80, height: 60, type: 'aws', category: 'messaging' },
};

// Azure service shape definitions
export const azureShapes: Record<string, ShapeDefinition> = {
  'azure-vm': { name: 'Virtual Machine', width: 80, height: 60, type: 'azure', category: 'compute' },
  'azure-functions': { name: 'Azure Functions', width: 80, height: 60, type: 'azure', category: 'compute' },
  'azure-aks': { name: 'AKS Cluster', width: 80, height: 60, type: 'azure', category: 'compute' },
  'azure-storage': { name: 'Storage Account', width: 80, height: 60, type: 'azure', category: 'storage' },
  'azure-sql': { name: 'SQL Database', width: 80, height: 60, type: 'azure', category: 'database' },
  'azure-cosmos': { name: 'Cosmos DB', width: 80, height: 60, type: 'azure', category: 'database' },
  'azure-vnet': { name: 'Virtual Network', width: 100, height: 80, type: 'azure', category: 'network' },
  'azure-app-service': { name: 'App Service', width: 80, height: 60, type: 'azure', category: 'web' },
};

// GCP service shape definitions
export const gcpShapes: Record<string, ShapeDefinition> = {
  'gcp-compute-engine': { name: 'Compute Engine', width: 80, height: 60, type: 'gcp', category: 'compute' },
  'gcp-cloud-functions': { name: 'Cloud Functions', width: 80, height: 60, type: 'gcp', category: 'compute' },
  'gcp-gke': { name: 'GKE Cluster', width: 80, height: 60, type: 'gcp', category: 'compute' },
  'gcp-cloud-storage': { name: 'Cloud Storage', width: 80, height: 60, type: 'gcp', category: 'storage' },
  'gcp-cloud-sql': { name: 'Cloud SQL', width: 80, height: 60, type: 'gcp', category: 'database' },
  'gcp-firestore': { name: 'Firestore', width: 80, height: 60, type: 'gcp', category: 'database' },
  'gcp-vpc': { name: 'VPC Network', width: 100, height: 80, type: 'gcp', category: 'network' },
  'gcp-app-engine': { name: 'App Engine', width: 80, height: 60, type: 'gcp', category: 'web' },
};

// Get BPMN shapes in the correct format
export const getBpmnShapes = (): Record<string, ShapeDefinition> => {
  const shapes: Record<string, ShapeDefinition> = {};
  
  Object.entries(bpmnShapes).forEach(([categoryKey, category]) => {
    if (category.shapes) {
      Object.entries(category.shapes).forEach(([shapeKey, shape]) => {
        shapes[shapeKey] = {
          name: shape.name,
          width: shape.width,
          height: shape.height,
          type: 'bpmn',
          category: categoryKey,
          tooltip: shape.tooltip,
        };
      });
    }
  });
  
  return shapes;
};

// Combine all shape definitions
export const allShapes: Record<string, ShapeDefinition> = {
  ...basicShapes,
  ...flowchartShapes,
  ...arrowShapes,
  ...infrastructureShapes,
  ...awsShapes,
  ...azureShapes,
  ...gcpShapes,
  ...getBpmnShapes(),
};

/**
 * Find shape definition by shape ID
 * @param shapeId - The ID of the shape to find
 * @returns Shape definition object or null if not found
 */
export const findShapeById = (shapeId: string): ShapeDefinition => {
  // First try direct lookup
  if (allShapes[shapeId]) {
    return allShapes[shapeId];
  }
  
  // Try with common variations
  const variations = [
    shapeId.replace(/-/g, '_'),
    shapeId.replace(/_/g, '-'),
    shapeId.toLowerCase(),
    shapeId.toUpperCase(),
  ];
  
  for (const variation of variations) {
    if (allShapes[variation]) {
      return allShapes[variation];
    }
  }
  
  // For unknown shapes, provide sensible defaults
  console.warn(`Shape definition not found for: ${shapeId}, using default`);
  return {
    name: shapeId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    width: 80,
    height: 60,
    type: 'unknown',
    category: 'misc',
  };
};

/**
 * Get default fill color for a shape
 * @param shapeId - The ID of the shape
 * @returns Default fill color
 */
export const getDefaultFill = (shapeId: string): string => {
  const shape = findShapeById(shapeId);
  
  switch (shape.type) {
    case 'aws':
      return '#FF9900';
    case 'azure':
      return '#0078D4';
    case 'gcp':
      return '#4285F4';
    case 'bpmn':
      return '#FFFFFF';
    case 'flowchart':
      return '#E3F2FD';
    case 'infrastructure':
      return '#F5F5F5';
    case 'arrow':
      return '#2196F3';
    default:
      return '#FFFFFF';
  }
};

/**
 * Get default stroke color for a shape
 * @param shapeId - The ID of the shape
 * @returns Default stroke color
 */
export const getDefaultStroke = (shapeId: string): string => {
  const shape = findShapeById(shapeId);
  
  switch (shape.type) {
    case 'aws':
      return '#FF9900';
    case 'azure':
      return '#0078D4';
    case 'gcp':
      return '#4285F4';
    case 'bpmn':
      return '#000000';
    default:
      return '#333333';
  }
};

/**
 * Get shape type mapping for ReactFlow node types
 * @param shapeId - The ID of the shape
 * @returns ReactFlow node type
 */
export const getReactFlowNodeType = (shapeId: string): string => {
  // Basic shapes
  if (shapeId === 'rect' || shapeId === 'rectangle') return 'rect';
  if (shapeId === 'circle') return 'circle';
  if (shapeId === 'triangle') return 'triangle';
  if (shapeId === 'diamond') return 'diamond';
  if (shapeId === 'hexagon') return 'hexagon';
  if (shapeId === 'star') return 'star';
  if (shapeId === 'line') return 'line';
  if (shapeId === 'text') return 'textNode';
  
  // Flowchart shapes
  if (shapeId === 'process') return 'process';
  if (shapeId === 'terminator') return 'terminator';
  if (shapeId === 'decision') return 'decision';
  if (shapeId === 'document') return 'document';
  if (shapeId === 'data') return 'data';
  
  // Arrows
  if (shapeId.startsWith('arrow-')) return shapeId;
  
  // Infrastructure
  if (shapeId === 'cloud') return 'cloud';
  if (shapeId === 'server') return 'server';
  if (shapeId === 'database') return 'database';
  if (shapeId === 'router') return 'router';
  if (shapeId === 'firewall') return 'firewall';
  if (shapeId === 'user') return 'user';
  if (shapeId === 'users') return 'users';
  if (shapeId === 'building') return 'building';
  if (shapeId === 'monitor') return 'monitor';
  if (shapeId === 'smartphone') return 'smartphone';
  if (shapeId === 'wifi') return 'wifi';
  if (shapeId === 'shield') return 'shield';
  if (shapeId === 'lock') return 'lock';
  if (shapeId === 'network') return 'network';
  
  // Cloud services
  if (shapeId.startsWith('aws-')) return 'aws-service';
  if (shapeId.startsWith('azure-')) return 'azure-service';
  if (shapeId.startsWith('gcp-')) return 'gcp-service';
  
  // BPMN shapes - use specific node types for each BPMN element
  if (shapeId.startsWith('bpmn-')) return shapeId;
  
  // Default fallback
  console.warn(`Unknown shape type for: ${shapeId}, using rect as fallback`);
  return 'rect';
};

// Shape categories for sidebar - matches the old shapeDefinition structure
export const shapeCategories = {
  general: {
    name: 'General',
    icon: Grid3x3,
    collapsed: false,
    layout: 'grid', 
    shapes: [
      { id: 'rect', icon: Square, type: 'basic', tooltip: 'Rectangle' },
      { id: 'circle', icon: Circle, type: 'basic', tooltip: 'Circle' },
      { id: 'triangle', icon: Triangle, type: 'basic', tooltip: 'Triangle' },
      { id: 'diamond', icon: Diamond, type: 'basic', tooltip: 'Diamond' },
      { id: 'hexagon', icon: Hexagon, type: 'basic', tooltip: 'Hexagon' },
      { id: 'star', icon: Star, type: 'basic', tooltip: 'Star' },
      { id: 'line', icon: Minus, type: 'line', tooltip: 'Line' },
      { id: 'text', icon: Type, type: 'text', tooltip: 'Text' }
    ]
  },
  
  arrows: {
    name: 'Arrows',
    icon: ArrowRight,
    collapsed: true,
    layout: 'grid',
    shapes: [
      { id: 'arrow-right', icon: ArrowRight, type: 'arrow', tooltip: 'Arrow Right' },
      { id: 'arrow-left', icon: ArrowLeft, type: 'arrow', tooltip: 'Arrow Left' },
      { id: 'arrow-up', icon: ArrowUp, type: 'arrow', tooltip: 'Arrow Up' },
      { id: 'arrow-down', icon: ArrowDown, type: 'arrow', tooltip: 'Arrow Down' }
    ]
  },
  
  flowchart: {
    name: 'Flowchart',
    icon: Bookmark,
    collapsed: true,
    layout: 'grid',
    shapes: [
      { id: 'document', icon: Bookmark, type: 'flowchart', tooltip: 'Document' },
      { id: 'data', icon: Database, type: 'flowchart', tooltip: 'Data Store' }
    ]
  },
  
  infrastructure: {
    name: 'Infrastructure',
    icon: Server,
    collapsed: true,
    layout: 'grid',
    shapes: [
      { id: 'cloud', icon: Cloud, type: 'infrastructure', tooltip: 'Cloud' },
      { id: 'server', icon: Server, type: 'infrastructure', tooltip: 'Server' },
      { id: 'database', icon: Database, type: 'infrastructure', tooltip: 'Database' },
      { id: 'router', icon: Globe, type: 'infrastructure', tooltip: 'Router' },
      { id: 'firewall', icon: Shield, type: 'infrastructure', tooltip: 'Firewall' },
      { id: 'user', icon: User, type: 'infrastructure', tooltip: 'User' },
      { id: 'users', icon: Users, type: 'infrastructure', tooltip: 'Users' },
      { id: 'building', icon: Building, type: 'infrastructure', tooltip: 'Building' },
      { id: 'monitor', icon: Monitor, type: 'infrastructure', tooltip: 'Monitor' },
      { id: 'smartphone', icon: Smartphone, type: 'infrastructure', tooltip: 'Mobile Device' },
      { id: 'wifi', icon: Wifi, type: 'infrastructure', tooltip: 'WiFi' },
      { id: 'shield', icon: Shield, type: 'infrastructure', tooltip: 'Security' },
      { id: 'lock', icon: Lock, type: 'infrastructure', tooltip: 'Security Lock' },
      { id: 'network', icon: Globe, type: 'infrastructure', tooltip: 'Network' }
    ]
  },

  cloudServices: {
    name: 'Cloud Services',
    icon: Cloud,
    collapsed: true,
    layout: 'grid',
    shapes: [
      // AWS Services
      { id: 'aws-ec2', icon: Server, type: 'cloud', tooltip: 'AWS EC2', serviceType: 'aws', color: '#FF9900' },
      { id: 'aws-s3', icon: Database, type: 'cloud', tooltip: 'AWS S3', serviceType: 'aws', color: '#FF9900' },
      { id: 'aws-lambda', icon: Cloud, type: 'cloud', tooltip: 'AWS Lambda', serviceType: 'aws', color: '#FF9900' },
      { id: 'aws-rds', icon: Database, type: 'cloud', tooltip: 'AWS RDS', serviceType: 'aws', color: '#FF9900' },
      { id: 'aws-vpc', icon: Shield, type: 'cloud', tooltip: 'AWS VPC', serviceType: 'aws', color: '#FF9900' },
      
      // Azure Services  
      { id: 'azure-vm', icon: Server, type: 'cloud', tooltip: 'Azure VM', serviceType: 'azure', color: '#0078D4' },
      { id: 'azure-storage', icon: Database, type: 'cloud', tooltip: 'Azure Storage', serviceType: 'azure', color: '#0078D4' },
      { id: 'azure-functions', icon: Cloud, type: 'cloud', tooltip: 'Azure Functions', serviceType: 'azure', color: '#0078D4' },
      
      // GCP Services
      { id: 'gcp-compute', icon: Server, type: 'cloud', tooltip: 'GCP Compute', serviceType: 'gcp', color: '#4285F4' },
      { id: 'gcp-storage', icon: Database, type: 'cloud', tooltip: 'GCP Storage', serviceType: 'gcp', color: '#4285F4' },
      { id: 'gcp-functions', icon: Cloud, type: 'cloud', tooltip: 'GCP Functions', serviceType: 'gcp', color: '#4285F4' }
    ]
  }
};
