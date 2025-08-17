import fs from 'fs';
import path from 'path';

// Read all AWS icon files
const awsIconsDir = path.join(process.cwd(), 'src/assets/icons/aws');
const iconFiles = fs.readdirSync(awsIconsDir).filter(file => file.endsWith('.svg'));

console.log(`Found ${iconFiles.length} AWS icons`);

// Generate the AWS icon mapping
let awsIconMapping = '';

iconFiles.forEach(file => {
  const iconName = file.replace('.svg', '');
  const serviceId = iconName
    .replace('Arch_', '')
    .replace('Amazon-', '')
    .replace('AWS-', '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  awsIconMapping += `  'aws-${serviceId}': <AwsIconWrapper iconUrl="/src/assets/icons/aws/${file}" size={24} />,\n`;
});

// Generate the awsAllServices mapping
let awsAllServicesMapping = '';

iconFiles.forEach(file => {
  const iconName = file.replace('.svg', '');
  const serviceId = iconName
    .replace('Arch_', '')
    .replace('Amazon-', '')
    .replace('AWS-', '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const displayName = iconName
    .replace('Arch_', '')
    .replace('Amazon-', 'Amazon ')
    .replace('AWS-', 'AWS ')
    .replace(/-/g, ' ');
  
  awsAllServicesMapping += `  'aws-${serviceId}': {
    name: '${displayName}',
    category: 'Compute',
    description: '${displayName} Service',
    icon: AWSIcons['aws-${serviceId}'],
    color: '#FF9900',
    iconUrl: '/src/assets/icons/aws/${file}',
  },\n`;
});

console.log('Generated AWS icon mappings:');
console.log('\nAWSIcons mapping:');
console.log(awsIconMapping);
console.log('\nawsAllServices mapping:');
console.log(awsAllServicesMapping);

// Write to a file for easy copying
const output = `// Generated AWS Icon Mappings
// AWSIcons mapping:
${awsIconMapping}

// awsAllServices mapping:
${awsAllServicesMapping}
`;

fs.writeFileSync('aws-icon-mappings.txt', output);
console.log('\nMappings written to aws-icon-mappings.txt');
