// architectureDig.tsx - Architecture and cloud shape definitions
import { 
  Square, 
  Circle, 
  Triangle, 
  Diamond, 
  Hexagon, 
  Star, 
  Minus, 
  Type, 
  Cloud, 
  Server, 
  Database, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  Users, 
  User, 
  Building, 
  Shield, 
  Wifi, 
  HardDrive, 
  Cpu, 
  Router, 
  Zap
} from 'lucide-react';

// Basic shape categories
export const architectureShapeCategories = {
  general: {
    name: 'General',
    icon: '🔧',
    collapsed: false,
    layout: 'grid',
    shapes: {
      rectangle: { name: 'Rectangle', icon: Square, width: 100, height: 60 },
      circle: { name: 'Circle', icon: Circle, width: 80, height: 80 },
      triangle: { name: 'Triangle', icon: Triangle, width: 80, height: 80 },
      diamond: { name: 'Diamond', icon: Diamond, width: 80, height: 80 },
      hexagon: { name: 'Hexagon', icon: Hexagon, width: 80, height: 80 },
      star: { name: 'Star', icon: Star, width: 80, height: 80 },
    }
  },
  basic: {
    name: 'Basic',
    icon: '📐',
    collapsed: false,
    layout: 'grid',
    shapes: {
      line: { name: 'Line', icon: Minus, width: 100, height: 4 },
      text: { name: 'Text', icon: Type, width: 100, height: 30 },
      cloud: { name: 'Cloud', icon: Cloud, width: 100, height: 60 },
      server: { name: 'Server', icon: Server, width: 100, height: 60 },
      database: { name: 'Database', icon: Database, width: 100, height: 60 },
    }
  },
  cloud: {
    name: 'Cloud',
    icon: '☁️',
    collapsed: false,
    layout: 'grid',
    shapes: {
      'cloud-service': { name: 'Cloud Service', icon: Cloud, width: 100, height: 60 },
      'load-balancer': { name: 'Load Balancer', icon: Server, width: 100, height: 60 },
      cdn: { name: 'CDN', icon: Cloud, width: 100, height: 60 },
      vpn: { name: 'VPN', icon: Shield, width: 100, height: 60 },
    }
  },
  infrastructure: {
    name: 'Infrastructure',
    icon: '🏗️',
    collapsed: false,
    layout: 'grid',
    shapes: {
      router: { name: 'Router', icon: Router, width: 100, height: 60 },
      firewall: { name: 'Firewall', icon: Shield, width: 100, height: 60 },
      server: { name: 'Server', icon: Server, width: 100, height: 60 },
      database: { name: 'Database', icon: Database, width: 100, height: 60 },
      storage: { name: 'Storage', icon: HardDrive, width: 100, height: 60 },
    }
  },
  security: {
    name: 'Security',
    icon: '🔒',
    collapsed: false,
    layout: 'grid',
    shapes: {
      firewall: { name: 'Firewall', icon: Shield, width: 100, height: 60 },
      vpn: { name: 'VPN', icon: Shield, width: 100, height: 60 },
      encryption: { name: 'Encryption', icon: Shield, width: 100, height: 60 },
      authentication: { name: 'Authentication', icon: User, width: 100, height: 60 },
    }
  },
  data: {
    name: 'Data',
    icon: '📊',
    collapsed: false,
    layout: 'grid',
    shapes: {
      database: { name: 'Database', icon: Database, width: 100, height: 60 },
      storage: { name: 'Storage', icon: HardDrive, width: 100, height: 60 },
      'data-warehouse': { name: 'Data Warehouse', icon: Database, width: 100, height: 60 },
      analytics: { name: 'Analytics', icon: Database, width: 100, height: 60 },
    }
  },
  compute: {
    name: 'Compute',
    icon: '⚡',
    collapsed: false,
    layout: 'grid',
    shapes: {
      server: { name: 'Server', icon: Server, width: 100, height: 60 },
      cpu: { name: 'CPU', icon: Cpu, width: 100, height: 60 },
      'virtual-machine': { name: 'Virtual Machine', icon: Server, width: 100, height: 60 },
      container: { name: 'Container', icon: Server, width: 100, height: 60 },
    }
  },
  users: {
    name: 'Users',
    icon: '👥',
    collapsed: false,
    layout: 'grid',
    shapes: {
      user: { name: 'User', icon: User, width: 100, height: 60 },
      users: { name: 'Users', icon: Users, width: 100, height: 60 },
      admin: { name: 'Admin', icon: User, width: 100, height: 60 },
      group: { name: 'Group', icon: Users, width: 100, height: 60 },
    }
  },
  enterprise: {
    name: 'Enterprise',
    icon: '🏢',
    collapsed: false,
    layout: 'grid',
    shapes: {
      building: { name: 'Building', icon: Building, width: 100, height: 60 },
      datacenter: { name: 'Data Center', icon: Server, width: 100, height: 60 },
      office: { name: 'Office', icon: Building, width: 100, height: 60 },
      network: { name: 'Network', icon: Wifi, width: 100, height: 60 },
    }
  },
  text: {
    name: 'Text',
    icon: '📝',
    collapsed: false,
    layout: 'grid',
    shapes: {
      text: { name: 'Text', icon: Type, width: 100, height: 30 },
      label: { name: 'Label', icon: Type, width: 100, height: 30 },
      title: { name: 'Title', icon: Type, width: 100, height: 30 },
      note: { name: 'Note', icon: FileText, width: 100, height: 60 },
    }
  },
  flowchart: {
    name: 'Flowchart',
    icon: '📋',
    collapsed: false,
    layout: 'grid',
    shapes: {
             process: { name: 'Process', icon: Square, width: 100, height: 60 },
      decision: { name: 'Decision', icon: Diamond, width: 80, height: 80 },
      document: { name: 'Document', icon: FileText, width: 100, height: 60 },
      data: { name: 'Data', icon: Database, width: 100, height: 60 },
      connector: { name: 'Connector', icon: Circle, width: 60, height: 60 },
      terminator: { name: 'Terminator', icon: Circle, width: 80, height: 80 },
    }
  },
  arrows: {
    name: 'Arrows',
    icon: '➡️',
    collapsed: false,
    layout: 'grid',
    shapes: {
      'arrow-right': { name: 'Arrow Right', icon: ArrowRight, width: 100, height: 20 },
      'arrow-left': { name: 'Arrow Left', icon: ArrowLeft, width: 100, height: 20 },
      'arrow-up': { name: 'Arrow Up', icon: ArrowUp, width: 20, height: 100 },
      'arrow-down': { name: 'Arrow Down', icon: ArrowDown, width: 20, height: 100 },
    }
  }
};