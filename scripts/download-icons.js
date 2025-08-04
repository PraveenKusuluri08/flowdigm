import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AWS Icons to download (most commonly used)
const awsIcons = [
  { name: 'aws-ec2', url: 'https://aws-icons.com/icons/Compute/Amazon-EC2.svg' },
  { name: 'aws-lambda', url: 'https://aws-icons.com/icons/Compute/AWS-Lambda.svg' },
  { name: 'aws-s3', url: 'https://aws-icons.com/icons/Storage/Amazon-S3.svg' },
  { name: 'aws-rds', url: 'https://aws-icons.com/icons/Database/Amazon-RDS.svg' },
  { name: 'aws-vpc', url: 'https://aws-icons.com/icons/Networking-Content-Delivery/Amazon-VPC.svg' },
  { name: 'aws-iam', url: 'https://aws-icons.com/icons/Security-Identity-Compliance/IAM-Identity-Center.svg' },
  { name: 'aws-ecs', url: 'https://aws-icons.com/icons/Containers/Amazon-ECS.svg' },
  { name: 'aws-eks', url: 'https://aws-icons.com/icons/Containers/Amazon-EKS.svg' },
  { name: 'aws-dynamodb', url: 'https://aws-icons.com/icons/Database/Amazon-DynamoDB.svg' },
  { name: 'aws-redshift', url: 'https://aws-icons.com/icons/Analytics/Amazon-Redshift.svg' },
  { name: 'aws-alb', url: 'https://aws-icons.com/icons/Networking-Content-Delivery/Application-Load-Balancer.svg' },
  { name: 'aws-route53', url: 'https://aws-icons.com/icons/Networking-Content-Delivery/Amazon-Route-53.svg' },
  { name: 'aws-kms', url: 'https://aws-icons.com/icons/Security-Identity-Compliance/AWS-Key-Management-Service.svg' },
  { name: 'aws-ebs', url: 'https://aws-icons.com/icons/Storage/Amazon-EBS.svg' },
  { name: 'aws-efs', url: 'https://aws-icons.com/icons/Storage/Amazon-EFS.svg' }
];

// GCP Icons to download (most commonly used)
const gcpIcons = [
  { name: 'gcp-compute-engine', url: 'https://gcpicons.com/icons/Compute/Compute-Engine.svg' },
  { name: 'gcp-cloud-functions', url: 'https://gcpicons.com/icons/Compute/Cloud-Functions.svg' },
  { name: 'gcp-gke', url: 'https://gcpicons.com/icons/Compute/Kubernetes-Engine.svg' },
  { name: 'gcp-cloud-storage', url: 'https://gcpicons.com/icons/Storage/Cloud-Storage.svg' },
  { name: 'gcp-cloud-sql', url: 'https://gcpicons.com/icons/Database/Cloud-SQL.svg' },
  { name: 'gcp-firestore', url: 'https://gcpicons.com/icons/Database/Firestore.svg' },
  { name: 'gcp-bigquery', url: 'https://gcpicons.com/icons/Analytics/BigQuery.svg' },
  { name: 'gcp-vpc', url: 'https://gcpicons.com/icons/Networking/VPC.svg' },
  { name: 'gcp-load-balancer', url: 'https://gcpicons.com/icons/Networking/Load-Balancing.svg' },
  { name: 'gcp-persistent-disk', url: 'https://gcpicons.com/icons/Storage/Persistent-Disk.svg' }
];

function downloadIcon(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        console.log(`Failed to download ${url}: ${response.statusCode}`);
        resolve(); // Continue with other downloads
      }
    }).on('error', (err) => {
      console.log(`Error downloading ${url}: ${err.message}`);
      resolve(); // Continue with other downloads
    });
  });
}

async function downloadIcons() {
  console.log('Starting icon downloads...');
  
  // Create directories if they don't exist
  const awsDir = path.join(__dirname, '../public/icons/aws');
  const gcpDir = path.join(__dirname, '../public/icons/gcp');
  
  if (!fs.existsSync(awsDir)) {
    fs.mkdirSync(awsDir, { recursive: true });
  }
  if (!fs.existsSync(gcpDir)) {
    fs.mkdirSync(gcpDir, { recursive: true });
  }
  
  // Download AWS icons
  console.log('\nDownloading AWS icons...');
  for (const icon of awsIcons) {
    const filepath = path.join(awsDir, `${icon.name}.svg`);
    await downloadIcon(icon.url, filepath);
  }
  
  // Download GCP icons
  console.log('\nDownloading GCP icons...');
  for (const icon of gcpIcons) {
    const filepath = path.join(gcpDir, `${icon.name}.svg`);
    await downloadIcon(icon.url, filepath);
  }
  
  console.log('\nIcon download completed!');
}

downloadIcons().catch(console.error); 