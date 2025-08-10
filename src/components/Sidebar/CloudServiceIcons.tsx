import React from 'react';

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

// Import commonly used AWS SVG icons as React components
import AWSEC2Icon from '../../assets/icons/aws/Arch_Amazon-EC2_64.svg?react';
import AWSS3Icon from '../../assets/icons/aws/Arch_Amazon-Simple-Storage-Service_64.svg?react';
import AWSLambdaIcon from '../../assets/icons/aws/Arch_AWS-Lambda_64.svg?react';
import AWSRDSIcon from '../../assets/icons/aws/Arch_Amazon-RDS_64.svg?react';
import AWSVPCIcon from '../../assets/icons/aws/Arch_Amazon-Virtual-Private-Cloud_64.svg?react';
import AWSCloudFormationIcon from '../../assets/icons/aws/Arch_AWS-CloudFormation_64.svg?react';
import AWSCloudWatchIcon from '../../assets/icons/aws/Arch_Amazon-CloudWatch_64.svg?react';
import AWSIAMIcon from '../../assets/icons/aws/Arch_AWS-Identity-and-Access-Management_64.svg?react';
import AWSDynamoDBIcon from '../../assets/icons/aws/Arch_Amazon-DynamoDB_64.svg?react';
import AWSElasticBeanstalkIcon from '../../assets/icons/aws/Arch_AWS-Elastic-Beanstalk_64.svg?react';
import AWSECSIcon from '../../assets/icons/aws/Arch_Amazon-Elastic-Container-Service_64.svg?react';
import AWSEKSIcon from '../../assets/icons/aws/Arch_Amazon-Elastic-Kubernetes-Service_64.svg?react';
import AWSEBSIcon from '../../assets/icons/aws/Arch_Amazon-Elastic-Block-Store_64.svg?react';
import AWSEFSIcon from '../../assets/icons/aws/Arch_Amazon-EFS_64.svg?react';
import AWSRoute53Icon from '../../assets/icons/aws/Arch_Amazon-Route-53_64.svg?react';
import AWSALBIcon from '../../assets/icons/aws/Arch_Elastic-Load-Balancing_64.svg?react';
import AWSRedshiftIcon from '../../assets/icons/aws/Arch_Amazon-Redshift_64.svg?react';
import AWSKMSIcon from '../../assets/icons/aws/Arch_AWS-Key-Management-Service_64.svg?react';
import AWSSNSIcon from '../../assets/icons/aws/Arch_Amazon-Simple-Notification-Service_64.svg?react';
import AWSSQSIcon from '../../assets/icons/aws/Arch_Amazon-Simple-Queue-Service_64.svg?react';
import AWSAuroraIcon from '../../assets/icons/aws/Arch_Amazon-Aurora_64.svg?react';
import AWSSageMakerIcon from '../../assets/icons/aws/Arch_Amazon-SageMaker_64.svg?react';
import AWSEMRIcon from '../../assets/icons/aws/Arch_Amazon-EMR_64.svg?react';
import AWSGlueIcon from '../../assets/icons/aws/Arch_AWS-Glue_64.svg?react';
import AWSAthenaIcon from '../../assets/icons/aws/Arch_Amazon-Athena_64.svg?react';
import AWSQuickSightIcon from '../../assets/icons/aws/Arch_Amazon-QuickSight_64.svg?react';
import AWSCloudFrontIcon from '../../assets/icons/aws/Arch_Amazon-CloudFront_64.svg?react';
import AWSAPIGatewayIcon from '../../assets/icons/aws/Arch_Amazon-API-Gateway_64.svg?react';
import AWSCognitoIcon from '../../assets/icons/aws/Arch_Amazon-Cognito_64.svg?react';
import AWSSecretsManagerIcon from '../../assets/icons/aws/Arch_AWS-Secrets-Manager_64.svg?react';
import AWSWAFIcon from '../../assets/icons/aws/Arch_AWS-WAF_64.svg?react';
import AWSShieldIcon from '../../assets/icons/aws/Arch_AWS-Shield_64.svg?react';
import AWSGuardDutyIcon from '../../assets/icons/aws/Arch_Amazon-GuardDuty_64.svg?react';
import AWSConfigIcon from '../../assets/icons/aws/Arch_AWS-Config_64.svg?react';
import AWSCloudTrailIcon from '../../assets/icons/aws/Arch_AWS-CloudTrail_64.svg?react';
import AWSSystemsManagerIcon from '../../assets/icons/aws/Arch_AWS-Systems-Manager_64.svg?react';
import AWSOrganizationsIcon from '../../assets/icons/aws/Arch_AWS-Organizations_64.svg?react';
import AWSControlTowerIcon from '../../assets/icons/aws/Arch_AWS-Control-Tower_64.svg?react';
import AWSWellArchitectedToolIcon from '../../assets/icons/aws/Arch_AWS-Well-Architected-Tool_64.svg?react';
import AWSBudgetsIcon from '../../assets/icons/aws/Arch_AWS-Budgets_64.svg?react';
import AWSCostExplorerIcon from '../../assets/icons/aws/Arch_AWS-Cost-Explorer_64.svg?react';
import AWSBillingConductorIcon from '../../assets/icons/aws/Arch_AWS-Billing-Conductor_64.svg?react';

// AWS Service Icons - Manual mapping
const AWSIcons = {
  'aws-ec2': <AWSEC2Icon className="w-6 h-6" />,
  'aws-s3': <AWSS3Icon className="w-6 h-6" />,
  'aws-lambda': <AWSLambdaIcon className="w-6 h-6" />,
  'aws-rds': <AWSRDSIcon className="w-6 h-6" />,
  'aws-vpc': <AWSVPCIcon className="w-6 h-6" />,
  'aws-cloudformation': <AWSCloudFormationIcon className="w-6 h-6" />,
  'aws-cloudwatch': <AWSCloudWatchIcon className="w-6 h-6" />,
  'aws-iam': <AWSIAMIcon className="w-6 h-6" />,
  'aws-dynamodb': <AWSDynamoDBIcon className="w-6 h-6" />,
  'aws-elastic-beanstalk': <AWSElasticBeanstalkIcon className="w-6 h-6" />,
  'aws-ecs': <AWSECSIcon className="w-6 h-6" />,
  'aws-eks': <AWSEKSIcon className="w-6 h-6" />,
  'aws-ebs': <AWSEBSIcon className="w-6 h-6" />,
  'aws-efs': <AWSEFSIcon className="w-6 h-6" />,
  'aws-route53': <AWSRoute53Icon className="w-6 h-6" />,
  'aws-alb': <AWSALBIcon className="w-6 h-6" />,
  'aws-redshift': <AWSRedshiftIcon className="w-6 h-6" />,
  'aws-kms': <AWSKMSIcon className="w-6 h-6" />,
  'aws-sns': <AWSSNSIcon className="w-6 h-6" />,
  'aws-sqs': <AWSSQSIcon className="w-6 h-6" />,
  'aws-aurora': <AWSAuroraIcon className="w-6 h-6" />,
  'aws-sagemaker': <AWSSageMakerIcon className="w-6 h-6" />,
  'aws-emr': <AWSEMRIcon className="w-6 h-6" />,
  'aws-glue': <AWSGlueIcon className="w-6 h-6" />,
  'aws-athena': <AWSAthenaIcon className="w-6 h-6" />,
  'aws-quicksight': <AWSQuickSightIcon className="w-6 h-6" />,
  'aws-cloudfront': <AWSCloudFrontIcon className="w-6 h-6" />,
  'aws-api-gateway': <AWSAPIGatewayIcon className="w-6 h-6" />,
  'aws-cognito': <AWSCognitoIcon className="w-6 h-6" />,
  'aws-secrets-manager': <AWSSecretsManagerIcon className="w-6 h-6" />,
  'aws-waf': <AWSWAFIcon className="w-6 h-6" />,
  'aws-shield': <AWSShieldIcon className="w-6 h-6" />,
  'aws-guardduty': <AWSGuardDutyIcon className="w-6 h-6" />,
  'aws-config': <AWSConfigIcon className="w-6 h-6" />,
  'aws-cloudtrail': <AWSCloudTrailIcon className="w-6 h-6" />,
  'aws-systems-manager': <AWSSystemsManagerIcon className="w-6 h-6" />,
  'aws-organizations': <AWSOrganizationsIcon className="w-6 h-6" />,
  'aws-control-tower': <AWSControlTowerIcon className="w-6 h-6" />,
  'aws-well-architected-tool': <AWSWellArchitectedToolIcon className="w-6 h-6" />,
  'aws-budgets': <AWSBudgetsIcon className="w-6 h-6" />,
  'aws-cost-explorer': <AWSCostExplorerIcon className="w-6 h-6" />,
  'aws-billing': <AWSBillingConductorIcon className="w-6 h-6" />,
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

// Service entry type
type ServiceEntry = {
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  iconUrl?: string;
  iconRaw?: string;
};

// Manual AWS services mapping
export const awsAllServices: Record<string, ServiceEntry> = {
  'aws-ec2': {
    name: 'Amazon EC2',
    category: 'Compute',
    description: 'Elastic Compute Cloud',
    icon: AWSIcons['aws-ec2'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-EC2_64.svg',
  },
  'aws-s3': {
    name: 'Amazon S3',
    category: 'Storage',
    description: 'Simple Storage Service',
    icon: AWSIcons['aws-s3'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Simple-Storage-Service_64.svg',
  },
  'aws-lambda': {
    name: 'AWS Lambda',
    category: 'Compute',
    description: 'Serverless Computing',
    icon: AWSIcons['aws-lambda'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Lambda_64.svg',
  },
  'aws-rds': {
    name: 'Amazon RDS',
    category: 'Database',
    description: 'Relational Database Service',
    icon: AWSIcons['aws-rds'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-RDS_64.svg',
  },
  'aws-vpc': {
    name: 'Amazon VPC',
    category: 'Networking',
    description: 'Virtual Private Cloud',
    icon: AWSIcons['aws-vpc'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Virtual-Private-Cloud_64.svg',
  },
  'aws-cloudformation': {
    name: 'AWS CloudFormation',
    category: 'Management',
    description: 'Infrastructure as Code',
    icon: AWSIcons['aws-cloudformation'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-CloudFormation_64.svg',
  },
  'aws-cloudwatch': {
    name: 'Amazon CloudWatch',
    category: 'Management',
    description: 'Monitoring and Observability',
    icon: AWSIcons['aws-cloudwatch'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-CloudWatch_64.svg',
  },
  'aws-iam': {
    name: 'AWS IAM',
    category: 'Security',
    description: 'Identity and Access Management',
    icon: AWSIcons['aws-iam'],
    color: '#DD344C',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Identity-and-Access-Management_64.svg',
  },
  'aws-dynamodb': {
    name: 'Amazon DynamoDB',
    category: 'Database',
    description: 'NoSQL Database',
    icon: AWSIcons['aws-dynamodb'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-DynamoDB_64.svg',
  },
  'aws-elastic-beanstalk': {
    name: 'AWS Elastic Beanstalk',
    category: 'Compute',
    description: 'Platform as a Service',
    icon: AWSIcons['aws-elastic-beanstalk'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Elastic-Beanstalk_64.svg',
  },
  'aws-ecs': {
    name: 'Amazon ECS',
    category: 'Containers',
    description: 'Elastic Container Service',
    icon: AWSIcons['aws-ecs'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Elastic-Container-Service_64.svg',
  },
  'aws-eks': {
    name: 'Amazon EKS',
    category: 'Containers',
    description: 'Elastic Kubernetes Service',
    icon: AWSIcons['aws-eks'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Elastic-Kubernetes-Service_64.svg',
  },
  'aws-ebs': {
    name: 'Amazon EBS',
    category: 'Storage',
    description: 'Elastic Block Store',
    icon: AWSIcons['aws-ebs'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Elastic-Block-Store_64.svg',
  },
  'aws-efs': {
    name: 'Amazon EFS',
    category: 'Storage',
    description: 'Elastic File System',
    icon: AWSIcons['aws-efs'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-EFS_64.svg',
  },
  'aws-route53': {
    name: 'Amazon Route 53',
    category: 'Networking',
    description: 'DNS Service',
    icon: AWSIcons['aws-route53'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Route-53_64.svg',
  },
  'aws-alb': {
    name: 'Application Load Balancer',
    category: 'Networking',
    description: 'Load Balancing',
    icon: AWSIcons['aws-alb'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Elastic-Load-Balancing_64.svg',
  },
  'aws-redshift': {
    name: 'Amazon Redshift',
    category: 'Analytics',
    description: 'Data Warehouse',
    icon: AWSIcons['aws-redshift'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Redshift_64.svg',
  },
  'aws-kms': {
    name: 'AWS KMS',
    category: 'Security',
    description: 'Key Management Service',
    icon: AWSIcons['aws-kms'],
    color: '#DD344C',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Key-Management-Service_64.svg',
  },
  'aws-sns': {
    name: 'Amazon SNS',
    category: 'Integration',
    description: 'Simple Notification Service',
    icon: AWSIcons['aws-sns'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Simple-Notification-Service_64.svg',
  },
  'aws-sqs': {
    name: 'Amazon SQS',
    category: 'Integration',
    description: 'Simple Queue Service',
    icon: AWSIcons['aws-sqs'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Simple-Queue-Service_64.svg',
  },
  'aws-aurora': {
    name: 'Amazon Aurora',
    category: 'Database',
    description: 'MySQL and PostgreSQL Compatible',
    icon: AWSIcons['aws-aurora'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Aurora_64.svg',
  },
  'aws-sagemaker': {
    name: 'Amazon SageMaker',
    category: 'Machine Learning',
    description: 'Machine Learning Platform',
    icon: AWSIcons['aws-sagemaker'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-SageMaker_64.svg',
  },
  'aws-emr': {
    name: 'Amazon EMR',
    category: 'Analytics',
    description: 'Elastic MapReduce',
    icon: AWSIcons['aws-emr'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-EMR_64.svg',
  },
  'aws-glue': {
    name: 'AWS Glue',
    category: 'Analytics',
    description: 'ETL Service',
    icon: AWSIcons['aws-glue'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Glue_64.svg',
  },
  'aws-athena': {
    name: 'Amazon Athena',
    category: 'Analytics',
    description: 'Interactive Query Service',
    icon: AWSIcons['aws-athena'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Athena_64.svg',
  },
  'aws-quicksight': {
    name: 'Amazon QuickSight',
    category: 'Analytics',
    description: 'Business Intelligence',
    icon: AWSIcons['aws-quicksight'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-QuickSight_64.svg',
  },
  'aws-cloudfront': {
    name: 'Amazon CloudFront',
    category: 'Networking',
    description: 'Content Delivery Network',
    icon: AWSIcons['aws-cloudfront'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-CloudFront_64.svg',
  },
  'aws-api-gateway': {
    name: 'Amazon API Gateway',
    category: 'Integration',
    description: 'API Management',
    icon: AWSIcons['aws-api-gateway'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-API-Gateway_64.svg',
  },
  'aws-cognito': {
    name: 'Amazon Cognito',
    category: 'Security',
    description: 'User Authentication',
    icon: AWSIcons['aws-cognito'],
    color: '#DD344C',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Cognito_64.svg',
  },
  'aws-secrets-manager': {
    name: 'AWS Secrets Manager',
    category: 'Security',
    description: 'Secret Management',
    icon: AWSIcons['aws-secrets-manager'],
    color: '#DD344C',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Secrets-Manager_64.svg',
  },
  'aws-waf': {
    name: 'AWS WAF',
    category: 'Security',
    description: 'Web Application Firewall',
    icon: AWSIcons['aws-waf'],
    color: '#DD344C',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-WAF_64.svg',
  },
  'aws-shield': {
    name: 'AWS Shield',
    category: 'Security',
    description: 'DDoS Protection',
    icon: AWSIcons['aws-shield'],
    color: '#DD344C',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Shield_64.svg',
  },
  'aws-guardduty': {
    name: 'Amazon GuardDuty',
    category: 'Security',
    description: 'Threat Detection',
    icon: AWSIcons['aws-guardduty'],
    color: '#DD344C',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-GuardDuty_64.svg',
  },
  'aws-config': {
    name: 'AWS Config',
    category: 'Management',
    description: 'Configuration Management',
    icon: AWSIcons['aws-config'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Config_64.svg',
  },
  'aws-cloudtrail': {
    name: 'AWS CloudTrail',
    category: 'Management',
    description: 'API Activity Logging',
    icon: AWSIcons['aws-cloudtrail'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-CloudTrail_64.svg',
  },
  'aws-systems-manager': {
    name: 'AWS Systems Manager',
    category: 'Management',
    description: 'Systems Management',
    icon: AWSIcons['aws-systems-manager'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Systems-Manager_64.svg',
  },
  'aws-organizations': {
    name: 'AWS Organizations',
    category: 'Management',
    description: 'Account Management',
    icon: AWSIcons['aws-organizations'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Organizations_64.svg',
  },
  'aws-control-tower': {
    name: 'AWS Control Tower',
    category: 'Management',
    description: 'Multi-Account Governance',
    icon: AWSIcons['aws-control-tower'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Control-Tower_64.svg',
  },
  'aws-well-architected-tool': {
    name: 'AWS Well-Architected Tool',
    category: 'Management',
    description: 'Architecture Review',
    icon: AWSIcons['aws-well-architected-tool'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Well-Architected-Tool_64.svg',
  },
  'aws-budgets': {
    name: 'AWS Budgets',
    category: 'Management',
    description: 'Cost Management',
    icon: AWSIcons['aws-budgets'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Budgets_64.svg',
  },
  'aws-cost-explorer': {
    name: 'AWS Cost Explorer',
    category: 'Management',
    description: 'Cost Analysis',
    icon: AWSIcons['aws-cost-explorer'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Cost-Explorer_64.svg',
  },
  'aws-billing': {
    name: 'AWS Billing Conductor',
    category: 'Management',
    description: 'Billing and Cost Management',
    icon: AWSIcons['aws-billing'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Billing-Conductor_64.svg',
  },
};

// Provide a minimal awsServices export to satisfy imports; primary list is awsAllServices
// export const awsServices = {
//   'aws-ec2': awsAllServices['aws-ec2'],
//   'aws-s3': awsAllServices['aws-s3'],
//   'aws-lambda': awsAllServices['aws-lambda'],
//   'aws-rds': awsAllServices['aws-rds'],
//   'aws-vpc': awsAllServices['aws-vpc'],
// };

// Azure services
// export const azureServices = {
//   'azure-vm': {
//     name: 'Azure Virtual Machine',
//     category: 'Compute',
//     description: 'Virtual Machine Service',
//     icon: AzureIcons['azure-vm'],
//     color: '#0078D4',
//   },
//   'azure-functions': {
//     name: 'Azure Functions',
//     category: 'Compute',
//     description: 'Serverless Computing',
//     icon: AzureIcons['azure-functions'],
//     color: '#0078D4',
//   },
//   'azure-aks': {
//     name: 'Azure Kubernetes Service',
//     category: 'Containers',
//     description: 'Managed Kubernetes',
//     icon: AzureIcons['azure-aks'],
//     color: '#0078D4',
//   },
//   'azure-storage': {
//     name: 'Azure Storage',
//     category: 'Storage',
//     description: 'Cloud Storage',
//     icon: AzureIcons['azure-storage'],
//     color: '#0078D4',
//   },
//   'azure-sql': {
//     name: 'Azure SQL Database',
//     category: 'Database',
//     description: 'Managed SQL Database',
//     icon: AzureIcons['azure-sql'],
//     color: '#0078D4',
//   },
//   'azure-cosmosdb': {
//     name: 'Azure Cosmos DB',
//     category: 'Database',
//     description: 'NoSQL Database',
//     icon: AzureIcons['azure-cosmosdb'],
//     color: '#0078D4',
//   },
//   'azure-vnet': {
//     name: 'Azure Virtual Network',
//     category: 'Networking',
//     description: 'Virtual Network',
//     icon: AzureIcons['azure-vnet'],
//     color: '#0078D4',
//   },
//   'azure-lb': {
//     name: 'Azure Load Balancer',
//     category: 'Networking',
//     description: 'Load Balancing',
//     icon: AzureIcons['azure-lb'],
//     color: '#0078D4',
//   },
//   'azure-disk': {
//     name: 'Azure Managed Disks',
//     category: 'Storage',
//     description: 'Managed Disk Storage',
//     icon: AzureIcons['azure-disk'],
//     color: '#0078D4',
//   },
//   'azure-key-vault': {
//     name: 'Azure Key Vault',
//     category: 'Security',
//     description: 'Secret Management',
//     icon: AzureIcons['azure-key-vault'],
//     color: '#0078D4',
//   },
//   'azure-ad': {
//     name: 'Azure Active Directory',
//     category: 'Security',
//     description: 'Identity Management',
//     icon: AzureIcons['azure-ad'],
//     color: '#0078D4',
//   },
// };

// Google Cloud services
// export const gcpServices = {
//   'gcp-compute-engine': {
//     name: 'Google Compute Engine',
//     category: 'Compute',
//     description: 'Virtual Machine Service',
//     icon: GCPIcons['gcp-compute-engine'],
//     color: '#4285F4',
//   },
//   'gcp-cloud-functions': {
//     name: 'Google Cloud Functions',
//     category: 'Compute',
//     description: 'Serverless Computing',
//     icon: GCPIcons['gcp-cloud-functions'],
//     color: '#4285F4',
//   },
//   'gcp-gke': {
//     name: 'Google Kubernetes Engine',
//     category: 'Containers',
//     description: 'Managed Kubernetes',
//     icon: GCPIcons['gcp-gke'],
//     color: '#4285F4',
//   },
//   'gcp-cloud-storage': {
//     name: 'Google Cloud Storage',
//     category: 'Storage',
//     description: 'Object Storage',
//     icon: GCPIcons['gcp-cloud-storage'],
//     color: '#4285F4',
//   },
//   'gcp-cloud-sql': {
//     name: 'Google Cloud SQL',
//     category: 'Database',
//     description: 'Managed SQL Database',
//     icon: GCPIcons['gcp-cloud-sql'],
//     color: '#4285F4',
//   },
//   'gcp-firestore': {
//     name: 'Google Cloud Firestore',
//     category: 'Database',
//     description: 'NoSQL Database',
//     icon: GCPIcons['gcp-firestore'],
//     color: '#4285F4',
//   },
//   'gcp-bigquery': {
//     name: 'Google BigQuery',
//     category: 'Analytics',
//     description: 'Data Warehouse',
//     icon: GCPIcons['gcp-bigquery'],
//     color: '#4285F4',
//   },
//   'gcp-vpc': {
//     name: 'Google Cloud VPC',
//     category: 'Networking',
//     description: 'Virtual Private Cloud',
//     icon: GCPIcons['gcp-vpc'],
//     color: '#4285F4',
//   },
//   'gcp-load-balancer': {
//     name: 'Google Cloud Load Balancer',
//     category: 'Networking',
//     description: 'Load Balancing',
//     icon: GCPIcons['gcp-load-balancer'],
//     color: '#4285F4',
//   },
//   'gcp-persistent-disk': {
//     name: 'Google Cloud Persistent Disk',
//     category: 'Storage',
//     description: 'Block Storage',
//     icon: GCPIcons['gcp-persistent-disk'],
//     color: '#4285F4',
//   },
//   'gcp-iam': {
//     name: 'Google Cloud IAM',
//     category: 'Security',
//     description: 'Identity and Access Management',
//     icon: GCPIcons['gcp-iam'],
//     color: '#4285F4',
//   },
//   'gcp-kms': {
//     name: 'Google Cloud KMS',
//     category: 'Security',
//     description: 'Key Management Service',
//     icon: GCPIcons['gcp-kms'],
//     color: '#4285F4',
//   },
// };

// Cloud service icon component
interface CloudServiceIconProps {
  serviceId: string;
  service: {
    name: string;
    category: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  };
}

export const CloudServiceIcon: React.FC<CloudServiceIconProps> = ({ 
  serviceId, 
  service
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    const payload: any = {
      shapeId: serviceId,
      iconOnly: true,
      serviceName: service.name,
      description: service.description,
      category: service.category,
    };

    // Get the actual service data from awsAllServices if it's an AWS service
    if (serviceId.startsWith('aws-') && awsAllServices[serviceId]) {
      const awsService = awsAllServices[serviceId];
      payload.iconUrl = awsService.iconUrl;
      payload.iconRaw = awsService.iconRaw;
      payload.serviceName = awsService.name;
      payload.description = awsService.description;
      payload.category = awsService.category;
    } else {
      // For non-AWS services, use the service data passed in
      if ((service as any).iconUrl) {
        payload.iconUrl = (service as any).iconUrl;
      }
      if ((service as any).iconRaw) {
        payload.iconRaw = (service as any).iconRaw;
      }
    }

    if (serviceId.startsWith('aws-')) payload.nodeType = 'aws-icon';
    if (serviceId.startsWith('azure-')) payload.nodeType = 'azure-icon';
    if (serviceId.startsWith('gcp-')) payload.nodeType = 'gcp-icon';

    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={handleDragStart}
      title={`${service.name} - ${service.description}`}
    >
      <div className="w-12 h-12 flex items-center justify-center mb-2">
        {service.icon}
      </div>
      <div className="text-center">
        <div className="text-xs font-medium text-gray-800 truncate max-w-20">
          {service.name}
        </div>
        <div className="text-xs text-gray-500 truncate max-w-20">
          {service.category}
        </div>
      </div>
    </div>
  );
};

// Service Category component
interface ServiceCategoryProps {
  title: string;
  services: Record<string, ServiceEntry>;
}

export const ServiceCategory: React.FC<ServiceCategoryProps> = ({ title, services }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(services).map(([serviceId, service]) => (
          <CloudServiceIcon key={serviceId} serviceId={serviceId} service={service} />
        ))}
      </div>
    </div>
  );
};

// Categorize AWS services for the sidebar
const categorizeServices = (services: Record<string, ServiceEntry>) => {
  const categories: Record<string, Record<string, ServiceEntry>> = {
    compute: {},
    storage: {},
    database: {},
    networking: {},
    security: {},
    management: {},
    analytics: {},
    integration: {},
    ml: {},
  };

  Object.entries(services).forEach(([serviceId, service]) => {
    const category = service.category.toLowerCase();
    if (category.includes('compute')) {
      categories.compute[serviceId] = service;
    } else if (category.includes('storage')) {
      categories.storage[serviceId] = service;
    } else if (category.includes('database')) {
      categories.database[serviceId] = service;
    } else if (category.includes('networking')) {
      categories.networking[serviceId] = service;
    } else if (category.includes('security')) {
      categories.security[serviceId] = service;
    } else if (category.includes('management')) {
      categories.management[serviceId] = service;
    } else if (category.includes('analytics')) {
      categories.analytics[serviceId] = service;
    } else if (category.includes('integration')) {
      categories.integration[serviceId] = service;
    } else if (category.includes('machine learning')) {
      categories.ml[serviceId] = service;
    } else {
      // Default to compute if no category matches
      categories.compute[serviceId] = service;
    }
  });

  return categories;
};

// Export categorized AWS services
export const awsServices = categorizeServices(awsAllServices);

// Create Azure services object
const azureAllServices: Record<string, ServiceEntry> = {
  'azure-vm': {
    name: 'Azure Virtual Machine',
    category: 'Compute',
    description: 'Virtual Machine Service',
    icon: AzureIcons['azure-vm'],
    color: '#0078D4',
  },
  'azure-functions': {
    name: 'Azure Functions',
    category: 'Compute',
    description: 'Serverless Computing',
    icon: AzureIcons['azure-functions'],
    color: '#0078D4',
  },
  'azure-aks': {
    name: 'Azure Kubernetes Service',
    category: 'Containers',
    description: 'Managed Kubernetes',
    icon: AzureIcons['azure-aks'],
    color: '#0078D4',
  },
  'azure-storage': {
    name: 'Azure Storage',
    category: 'Storage',
    description: 'Cloud Storage',
    icon: AzureIcons['azure-storage'],
    color: '#0078D4',
  },
  'azure-sql': {
    name: 'Azure SQL Database',
    category: 'Database',
    description: 'Managed SQL Database',
    icon: AzureIcons['azure-sql'],
    color: '#0078D4',
  },
  'azure-cosmosdb': {
    name: 'Azure Cosmos DB',
    category: 'Database',
    description: 'NoSQL Database',
    icon: AzureIcons['azure-cosmosdb'],
    color: '#0078D4',
  },
  'azure-vnet': {
    name: 'Azure Virtual Network',
    category: 'Networking',
    description: 'Virtual Network',
    icon: AzureIcons['azure-vnet'],
    color: '#0078D4',
  },
  'azure-lb': {
    name: 'Azure Load Balancer',
    category: 'Networking',
    description: 'Load Balancing',
    icon: AzureIcons['azure-lb'],
    color: '#0078D4',
  },
  'azure-disk': {
    name: 'Azure Managed Disks',
    category: 'Storage',
    description: 'Managed Disk Storage',
    icon: AzureIcons['azure-disk'],
    color: '#0078D4',
  },
  'azure-key-vault': {
    name: 'Azure Key Vault',
    category: 'Security',
    description: 'Secret Management',
    icon: AzureIcons['azure-key-vault'],
    color: '#0078D4',
  },
  'azure-ad': {
    name: 'Azure Active Directory',
    category: 'Security',
    description: 'Identity Management',
    icon: AzureIcons['azure-ad'],
    color: '#0078D4',
  },
};

// Create GCP services object
const gcpAllServices: Record<string, ServiceEntry> = {
  'gcp-compute-engine': {
    name: 'Google Compute Engine',
    category: 'Compute',
    description: 'Virtual Machine Service',
    icon: GCPIcons['gcp-compute-engine'],
    color: '#4285F4',
  },
  'gcp-cloud-functions': {
    name: 'Google Cloud Functions',
    category: 'Compute',
    description: 'Serverless Computing',
    icon: GCPIcons['gcp-cloud-functions'],
    color: '#4285F4',
  },
  'gcp-gke': {
    name: 'Google Kubernetes Engine',
    category: 'Containers',
    description: 'Managed Kubernetes',
    icon: GCPIcons['gcp-gke'],
    color: '#4285F4',
  },
  'gcp-cloud-storage': {
    name: 'Google Cloud Storage',
    category: 'Storage',
    description: 'Object Storage',
    icon: GCPIcons['gcp-cloud-storage'],
    color: '#4285F4',
  },
  'gcp-cloud-sql': {
    name: 'Google Cloud SQL',
    category: 'Database',
    description: 'Managed SQL Database',
    icon: GCPIcons['gcp-cloud-sql'],
    color: '#4285F4',
  },
  'gcp-firestore': {
    name: 'Google Cloud Firestore',
    category: 'Database',
    description: 'NoSQL Database',
    icon: GCPIcons['gcp-firestore'],
    color: '#4285F4',
  },
  'gcp-bigquery': {
    name: 'Google BigQuery',
    category: 'Analytics',
    description: 'Data Warehouse',
    icon: GCPIcons['gcp-bigquery'],
    color: '#4285F4',
  },
  'gcp-vpc': {
    name: 'Google Cloud VPC',
    category: 'Networking',
    description: 'Virtual Private Cloud',
    icon: GCPIcons['gcp-vpc'],
    color: '#4285F4',
  },
  'gcp-load-balancer': {
    name: 'Google Cloud Load Balancer',
    category: 'Networking',
    description: 'Load Balancing',
    icon: GCPIcons['gcp-load-balancer'],
    color: '#4285F4',
  },
  'gcp-persistent-disk': {
    name: 'Google Cloud Persistent Disk',
    category: 'Storage',
    description: 'Block Storage',
    icon: GCPIcons['gcp-persistent-disk'],
    color: '#4285F4',
  },
  'gcp-iam': {
    name: 'Google Cloud IAM',
    category: 'Security',
    description: 'Identity and Access Management',
    icon: GCPIcons['gcp-iam'],
    color: '#4285F4',
  },
  'gcp-kms': {
    name: 'Google Cloud KMS',
    category: 'Security',
    description: 'Key Management Service',
    icon: GCPIcons['gcp-kms'],
    color: '#4285F4',
  },
};

// Export categorized Azure services
export const azureServices = categorizeServices(azureAllServices);

// Export categorized GCP services  
export const googleCloudServices = categorizeServices(gcpAllServices);

export default CloudServiceIcon;
