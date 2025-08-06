import React from 'react';

// Import AWS SVG icons as React components using ?react suffix for vite-plugin-svgr
import AWSEC2Icon from '../../assets/icons/aws/ec2.svg?react';
import AWSS3Icon from '../../assets/icons/aws/s3.svg?react';
import AWSLambdaIcon from '../../assets/icons/aws/lambda.svg?react';
import AWSRDSIcon from '../../assets/icons/aws/rds.svg?react';
import AWSVPCIcon from '../../assets/icons/aws/vpc.svg?react';
import AWSIAMIcon from '../../assets/icons/aws/iam.svg?react';
import AWSECSIcon from '../../assets/icons/aws/ecs.svg?react';
import AWSEKSIcon from '../../assets/icons/aws/eks.svg?react';
import AWSDynamoDBIcon from '../../assets/icons/aws/dynamodb.svg?react';
import AWSRedshiftIcon from '../../assets/icons/aws/redshift.svg?react';
import AWSALBIcon from '../../assets/icons/aws/alb.svg?react';
import AWSRoute53Icon from '../../assets/icons/aws/route53.svg?react';
import AWSKMSIcon from '../../assets/icons/aws/kms.svg?react';
import AWSEBSIcon from '../../assets/icons/aws/ebs.svg?react';
import AWSEFSIcon from '../../assets/icons/aws/efs.svg?react';

// Import Azure SVG icons as React components
import AzureVMIcon from '../../assets/icons/azure/virtual-machine.svg?react';
import AzureStorageIcon from '../../assets/icons/azure/storage.svg?react';
import AzureFunctionsIcon from '../../assets/icons/azure/functions.svg?react';
import AzureAKSIcon from '../../assets/icons/azure/aks.svg?react';
import AzureSQLIcon from '../../assets/icons/azure/sql.svg?react';
import AzureCosmosDBIcon from '../../assets/icons/azure/cosmosdb.svg?react';
import AzureVNetIcon from '../../assets/icons/azure/vnet.svg?react';
import AzureLoadBalancerIcon from '../../assets/icons/azure/load-balancer.svg?react';
import AzureDiskIcon from '../../assets/icons/azure/disk.svg?react';
import AzureKeyVaultIcon from '../../assets/icons/azure/key-vault.svg?react';
import AzureActiveDirectoryIcon from '../../assets/icons/azure/active-directory.svg?react';

// Import GCP SVG icons as React components
import GCPComputeIcon from '../../assets/icons/gcp/compute-engine.svg?react';
import GCPStorageIcon from '../../assets/icons/gcp/cloud-storage.svg?react';
import GCPFunctionsIcon from '../../assets/icons/gcp/cloud-functions.svg?react';
import GCPGKEIcon from '../../assets/icons/gcp/gke.svg?react';
import GCPCloudSQLIcon from '../../assets/icons/gcp/cloud-sql.svg?react';
import GCPFirestoreIcon from '../../assets/icons/gcp/firestore.svg?react';
import GCPBigQueryIcon from '../../assets/icons/gcp/bigquery.svg?react';
import GCPVPCIcon from '../../assets/icons/gcp/vpc.svg?react';
import GCPLoadBalancerIcon from '../../assets/icons/gcp/load-balancer.svg?react';
import GCPPersistentDiskIcon from '../../assets/icons/gcp/persistent-disk.svg?react';
import GCPIAMIcon from '../../assets/icons/gcp/iam.svg?react';
import GCPKMSIcon from '../../assets/icons/gcp/kms.svg?react';

// AWS Service Icons - Using SVG React components from files
const AWSIcons = {
  'aws-ec2': (
    <AWSEC2Icon className="w-6 h-6" />
  ),
  'aws-lambda': (
    <AWSLambdaIcon className="w-6 h-6" />
  ),
  'aws-s3': (
    <AWSS3Icon className="w-6 h-6" />
  ),
  'aws-rds': (
    <AWSRDSIcon className="w-6 h-6" />
  ),
  'aws-vpc': (
    <AWSVPCIcon className="w-6 h-6" />
  ),
  'aws-iam': (
    <AWSIAMIcon className="w-6 h-6" />
  ),
  'aws-ecs': (
    <AWSECSIcon className="w-6 h-6" />
  ),
  'aws-eks': (
    <AWSEKSIcon className="w-6 h-6" />
  ),
  'aws-dynamodb': (
    <AWSDynamoDBIcon className="w-6 h-6" />
  ),
  'aws-redshift': (
    <AWSRedshiftIcon className="w-6 h-6" />
  ),
  'aws-alb': (
    <AWSALBIcon className="w-6 h-6" />
  ),
  'aws-route53': (
    <AWSRoute53Icon className="w-6 h-6" />
  ),
  'aws-kms': (
    <AWSKMSIcon className="w-6 h-6" />
  ),
  'aws-ebs': (
    <AWSEBSIcon className="w-6 h-6" />
  ),
  'aws-efs': (
    <AWSEFSIcon className="w-6 h-6" />
  )
};

// Google Cloud Service Icons - Using SVG React components from files
const GCPIcons = {
  'gcp-compute-engine': (
    <GCPComputeIcon className="w-6 h-6" />
  ),
  'gcp-cloud-functions': (
    <GCPFunctionsIcon className="w-6 h-6" />
  ),
  'gcp-gke': (
    <GCPGKEIcon className="w-6 h-6" />
  ),
  'gcp-cloud-storage': (
    <GCPStorageIcon className="w-6 h-6" />
  ),
  'gcp-cloud-sql': (
    <GCPCloudSQLIcon className="w-6 h-6" />
  ),
  'gcp-firestore': (
    <GCPFirestoreIcon className="w-6 h-6" />
  ),
  'gcp-bigquery': (
    <GCPBigQueryIcon className="w-6 h-6" />
  ),
  'gcp-vpc': (
    <GCPVPCIcon className="w-6 h-6" />
  ),
  'gcp-load-balancer': (
    <GCPLoadBalancerIcon className="w-6 h-6" />
  ),
  'gcp-persistent-disk': (
    <GCPPersistentDiskIcon className="w-6 h-6" />
  ),
  'gcp-iam': (
    <GCPIAMIcon className="w-6 h-6" />
  ),
  'gcp-kms': (
    <GCPKMSIcon className="w-6 h-6" />
  )
};

// Azure Service Icons - Using SVG React components from files
const AzureIcons = {
  'azure-vm': (
    <AzureVMIcon className="w-6 h-6" />
  ),
  'azure-functions': (
    <AzureFunctionsIcon className="w-6 h-6" />
  ),
  'azure-aks': (
    <AzureAKSIcon className="w-6 h-6" />
  ),
  'azure-storage': (
    <AzureStorageIcon className="w-6 h-6" />
  ),
  'azure-sql': (
    <AzureSQLIcon className="w-6 h-6" />
  ),
  'azure-cosmosdb': (
    <AzureCosmosDBIcon className="w-6 h-6" />
  ),
  'azure-vnet': (
    <AzureVNetIcon className="w-6 h-6" />
  ),
  'azure-lb': (
    <AzureLoadBalancerIcon className="w-6 h-6" />
  ),
  'azure-disk': (
    <AzureDiskIcon className="w-6 h-6" />
  ),
  'azure-key-vault': (
    <AzureKeyVaultIcon className="w-6 h-6" />
  ),
  'azure-ad': (
    <AzureActiveDirectoryIcon className="w-6 h-6" />
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
      icon: GCPIcons['gcp-iam'],
      color: '#4285F4'
    },
    'gcp-kms': {
      name: 'KMS',
      category: 'Security',
      description: 'Key Management Service',
      icon: GCPIcons['gcp-kms'],
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
      icon: AzureIcons['azure-key-vault'],
      color: '#0078D4'
    },
    'azure-ad': {
      name: 'Active Directory',
      category: 'Security',
      description: 'Identity Management',
      icon: AzureIcons['azure-ad'],
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