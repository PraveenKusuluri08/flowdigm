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

// Import GCP SVG icons as React components (basic set that exists)
import GCPComputeIcon from '../../assets/icons/gcp/Compute-Engine.svg?react';
import GCPStorageIcon from '../../assets/icons/gcp/Cloud-Storage.svg?react';
import GCPFunctionsIcon from '../../assets/icons/gcp/Cloud-Functions.svg?react';
import GCPGKEIcon from '../../assets/icons/gcp/Google-Kubernetes-Engine.svg?react';
import GCPCloudSQLIcon from '../../assets/icons/gcp/Cloud-SQL.svg?react';
import GCPFirestoreIcon from '../../assets/icons/gcp/Firestore.svg?react';
import GCPBigQueryIcon from '../../assets/icons/gcp/BigQuery.svg?react';
import GCPVPCIcon from '../../assets/icons/gcp/Virtual-Private-Cloud.svg?react';
import GCPLoadBalancerIcon from '../../assets/icons/gcp/Cloud-Load-Balancing.svg?react';
import GCPPersistentDiskIcon from '../../assets/icons/gcp/Persistent-Disk.svg?react';
import GCPIAMIcon from '../../assets/icons/gcp/Identity-And-Access-Management.svg?react';
import GCPKMSIcon from '../../assets/icons/gcp/Key-Management-Service.svg?react';
import GCPAppEngineIcon from '../../assets/icons/gcp/App-Engine.svg?react';
import GCPBigtableIcon from '../../assets/icons/gcp/Bigtable.svg?react';
import GCPPubSubIcon from '../../assets/icons/gcp/PubSub.svg?react';
import GCPFilestoreIcon from '../../assets/icons/gcp/Filestore.svg?react';
import GCPMemorystoreIcon from '../../assets/icons/gcp/Memorystore.svg?react';
import GCPLookerIcon from '../../assets/icons/gcp/Looker.svg?react';
import GCPDatastreamIcon from '../../assets/icons/gcp/Datastream.svg?react';
import GCPCloudDNSIcon from '../../assets/icons/gcp/Cloud-DNS.svg?react';
import GCPCloudCDNIcon from '../../assets/icons/gcp/Cloud-CDN.svg?react';
import GCPCloudArmorIcon from '../../assets/icons/gcp/Cloud-Armor.svg?react';
import GCPSecretManagerIcon from '../../assets/icons/gcp/Secret-Manager.svg?react';
import GCPVertexAIIcon from '../../assets/icons/gcp/Vertex-AI.svg?react';
import GCPDialogflowIcon from '../../assets/icons/gcp/Dialogflow-CX.svg?react';
import GCPCloudRunIcon from '../../assets/icons/gcp/Kuberun.svg?react';
import GCPAnthosIcon from '../../assets/icons/gcp/Anthos.svg?react';
import GCPArtifactRegistryIcon from '../../assets/icons/gcp/Artifact-Registry.svg?react';
import GCPCloudComposerIcon from '../../assets/icons/gcp/Cloud-Composer.svg?react';
import GCPDataFusionIcon from '../../assets/icons/gcp/Cloud-Data-Fusion.svg?react';
import GCPCloudDeployIcon from '../../assets/icons/gcp/Cloud-Deploy.svg?react';
import GCPCloudAPIGatewayIcon from '../../assets/icons/gcp/Cloud-API-Gateway.svg?react';
import GCPCloudAuditLogsIcon from '../../assets/icons/gcp/Cloud-Audit-Logs.svg?react';
import GCPCloudAssetInventoryIcon from '../../assets/icons/gcp/Cloud-Asset-Inventory.svg?react';
import GCPBinaryAuthorizationIcon from '../../assets/icons/gcp/Binary-Authorization.svg?react';
import GCPCertificateManagerIcon from '../../assets/icons/gcp/Certificate-Manager.svg?react';
import GCPBillingIcon from '../../assets/icons/gcp/Billing.svg?react';
import GCPProjectIcon from '../../assets/icons/gcp/Project.svg?react';
import GCPStackdriverIcon from '../../assets/icons/gcp/Stackdriver.svg?react';
import GCPErrorReportingIcon from '../../assets/icons/gcp/Error-Reporting.svg?react';

// Add missing GCP icon imports
import GCPCloudBuildIcon from '../../assets/icons/gcp/Cloud-Build.svg?react';
import GCPAutoMLIcon from '../../assets/icons/gcp/AutoML.svg?react';
import GCPDebuggerIcon from '../../assets/icons/gcp/Debugger.svg?react';
import GCPProfilerIcon from '../../assets/icons/gcp/Profiler.svg?react';
import GCPTraceIcon from '../../assets/icons/gcp/Trace.svg?react';
import GCPCloudCodeIcon from '../../assets/icons/gcp/Cloud-Code.svg?react';
import GCPCloudAPIsIcon from '../../assets/icons/gcp/Cloud-APIs.svg?react';
import GCPAPIIcon from '../../assets/icons/gcp/API.svg?react';
import GCPApigeeIcon from '../../assets/icons/gcp/Apigee-API-Platform.svg?react';
import GCPEventarcIcon from '../../assets/icons/gcp/Eventarc.svg?react';
import GCPWorkflowsIcon from '../../assets/icons/gcp/Workflows.svg?react';
import GCPCloudSchedulerIcon from '../../assets/icons/gcp/Cloud-Scheduler.svg?react';
import GCPCloudTasksIcon from '../../assets/icons/gcp/Cloud-Tasks.svg?react';
import GCPCloudLoggingIcon from '../../assets/icons/gcp/Cloud-Logging.svg?react';
import GCPCloudMonitoringIcon from '../../assets/icons/gcp/Cloud-Monitoring.svg?react';
import GCPCloudTraceIcon from '../../assets/icons/gcp/Trace.svg?react';
import GCPCloudDebuggerIcon from '../../assets/icons/gcp/Debugger.svg?react';
import GCPCloudProfilerIcon from '../../assets/icons/gcp/Profiler.svg?react';
import GCPCloudErrorReportingIcon from '../../assets/icons/gcp/Error-Reporting.svg?react';

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

// Resolve AWS SVG file URLs at build time (so they work in production)
const awsIconUrlMap = import.meta.glob('../../assets/icons/aws/*.svg', {
  eager: true,
  as: 'url'
}) as Record<string, string>;

const resolveAwsIconUrl = (fileName: string): string | undefined => {
  for (const [path, url] of Object.entries(awsIconUrlMap)) {
    if (path.endsWith(`/${fileName}`)) return url as unknown as string;
  }
  return undefined;
};

// AWS Icon wrapper component with proper styling - NO BORDERS, NO TEXT, smaller size
const AwsIconWrapper = ({ iconUrl, size = 20 }: { iconUrl: string; size?: number }) => (
  <img 
    src={iconUrl} 
    alt="AWS Icon" 
    style={{ 
      width: size, 
      height: size,
      objectFit: 'contain'
    }}
    className="aws-icon"
  />
);

// Helper to map AWS service id -> icon filename
const getAwsIconFileName = (serviceId: string): string => {
  const iconName = serviceId.replace('aws-', '');
  const iconMappings: Record<string, string> = {
    'ec2': 'Arch_Amazon-EC2_64.svg',
    's3': 'Arch_Amazon-Simple-Storage-Service_64.svg',
    'lambda': 'Arch_AWS-Lambda_64.svg',
    'rds': 'Arch_Amazon-RDS_64.svg',
    'vpc': 'Arch_Amazon-Virtual-Private-Cloud_64.svg',
    'cloudformation': 'Arch_AWS-CloudFormation_64.svg',
    'cloudwatch': 'Arch_Amazon-CloudWatch_64.svg',
    'iam': 'Arch_AWS-Identity-and-Access-Management_64.svg',
    'dynamodb': 'Arch_Amazon-DynamoDB_64.svg',
    'elastic-beanstalk': 'Arch_AWS-Elastic-Beanstalk_64.svg',
    'ecs': 'Arch_Amazon-Elastic-Container-Service_64.svg',
    'eks': 'Arch_Amazon-Elastic-Kubernetes-Service_64.svg',
    'ebs': 'Arch_Amazon-Elastic-Block-Store_64.svg',
    'efs': 'Arch_Amazon-EFS_64.svg',
    'route53': 'Arch_Amazon-Route-53_64.svg',
    'alb': 'Arch_Elastic-Load-Balancing_64.svg',
    'redshift': 'Arch_Amazon-Redshift_64.svg',
    'kms': 'Arch_AWS-Key-Management-Service_64.svg',
    'sns': 'Arch_Amazon-Simple-Notification-Service_64.svg',
    'sqs': 'Arch_Amazon-Simple-Queue-Service_64.svg',
    'aurora': 'Arch_Amazon-Aurora_64.svg',
    'sagemaker': 'Arch_Amazon-SageMaker_64.svg',
    'emr': 'Arch_Amazon-EMR_64.svg',
    'glue': 'Arch_AWS-Glue_64.svg',
    'athena': 'Arch_Amazon-Athena_64.svg',
    'quicksight': 'Arch_Amazon-QuickSight_64.svg',
    'cloudfront': 'Arch_Amazon-CloudFront_64.svg',
    'api-gateway': 'Arch_Amazon-API-Gateway_64.svg',
    'cognito': 'Arch_Amazon-Cognito_64.svg',
    'secrets-manager': 'Arch_AWS-Secrets-Manager_64.svg',
    'waf': 'Arch_AWS-WAF_64.svg',
    'shield': 'Arch_AWS-Shield_64.svg',
    'guardduty': 'Arch_Amazon-GuardDuty_64.svg',
    'config': 'Arch_AWS-Config_64.svg',
    'cloudtrail': 'Arch_AWS-CloudTrail_64.svg',
    'systems-manager': 'Arch_AWS-Systems-Manager_64.svg',
    'organizations': 'Arch_AWS-Organizations_64.svg',
    'control-tower': 'Arch_AWS-Control-Tower_64.svg',
    'well-architected-tool': 'Arch_AWS-Well-Architected-Tool_64.svg',
    'budgets': 'Arch_AWS-Budgets_64.svg',
    'cost-explorer': 'Arch_AWS-Cost-Explorer_64.svg',
    'billing-conductor': 'Arch_AWS-Billing-Conductor_64.svg',
    // Add more mappings as needed
  };
  const explicit = iconMappings[iconName];
  if (explicit) return explicit;
  return `Arch_${iconName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}_64.svg`;
};

// Dynamic AWS icon loader function that resolves a production-safe URL
const getAwsIcon = (serviceId: string) => {
  const fileName = getAwsIconFileName(serviceId);
  const url = resolveAwsIconUrl(fileName);
  return <AwsIconWrapper iconUrl={url || ''} size={20} />;
};

// AWS Service Icons - Using dynamic loading for better compatibility
const AWSIcons = {
  'aws-ec2': getAwsIcon('aws-ec2'),
  'aws-s3': getAwsIcon('aws-s3'),
  'aws-lambda': getAwsIcon('aws-lambda'),
  'aws-rds': getAwsIcon('aws-rds'),
  'aws-vpc': getAwsIcon('aws-vpc'),
  'aws-cloudformation': getAwsIcon('aws-cloudformation'),
  'aws-cloudwatch': getAwsIcon('aws-cloudwatch'),
  'aws-iam': getAwsIcon('aws-iam'),
  'aws-dynamodb': getAwsIcon('aws-dynamodb'),
  'aws-elastic-beanstalk': getAwsIcon('aws-elastic-beanstalk'),
  'aws-ecs': getAwsIcon('aws-ecs'),
  'aws-eks': getAwsIcon('aws-eks'),
  'aws-ebs': getAwsIcon('aws-ebs'),
  'aws-efs': getAwsIcon('aws-efs'),
  'aws-route53': getAwsIcon('aws-route53'),
  'aws-alb': getAwsIcon('aws-alb'),
  'aws-redshift': getAwsIcon('aws-redshift'),
  'aws-kms': getAwsIcon('aws-kms'),
  'aws-sns': getAwsIcon('aws-sns'),
  'aws-sqs': getAwsIcon('aws-sqs'),
  'aws-aurora': getAwsIcon('aws-aurora'),
  'aws-sagemaker': getAwsIcon('aws-sagemaker'),
  'aws-emr': getAwsIcon('aws-emr'),
  'aws-glue': getAwsIcon('aws-glue'),
  'aws-athena': getAwsIcon('aws-athena'),
  'aws-quicksight': getAwsIcon('aws-quicksight'),
  'aws-cloudfront': getAwsIcon('aws-cloudfront'),
  'aws-api-gateway': getAwsIcon('aws-api-gateway'),
  'aws-cognito': getAwsIcon('aws-cognito'),
  'aws-secrets-manager': getAwsIcon('aws-secrets-manager'),
  'aws-waf': getAwsIcon('aws-waf'),
  'aws-shield': getAwsIcon('aws-shield'),
  'aws-guardduty': getAwsIcon('aws-guardduty'),
  'aws-config': getAwsIcon('aws-config'),
  'aws-cloudtrail': getAwsIcon('aws-cloudtrail'),
  'aws-systems-manager': getAwsIcon('aws-systems-manager'),
  'aws-organizations': getAwsIcon('aws-organizations'),
  'aws-control-tower': getAwsIcon('aws-control-tower'),
  'aws-well-architected-tool': getAwsIcon('aws-well-architected-tool'),
  'aws-budgets': getAwsIcon('aws-budgets'),
  'aws-cost-explorer': getAwsIcon('aws-cost-explorer'),
  'aws-billing-conductor': getAwsIcon('aws-billing-conductor'),
};

// Google Cloud Service Icons - Using SVG React components from files
const GCPIcons = {
  'gcp-compute-engine': <GCPComputeIcon className="w-6 h-6" />,
  'gcp-cloud-functions': <GCPFunctionsIcon className="w-6 h-6" />,
  'gcp-gke': <GCPGKEIcon className="w-6 h-6" />,
  'gcp-cloud-storage': <GCPStorageIcon className="w-6 h-6" />,
  'gcp-cloud-sql': <GCPCloudSQLIcon className="w-6 h-6" />,
  'gcp-firestore': <GCPFirestoreIcon className="w-6 h-6" />,
  'gcp-bigquery': <GCPBigQueryIcon className="w-6 h-6" />,
  'gcp-vpc': <GCPVPCIcon className="w-6 h-6" />,
  'gcp-load-balancer': <GCPLoadBalancerIcon className="w-6 h-6" />,
  'gcp-persistent-disk': <GCPPersistentDiskIcon className="w-6 h-6" />,
  'gcp-iam': <GCPIAMIcon className="w-6 h-6" />,
  'gcp-kms': <GCPKMSIcon className="w-6 h-6" />,
  'gcp-app-engine': <GCPAppEngineIcon className="w-6 h-6" />,
  'gcp-bigtable': <GCPBigtableIcon className="w-6 h-6" />,
  'gcp-pubsub': <GCPPubSubIcon className="w-6 h-6" />,
  'gcp-filestore': <GCPFilestoreIcon className="w-6 h-6" />,
  'gcp-memorystore': <GCPMemorystoreIcon className="w-6 h-6" />,
  'gcp-looker': <GCPLookerIcon className="w-6 h-6" />,
  'gcp-datastream': <GCPDatastreamIcon className="w-6 h-6" />,
  'gcp-cloud-dns': <GCPCloudDNSIcon className="w-6 h-6" />,
  'gcp-cloud-cdn': <GCPCloudCDNIcon className="w-6 h-6" />,
  'gcp-cloud-armor': <GCPCloudArmorIcon className="w-6 h-6" />,
  'gcp-secret-manager': <GCPSecretManagerIcon className="w-6 h-6" />,
  'gcp-vertex-ai': <GCPVertexAIIcon className="w-6 h-6" />,
  'gcp-dialogflow': <GCPDialogflowIcon className="w-6 h-6" />,
  'gcp-cloud-run': <GCPCloudRunIcon className="w-6 h-6" />,
  'gcp-anthos': <GCPAnthosIcon className="w-6 h-6" />,
  'gcp-artifact-registry': <GCPArtifactRegistryIcon className="w-6 h-6" />,
  'gcp-cloud-composer': <GCPCloudComposerIcon className="w-6 h-6" />,
  'gcp-data-fusion': <GCPDataFusionIcon className="w-6 h-6" />,
  'gcp-cloud-deploy': <GCPCloudDeployIcon className="w-6 h-6" />,
  'gcp-cloud-api-gateway': <GCPCloudAPIGatewayIcon className="w-6 h-6" />,
  'gcp-cloud-audit-logs': <GCPCloudAuditLogsIcon className="w-6 h-6" />,
  'gcp-cloud-asset-inventory': <GCPCloudAssetInventoryIcon className="w-6 h-6" />,
  'gcp-binary-authorization': <GCPBinaryAuthorizationIcon className="w-6 h-6" />,
  'gcp-certificate-manager': <GCPCertificateManagerIcon className="w-6 h-6" />,
  'gcp-billing': <GCPBillingIcon className="w-6 h-6" />,
  'gcp-project': <GCPProjectIcon className="w-6 h-6" />,
  'gcp-stackdriver': <GCPStackdriverIcon className="w-6 h-6" />,
  'gcp-error-reporting': <GCPErrorReportingIcon className="w-6 h-6" />,
  'gcp-debugger': <GCPDebuggerIcon className="w-6 h-6" />,
  'gcp-profiler': <GCPProfilerIcon className="w-6 h-6" />,
  'gcp-trace': <GCPTraceIcon className="w-6 h-6" />,
  'gcp-cloud-code': <GCPCloudCodeIcon className="w-6 h-6" />,
  'gcp-cloud-apis': <GCPCloudAPIsIcon className="w-6 h-6" />,
  'gcp-api': <GCPAPIIcon className="w-6 h-6" />,
  'gcp-apigee': <GCPApigeeIcon className="w-6 h-6" />,
  'gcp-eventarc': <GCPEventarcIcon className="w-6 h-6" />,
  'gcp-workflows': <GCPWorkflowsIcon className="w-6 h-6" />,
  'gcp-cloud-scheduler': <GCPCloudSchedulerIcon className="w-6 h-6" />,
  'gcp-cloud-tasks': <GCPCloudTasksIcon className="w-6 h-6" />,
  'gcp-cloud-logging': <GCPCloudLoggingIcon className="w-6 h-6" />,
  'gcp-cloud-monitoring': <GCPCloudMonitoringIcon className="w-6 h-6" />,
};

// Azure Service Icons
const AzureIcons = {
  'azure-vm': <AzureVMIcon className="w-6 h-6" />,
  'azure-storage': <AzureStorageIcon className="w-6 h-6" />,
  'azure-functions': <AzureFunctionsIcon className="w-6 h-6" />,
  'azure-aks': <AzureAKSIcon className="w-6 h-6" />,
  'azure-sql': <AzureSQLIcon className="w-6 h-6" />,
  'azure-cosmosdb': <AzureCosmosDBIcon className="w-6 h-6" />,
  'azure-vnet': <AzureVNetIcon className="w-6 h-6" />,
  'azure-load-balancer': <AzureLoadBalancerIcon className="w-6 h-6" />,
  'azure-disk': <AzureDiskIcon className="w-6 h-6" />,
  'azure-key-vault': <AzureKeyVaultIcon className="w-6 h-6" />,
  'azure-active-directory': <AzureActiveDirectoryIcon className="w-6 h-6" />,
};

// Service entry interface
interface ServiceEntry {
  name: string;
  category: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  iconUrl: string;
}

// Comprehensive AWS services mapping with all available services
export const awsAllServices: Record<string, ServiceEntry> = {
  // Compute Services
  'aws-ec2': {
    name: 'Amazon EC2',
    category: 'Compute',
    description: 'Virtual Machine Service',
    icon: AWSIcons['aws-ec2'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-EC2_64.svg',
  },
  'aws-lambda': {
    name: 'AWS Lambda',
    category: 'Compute',
    description: 'Serverless Computing',
    icon: AWSIcons['aws-lambda'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Lambda_64.svg',
  },
  'aws-ecs': {
    name: 'Amazon ECS',
    category: 'Compute',
    description: 'Container Service',
    icon: AWSIcons['aws-ecs'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Elastic-Container-Service_64.svg',
  },
  'aws-eks': {
    name: 'Amazon EKS',
    category: 'Compute',
    description: 'Kubernetes Service',
    icon: AWSIcons['aws-eks'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Elastic-Kubernetes-Service_64.svg',
  },
  'aws-elastic-beanstalk': {
    name: 'AWS Elastic Beanstalk',
    category: 'Compute',
    description: 'Platform as a Service',
    icon: AWSIcons['aws-elastic-beanstalk'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Elastic-Beanstalk_64.svg',
  },
  'aws-lightsail': {
    name: 'Amazon Lightsail',
    category: 'Compute',
    description: 'Virtual Private Server',
    icon: getAwsIcon('aws-lightsail'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Lightsail_64.svg',
  },
  'aws-batch': {
    name: 'AWS Batch',
    category: 'Compute',
    description: 'Batch Computing',
    icon: getAwsIcon('aws-batch'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Batch_64.svg',
  },
  'aws-app-runner': {
    name: 'AWS App Runner',
    category: 'Compute',
    description: 'Application Runner',
    icon: getAwsIcon('aws-app-runner'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-App-Runner_64.svg',
  },

  // Storage Services
  'aws-s3': {
    name: 'Amazon S3',
    category: 'Storage',
    description: 'Object Storage',
    icon: AWSIcons['aws-s3'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Simple-Storage-Service_64.svg',
  },
  'aws-ebs': {
    name: 'Amazon EBS',
    category: 'Storage',
    description: 'Block Storage',
    icon: AWSIcons['aws-ebs'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Elastic-Block-Store_64.svg',
  },
  'aws-efs': {
    name: 'Amazon EFS',
    category: 'Storage',
    description: 'File Storage',
    icon: AWSIcons['aws-efs'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-EFS_64.svg',
  },
  'aws-fsx': {
    name: 'Amazon FSx',
    category: 'Storage',
    description: 'File System',
    icon: getAwsIcon('aws-fsx'),
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-FSx_64.svg',
  },
  'aws-storage-gateway': {
    name: 'AWS Storage Gateway',
    category: 'Storage',
    description: 'Storage Gateway',
    icon: getAwsIcon('aws-storage-gateway'),
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Storage-Gateway_64.svg',
  },
  'aws-snowball': {
    name: 'AWS Snowball',
    category: 'Storage',
    description: 'Data Transfer',
    icon: getAwsIcon('aws-snowball'),
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Snowball_64.svg',
  },

  // Database Services
  'aws-rds': {
    name: 'Amazon RDS',
    category: 'Database',
    description: 'Relational Database',
    icon: AWSIcons['aws-rds'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-RDS_64.svg',
  },
  'aws-dynamodb': {
    name: 'Amazon DynamoDB',
    category: 'Database',
    description: 'NoSQL Database',
    icon: AWSIcons['aws-dynamodb'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-DynamoDB_64.svg',
  },
  'aws-aurora': {
    name: 'Amazon Aurora',
    category: 'Database',
    description: 'MySQL/PostgreSQL Compatible',
    icon: AWSIcons['aws-aurora'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Aurora_64.svg',
  },
  'aws-redshift': {
    name: 'Amazon Redshift',
    category: 'Database',
    description: 'Data Warehouse',
    icon: AWSIcons['aws-redshift'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Redshift_64.svg',
  },
  'aws-elasticache': {
    name: 'Amazon ElastiCache',
    category: 'Database',
    description: 'In-Memory Caching',
    icon: getAwsIcon('aws-elasticache'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-ElastiCache_64.svg',
  },
  'aws-neptune': {
    name: 'Amazon Neptune',
    category: 'Database',
    description: 'Graph Database',
    icon: getAwsIcon('aws-neptune'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Neptune_64.svg',
  },
  'aws-documentdb': {
    name: 'Amazon DocumentDB',
    category: 'Database',
    description: 'MongoDB Compatible',
    icon: getAwsIcon('aws-documentdb'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-DocumentDB_64.svg',
  },
  'aws-keyspaces': {
    name: 'Amazon Keyspaces',
    category: 'Database',
    description: 'Apache Cassandra Compatible',
    icon: getAwsIcon('aws-keyspaces'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Keyspaces_64.svg',
  },

  // Networking Services
  'aws-vpc': {
    name: 'Amazon VPC',
    category: 'Networking',
    description: 'Virtual Private Cloud',
    icon: AWSIcons['aws-vpc'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Virtual-Private-Cloud_64.svg',
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
    category: 'Networking',
    description: 'API Management',
    icon: AWSIcons['aws-api-gateway'],
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-API-Gateway_64.svg',
  },
  'aws-direct-connect': {
    name: 'AWS Direct Connect',
    category: 'Networking',
    description: 'Dedicated Network Connection',
    icon: getAwsIcon('aws-direct-connect'),
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Direct-Connect_64.svg',
  },
  'aws-vpn-gateway': {
    name: 'AWS VPN Gateway',
    category: 'Networking',
    description: 'VPN Gateway',
    icon: getAwsIcon('aws-vpn-gateway'),
    color: '#3F8624',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-VPN-Gateway_64.svg',
  },

  // Security Services
  'aws-iam': {
    name: 'AWS IAM',
    category: 'Security',
    description: 'Identity and Access Management',
    icon: AWSIcons['aws-iam'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Identity-and-Access-Management_64.svg',
  },
  'aws-kms': {
    name: 'AWS KMS',
    category: 'Security',
    description: 'Key Management Service',
    icon: AWSIcons['aws-kms'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Key-Management-Service_64.svg',
  },
  'aws-cognito': {
    name: 'Amazon Cognito',
    category: 'Security',
    description: 'User Authentication',
    icon: AWSIcons['aws-cognito'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Cognito_64.svg',
  },
  'aws-secrets-manager': {
    name: 'AWS Secrets Manager',
    category: 'Security',
    description: 'Secret Management',
    icon: AWSIcons['aws-secrets-manager'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Secrets-Manager_64.svg',
  },
  'aws-guardduty': {
    name: 'Amazon GuardDuty',
    category: 'Security',
    description: 'Threat Detection',
    icon: AWSIcons['aws-guardduty'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-GuardDuty_64.svg',
  },
  'aws-waf': {
    name: 'AWS WAF',
    category: 'Security',
    description: 'Web Application Firewall',
    icon: AWSIcons['aws-waf'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-WAF_64.svg',
  },
  'aws-shield': {
    name: 'AWS Shield',
    category: 'Security',
    description: 'DDoS Protection',
    icon: AWSIcons['aws-shield'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Shield_64.svg',
  },
  'aws-config': {
    name: 'AWS Config',
    category: 'Security',
    description: 'Configuration Management',
    icon: AWSIcons['aws-config'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Config_64.svg',
  },
  'aws-cloudtrail': {
    name: 'AWS CloudTrail',
    category: 'Security',
    description: 'API Logging',
    icon: AWSIcons['aws-cloudtrail'],
    color: '#D45B07',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-CloudTrail_64.svg',
  },

  // Analytics Services
  'aws-athena': {
    name: 'Amazon Athena',
    category: 'Analytics',
    description: 'Interactive Query Service',
    icon: AWSIcons['aws-athena'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Athena_64.svg',
  },
  'aws-emr': {
    name: 'Amazon EMR',
    category: 'Analytics',
    description: 'Big Data Processing',
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
  'aws-quicksight': {
    name: 'Amazon QuickSight',
    category: 'Analytics',
    description: 'Business Intelligence',
    icon: AWSIcons['aws-quicksight'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-QuickSight_64.svg',
  },
  'aws-kinesis': {
    name: 'Amazon Kinesis',
    category: 'Analytics',
    description: 'Real-time Data Streaming',
    icon: getAwsIcon('aws-kinesis'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Kinesis_64.svg',
  },
  'aws-data-pipeline': {
    name: 'AWS Data Pipeline',
    category: 'Analytics',
    description: 'Data Pipeline Service',
    icon: getAwsIcon('aws-data-pipeline'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Data-Pipeline_64.svg',
  },

  // Machine Learning Services
  'aws-sagemaker': {
    name: 'Amazon SageMaker',
    category: 'Machine Learning',
    description: 'Machine Learning Platform',
    icon: AWSIcons['aws-sagemaker'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-SageMaker_64.svg',
  },
  'aws-rekognition': {
    name: 'Amazon Rekognition',
    category: 'Machine Learning',
    description: 'Image and Video Analysis',
    icon: getAwsIcon('aws-rekognition'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Rekognition_64.svg',
  },
  'aws-comprehend': {
    name: 'Amazon Comprehend',
    category: 'Machine Learning',
    description: 'Natural Language Processing',
    icon: getAwsIcon('aws-comprehend'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Comprehend_64.svg',
  },
  'aws-translate': {
    name: 'Amazon Translate',
    category: 'Machine Learning',
    description: 'Neural Machine Translation',
    icon: getAwsIcon('aws-translate'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Translate_64.svg',
  },
  'aws-transcribe': {
    name: 'Amazon Transcribe',
    category: 'Machine Learning',
    description: 'Speech to Text',
    icon: getAwsIcon('aws-transcribe'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Transcribe_64.svg',
  },
  'aws-polly': {
    name: 'Amazon Polly',
    category: 'Machine Learning',
    description: 'Text to Speech',
    icon: getAwsIcon('aws-polly'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Polly_64.svg',
  },
  'aws-lex': {
    name: 'Amazon Lex',
    category: 'Machine Learning',
    description: 'Conversational AI',
    icon: getAwsIcon('aws-lex'),
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Lex_64.svg',
  },

  // Management Services
  'aws-cloudwatch': {
    name: 'Amazon CloudWatch',
    category: 'Management',
    description: 'Monitoring and Observability',
    icon: AWSIcons['aws-cloudwatch'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-CloudWatch_64.svg',
  },
  'aws-cloudformation': {
    name: 'AWS CloudFormation',
    category: 'Management',
    description: 'Infrastructure as Code',
    icon: AWSIcons['aws-cloudformation'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-CloudFormation_64.svg',
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
  'aws-billing-conductor': {
    name: 'AWS Billing Conductor',
    category: 'Management',
    description: 'Billing and Cost Management',
    icon: AWSIcons['aws-billing-conductor'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Billing-Conductor_64.svg',
  },

  // Integration Services
  'aws-sns': {
    name: 'Amazon SNS',
    category: 'Integration',
    description: 'Simple Notification Service',
    icon: AWSIcons['aws-sns'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Simple-Notification-Service_64.svg',
  },
  'aws-sqs': {
    name: 'Amazon SQS',
    category: 'Integration',
    description: 'Simple Queue Service',
    icon: AWSIcons['aws-sqs'],
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-Simple-Queue-Service_64.svg',
  },
  'aws-eventbridge': {
    name: 'Amazon EventBridge',
    category: 'Integration',
    description: 'Event Bus Service',
    icon: getAwsIcon('aws-eventbridge'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-EventBridge_64.svg',
  },
  'aws-step-functions': {
    name: 'AWS Step Functions',
    category: 'Integration',
    description: 'Workflow Orchestration',
    icon: getAwsIcon('aws-step-functions'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_AWS-Step-Functions_64.svg',
  },
  'aws-app-flow': {
    name: 'Amazon AppFlow',
    category: 'Integration',
    description: 'Data Integration',
    icon: getAwsIcon('aws-app-flow'),
    color: '#0073BB',
    iconUrl: '/src/assets/icons/aws/Arch_Amazon-AppFlow_64.svg',
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
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-cloud-functions': {
//     name: 'Google Cloud Functions',
//     category: 'Compute',
//     description: 'Serverless Computing',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-gke': {
//     name: 'Google Kubernetes Engine',
//     category: 'Containers',
//     description: 'Managed Kubernetes',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-cloud-storage': {
//     name: 'Google Cloud Storage',
//     category: 'Storage',
//     description: 'Object Storage',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-cloud-sql': {
//     name: 'Google Cloud SQL',
//     category: 'Database',
//     description: 'Managed SQL Database',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-firestore': {
//     name: 'Google Cloud Firestore',
//     category: 'Database',
//     description: 'NoSQL Database',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-bigquery': {
//     name: 'Google BigQuery',
//     category: 'Analytics',
//     description: 'Data Warehouse',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-vpc': {
//     name: 'Google Cloud VPC',
//     category: 'Networking',
//     description: 'Virtual Private Cloud',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-load-balancer': {
//     name: 'Google Cloud Load Balancer',
//     category: 'Networking',
//     description: 'Load Balancing',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-persistent-disk': {
//     name: 'Google Cloud Persistent Disk',
//     category: 'Storage',
//     description: 'Block Storage',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-iam': {
//     name: 'Google Cloud IAM',
//     category: 'Security',
//     description: 'Identity and Access Management',
//     icon: <div>🔧</div>, // Fallback icon 
//     color: '#4285F4',
//   },
//   'gcp-kms': {
//     name: 'Google Cloud KMS',
//     category: 'Security',
//     description: 'Key Management Service',
//     icon: <div>🔧</div>, // Fallback icon 
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
    icon: React.ReactElement;
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
      const fileName = getAwsIconFileName(serviceId);
      const url = resolveAwsIconUrl(fileName);
      payload.iconUrl = url || awsService.iconUrl;
      payload.serviceName = awsService.name;
      payload.description = awsService.description;
      payload.category = awsService.category;
    } else {
      // For non-AWS services, use the service data passed in
      if ((service as any).iconUrl) {
        payload.iconUrl = (service as any).iconUrl;
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
      className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing group"
      draggable
      onDragStart={handleDragStart}
      title={`${service.name} - ${service.description}`}
    >
      <div className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
        {service.icon}
      </div>
      <div className="text-center">
        <div className="text-xs font-bold text-gray-800 truncate max-w-20">
          {service.name}
        </div>
        <div className="text-xs text-gray-600 truncate max-w-20 font-medium">
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
    <div className="space-y-4">
      <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide flex items-center">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 animate-pulse"></div>
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
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
    iconUrl: '/src/assets/icons/azure/virtual-machine.svg',
  },
  'azure-functions': {
    name: 'Azure Functions',
    category: 'Compute',
    description: 'Serverless Computing',
    icon: AzureIcons['azure-functions'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/functions.svg',
  },
  'azure-aks': {
    name: 'Azure Kubernetes Service',
    category: 'Containers',
    description: 'Managed Kubernetes',
    icon: AzureIcons['azure-aks'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/aks.svg',
  },
  'azure-storage': {
    name: 'Azure Storage',
    category: 'Storage',
    description: 'Cloud Storage',
    icon: AzureIcons['azure-storage'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/storage.svg',
  },
  'azure-sql': {
    name: 'Azure SQL Database',
    category: 'Database',
    description: 'Managed SQL Database',
    icon: AzureIcons['azure-sql'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/sql.svg',
  },
  'azure-cosmosdb': {
    name: 'Azure Cosmos DB',
    category: 'Database',
    description: 'NoSQL Database',
    icon: AzureIcons['azure-cosmosdb'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/cosmosdb.svg',
  },
  'azure-vnet': {
    name: 'Azure Virtual Network',
    category: 'Networking',
    description: 'Virtual Network',
    icon: AzureIcons['azure-vnet'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/vnet.svg',
  },
  'azure-load-balancer': {
    name: 'Azure Load Balancer',
    category: 'Networking',
    description: 'Load Balancing',
    icon: AzureIcons['azure-load-balancer'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/load-balancer.svg',
  },
  'azure-disk': {
    name: 'Azure Managed Disks',
    category: 'Storage',
    description: 'Managed Disk Storage',
    icon: AzureIcons['azure-disk'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/disk.svg',
  },
  'azure-key-vault': {
    name: 'Azure Key Vault',
    category: 'Security',
    description: 'Secret Management',
    icon: AzureIcons['azure-key-vault'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/key-vault.svg',
  },
  'azure-active-directory': {
    name: 'Azure Active Directory',
    category: 'Security',
    description: 'Identity Management',
    icon: AzureIcons['azure-active-directory'],
    color: '#0078D4',
    iconUrl: '/src/assets/icons/azure/active-directory.svg',
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
    iconUrl: '/icons/gcp/Compute-Engine.svg',
  },
  'gcp-cloud-functions': {
    name: 'Google Cloud Functions',
    category: 'Compute',
    description: 'Serverless Computing',
    icon: GCPIcons['gcp-cloud-functions'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Functions.svg',
  },
  'gcp-app-engine': {
    name: 'Google App Engine',
    category: 'Compute',
    description: 'Platform as a Service',
    icon: GCPIcons['gcp-app-engine'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/App-Engine.svg',
  },
  'gcp-cloud-run': {
    name: 'Google Cloud Run',
    category: 'Compute',
    description: 'Serverless Containers',
    icon: GCPIcons['gcp-cloud-run'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Kuberun.svg',
  },
  'gcp-gke': {
    name: 'Google Kubernetes Engine',
    category: 'Containers',
    description: 'Managed Kubernetes',
    icon: GCPIcons['gcp-gke'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Google-Kubernetes-Engine.svg',
  },
  'gcp-anthos': {
    name: 'Google Anthos',
    category: 'Containers',
    description: 'Hybrid Cloud Platform',
    icon: GCPIcons['gcp-anthos'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Anthos.svg',
  },
  'gcp-cloud-storage': {
    name: 'Google Cloud Storage',
    category: 'Storage',
    description: 'Object Storage',
    icon: GCPIcons['gcp-cloud-storage'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Storage.svg',
  },
  'gcp-persistent-disk': {
    name: 'Google Cloud Persistent Disk',
    category: 'Storage',
    description: 'Block Storage',
    icon: GCPIcons['gcp-persistent-disk'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Persistent-Disk.svg',
  },
  'gcp-filestore': {
    name: 'Google Cloud Filestore',
    category: 'Storage',
    description: 'Managed File Storage',
    icon: GCPIcons['gcp-filestore'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Filestore.svg',
  },
  'gcp-artifact-registry': {
    name: 'Google Artifact Registry',
    category: 'Storage',
    description: 'Container Registry',
    icon: GCPIcons['gcp-artifact-registry'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Artifact-Registry.svg',
  },
  'gcp-cloud-sql': {
    name: 'Google Cloud SQL',
    category: 'Database',
    description: 'Managed SQL Database',
    icon: GCPIcons['gcp-cloud-sql'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-SQL.svg',
  },
  'gcp-firestore': {
    name: 'Google Cloud Firestore',
    category: 'Database',
    description: 'NoSQL Database',
    icon: GCPIcons['gcp-firestore'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Firestore.svg',
  },
  'gcp-bigtable': {
    name: 'Google Cloud Bigtable',
    category: 'Database',
    description: 'NoSQL Database',
    icon: GCPIcons['gcp-bigtable'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Bigtable.svg',
  },
  'gcp-memorystore': {
    name: 'Google Cloud Memorystore',
    category: 'Database',
    description: 'Managed Redis',
    icon: GCPIcons['gcp-memorystore'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Memorystore.svg',
  },
    'gcp-bigquery': {
    name: 'Google BigQuery',
    category: 'Analytics',
    description: 'Data Warehouse',
    icon: GCPIcons['gcp-bigquery'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/BigQuery.svg',
  },
  'gcp-looker': {
    name: 'Google Looker',
    category: 'Analytics',
    description: 'Business Intelligence',
    icon: GCPIcons['gcp-looker'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Looker.svg',
  },
  'gcp-data-fusion': {
    name: 'Google Cloud Data Fusion',
    category: 'Analytics',
    description: 'Data Integration',
    icon: GCPIcons['gcp-data-fusion'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Data-Fusion.svg',
  },
  'gcp-datastream': {
    name: 'Google Cloud Datastream',
    category: 'Analytics',
    description: 'Data Replication',
    icon: GCPIcons['gcp-datastream'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Datastream.svg',
  },
  'gcp-vpc': {
    name: 'Google Cloud VPC',
    category: 'Networking',
    description: 'Virtual Private Cloud',
    icon: GCPIcons['gcp-vpc'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Virtual-Private-Cloud.svg',
  },
  'gcp-load-balancer': {
    name: 'Google Cloud Load Balancer',
    category: 'Networking',
    description: 'Load Balancing',
    icon: GCPIcons['gcp-load-balancer'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Load-Balancing.svg',
  },
  'gcp-cloud-dns': {
    name: 'Google Cloud DNS',
    category: 'Networking',
    description: 'Domain Name System',
    icon: GCPIcons['gcp-cloud-dns'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-DNS.svg',
  },
  'gcp-cloud-cdn': {
    name: 'Google Cloud CDN',
    category: 'Networking',
    description: 'Content Delivery Network',
    icon: GCPIcons['gcp-cloud-cdn'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-CDN.svg',
  },
  'gcp-cloud-armor': {
    name: 'Google Cloud Armor',
    category: 'Security',
    description: 'DDoS Protection',
    icon: GCPIcons['gcp-cloud-armor'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Armor.svg',
  },
  'gcp-secret-manager': {
    name: 'Google Secret Manager',
    category: 'Security',
    description: 'Secret Management',
    icon: GCPIcons['gcp-secret-manager'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Secret-Manager.svg',
  },
  'gcp-binary-authorization': {
    name: 'Google Binary Authorization',
    category: 'Security',
    description: 'Container Security',
    icon: GCPIcons['gcp-binary-authorization'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Binary-Authorization.svg',
  },
  'gcp-certificate-manager': {
    name: 'Google Certificate Manager',
    category: 'Security',
    description: 'SSL Certificate Management',
    icon: GCPIcons['gcp-certificate-manager'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Certificate-Manager.svg',
  },
  'gcp-vertex-ai': {
    name: 'Google Vertex AI',
    category: 'Machine Learning',
    description: 'AI Platform',
    icon: GCPIcons['gcp-vertex-ai'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Vertex-AI.svg',
  },
  'gcp-automl': {
    name: 'Google AutoML',
    category: 'Machine Learning',
    description: 'Automated Machine Learning',
    icon: <div>🤖</div>, // AutoML icon not available, using emoji
    color: '#4285F4',
    iconUrl: '/icons/gcp/AutoML.svg',
  },
  'gcp-dialogflow': {
    name: 'Google Dialogflow',
    category: 'Machine Learning',
    description: 'Conversational AI',
    icon: GCPIcons['gcp-dialogflow'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Dialogflow.svg',
  },
  'gcp-pubsub': {
    name: 'Google Cloud Pub/Sub',
    category: 'Integration',
    description: 'Messaging Service',
    icon: GCPIcons['gcp-pubsub'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/PubSub.svg',
  },
  'gcp-cloud-build': {
    name: 'Google Cloud Build',
    category: 'Integration',
    description: 'CI/CD Platform',
    icon: <div>🏗️</div>, // Cloud Build icon not available, using emoji
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Build.svg',
  },
  'gcp-cloud-deploy': {
    name: 'Google Cloud Deploy',
    category: 'Integration',
    description: 'Continuous Delivery',
    icon: GCPIcons['gcp-cloud-deploy'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Deploy.svg',
  },
  'gcp-cloud-api-gateway': {
    name: 'Google Cloud API Gateway',
    category: 'Integration',
    description: 'API Management',
    icon: GCPIcons['gcp-cloud-api-gateway'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-API-Gateway.svg',
  },
  'gcp-eventarc': {
    name: 'Google Eventarc',
    category: 'Integration',
    description: 'Event Management',
    icon: GCPIcons['gcp-eventarc'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Eventarc.svg',
  },
  'gcp-workflows': {
    name: 'Google Cloud Workflows',
    category: 'Integration',
    description: 'Workflow Orchestration',
    icon: GCPIcons['gcp-workflows'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Workflows.svg',
  },
  'gcp-cloud-scheduler': {
    name: 'Google Cloud Scheduler',
    category: 'Integration',
    description: 'Job Scheduling',
    icon: GCPIcons['gcp-cloud-scheduler'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Scheduler.svg',
  },
  'gcp-cloud-tasks': {
    name: 'Google Cloud Tasks',
    category: 'Integration',
    description: 'Task Queue',
    icon: GCPIcons['gcp-cloud-tasks'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Tasks.svg',
  },
  'gcp-cloud-logging': {
    name: 'Google Cloud Logging',
    category: 'Operations',
    description: 'Log Management',
    icon: GCPIcons['gcp-cloud-logging'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Logging.svg',
  },
  'gcp-cloud-monitoring': {
    name: 'Google Cloud Monitoring',
    category: 'Operations',
    description: 'Infrastructure Monitoring',
    icon: GCPIcons['gcp-cloud-monitoring'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Monitoring.svg',
  },
  'gcp-stackdriver': {
    name: 'Google Stackdriver',
    category: 'Operations',
    description: 'Monitoring & Logging',
    icon: GCPIcons['gcp-stackdriver'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Stackdriver.svg',
  },
  'gcp-error-reporting': {
    name: 'Google Error Reporting',
    category: 'Operations',
    description: 'Error Tracking',
    icon: GCPIcons['gcp-error-reporting'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Error-Reporting.svg',
  },
  'gcp-debugger': {
    name: 'Google Cloud Debugger',
    category: 'Operations',
    description: 'Application Debugging',
    icon: GCPIcons['gcp-debugger'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Debugger.svg',
  },
  'gcp-profiler': {
    name: 'Google Cloud Profiler',
    category: 'Operations',
    description: 'Performance Profiling',
    icon: GCPIcons['gcp-profiler'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Profiler.svg',
  },
  'gcp-trace': {
    name: 'Google Cloud Trace',
    category: 'Operations',
    description: 'Distributed Tracing',
    icon: GCPIcons['gcp-trace'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Trace.svg',
  },
  'gcp-cloud-audit-logs': {
    name: 'Google Cloud Audit Logs',
    category: 'Operations',
    description: 'Audit Trail',
    icon: GCPIcons['gcp-cloud-audit-logs'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Audit-Logs.svg',
  },
  'gcp-cloud-asset-inventory': {
    name: 'Google Cloud Asset Inventory',
    category: 'Operations',
    description: 'Resource Discovery',
    icon: GCPIcons['gcp-cloud-asset-inventory'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Asset-Inventory.svg',
  },
  'gcp-billing': {
    name: 'Google Cloud Billing',
    category: 'Management',
    description: 'Cost Management',
    icon: GCPIcons['gcp-billing'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Billing.svg',
  },
  'gcp-project': {
    name: 'Google Cloud Project',
    category: 'Management',
    description: 'Project Management',
    icon: GCPIcons['gcp-project'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Project.svg',
  },
  'gcp-cloud-code': {
    name: 'Google Cloud Code',
    category: 'Development',
    description: 'IDE Extensions',
    icon: GCPIcons['gcp-cloud-code'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-Code.svg',
  },
  'gcp-cloud-apis': {
    name: 'Google Cloud APIs',
    category: 'Development',
    description: 'API Library',
    icon: GCPIcons['gcp-cloud-apis'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Cloud-APIs.svg',
  },
  'gcp-api': {
    name: 'Google Cloud API',
    category: 'Development',
    description: 'API Management',
    icon: GCPIcons['gcp-api'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/API.svg',
  },
  'gcp-apigee': {
    name: 'Google Apigee',
    category: 'Development',
    description: 'API Platform',
    icon: GCPIcons['gcp-apigee'],
    color: '#4285F4',
    iconUrl: '/icons/gcp/Apigee-API-Platform.svg',
  },
};

// Export the missing service objects (awsAllServices is already exported above)
export { gcpAllServices, azureAllServices };

// Export categorized Azure services
export const azureServices = categorizeServices(azureAllServices);

// Export categorized GCP services  
export const googleCloudServices = categorizeServices(gcpAllServices);

export default CloudServiceIcon;
