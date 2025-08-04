import React from 'react';

// AWS Service Icons - Using proper SVG icons
const AWSIcons = {
  'aws-ec2': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M12 10l2 1.5v3L12 16l-2-1.5v-3L12 10z"/>
    </svg>
  ),
  'aws-lambda': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
    </svg>
  ),
  'aws-s3': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h6"/>
    </svg>
  ),
  'aws-rds': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      <path d="M12 6l-3 3 3 3 3-3-3-3z"/>
    </svg>
  ),
  'aws-vpc': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h8"/>
    </svg>
  ),
  'aws-iam': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M12 10l2 1.5v3L12 16l-2-1.5v-3L12 10z"/>
      <path d="M12 12l1 0.5v1L12 14l-1-0.5v-1L12 12z"/>
    </svg>
  ),
  'aws-ecs': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="8" cy="10" r="1"/>
      <circle cx="16" cy="10" r="1"/>
      <circle cx="8" cy="14" r="1"/>
      <circle cx="16" cy="14" r="1"/>
    </svg>
  ),
  'aws-eks': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="8" cy="10" r="1"/>
      <circle cx="16" cy="10" r="1"/>
      <circle cx="8" cy="14" r="1"/>
      <circle cx="16" cy="14" r="1"/>
    </svg>
  ),
  'aws-dynamodb': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M12 10l2 1.5v3L12 16l-2-1.5v-3L12 10z"/>
      <path d="M12 12l1 0.5v1L12 14l-1-0.5v-1L12 12z"/>
    </svg>
  ),
  'aws-redshift': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h6"/>
      <path d="M10 8h4M10 16h4"/>
    </svg>
  ),
  'aws-alb': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h8"/>
      <path d="M10 8h4M10 16h4"/>
    </svg>
  ),
  'aws-route53': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      <path d="M12 6l-3 3 3 3 3-3-3-3z"/>
    </svg>
  ),
  'aws-kms': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M12 10l2 1.5v3L12 16l-2-1.5v-3L12 10z"/>
      <path d="M12 12l1 0.5v1L12 14l-1-0.5v-1L12 12z"/>
    </svg>
  ),
  'aws-ebs': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  'aws-efs': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h6"/>
    </svg>
  )
};

// Google Cloud Service Icons - Using proper SVG icons
const GCPIcons = {
  'gcp-compute-engine': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="8" cy="10" r="1"/>
      <circle cx="16" cy="10" r="1"/>
      <circle cx="8" cy="14" r="1"/>
      <circle cx="16" cy="14" r="1"/>
    </svg>
  ),
  'gcp-cloud-functions': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
    </svg>
  ),
  'gcp-gke': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="8" cy="10" r="1"/>
      <circle cx="16" cy="10" r="1"/>
      <circle cx="8" cy="14" r="1"/>
      <circle cx="16" cy="14" r="1"/>
    </svg>
  ),
  'gcp-cloud-storage': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h6"/>
    </svg>
  ),
  'gcp-cloud-sql': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      <path d="M12 6l-3 3 3 3 3-3-3-3z"/>
    </svg>
  ),
  'gcp-firestore': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M12 10l2 1.5v3L12 16l-2-1.5v-3L12 10z"/>
      <path d="M12 12l1 0.5v1L12 14l-1-0.5v-1L12 12z"/>
    </svg>
  ),
  'gcp-bigquery': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h6"/>
      <path d="M10 8h4M10 16h4"/>
    </svg>
  ),
  'gcp-vpc': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h8"/>
    </svg>
  ),
  'gcp-load-balancer': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 10h8M8 12h8M8 14h8"/>
      <path d="M10 8h4M10 16h4"/>
    </svg>
  ),
  'gcp-persistent-disk': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
};

// Azure Service Icons - Custom SVG icons (we can add real Azure icons later)
const AzureIcons = {
  'azure-vm': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M12 10l2 1.5v3L12 16l-2-1.5v-3L12 10z"/>
    </svg>
  ),
  'azure-functions': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
    </svg>
  ),
  'azure-aks': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <circle cx="12" cy="12" r="2"/>
      <circle cx="8" cy="10" r="1"/>
      <circle cx="16" cy="10" r="1"/>
      <circle cx="8" cy="14" r="1"/>
      <circle cx="16" cy="14" r="1"/>
    </svg>
  ),
  'azure-storage': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/>
      <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
      <path d="M9 9h2v2H9V9zm0 4h2v2H9v-2z"/>
    </svg>
  ),
  'azure-sql': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      <path d="M12 6l-3 3 3 3 3-3-3-3z"/>
    </svg>
  ),
  'azure-cosmosdb': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M12 10l2 1.5v3L12 16l-2-1.5v-3L12 10z"/>
      <path d="M12 12l1 0.5v1L12 14l-1-0.5v-1L12 12z"/>
    </svg>
  ),
  'azure-vnet': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
    </svg>
  ),
  'azure-lb': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <path d="M8 12h8M8 10h8M8 14h8"/>
    </svg>
  ),
  'azure-disk': (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
      <path d="M12 6l6 3.5v7L12 18l-6-3.5v-7L12 6z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
};

// AWS Service Icons
export const awsServices = {
  compute: {
    'aws-ec2': {
      name: 'EC2',
      category: 'Compute',
      description: 'Elastic Compute Cloud',
      icon: AWSIcons['aws-ec2'],
      color: '#FF9900'
    },
    'aws-lambda': {
      name: 'Lambda',
      category: 'Compute',
      description: 'Serverless Computing',
      icon: AWSIcons['aws-lambda'],
      color: '#FF9900'
    },
    'aws-ecs': {
      name: 'ECS',
      category: 'Compute',
      description: 'Elastic Container Service',
      icon: AWSIcons['aws-ecs'],
      color: '#FF9900'
    },
    'aws-eks': {
      name: 'EKS',
      category: 'Compute',
      description: 'Elastic Kubernetes Service',
      icon: AWSIcons['aws-eks'],
      color: '#FF9900'
    }
  },
  storage: {
    'aws-s3': {
      name: 'S3',
      category: 'Storage',
      description: 'Simple Storage Service',
      icon: AWSIcons['aws-s3'],
      color: '#FF9900'
    },
    'aws-ebs': {
      name: 'EBS',
      category: 'Storage',
      description: 'Elastic Block Store',
      icon: AWSIcons['aws-ebs'],
      color: '#FF9900'
    },
    'aws-efs': {
      name: 'EFS',
      category: 'Storage',
      description: 'Elastic File System',
      icon: AWSIcons['aws-efs'],
      color: '#FF9900'
    }
  },
  database: {
    'aws-rds': {
      name: 'RDS',
      category: 'Database',
      description: 'Relational Database Service',
      icon: AWSIcons['aws-rds'],
      color: '#FF9900'
    },
    'aws-dynamodb': {
      name: 'DynamoDB',
      category: 'Database',
      description: 'NoSQL Database',
      icon: AWSIcons['aws-dynamodb'],
      color: '#FF9900'
    },
    'aws-redshift': {
      name: 'Redshift',
      category: 'Database',
      description: 'Data Warehouse',
      icon: AWSIcons['aws-redshift'],
      color: '#FF9900'
    }
  },
  networking: {
    'aws-vpc': {
      name: 'VPC',
      category: 'Networking',
      description: 'Virtual Private Cloud',
      icon: AWSIcons['aws-vpc'],
      color: '#FF9900'
    },
    'aws-alb': {
      name: 'ALB',
      category: 'Networking',
      description: 'Application Load Balancer',
      icon: AWSIcons['aws-alb'],
      color: '#FF9900'
    },
    'aws-route53': {
      name: 'Route 53',
      category: 'Networking',
      description: 'DNS Service',
      icon: AWSIcons['aws-route53'],
      color: '#FF9900'
    }
  },
  security: {
    'aws-iam': {
      name: 'IAM',
      category: 'Security',
      description: 'Identity & Access Management',
      icon: AWSIcons['aws-iam'],
      color: '#FF9900'
    },
    'aws-kms': {
      name: 'KMS',
      category: 'Security',
      description: 'Key Management Service',
      icon: AWSIcons['aws-kms'],
      color: '#FF9900'
    }
  }
};

// Google Cloud Service Icons
export const googleCloudServices = {
  compute: {
    'gcp-compute-engine': {
      name: 'Compute Engine',
      category: 'Compute',
      description: 'Virtual Machines',
      icon: GCPIcons['gcp-compute-engine'],
      color: '#4285F4'
    },
    'gcp-cloud-functions': {
      name: 'Cloud Functions',
      category: 'Compute',
      description: 'Serverless Functions',
      icon: GCPIcons['gcp-cloud-functions'],
      color: '#4285F4'
    },
    'gcp-gke': {
      name: 'GKE',
      category: 'Compute',
      description: 'Google Kubernetes Engine',
      icon: GCPIcons['gcp-gke'],
      color: '#4285F4'
    }
  },
  storage: {
    'gcp-cloud-storage': {
      name: 'Cloud Storage',
      category: 'Storage',
      description: 'Object Storage',
      icon: GCPIcons['gcp-cloud-storage'],
      color: '#4285F4'
    },
    'gcp-persistent-disk': {
      name: 'Persistent Disk',
      category: 'Storage',
      description: 'Block Storage',
      icon: GCPIcons['gcp-persistent-disk'],
      color: '#4285F4'
    }
  },
  database: {
    'gcp-cloud-sql': {
      name: 'Cloud SQL',
      category: 'Database',
      description: 'Managed SQL',
      icon: GCPIcons['gcp-cloud-sql'],
      color: '#4285F4'
    },
    'gcp-firestore': {
      name: 'Firestore',
      category: 'Database',
      description: 'NoSQL Database',
      icon: GCPIcons['gcp-firestore'],
      color: '#4285F4'
    },
    'gcp-bigquery': {
      name: 'BigQuery',
      category: 'Database',
      description: 'Data Warehouse',
      icon: GCPIcons['gcp-bigquery'],
      color: '#4285F4'
    }
  },
  networking: {
    'gcp-vpc': {
      name: 'VPC',
      category: 'Networking',
      description: 'Virtual Private Cloud',
      icon: GCPIcons['gcp-vpc'],
      color: '#4285F4'
    },
    'gcp-load-balancer': {
      name: 'Load Balancer',
      category: 'Networking',
      description: 'Cloud Load Balancing',
      icon: GCPIcons['gcp-load-balancer'],
      color: '#4285F4'
    }
  },
  security: {
    'gcp-iam': {
      name: 'IAM',
      category: 'Security',
      description: 'Identity & Access Management',
      icon: GCPIcons['gcp-compute-engine'], // Fallback icon
      color: '#4285F4'
    },
    'gcp-kms': {
      name: 'KMS',
      category: 'Security',
      description: 'Key Management Service',
      icon: GCPIcons['gcp-compute-engine'], // Fallback icon
      color: '#4285F4'
    }
  }
};

// Azure Service Icons
export const azureServices = {
  compute: {
    'azure-vm': {
      name: 'Virtual Machines',
      category: 'Compute',
      description: 'Cloud Virtual Machines',
      icon: AzureIcons['azure-vm'],
      color: '#0078D4'
    },
    'azure-functions': {
      name: 'Functions',
      category: 'Compute',
      description: 'Serverless Functions',
      icon: AzureIcons['azure-functions'],
      color: '#0078D4'
    },
    'azure-aks': {
      name: 'AKS',
      category: 'Compute',
      description: 'Azure Kubernetes Service',
      icon: AzureIcons['azure-aks'],
      color: '#0078D4'
    }
  },
  storage: {
    'azure-storage': {
      name: 'Storage',
      category: 'Storage',
      description: 'Cloud Storage',
      icon: AzureIcons['azure-storage'],
      color: '#0078D4'
    },
    'azure-disk': {
      name: 'Managed Disks',
      category: 'Storage',
      description: 'Block Storage',
      icon: AzureIcons['azure-disk'],
      color: '#0078D4'
    }
  },
  database: {
    'azure-sql': {
      name: 'SQL Database',
      category: 'Database',
      description: 'Managed SQL',
      icon: AzureIcons['azure-sql'],
      color: '#0078D4'
    },
    'azure-cosmosdb': {
      name: 'Cosmos DB',
      category: 'Database',
      description: 'NoSQL Database',
      icon: AzureIcons['azure-cosmosdb'],
      color: '#0078D4'
    }
  },
  networking: {
    'azure-vnet': {
      name: 'Virtual Network',
      category: 'Networking',
      description: 'Virtual Network',
      icon: AzureIcons['azure-vnet'],
      color: '#0078D4'
    },
    'azure-lb': {
      name: 'Load Balancer',
      category: 'Networking',
      description: 'Load Balancer',
      icon: AzureIcons['azure-lb'],
      color: '#0078D4'
    }
  },
  security: {
    'azure-key-vault': {
      name: 'Key Vault',
      category: 'Security',
      description: 'Key Management',
      icon: AzureIcons['azure-vm'], // Using VM icon as fallback
      color: '#0078D4'
    },
    'azure-ad': {
      name: 'Active Directory',
      category: 'Security',
      description: 'Identity Management',
      icon: AzureIcons['azure-vm'], // Using VM icon as fallback
      color: '#0078D4'
    }
  }
};

// Cloud Service Icon Component
interface CloudServiceIconProps {
  serviceId: string;
  service: {
    name: string;
    category: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  };
  onDragStart: (e: React.DragEvent, serviceId: string) => void;
}

export const CloudServiceIcon: React.FC<CloudServiceIconProps> = ({ 
  serviceId, 
  service, 
  onDragStart 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log('🔄 Drag started for service:', serviceId, service);
    onDragStart(e, serviceId);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
      title={`${service.name} - ${service.description}`}
    >
      <div 
        className="mb-2 flex items-center justify-center"
        style={{ color: service.color }}
      >
        {service.icon}
      </div>
      <div className="text-xs font-medium text-gray-700 text-center">
        {service.name}
      </div>
      <div className="text-xs text-gray-500 text-center mt-1">
        {service.category}
      </div>
    </div>
  );
};

// Service Category Component
interface ServiceCategoryProps {
  title: string;
  services: Record<string, any>;
  onDragStart: (e: React.DragEvent, serviceId: string) => void;
}

export const ServiceCategory: React.FC<ServiceCategoryProps> = ({ 
  title, 
  services, 
  onDragStart 
}) => {
  // Safety check to prevent Object.entries error
  if (!services || typeof services !== 'object') {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">
          {title}
        </h3>
        <div className="text-xs text-gray-500 px-2">
          No services available
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 px-2">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(services).map(([serviceId, service]) => (
          <CloudServiceIcon
            key={serviceId}
            serviceId={serviceId}
            service={service}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}; 