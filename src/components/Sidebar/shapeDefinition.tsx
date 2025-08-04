// constants/shapeDefinitions.js - Simple AWS shapes with Lucide icons and proper colors
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
  Key,
  Users,
  User,
  Folder,
  File,
  HardDrive,
  MemoryStick,
  Router,
  Network,
  Zap,
  Settings,
  Building,
  Factory,
  Container,
  Layers,
  Activity,
  Search,
  BarChart3,
  GitBranch,
  MessageSquare,
  Bell,
  Workflow,
  Brain,
  Eye,
  Mic,
  Languages
} from 'lucide-react';
import { bpmnShapes } from '../constants/bpmnShapes';
import { awsServices, googleCloudServices, azureServices } from './CloudServiceIcons';


// AWS Icon wrapper component with proper styling
// eslint-disable-next-line react-refresh/only-export-components
const AwsIconWrapper = ({ LucideIcon, color, size = 24 }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LucideIcon: any;
  color: string;
  size?: number;
}) => (
  <LucideIcon 
    size={size} 
    style={{ color }} 
    strokeWidth={1.5}
  />
);

export const shapeCategories = {
  general: {
    name: 'General',
    icon: Grid3X3,
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
    icon: Diamond,
    collapsed: true,
    layout: 'grid',
    shapes: [
      { id: 'process', icon: Square, type: 'flowchart', tooltip: 'Process' },
      { id: 'decision', icon: Diamond, type: 'flowchart', tooltip: 'Decision' },
      { id: 'terminator', icon: Circle, type: 'flowchart', tooltip: 'Start/End' },
      { id: 'document', icon: Bookmark, type: 'flowchart', tooltip: 'Document' },
      { id: 'data', icon: Database, type: 'flowchart', tooltip: 'Data' },
      { id: 'connector', icon: Circle, type: 'flowchart', tooltip: 'Connector' }
    ]
  },

  // aws: {
  //   name: 'AWS',
  //   icon: Cloud,
  //   collapsed: true,
  //   layout: 'grid',
  //   shapes: [
  //     // Compute Services - Orange (#FF9900)
  //     { 
  //       id: 'aws-ec2', 
  //       icon: () => <AwsIconWrapper LucideIcon={Server} color="#FF9900" />, 
  //       type: 'aws-compute', 
  //       tooltip: 'Amazon EC2',
  //       category: 'Compute'
  //     },
  //     { 
  //       id: 'aws-lambda', 
  //       icon: () => <AwsIconWrapper LucideIcon={Zap} color="#FF9900" />, 
  //       type: 'aws-compute', 
  //       tooltip: 'AWS Lambda',
  //       category: 'Compute'
  //     },
  //     { 
  //       id: 'aws-ecs', 
  //       icon: () => <AwsIconWrapper LucideIcon={Container} color="#FF9900" />, 
  //       type: 'aws-compute', 
  //       tooltip: 'Amazon ECS',
  //       category: 'Compute'
  //     },
  //     { 
  //       id: 'aws-eks', 
  //       icon: () => <AwsIconWrapper LucideIcon={Hexagon} color="#FF9900" />, 
  //       type: 'aws-compute', 
  //       tooltip: 'Amazon EKS',
  //       category: 'Compute'
  //     },
  //     { 
  //       id: 'aws-beanstalk', 
  //       icon: () => <AwsIconWrapper LucideIcon={Layers} color="#FF9900" />, 
  //       type: 'aws-compute', 
  //       tooltip: 'AWS Elastic Beanstalk',
  //       category: 'Compute'
  //     },
      
  //     // Storage Services - Green (#3F8624)
  //     { 
  //       id: 'aws-s3', 
  //       icon: () => <AwsIconWrapper LucideIcon={Folder} color="#3F8624" />, 
  //       type: 'aws-storage', 
  //       tooltip: 'Amazon S3',
  //       category: 'Storage'
  //     },
  //     { 
  //       id: 'aws-ebs', 
  //       icon: () => <AwsIconWrapper LucideIcon={HardDrive} color="#3F8624" />, 
  //       type: 'aws-storage', 
  //       tooltip: 'Amazon EBS',
  //       category: 'Storage'
  //     },
  //     { 
  //       id: 'aws-efs', 
  //       icon: () => <AwsIconWrapper LucideIcon={File} color="#3F8624" />, 
  //       type: 'aws-storage', 
  //       tooltip: 'Amazon EFS',
  //       category: 'Storage'
  //     },
  //     { 
  //       id: 'aws-glacier', 
  //       icon: () => <AwsIconWrapper LucideIcon={Database} color="#3F8624" />, 
  //       type: 'aws-storage', 
  //       tooltip: 'Amazon Glacier',
  //       category: 'Storage'
  //     },
  //     { 
  //       id: 'aws-storage-gateway', 
  //       icon: () => <AwsIconWrapper LucideIcon={Network} color="#3F8624" />, 
  //       type: 'aws-storage', 
  //       tooltip: 'AWS Storage Gateway',
  //       category: 'Storage'
  //     },
      
  //     // Database Services - Blue (#3F48CC)
  //     { 
  //       id: 'aws-rds', 
  //       icon: () => <AwsIconWrapper LucideIcon={Database} color="#3F48CC" />, 
  //       type: 'aws-database', 
  //       tooltip: 'Amazon RDS',
  //       category: 'Database'
  //     },
  //     { 
  //       id: 'aws-dynamodb', 
  //       icon: () => <AwsIconWrapper LucideIcon={Database} color="#3F48CC" />, 
  //       type: 'aws-database', 
  //       tooltip: 'Amazon DynamoDB',
  //       category: 'Database'
  //     },
  //     { 
  //       id: 'aws-redshift', 
  //       icon: () => <AwsIconWrapper LucideIcon={BarChart3} color="#3F48CC" />, 
  //       type: 'aws-database', 
  //       tooltip: 'Amazon Redshift',
  //       category: 'Database'
  //     },
  //     { 
  //       id: 'aws-elasticache', 
  //       icon: () => <AwsIconWrapper LucideIcon={MemoryStick} color="#3F48CC" />, 
  //       type: 'aws-database', 
  //       tooltip: 'Amazon ElastiCache',
  //       category: 'Database'
  //     },
  //     { 
  //       id: 'aws-documentdb', 
  //       icon: () => <AwsIconWrapper LucideIcon={File} color="#3F48CC" />, 
  //       type: 'aws-database', 
  //       tooltip: 'Amazon DocumentDB',
  //       category: 'Database'
  //     },
      
  //     // Networking Services - Red (#FF4B4B)
  //     { 
  //       id: 'aws-vpc', 
  //       icon: () => <AwsIconWrapper LucideIcon={Network} color="#FF4B4B" />, 
  //       type: 'aws-network', 
  //       tooltip: 'Amazon VPC',
  //       category: 'Networking'
  //     },
  //     { 
  //       id: 'aws-cloudfront', 
  //       icon: () => <AwsIconWrapper LucideIcon={Globe} color="#FF4B4B" />, 
  //       type: 'aws-network', 
  //       tooltip: 'Amazon CloudFront',
  //       category: 'Networking'
  //     },
  //     { 
  //       id: 'aws-elb', 
  //       icon: () => <AwsIconWrapper LucideIcon={Network} color="#FF4B4B" />, 
  //       type: 'aws-network', 
  //       tooltip: 'Elastic Load Balancer',
  //       category: 'Networking'
  //     },
  //     { 
  //       id: 'aws-route53', 
  //       icon: () => <AwsIconWrapper LucideIcon={Globe} color="#FF4B4B" />, 
  //       type: 'aws-network', 
  //       tooltip: 'Amazon Route 53',
  //       category: 'Networking'
  //     },
  //     { 
  //       id: 'aws-api-gateway', 
  //       icon: () => <AwsIconWrapper LucideIcon={Router} color="#FF4B4B" />, 
  //       type: 'aws-network', 
  //       tooltip: 'Amazon API Gateway',
  //       category: 'Networking'
  //     },
      
  //     // Security Services - Dark Red (#DD344C)
  //     { 
  //       id: 'aws-iam', 
  //       icon: () => <AwsIconWrapper LucideIcon={Shield} color="#DD344C" />, 
  //       type: 'aws-security', 
  //       tooltip: 'AWS IAM',
  //       category: 'Security'
  //     },
  //     { 
  //       id: 'aws-kms', 
  //       icon: () => <AwsIconWrapper LucideIcon={Key} color="#DD344C" />, 
  //       type: 'aws-security', 
  //       tooltip: 'AWS KMS',
  //       category: 'Security'
  //     },
  //     { 
  //       id: 'aws-waf', 
  //       icon: () => <AwsIconWrapper LucideIcon={Shield} color="#DD344C" />, 
  //       type: 'aws-security', 
  //       tooltip: 'AWS WAF',
  //       category: 'Security'
  //     },
  //     { 
  //       id: 'aws-cognito', 
  //       icon: () => <AwsIconWrapper LucideIcon={Users} color="#DD344C" />, 
  //       type: 'aws-security', 
  //       tooltip: 'Amazon Cognito',
  //       category: 'Security'
  //     },
  //     { 
  //       id: 'aws-certificate-manager', 
  //       icon: () => <AwsIconWrapper LucideIcon={Lock} color="#DD344C" />, 
  //       type: 'aws-security', 
  //       tooltip: 'AWS Certificate Manager',
  //       category: 'Security'
  //     },
      
  //     // Management & Governance - Green (#759C3E)
  //     { 
  //       id: 'aws-cloudwatch', 
  //       icon: () => <AwsIconWrapper LucideIcon={Monitor} color="#759C3E" />, 
  //       type: 'aws-management', 
  //       tooltip: 'Amazon CloudWatch',
  //       category: 'Management'
  //     },
  //     { 
  //       id: 'aws-cloudformation', 
  //       icon: () => <AwsIconWrapper LucideIcon={Settings} color="#759C3E" />, 
  //       type: 'aws-management', 
  //       tooltip: 'AWS CloudFormation',
  //       category: 'Management'
  //     },
  //     { 
  //       id: 'aws-config', 
  //       icon: () => <AwsIconWrapper LucideIcon={Settings} color="#759C3E" />, 
  //       type: 'aws-management', 
  //       tooltip: 'AWS Config',
  //       category: 'Management'
  //     },
  //     { 
  //       id: 'aws-cloudtrail', 
  //       icon: () => <AwsIconWrapper LucideIcon={Activity} color="#759C3E" />, 
  //       type: 'aws-management', 
  //       tooltip: 'AWS CloudTrail',
  //       category: 'Management'
  //     },
  //     { 
  //       id: 'aws-systems-manager', 
  //       icon: () => <AwsIconWrapper LucideIcon={Settings} color="#759C3E" />, 
  //       type: 'aws-management', 
  //       tooltip: 'AWS Systems Manager',
  //       category: 'Management'
  //     },
      
  //     // Analytics - Purple (#8C4FFF)
  //     { 
  //       id: 'aws-kinesis', 
  //       icon: () => <AwsIconWrapper LucideIcon={Activity} color="#8C4FFF" />, 
  //       type: 'aws-analytics', 
  //       tooltip: 'Amazon Kinesis',
  //       category: 'Analytics'
  //     },
  //     { 
  //       id: 'aws-emr', 
  //       icon: () => <AwsIconWrapper LucideIcon={Server} color="#8C4FFF" />, 
  //       type: 'aws-analytics', 
  //       tooltip: 'Amazon EMR',
  //       category: 'Analytics'
  //     },
  //     { 
  //       id: 'aws-glue', 
  //       icon: () => <AwsIconWrapper LucideIcon={Network} color="#8C4FFF" />, 
  //       type: 'aws-analytics', 
  //       tooltip: 'AWS Glue',
  //       category: 'Analytics'
  //     },
  //     { 
  //       id: 'aws-athena', 
  //       icon: () => <AwsIconWrapper LucideIcon={Search} color="#8C4FFF" />, 
  //       type: 'aws-analytics', 
  //       tooltip: 'Amazon Athena',
  //       category: 'Analytics'
  //     },
  //     { 
  //       id: 'aws-quicksight', 
  //       icon: () => <AwsIconWrapper LucideIcon={BarChart3} color="#8C4FFF" />, 
  //       type: 'aws-analytics', 
  //       tooltip: 'Amazon QuickSight',
  //       category: 'Analytics'
  //     },
      
  //     // Developer Tools - Dark Green (#4B612C)
  //     { 
  //       id: 'aws-codecommit', 
  //       icon: () => <AwsIconWrapper LucideIcon={GitBranch} color="#4B612C" />, 
  //       type: 'aws-devtools', 
  //       tooltip: 'AWS CodeCommit',
  //       category: 'Developer Tools'
  //     },
  //     { 
  //       id: 'aws-codebuild', 
  //       icon: () => <AwsIconWrapper LucideIcon={Settings} color="#4B612C" />, 
  //       type: 'aws-devtools', 
  //       tooltip: 'AWS CodeBuild',
  //       category: 'Developer Tools'
  //     },
  //     { 
  //       id: 'aws-codedeploy', 
  //       icon: () => <AwsIconWrapper LucideIcon={Zap} color="#4B612C" />, 
  //       type: 'aws-devtools', 
  //       tooltip: 'AWS CodeDeploy',
  //       category: 'Developer Tools'
  //     },
  //     { 
  //       id: 'aws-codepipeline', 
  //       icon: () => <AwsIconWrapper LucideIcon={Workflow} color="#4B612C" />, 
  //       type: 'aws-devtools', 
  //       tooltip: 'AWS CodePipeline',
  //       category: 'Developer Tools'
  //     },
      
  //     // Integration - Light Red (#FF4B4B)
  //     { 
  //       id: 'aws-sqs', 
  //       icon: () => <AwsIconWrapper LucideIcon={MessageSquare} color="#FF4B4B" />, 
  //       type: 'aws-integration', 
  //       tooltip: 'Amazon SQS',
  //       category: 'Integration'
  //     },
  //     { 
  //       id: 'aws-sns', 
  //       icon: () => <AwsIconWrapper LucideIcon={Bell} color="#FF4B4B" />, 
  //       type: 'aws-integration', 
  //       tooltip: 'Amazon SNS',
  //       category: 'Integration'
  //     },
  //     { 
  //       id: 'aws-eventbridge', 
  //       icon: () => <AwsIconWrapper LucideIcon={Network} color="#FF4B4B" />, 
  //       type: 'aws-integration', 
  //       tooltip: 'Amazon EventBridge',
  //       category: 'Integration'
  //     },
  //     { 
  //       id: 'aws-step-functions', 
  //       icon: () => <AwsIconWrapper LucideIcon={Workflow} color="#FF4B4B" />, 
  //       type: 'aws-integration', 
  //       tooltip: 'AWS Step Functions',
  //       category: 'Integration'
  //     },
      
  //     // Machine Learning - Teal (#01A88D)
  //     { 
  //       id: 'aws-sagemaker', 
  //       icon: () => <AwsIconWrapper LucideIcon={Brain} color="#01A88D" />, 
  //       type: 'aws-ml', 
  //       tooltip: 'Amazon SageMaker',
  //       category: 'Machine Learning'
  //     },
  //     { 
  //       id: 'aws-comprehend', 
  //       icon: () => <AwsIconWrapper LucideIcon={Eye} color="#01A88D" />, 
  //       type: 'aws-ml', 
  //       tooltip: 'Amazon Comprehend',
  //       category: 'Machine Learning'
  //     },
  //     { 
  //       id: 'aws-rekognition', 
  //       icon: () => <AwsIconWrapper LucideIcon={Eye} color="#01A88D" />, 
  //       type: 'aws-ml', 
  //       tooltip: 'Amazon Rekognition',
  //       category: 'Machine Learning'
  //     },
  //     { 
  //       id: 'aws-polly', 
  //       icon: () => <AwsIconWrapper LucideIcon={Mic} color="#01A88D" />, 
  //       type: 'aws-ml', 
  //       tooltip: 'Amazon Polly',
  //       category: 'Machine Learning'
  //     },
  //     { 
  //       id: 'aws-transcribe', 
  //       icon: () => <AwsIconWrapper LucideIcon={Mic} color="#01A88D" />, 
  //       type: 'aws-ml', 
  //       tooltip: 'Amazon Transcribe',
  //       category: 'Machine Learning'
  //     },
  //     { 
  //       id: 'aws-translate', 
  //       icon: () => <AwsIconWrapper LucideIcon={Languages} color="#01A88D" />, 
  //       type: 'aws-ml', 
  //       tooltip: 'Amazon Translate',
  //       category: 'Machine Learning'
  //     },
      
  //     // Search - Brown (#9D5025)
  //     { 
  //       id: 'aws-cloudsearch', 
  //       icon: () => <AwsIconWrapper LucideIcon={Search} color="#9D5025" />, 
  //       type: 'aws-search', 
  //       tooltip: 'Amazon CloudSearch',
  //       category: 'Search'
  //     },
  //     { 
  //       id: 'aws-elasticsearch', 
  //       icon: () => <AwsIconWrapper LucideIcon={Search} color="#9D5025" />, 
  //       type: 'aws-search', 
  //       tooltip: 'Amazon Elasticsearch',
  //       category: 'Search'
  //     },
  //     { 
  //       id: 'aws-opensearch', 
  //       icon: () => <AwsIconWrapper LucideIcon={Search} color="#9D5025" />, 
  //       type: 'aws-search', 
  //       tooltip: 'Amazon OpenSearch',
  //       category: 'Search'
  //     }
  //   ]
  // },

  // Azure Services
  // azure: {
  //   name: 'Azure',
  //   icon: Cloud,
  //   collapsed: true,
  //   layout: 'grid',
  //   shapes: [
  //     { id: 'azure-vm', icon: Server, type: 'azure-compute', tooltip: 'Virtual Machines', color: '#0078D4' },
  //     { id: 'azure-functions', icon: Zap, type: 'azure-compute', tooltip: 'Azure Functions', color: '#0078D4' },
  //     { id: 'azure-storage', icon: Folder, type: 'azure-storage', tooltip: 'Azure Storage', color: '#0078D4' },
  //     { id: 'azure-sql', icon: Database, type: 'azure-database', tooltip: 'Azure SQL Database', color: '#0078D4' },
  //     { id: 'azure-cosmos', icon: Database, type: 'azure-database', tooltip: 'Azure Cosmos DB', color: '#0078D4' },
  //     { id: 'azure-vnet', icon: Network, type: 'azure-network', tooltip: 'Virtual Network', color: '#0078D4' },
  //     { id: 'azure-lb', icon: Network, type: 'azure-network', tooltip: 'Load Balancer', color: '#0078D4' },
  //     { id: 'azure-ad', icon: Shield, type: 'azure-security', tooltip: 'Azure Active Directory', color: '#0078D4' }
  //   ]
  // },

  // Google Cloud
  // gcp: {
  //   name: 'Google Cloud',
  //   icon: Cloud,
  //   collapsed: true,
  //   layout: 'grid',
  //   shapes: [
  //     { id: 'gcp-compute', icon: Server, type: 'gcp-compute', tooltip: 'Compute Engine', color: '#4285F4' },
  //     { id: 'gcp-functions', icon: Zap, type: 'gcp-compute', tooltip: 'Cloud Functions', color: '#4285F4' },
  //     { id: 'gcp-storage', icon: Folder, type: 'gcp-storage', tooltip: 'Cloud Storage', color: '#4285F4' },
  //     { id: 'gcp-sql', icon: Database, type: 'gcp-database', tooltip: 'Cloud SQL', color: '#4285F4' },
  //     { id: 'gcp-firestore', icon: Database, type: 'gcp-database', tooltip: 'Firestore', color: '#4285F4' },
  //     { id: 'gcp-vpc', icon: Network, type: 'gcp-network', tooltip: 'VPC Network', color: '#4285F4' },
  //     { id: 'gcp-lb', icon: Network, type: 'gcp-network', tooltip: 'Load Balancer', color: '#4285F4' }
  //   ]
  // },

  // Infrastructure & Network
  infrastructure: {
    name: 'Infrastructure',
    icon: Server,
    collapsed: true,
    layout: 'grid',
    shapes: [
      { id: 'server', icon: Server, type: 'infrastructure', tooltip: 'Server' },
      { id: 'database', icon: Database, type: 'infrastructure', tooltip: 'Database' },
      { id: 'cloud', icon: Cloud, type: 'infrastructure', tooltip: 'Cloud' },
      { id: 'router', icon: Router, type: 'infrastructure', tooltip: 'Router' },
      { id: 'firewall', icon: Shield, type: 'infrastructure', tooltip: 'Firewall' },
      { id: 'load-balancer', icon: Network, type: 'infrastructure', tooltip: 'Load Balancer' },
      { id: 'cdn', icon: Globe, type: 'infrastructure', tooltip: 'CDN' },
      { id: 'vpn', icon: Lock, type: 'infrastructure', tooltip: 'VPN' }
    ]
  },

  // Users & Devices
  users: {
    name: 'Users & Devices',
    icon: Users,
    collapsed: true,
    layout: 'grid',
    shapes: [
      { id: 'user', icon: User, type: 'user', tooltip: 'User' },
      { id: 'users', icon: Users, type: 'user', tooltip: 'Users' },
      { id: 'admin', icon: Shield, type: 'user', tooltip: 'Administrator' },
      { id: 'desktop', icon: Monitor, type: 'device', tooltip: 'Desktop' },
      { id: 'mobile', icon: Smartphone, type: 'device', tooltip: 'Mobile Device' },
      { id: 'wifi', icon: Wifi, type: 'device', tooltip: 'WiFi' }
    ]
  },

  // Enterprise
  enterprise: {
    name: 'Enterprise',
    icon: Building,
    collapsed: true,
    layout: 'grid',
    shapes: [
      { id: 'building', icon: Building, type: 'enterprise', tooltip: 'Building' },
      { id: 'datacenter', icon: Server, type: 'enterprise', tooltip: 'Data Center' },
      { id: 'office', icon: Building, type: 'enterprise', tooltip: 'Office' },
      { id: 'factory', icon: Factory, type: 'enterprise', tooltip: 'Factory' },
      { id: 'branch', icon: Building, type: 'enterprise', tooltip: 'Branch Office' }
    ]
  },

  // UML
  uml: {
    name: 'UML',
    icon: Square,
    collapsed: true,
    layout: 'grid',
    shapes: [
      { id: 'class', icon: Square, type: 'uml', tooltip: 'Class' },
      { id: 'actor', icon: User, type: 'uml', tooltip: 'Actor' },
      { id: 'usecase', icon: Circle, type: 'uml', tooltip: 'Use Case' },
      { id: 'component', icon: Square, type: 'uml', tooltip: 'Component' },
      { id: 'package', icon: Folder, type: 'uml', tooltip: 'Package' },
      { id: 'interface', icon: Circle, type: 'uml', tooltip: 'Interface' }
    ]
  },
  

};

// Helper function to get shape by ID across all categories including BPMN and Cloud Services
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findShapeById = (shapeId: any) => {
  // First search in regular shape categories
  for (const category of Object.values(shapeCategories)) {
    const shape = category.shapes.find(s => s.id === shapeId);
    if (shape) return shape;
  }
  
  // Then search in BPMN shapes
  for (const category of Object.values(bpmnShapes)) {
    const shape = (category.shapes as any)[shapeId];
    if (shape) {
      return {
        id: shapeId,
        name: shape.name,
        tooltip: shape.tooltip,
        icon: shape.icon,
        width: shape.width,
        height: shape.height
      };
    }
  }
  
  // Then search in Cloud Services (AWS, GCP, Azure)
  // Import cloud services dynamically to avoid circular dependencies
  try {
    // Search in AWS services
    for (const category of Object.values(awsServices)) {
      if ((category as any)[shapeId]) {
        const service = (category as any)[shapeId];
        return {
          id: shapeId,
          name: service.name,
          tooltip: service.description,
          icon: service.icon,
          width: 120,
          height: 80,
          serviceType: 'aws',
          serviceName: service.name,
          description: service.description,
          category: service.category
        };
      }
    }
    
    // Search in Google Cloud services
    for (const category of Object.values(googleCloudServices)) {
      if ((category as any)[shapeId]) {
        const service = (category as any)[shapeId];
        return {
          id: shapeId,
          name: service.name,
          tooltip: service.description,
          icon: service.icon,
          width: 120,
          height: 80,
          serviceType: 'gcp',
          serviceName: service.name,
          description: service.description,
          category: service.category
        };
      }
    }
    
    // Search in Azure services
    for (const category of Object.values(azureServices)) {
      if ((category as any)[shapeId]) {
        const service = (category as any)[shapeId];
        return {
          id: shapeId,
          name: service.name,
          tooltip: service.description,
          icon: service.icon,
          width: 120,
          height: 80,
          serviceType: 'azure',
          serviceName: service.name,
          description: service.description,
          category: service.category
        };
      }
    }
  } catch (error) {
    console.warn('Could not load cloud services for shape lookup:', error);
  }
  
  return null;
};

// Helper function to get all shapes as flat array
export const getAllShapes = () => {
  return Object.values(shapeCategories).flatMap(category => category.shapes);
};

// Helper function to get shapes by type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getShapesByType = (type: any) => {
  return getAllShapes().filter((shape: any) => shape.type === type);
};