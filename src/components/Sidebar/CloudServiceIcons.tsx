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
import GCPComputeIcon from '../../assets/icons/gcp/compute-engine.svg?react';
import GCPStorageIcon from '../../assets/icons/gcp/cloud-storage.svg?react';
import GCPFunctionsIcon from '../../assets/icons/gcp/cloud-functions.svg?react';
import GCPGKEIcon from '../../assets/icons/gcp/Google-Kubernetes-Engine.svg?react';
import GCPCloudSQLIcon from '../../assets/icons/gcp/cloud-sql.svg?react';
import GCPFirestoreIcon from '../../assets/icons/gcp/firestore.svg?react';
import GCPBigQueryIcon from '../../assets/icons/gcp/bigquery.svg?react';
import GCPVPCIcon from '../../assets/icons/gcp/Virtual-Private-Cloud.svg?react';
import GCPLoadBalancerIcon from '../../assets/icons/gcp/Cloud-Load-Balancing.svg?react';
import GCPPersistentDiskIcon from '../../assets/icons/gcp/persistent-disk.svg?react';
import GCPIAMIcon from '../../assets/icons/gcp/Identity-And-Access-Management.svg?react';
import GCPKMSIcon from '../../assets/icons/gcp/Key-Management-Service.svg?react';
import GCPAppEngineIcon from '../../assets/icons/gcp/App-Engine.svg?react';
import GCPBigtableIcon from '../../assets/icons/gcp/Bigtable.svg?react';
import GCPPubSubIcon from '../../assets/icons/gcp/PubSub.svg?react';

// TODO: Add more GCP icons once files are verified to exist
/* 
// Commented out until file existence is verified
import GCPCloudBuildIcon from '../../assets/icons/gcp/Cloud-Build.svg?react';
import GCPCloudDNSIcon from '../../assets/icons/gcp/Cloud-DNS.svg?react';
import GCPCloudCDNIcon from '../../assets/icons/gcp/Cloud-CDN.svg?react';
import GCPCloudArmorIcon from '../../assets/icons/gcp/Cloud-Armor.svg?react';
import GCPSecretManagerIcon from '../../assets/icons/gcp/Secret-Manager.svg?react';
import GCPVertexAIIcon from '../../assets/icons/gcp/Vertex-AI.svg?react';
import GCPAutoMLIcon from '../../assets/icons/gcp/AutoML.svg?react';
import GCPDialogflowIcon from '../../assets/icons/gcp/Dialogflow.svg?react';
import GCPCloudRunIcon from '../../assets/icons/gcp/Kuberun.svg?react';
import GCPAnthosIcon from '../../assets/icons/gcp/Anthos.svg?react';
import GCPArtifactRegistryIcon from '../../assets/icons/gcp/Artifact-Registry.svg?react';
import GCPCloudComposerIcon from '../../assets/icons/gcp/Cloud-Composer.svg?react';
import GCPDataFusionIcon from '../../assets/icons/gcp/Cloud-Data-Fusion.svg?react';
import GCPDatastreamIcon from '../../assets/icons/gcp/Datastream.svg?react';
import GCPLookerIcon from '../../assets/icons/gcp/Looker.svg?react';
import GCPMemorystoreIcon from '../../assets/icons/gcp/Memorystore.svg?react';
import GCPFilestoreIcon from '../../assets/icons/gcp/Filestore.svg?react';
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
*/
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

  /* Commented out until file existence is verified
  'gcp-cloud-build': <GCPCloudBuildIcon className="w-6 h-6" />,
  'gcp-cloud-dns': <GCPCloudDNSIcon className="w-6 h-6" />,
  'gcp-cloud-cdn': <GCPCloudCDNIcon className="w-6 h-6" />,
  'gcp-cloud-armor': <GCPCloudArmorIcon className="w-6 h-6" />,
  'gcp-secret-manager': <GCPSecretManagerIcon className="w-6 h-6" />,
  'gcp-vertex-ai': <GCPVertexAIIcon className="w-6 h-6" />,
  'gcp-automl': <GCPAutoMLIcon className="w-6 h-6" />,
  'gcp-dialogflow': <GCPDialogflowIcon className="w-6 h-6" />,
  'gcp-cloud-run': <GCPCloudRunIcon className="w-6 h-6" />,
  'gcp-anthos': <GCPAnthosIcon className="w-6 h-6" />,
  'gcp-artifact-registry': <GCPArtifactRegistryIcon className="w-6 h-6" />,
  'gcp-cloud-composer': <GCPCloudComposerIcon className="w-6 h-6" />,
  'gcp-data-fusion': <GCPDataFusionIcon className="w-6 h-6" />,
  'gcp-datastream': <GCPDatastreamIcon className="w-6 h-6" />,
  'gcp-looker': <GCPLookerIcon className="w-6 h-6" />,
  'gcp-memorystore': <GCPMemorystoreIcon className="w-6 h-6" />,
  'gcp-filestore': <GCPFilestoreIcon className="w-6 h-6" />,
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
  */
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
  'gcp-cloud-trace': <GCPCloudTraceIcon className="w-6 h-6" />,
  'gcp-cloud-debugger': <GCPCloudDebuggerIcon className="w-6 h-6" />,
  'gcp-cloud-profiler': <GCPCloudProfilerIcon className="w-6 h-6" />,
  'gcp-cloud-error-reporting': <GCPCloudErrorReportingIcon className="w-6 h-6" />,
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
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-cloud-functions': {
//     name: 'Google Cloud Functions',
//     category: 'Compute',
//     description: 'Serverless Computing',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-gke': {
//     name: 'Google Kubernetes Engine',
//     category: 'Containers',
//     description: 'Managed Kubernetes',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-cloud-storage': {
//     name: 'Google Cloud Storage',
//     category: 'Storage',
//     description: 'Object Storage',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-cloud-sql': {
//     name: 'Google Cloud SQL',
//     category: 'Database',
//     description: 'Managed SQL Database',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-firestore': {
//     name: 'Google Cloud Firestore',
//     category: 'Database',
//     description: 'NoSQL Database',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-bigquery': {
//     name: 'Google BigQuery',
//     category: 'Analytics',
//     description: 'Data Warehouse',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-vpc': {
//     name: 'Google Cloud VPC',
//     category: 'Networking',
//     description: 'Virtual Private Cloud',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-load-balancer': {
//     name: 'Google Cloud Load Balancer',
//     category: 'Networking',
//     description: 'Load Balancing',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-persistent-disk': {
//     name: 'Google Cloud Persistent Disk',
//     category: 'Storage',
//     description: 'Block Storage',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-iam': {
//     name: 'Google Cloud IAM',
//     category: 'Security',
//     description: 'Identity and Access Management',
//     icon: <div></div>, // Temporary fallback for 
//     color: '#4285F4',
//   },
//   'gcp-kms': {
//     name: 'Google Cloud KMS',
//     category: 'Security',
//     description: 'Key Management Service',
//     icon: <div></div>, // Temporary fallback for 
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
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Compute-Engine.svg',
    iconRaw: 'gcp-compute-engine',
  },
  'gcp-cloud-functions': {
    name: 'Google Cloud Functions',
    category: 'Compute',
    description: 'Serverless Computing',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Functions.svg',
    iconRaw: 'gcp-cloud-functions',
  },
  'gcp-app-engine': {
    name: 'Google App Engine',
    category: 'Compute',
    description: 'Platform as a Service',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/App-Engine.svg',
    iconRaw: 'gcp-app-engine',
  },
  'gcp-cloud-run': {
    name: 'Google Cloud Run',
    category: 'Compute',
    description: 'Serverless Containers',
    icon: <div>🔗</div>, // Temporary fallback icon
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Kuberun.svg',
    iconRaw: 'gcp-cloud-run',
  },
  'gcp-gke': {
    name: 'Google Kubernetes Engine',
    category: 'Containers',
    description: 'Managed Kubernetes',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Google-Kubernetes-Engine.svg',
    iconRaw: 'gcp-gke',
  },
  'gcp-anthos': {
    name: 'Google Anthos',
    category: 'Containers',
    description: 'Hybrid Cloud Platform',
    icon: <div>🔗</div>, // Temporary fallback icon
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Anthos.svg',
    iconRaw: 'gcp-anthos',
  },
  'gcp-cloud-storage': {
    name: 'Google Cloud Storage',
    category: 'Storage',
    description: 'Object Storage',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Storage.svg',
    iconRaw: 'gcp-cloud-storage',
  },
  'gcp-persistent-disk': {
    name: 'Google Cloud Persistent Disk',
    category: 'Storage',
    description: 'Block Storage',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Persistent-Disk.svg',
    iconRaw: 'gcp-persistent-disk',
  },
  'gcp-filestore': {
    name: 'Google Cloud Filestore',
    category: 'Storage',
    description: 'Managed File Storage',
    icon: <div></div>, // Temporary fallback for  // Using firestore icon as fallback
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Filestore.svg',
    iconRaw: 'gcp-filestore',
  },
  'gcp-artifact-registry': {
    name: 'Google Artifact Registry',
    category: 'Storage',
    description: 'Container Registry',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Artifact-Registry.svg',
    iconRaw: 'gcp-artifact-registry',
  },
  'gcp-cloud-sql': {
    name: 'Google Cloud SQL',
    category: 'Database',
    description: 'Managed SQL Database',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-SQL.svg',
    iconRaw: 'gcp-cloud-sql',
  },
  'gcp-firestore': {
    name: 'Google Cloud Firestore',
    category: 'Database',
    description: 'NoSQL Database',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Firestore.svg',
    iconRaw: 'gcp-firestore',
  },
  'gcp-bigtable': {
    name: 'Google Cloud Bigtable',
    category: 'Database',
    description: 'NoSQL Database',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Bigtable.svg',
    iconRaw: 'gcp-bigtable',
  },
  'gcp-memorystore': {
    name: 'Google Cloud Memorystore',
    category: 'Database',
    description: 'Managed Redis',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Memorystore.svg',
    iconRaw: 'gcp-memorystore',
  },
  'gcp-bigquery': {
    name: 'Google BigQuery',
    category: 'Analytics',
    description: 'Data Warehouse',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/BigQuery.svg',
    iconRaw: 'gcp-bigquery',
  },
  'gcp-looker': {
    name: 'Google Looker',
    category: 'Analytics',
    description: 'Business Intelligence',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Looker.svg',
    iconRaw: 'gcp-looker',
  },
  'gcp-data-fusion': {
    name: 'Google Cloud Data Fusion',
    category: 'Analytics',
    description: 'Data Integration',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Data-Fusion.svg',
    iconRaw: 'gcp-data-fusion',
  },
  'gcp-datastream': {
    name: 'Google Cloud Datastream',
    category: 'Analytics',
    description: 'Data Replication',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Datastream.svg',
    iconRaw: 'gcp-datastream',
  },
  'gcp-vpc': {
    name: 'Google Cloud VPC',
    category: 'Networking',
    description: 'Virtual Private Cloud',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Virtual-Private-Cloud.svg',
    iconRaw: 'gcp-vpc',
  },
  'gcp-load-balancer': {
    name: 'Google Cloud Load Balancer',
    category: 'Networking',
    description: 'Load Balancing',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Load-Balancing.svg',
    iconRaw: 'gcp-load-balancer',
  },
  'gcp-cloud-dns': {
    name: 'Google Cloud DNS',
    category: 'Networking',
    description: 'Domain Name System',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-DNS.svg',
    iconRaw: 'gcp-cloud-dns',
  },
  'gcp-cloud-cdn': {
    name: 'Google Cloud CDN',
    category: 'Networking',
    description: 'Content Delivery Network',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-CDN.svg',
    iconRaw: 'gcp-cloud-cdn',
  },
  'gcp-cloud-armor': {
    name: 'Google Cloud Armor',
    category: 'Security',
    description: 'DDoS Protection',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Armor.svg',
    iconRaw: 'gcp-cloud-armor',
  },
  'gcp-iam': {
    name: 'Google Cloud IAM',
    category: 'Security',
    description: 'Identity and Access Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Identity-And-Access-Management.svg',
    iconRaw: 'gcp-iam',
  },
  'gcp-kms': {
    name: 'Google Cloud KMS',
    category: 'Security',
    description: 'Key Management Service',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Key-Management-Service.svg',
    iconRaw: 'gcp-kms',
  },
  'gcp-secret-manager': {
    name: 'Google Secret Manager',
    category: 'Security',
    description: 'Secret Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Secret-Manager.svg',
    iconRaw: 'gcp-secret-manager',
  },
  'gcp-binary-authorization': {
    name: 'Google Binary Authorization',
    category: 'Security',
    description: 'Container Security',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Binary-Authorization.svg',
    iconRaw: 'gcp-binary-authorization',
  },
  'gcp-certificate-manager': {
    name: 'Google Certificate Manager',
    category: 'Security',
    description: 'SSL Certificate Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Certificate-Manager.svg',
    iconRaw: 'gcp-certificate-manager',
  },
  'gcp-vertex-ai': {
    name: 'Google Vertex AI',
    category: 'Machine Learning',
    description: 'AI Platform',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Vertex-AI.svg',
    iconRaw: 'gcp-vertex-ai',
  },
  'gcp-automl': {
    name: 'Google AutoML',
    category: 'Machine Learning',
    description: 'Automated Machine Learning',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/AutoML.svg',
    iconRaw: 'gcp-automl',
  },
  'gcp-dialogflow': {
    name: 'Google Dialogflow',
    category: 'Machine Learning',
    description: 'Conversational AI',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Dialogflow.svg',
    iconRaw: 'gcp-dialogflow',
  },
  'gcp-pubsub': {
    name: 'Google Cloud Pub/Sub',
    category: 'Integration',
    description: 'Messaging Service',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/PubSub.svg',
    iconRaw: 'gcp-pubsub',
  },
  'gcp-cloud-build': {
    name: 'Google Cloud Build',
    category: 'Integration',
    description: 'CI/CD Platform',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Build.svg',
    iconRaw: 'gcp-cloud-build',
  },
  'gcp-cloud-deploy': {
    name: 'Google Cloud Deploy',
    category: 'Integration',
    description: 'Continuous Delivery',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Deploy.svg',
    iconRaw: 'gcp-cloud-deploy',
  },
  'gcp-cloud-api-gateway': {
    name: 'Google Cloud API Gateway',
    category: 'Integration',
    description: 'API Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-API-Gateway.svg',
    iconRaw: 'gcp-cloud-api-gateway',
  },
  'gcp-eventarc': {
    name: 'Google Eventarc',
    category: 'Integration',
    description: 'Event Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Eventarc.svg',
    iconRaw: 'gcp-eventarc',
  },
  'gcp-workflows': {
    name: 'Google Cloud Workflows',
    category: 'Integration',
    description: 'Workflow Orchestration',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Workflows.svg',
    iconRaw: 'gcp-workflows',
  },
  'gcp-cloud-scheduler': {
    name: 'Google Cloud Scheduler',
    category: 'Integration',
    description: 'Job Scheduling',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Scheduler.svg',
    iconRaw: 'gcp-cloud-scheduler',
  },
  'gcp-cloud-tasks': {
    name: 'Google Cloud Tasks',
    category: 'Integration',
    description: 'Task Queue',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Tasks.svg',
    iconRaw: 'gcp-cloud-tasks',
  },
  'gcp-cloud-logging': {
    name: 'Google Cloud Logging',
    category: 'Operations',
    description: 'Log Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Logging.svg',
    iconRaw: 'gcp-cloud-logging',
  },
  'gcp-cloud-monitoring': {
    name: 'Google Cloud Monitoring',
    category: 'Operations',
    description: 'Infrastructure Monitoring',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Monitoring.svg',
    iconRaw: 'gcp-cloud-monitoring',
  },
  'gcp-stackdriver': {
    name: 'Google Stackdriver',
    category: 'Operations',
    description: 'Monitoring & Logging',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Stackdriver.svg',
    iconRaw: 'gcp-stackdriver',
  },
  'gcp-error-reporting': {
    name: 'Google Error Reporting',
    category: 'Operations',
    description: 'Error Tracking',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Error-Reporting.svg',
    iconRaw: 'gcp-error-reporting',
  },
  'gcp-debugger': {
    name: 'Google Cloud Debugger',
    category: 'Operations',
    description: 'Application Debugging',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Debugger.svg',
    iconRaw: 'gcp-debugger',
  },
  'gcp-profiler': {
    name: 'Google Cloud Profiler',
    category: 'Operations',
    description: 'Performance Profiling',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Profiler.svg',
    iconRaw: 'gcp-profiler',
  },
  'gcp-trace': {
    name: 'Google Cloud Trace',
    category: 'Operations',
    description: 'Distributed Tracing',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Trace.svg',
    iconRaw: 'gcp-trace',
  },
  'gcp-cloud-audit-logs': {
    name: 'Google Cloud Audit Logs',
    category: 'Operations',
    description: 'Audit Trail',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Audit-Logs.svg',
    iconRaw: 'gcp-cloud-audit-logs',
  },
  'gcp-cloud-asset-inventory': {
    name: 'Google Cloud Asset Inventory',
    category: 'Operations',
    description: 'Resource Discovery',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Asset-Inventory.svg',
    iconRaw: 'gcp-cloud-asset-inventory',
  },
  'gcp-billing': {
    name: 'Google Cloud Billing',
    category: 'Management',
    description: 'Cost Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Billing.svg',
    iconRaw: 'gcp-billing',
  },
  'gcp-project': {
    name: 'Google Cloud Project',
    category: 'Management',
    description: 'Project Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Project.svg',
    iconRaw: 'gcp-project',
  },
  'gcp-cloud-code': {
    name: 'Google Cloud Code',
    category: 'Development',
    description: 'IDE Extensions',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-Code.svg',
    iconRaw: 'gcp-cloud-code',
  },
  'gcp-cloud-apis': {
    name: 'Google Cloud APIs',
    category: 'Development',
    description: 'API Library',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Cloud-APIs.svg',
    iconRaw: 'gcp-cloud-apis',
  },
  'gcp-api': {
    name: 'Google Cloud API',
    category: 'Development',
    description: 'API Management',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/API.svg',
    iconRaw: 'gcp-api',
  },
  'gcp-apigee': {
    name: 'Google Apigee',
    category: 'Development',
    description: 'API Platform',
    icon: <div></div>, // Temporary fallback for 
    color: '#4285F4',
    iconUrl: '/src/assets/icons/gcp/Apigee-API-Platform.svg',
    iconRaw: 'gcp-apigee',
  },
};

// Export categorized Azure services
export const azureServices = categorizeServices(azureAllServices);

// Export categorized GCP services  
export const googleCloudServices = categorizeServices(gcpAllServices);

export default CloudServiceIcon;
