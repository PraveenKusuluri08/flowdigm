// utils/dragDropUtils.js
import { v4 as uuidv4 } from 'uuid';
import { findShapeById } from '../components/CanvasEditor/shapeDefinition';
import { awsAllServices, gcpAllServices, azureAllServices } from '../components/Sidebar/CloudServiceIcons';

/**
 * Creates a shape object from sidebar drag and drop
 * @param {string} shapeId - The ID of the shape from sidebar
 * @param {object} position - The position where to create the shape {x, y}
 * @param {object} options - Additional options for the shape
 * @returns {object|null} - The created shape object or null if failed
 */
export const createShapeFromSidebar = (shapeId, position, options = {}) => {
  const shapeDefinition = findShapeById(shapeId);
  
  // Get cloud service data if available
  let cloudServiceData = null;
  if (shapeId.startsWith('aws-') && awsAllServices && awsAllServices[shapeId]) {
    cloudServiceData = awsAllServices[shapeId];
  } else if (shapeId.startsWith('gcp-') && gcpAllServices && gcpAllServices[shapeId]) {
    cloudServiceData = gcpAllServices[shapeId];
  } else if (shapeId.startsWith('azure-') && azureAllServices && azureAllServices[shapeId]) {
    cloudServiceData = azureAllServices[shapeId];
  }
  
  if (!shapeDefinition && !cloudServiceData) {
    console.warn(`Shape definition not found for: ${shapeId}`);
    return null;
  }

  // Generate unique ID
  const generateId = () => {
    try {
      return uuidv4();
    } catch (error) {
      // Fallback if uuid is not available
      return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
  };

  // Base shape properties
  const baseShape = {
    id: generateId(),
    type: shapeId,
    shapeId: shapeId,
    name: cloudServiceData?.name || shapeDefinition?.name || shapeId,
    tooltip: cloudServiceData?.description || shapeDefinition?.tooltip || shapeDefinition?.name || shapeId,
    x: position.x,
    y: position.y,
    width: options.width || getDefaultWidth(shapeId),
    height: options.height || getDefaultHeight(shapeId),
    fill: options.fill || getDefaultFill(shapeId),
    stroke: options.stroke || getDefaultStroke(shapeId),
    strokeWidth: options.strokeWidth || 1,
    rotation: 0,
    // Add cloud service data for icon rendering
    icon: cloudServiceData?.icon || null,
    iconUrl: cloudServiceData?.iconUrl || null,
    iconRaw: cloudServiceData?.iconRaw || null,
    serviceName: cloudServiceData?.name || shapeId,
    serviceType: shapeId.startsWith('aws-') ? 'AWS' : shapeId.startsWith('gcp-') ? 'GCP' : shapeId.startsWith('azure-') ? 'AZURE' : null,
    // Add connection points for interactive shapes
    connectionPoints: {
      top: { x: 0.5, y: 0 },
      right: { x: 1, y: 0.5 },
      bottom: { x: 0.5, y: 1 },
      left: { x: 0, y: 0.5 }
    }
  };

  // Handle specific shape types based on their category
  return handleShapeType(baseShape, shapeDefinition, position);
};

/**
 * Get default width based on shape type
 */
const getDefaultWidth = (shapeId) => {
  if (shapeId.startsWith('aws-') || shapeId.startsWith('azure-') || shapeId.startsWith('gcp-')) {
    return 120; // Cloud services are wider
  }
  if (shapeId === 'line' || shapeId.startsWith('arrow-')) {
    return 100;
  }
  return 80; // Default width
};

/**
 * Get default height based on shape type
 */
const getDefaultHeight = (shapeId) => {
  if (shapeId.startsWith('aws-') || shapeId.startsWith('azure-') || shapeId.startsWith('gcp-')) {
    return 80; // Cloud services
  }
  if (shapeId === 'line' || shapeId.startsWith('arrow-')) {
    return 2; // Lines are thin
  }
  return 60; // Default height
};

/**
 * Get default fill color based on shape type
 */
const getDefaultFill = (shapeId) => {
  if (shapeId === 'line' || shapeId.startsWith('arrow-')) {
    return 'transparent';
  }
  if (shapeId === 'text' || shapeId === 'label') {
    return '#000000'; // Text color
  }
  return '#ffffff'; // Default white fill
};

/**
 * Get default stroke color based on shape type
 */
const getDefaultStroke = (shapeId) => {
  if (shapeId.startsWith('aws-')) {
    return '#FF9900'; // AWS orange
  }
  if (shapeId.startsWith('azure-')) {
    return '#0078D4'; // Azure blue
  }
  if (shapeId.startsWith('gcp-')) {
    return '#4285F4'; // GCP blue
  }
  return '#000000'; // Default black
};

/**
 * Handle different shape types and return appropriate shape object
 */
const handleShapeType = (baseShape, shapeDefinition, position) => {
  // Check for cloud services by ID prefix first
  if (baseShape.shapeId.startsWith('aws-')) {
    return handleAWSShape(baseShape, shapeDefinition);
  }
  
  if (baseShape.shapeId.startsWith('gcp-')) {
    return handleGCPShape(baseShape, shapeDefinition);
  }
  
  if (baseShape.shapeId.startsWith('azure-')) {
    return handleAzureShape(baseShape, shapeDefinition);
  }
  
  // Handle other shape types
  switch (shapeDefinition?.type) {
    case 'basic':
      return handleBasicShape(baseShape, shapeDefinition);
      
    case 'arrow':
    case 'line':
      return handleLineShape(baseShape, position);
      
    case 'text':
      return handleTextShape(baseShape);
      
    case 'flowchart':
      return handleFlowchartShape(baseShape, shapeDefinition);
      
    case 'infrastructure':
    case 'user':
    case 'device':
    case 'enterprise':
    case 'uml':
    case 'image':
    default:
      return handleGenericShape(baseShape, shapeDefinition);
  }
};

/**
 * Handle basic geometric shapes
 */
const handleBasicShape = (baseShape, shapeDefinition) => {
  return {
    ...baseShape,
    type: baseShape.shapeId === 'rect' ? 'rectangle' : baseShape.shapeId
  };
};

/**
 * Handle line and arrow shapes
 */
const handleLineShape = (baseShape, position) => {
  return {
    ...baseShape,
    type: 'line',
    points: [position.x, position.y, position.x + 100, position.y],
    fill: 'transparent'
  };
};

/**
 * Handle text shapes
 */
const handleTextShape = (baseShape) => {
  return {
    ...baseShape,
    type: 'text',
    text: 'Double click to edit',
    fontSize: 16,
    fontFamily: 'Arial',
    fill: '#000000',
    stroke: 'transparent'
  };
};

/**
 * Handle flowchart shapes
 */
const handleFlowchartShape = (baseShape, shapeDefinition) => {
  const typeMapping = {
    'process': 'rectangle',
    'decision': 'diamond',
    'terminator': 'circle',
    'document': 'rectangle',
    'data': 'database',
    'connector': 'circle'
  };
  
  return {
    ...baseShape,
    type: typeMapping[baseShape.shapeId] || baseShape.shapeId
  };
};

/**
 * Handle AWS service shapes
 */
const handleAWSShape = (baseShape, shapeDefinition) => {
  return {
    ...baseShape,
    type: baseShape.shapeId,
    serviceCategory: shapeDefinition.type,
    category: shapeDefinition.category || 'AWS',
    width: 120,
    height: 80,
    stroke: getAWSServiceColor(shapeDefinition.type),
    strokeWidth: 2,
    // Ensure icon data is preserved
    icon: baseShape.icon,
    iconUrl: baseShape.iconUrl,
    iconRaw: baseShape.iconRaw,
    serviceName: baseShape.serviceName,
    serviceType: baseShape.serviceType
  };
};

/**
 * Handle Azure service shapes
 */
const handleAzureShape = (baseShape, shapeDefinition) => {
  return {
    ...baseShape,
    type: baseShape.shapeId,
    serviceCategory: shapeDefinition.type,
    category: 'Azure',
    width: 120,
    height: 80,
    stroke: '#0078D4',
    strokeWidth: 2,
    // Ensure icon data is preserved
    icon: baseShape.icon,
    iconUrl: baseShape.iconUrl,
    iconRaw: baseShape.iconRaw,
    serviceName: baseShape.serviceName,
    serviceType: baseShape.serviceType
  };
};

/**
 * Handle GCP service shapes
 */
const handleGCPShape = (baseShape, shapeDefinition) => {
  return {
    ...baseShape,
    type: baseShape.shapeId,
    serviceCategory: shapeDefinition.type,
    category: 'GCP',
    width: 120,
    height: 80,
    stroke: '#4285F4',
    strokeWidth: 2,
    // Ensure icon data is preserved
    icon: baseShape.icon,
    iconUrl: baseShape.iconUrl,
    iconRaw: baseShape.iconRaw,
    serviceName: baseShape.serviceName,
    serviceType: baseShape.serviceType
  };
};

/**
 * Handle generic shapes (infrastructure, users, etc.)
 */
const handleGenericShape = (baseShape, shapeDefinition) => {
  return {
    ...baseShape,
    type: baseShape.shapeId,
    category: shapeDefinition.type
  };
};

/**
 * Get AWS service color based on service category
 */
const getAWSServiceColor = (serviceType) => {
  const colorMap = {
    'aws-compute': '#FF9900',
    'aws-storage': '#3F8624',
    'aws-database': '#3F48CC',
    'aws-network': '#FF4B4B',
    'aws-security': '#DD344C',
    'aws-management': '#759C3E',
    'aws-analytics': '#8C4FFF',
    'aws-ml': '#01A88D',
    'aws-integration': '#FF4B4B'
  };
  
  return colorMap[serviceType] || '#FF9900';
};

/**
 * Handles drag start event for sidebar items
 */
export const handleSidebarDragStart = (e, shapeId) => {
  console.log('Starting drag for shape:', shapeId);
  
  const dragData = {
    shapeId: shapeId,
    timestamp: Date.now()
  };
  
  e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  e.dataTransfer.effectAllowed = 'move';
  
  // Add visual feedback
  if (e.target) {
    e.target.style.opacity = '0.5';
  }
};

/**
 * Handles drag end event for sidebar items
 */
export const handleSidebarDragEnd = (e) => {
  // Restore visual feedback
  if (e.target) {
    e.target.style.opacity = '1';
  }
};

/**
 * Handles canvas drag over event
 */
export const handleCanvasDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

/**
 * Handles canvas drop event
 */
export const handleCanvasDrop = (e, canvasRef, addShape, snapToGrid) => {
  e.preventDefault();
  
  try {
    const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (!dragData.shapeId) {
      console.warn('No shape ID found in drag data');
      return false;
    }
    
    // Get canvas position
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas reference not found');
      return false;
    }
    
    const stage = canvas.getStage();
    const pointerPosition = stage.getPointerPosition();
    
    // Convert screen coordinates to stage coordinates
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const pos = stageTransform.point(pointerPosition);
    
    // Apply grid snapping if enabled
    const finalPosition = {
      x: snapToGrid ? snapToGrid(pos.x - 60) : pos.x - 60, // Center the shape
      y: snapToGrid ? snapToGrid(pos.y - 40) : pos.y - 40
    };
    
    // Create the shape
    const newShape = createShapeFromSidebar(dragData.shapeId, finalPosition);
    
    if (newShape) {
      addShape(newShape);
      console.log('Successfully added shape:', newShape.type);
      return true;
    } else {
      console.error('Failed to create shape from sidebar');
      return false;
    }
    
  } catch (error) {
    console.error('Error handling canvas drop:', error);
    return false;
  }
};

/**
 * Validates shape data before creation
 */
export const validateShapeData = (shapeData) => {
  if (!shapeData) {
    return { valid: false, error: 'Shape data is required' };
  }
  
  if (!shapeData.type) {
    return { valid: false, error: 'Shape type is required' };
  }
  
  if (typeof shapeData.x !== 'number' || typeof shapeData.y !== 'number') {
    return { valid: false, error: 'Valid position coordinates are required' };
  }
  
  return { valid: true };
};

/**
 * Utility to check if a shape is a cloud service
 */
export const isCloudService = (shapeType) => {
  return shapeType?.startsWith('aws-') || 
         shapeType?.startsWith('azure-') || 
         shapeType?.startsWith('gcp-');
};

/**
 * Utility to get shape category display name
 */
export const getShapeCategoryName = (shapeType) => {
  if (shapeType?.startsWith('aws-')) return 'Amazon Web Services';
  if (shapeType?.startsWith('azure-')) return 'Microsoft Azure';
  if (shapeType?.startsWith('gcp-')) return 'Google Cloud Platform';
  return 'General';
};