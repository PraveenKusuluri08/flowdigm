// constants/architectureShapes.js - Architecture and cloud shapes
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
  Grid3X3,
  Type,
  
  Server,
  Database,
  Cloud,
  Globe,
  Monitor,
  Smartphone,
  Wifi,
  Shield,
  Lock,
  Key,
  Users,
  User,
  Folder,
  File,
  HardDrive,
  Cpu,
  MemoryStick,
  Router,
  Network,
  Zap,
  Settings,
  Cog,
  Building,
  Building2,
  Warehouse,
  Factory
} from 'lucide-react';

export const architectureShapeCategories = {
  general: {
    name: 'General',
    icon: Grid3X3,
    shapes: [
      { id: 'rect', name: 'Rectangle', icon: Square, type: 'basic' },
      { id: 'circle', name: 'Circle', icon: Circle, type: 'basic' },
      { id: 'triangle', name: 'Triangle', icon: Triangle, type: 'basic' },
      { id: 'diamond', name: 'Diamond', icon: Diamond, type: 'basic' },
      { id: 'hexagon', name: 'Hexagon', icon: Hexagon, type: 'basic' },
      { id: 'star', name: 'Star', icon: Star, type: 'basic' }
    ]
  },
  basic: {
    name: 'Basic',
    icon: Square,
    shapes: [
      { id: 'line', name: 'Line', icon: Minus, type: 'line' },
      { id: 'arrow-right', name: 'Arrow Right', icon: ArrowRight, type: 'arrow' },
      { id: 'arrow-left', name: 'Arrow Left', icon: ArrowLeft, type: 'arrow' },
      { id: 'arrow-up', name: 'Arrow Up', icon: ArrowUp, type: 'arrow' },
      { id: 'arrow-down', name: 'Arrow Down', icon: ArrowDown, type: 'arrow' }
    ]
  },
  cloud: {
    name: 'Cloud & Web',
    icon: Cloud,
    shapes: [
      { id: 'cloud', name: 'Cloud', icon: Cloud, type: 'cloud' },
      { id: 'server', name: 'Server', icon: Server, type: 'infrastructure' },
      { id: 'database', name: 'Database', icon: Database, type: 'data' },
      { id: 'globe', name: 'Internet', icon: Globe, type: 'network' },
      { id: 'monitor', name: 'Desktop', icon: Monitor, type: 'device' },
      { id: 'smartphone', name: 'Mobile', icon: Smartphone, type: 'device' },
      { id: 'wifi', name: 'WiFi', icon: Wifi, type: 'network' },
      { id: 'router', name: 'Router', icon: Router, type: 'network' }
    ]
  },
  infrastructure: {
    name: 'Infrastructure',
    icon: Server,
    shapes: [
      { id: 'server-rack', name: 'Server Rack', icon: Server, type: 'infrastructure' },
      { id: 'virtual-machine', name: 'Virtual Machine', icon: Monitor, type: 'infrastructure' },
      { id: 'container', name: 'Container', icon: Square, type: 'infrastructure' },
      { id: 'load-balancer', name: 'Load Balancer', icon: Network, type: 'infrastructure' },
      { id: 'firewall', name: 'Firewall', icon: Shield, type: 'security' },
      { id: 'gateway', name: 'Gateway', icon: Zap, type: 'network' },
      { id: 'cdn', name: 'CDN', icon: Globe, type: 'network' },
      { id: 'dns', name: 'DNS', icon: Globe, type: 'network' }
    ]
  },
  security: {
    name: 'Security',
    icon: Shield,
    shapes: [
      { id: 'shield', name: 'Security', icon: Shield, type: 'security' },
      { id: 'lock', name: 'Encryption', icon: Lock, type: 'security' },
      { id: 'key', name: 'Authentication', icon: Key, type: 'security' },
      { id: 'vpn', name: 'VPN', icon: Shield, type: 'security' },
      { id: 'certificate', name: 'Certificate', icon: File, type: 'security' },
      { id: 'identity', name: 'Identity', icon: User, type: 'security' }
    ]
  },
  data: {
    name: 'Data & Storage',
    icon: Database,
    shapes: [
      { id: 'database-sql', name: 'SQL Database', icon: Database, type: 'data' },
      { id: 'database-nosql', name: 'NoSQL Database', icon: Database, type: 'data' },
      { id: 'data-warehouse', name: 'Data Warehouse', icon: Warehouse, type: 'data' },
      { id: 'file-storage', name: 'File Storage', icon: Folder, type: 'data' },
      { id: 'blob-storage', name: 'Blob Storage', icon: HardDrive, type: 'data' },
      { id: 'cache', name: 'Cache', icon: MemoryStick, type: 'data' },
      { id: 'queue', name: 'Message Queue', icon: ArrowRight, type: 'data' },
      { id: 'stream', name: 'Data Stream', icon: ArrowRight, type: 'data' }
    ]
  },
  compute: {
    name: 'Compute',
    icon: Cpu,
    shapes: [
      { id: 'function', name: 'Function', icon: Zap, type: 'compute' },
      { id: 'microservice', name: 'Microservice', icon: Hexagon, type: 'compute' },
      { id: 'api', name: 'API', icon: Settings, type: 'compute' },
      { id: 'worker', name: 'Background Worker', icon: Cog, type: 'compute' },
      { id: 'scheduler', name: 'Scheduler', icon: Settings, type: 'compute' },
      { id: 'batch-job', name: 'Batch Job', icon: Square, type: 'compute' }
    ]
  },
  users: {
    name: 'Users & Roles',
    icon: Users,
    shapes: [
      { id: 'user', name: 'User', icon: User, type: 'user' },
      { id: 'users', name: 'Users', icon: Users, type: 'user' },
      { id: 'admin', name: 'Administrator', icon: Shield, type: 'user' },
      { id: 'developer', name: 'Developer', icon: User, type: 'user' },
      { id: 'external-user', name: 'External User', icon: User, type: 'user' }
    ]
  },
  aws: {
    name: 'AWS Services',
    icon: Cloud,
    shapes: [
      { id: 'aws-ec2', name: 'EC2', icon: Server, type: 'aws' },
      { id: 'aws-s3', name: 'S3', icon: Folder, type: 'aws' },
      { id: 'aws-rds', name: 'RDS', icon: Database, type: 'aws' },
      { id: 'aws-lambda', name: 'Lambda', icon: Zap, type: 'aws' },
      { id: 'aws-vpc', name: 'VPC', icon: Network, type: 'aws' },
      { id: 'aws-cloudfront', name: 'CloudFront', icon: Globe, type: 'aws' },
      { id: 'aws-elb', name: 'Load Balancer', icon: Network, type: 'aws' },
      { id: 'aws-apigateway', name: 'API Gateway', icon: Settings, type: 'aws' }
    ]
  },
  azure: {
    name: 'Azure Services',
    icon: Cloud,
    shapes: [
      { id: 'azure-vm', name: 'Virtual Machine', icon: Server, type: 'azure' },
      { id: 'azure-storage', name: 'Storage Account', icon: Folder, type: 'azure' },
      { id: 'azure-sql', name: 'SQL Database', icon: Database, type: 'azure' },
      { id: 'azure-functions', name: 'Functions', icon: Zap, type: 'azure' },
      { id: 'azure-vnet', name: 'Virtual Network', icon: Network, type: 'azure' },
      { id: 'azure-cdn', name: 'CDN', icon: Globe, type: 'azure' }
    ]
  },
  gcp: {
    name: 'Google Cloud',
    icon: Cloud,
    shapes: [
      { id: 'gcp-compute', name: 'Compute Engine', icon: Server, type: 'gcp' },
      { id: 'gcp-storage', name: 'Cloud Storage', icon: Folder, type: 'gcp' },
      { id: 'gcp-sql', name: 'Cloud SQL', icon: Database, type: 'gcp' },
      { id: 'gcp-functions', name: 'Cloud Functions', icon: Zap, type: 'gcp' },
      { id: 'gcp-vpc', name: 'VPC', icon: Network, type: 'gcp' },
      { id: 'gcp-cdn', name: 'Cloud CDN', icon: Globe, type: 'gcp' }
    ]
  },
  enterprise: {
    name: 'Enterprise',
    icon: Building,
    shapes: [
      { id: 'enterprise', name: 'Enterprise', icon: Building2, type: 'enterprise' },
      { id: 'datacenter', name: 'Data Center', icon: Building, type: 'enterprise' },
      { id: 'office', name: 'Office', icon: Building, type: 'enterprise' },
      { id: 'factory', name: 'Factory', icon: Factory, type: 'enterprise' },
      { id: 'branch', name: 'Branch Office', icon: Building, type: 'enterprise' }
    ]
  },
  text: {
    name: 'Text',
    icon: Type,
    shapes: [
      { id: 'text', name: 'Text', icon: Type, type: 'text' },
      { id: 'label', name: 'Label', icon: Type, type: 'text' },
      { id: 'title', name: 'Title', icon: Type, type: 'text' },
      { id: 'note', name: 'Note', icon: File, type: 'text' }
    ]
  },
  flowchart: {
    name: 'Flowchart',
    icon: Diamond,
    shapes: [
      { id: 'process', name: 'Process', icon: Square, type: 'flowchart' },
      { id: 'decision', name: 'Decision', icon: Diamond, type: 'flowchart' },
      { id: 'terminator', name: 'Start/End', icon: Circle, type: 'flowchart' },
      { id: 'document', name: 'Document', icon: File, type: 'flowchart' },
      { id: 'storage', name: 'Storage', icon: Database, type: 'flowchart' },
      { id: 'manual-operation', name: 'Manual Operation', icon: Square, type: 'flowchart' }
    ]
  }
};