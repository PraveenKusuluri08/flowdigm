// components/CanvasEditor/DrawingCanvas.tsx - COMPLETE FIXED VERSION
import React, { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
  useReactFlow,
  ConnectionLineType,
  BackgroundVariant
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

import { useCanvas } from '../../hooks/useCanvas';
import { findShapeById, getDefaultFill, getDefaultStroke } from './shapeDefinition';
import { validateShapeLabel, autoCorrectShape } from "../../utils/shapeValidation";
import { awsAllServices } from "../Sidebar/CloudServiceIcons";
import { 
  RectangleNode,
  CircleNode,
  TriangleNode,
  DiamondNode,
  HexagonNode,
  StarNode,
  LineNode,
  TextNode,
  CloudNode,
  ServerNode,
  DatabaseNode,
  ImportedImageNode,
  ArrowRightNode,
  ArrowLeftNode,
  ArrowUpNode,
  ArrowDownNode,
  ProcessNode,
  DocumentNode,
  UserNode,
  UsersNode,
  RouterNode,
  FirewallNode,
   BuildingNode,
   RawIconNode
} from './ReactFlowNodes';
import { BPMNNodeComponents } from './BPMNNodes';

// Node type mappings
const nodeTypes = {
  // Basic shapes
  rect: RectangleNode,
  rectangle: RectangleNode,
  process: ProcessNode,
  circle: CircleNode,
  terminator: CircleNode,
  triangle: TriangleNode,
  diamond: DiamondNode,
  decision: DiamondNode,
  hexagon: HexagonNode,
  star: StarNode,
  line: LineNode,
  text: TextNode,
  textNode: TextNode,
  cloud: CloudNode,
  server: ServerNode,
  infrastructure: ServerNode,
  database: DatabaseNode,
  
  // Arrows
  'arrow-right': ArrowRightNode,
  'arrow-left': ArrowLeftNode,
  'arrow-up': ArrowUpNode,
  'arrow-down': ArrowDownNode,
  
  // Flowchart
  document: DocumentNode,
  data: DatabaseNode,
  connector: CircleNode,
  
  // Users & Devices
  user: UserNode,
  users: UsersNode,
  admin: UserNode,
  
  // Infrastructure
  router: RouterNode,
  firewall: FirewallNode,
  'load-balancer': ServerNode,
  cdn: CloudNode,
  vpn: FirewallNode,
  
  // Enterprise
  building: BuildingNode,
  datacenter: ServerNode,
  office: BuildingNode,
  
  // BPMN 2.0 Nodes
  ...BPMNNodeComponents,
  factory: BuildingNode,
  branch: BuildingNode,
  
  // UML
  class: RectangleNode,
  actor: UserNode,
  usecase: CircleNode,
  component: RectangleNode,
  package: RectangleNode,
  interface: CircleNode,
  
  // AWS Services - Use RawIconNode for better icon rendering
  'aws-service': RawIconNode,
  'aws-icon': RawIconNode,
  'aws-ec2': RawIconNode,
  'aws-s3': RawIconNode,
  'aws-lambda': RawIconNode,
  'aws-rds': RawIconNode,
  'aws-vpc': RawIconNode,
  
  // Azure Services
  'azure-service': RawIconNode,
  'azure-icon': RawIconNode,
  'azure-vm': RawIconNode,
  'azure-storage': RawIconNode,
  'azure-functions': RawIconNode,
  
  // GCP Services
  'gcp-service': RawIconNode,
  'gcp-icon': RawIconNode,
  'gcp-compute': RawIconNode,
  'gcp-storage': RawIconNode,
  'gcp-functions': RawIconNode,
  'gcp-compute-engine': RawIconNode,
  'gcp-cloud-storage': RawIconNode,
  'gcp-cloud-functions': RawIconNode,
  
  // Imported Images
  'imported-image': ImportedImageNode,
  'image': ImportedImageNode,
};

interface NodeData {
  label?: string;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  serviceType?: string;
  serviceName?: string;
  icon?: any; 
  iconUrl?: string;
  iconSrc?: string;
  iconRaw?: string;
  shapeId?: string;
  description?: string;
  category?: string;
  iconOnly?: boolean;
  onResize?: (newSize: { width: number; height: number }) => void;
  onChange?: (newData: any) => void;
  minWidth?: number;
  minHeight?: number;
}

interface LastAction {
  type: 'ADD_CONNECTION' | 'ADD_NODE';
  edge?: Edge;
  node?: Node;
  timestamp: number;
}

const DrawingCanvas = () => {
  const { state, addShape, updateShape } = useCanvas();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  
  const reactFlowInstanceRef = useRef<any>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  const onNodeDataChange = useCallback((nodeId: string, newData: any) => {
    if (newData.label !== undefined) {
      const validation = validateShapeLabel(newData);
      
      if (!validation.isValid && validation.expectedShapeId && validation.confidence >= 0.8) {
        if (window.confirm(`The label "${newData.label}" suggests this should be a ${validation.expectedShapeName}. Would you like to change the shape automatically?`)) {
          const correctedData = autoCorrectShape(newData);
          if (correctedData) {
            newData = correctedData;
          }
        }
      }
    }
    
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
          
          if (newData.shapeId && newData.shapeId !== node.data.shapeId) {
            updatedNode.type = newData.shapeId;
          }
          
          return updatedNode;
        }
        return node;
      });
    });
  }, [setNodes]);

  const handleNodeResize = useCallback((nodeId: string, newSize: { width: number; height: number }) => {
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              width: newSize.width,
              height: newSize.height,
            },
          };
          return updatedNode;
        }
        return node;
      });
      return updatedNodes;
    });
    
    updateShape(nodeId, {
      width: newSize.width,
      height: newSize.height,
    });
  }, [setNodes, updateShape]);

  useEffect(() => {
    if (state.shapes && state.shapes.length > 0) {
      const initialNodes = state.shapes.map((shape: any) => {
        const nodeData = {
          ...shape,
          label: shape.text || shape.serviceName || shape.type,
          width: shape.width,
          height: shape.height,
          fill: shape.fill,
          stroke: shape.stroke,
          strokeWidth: shape.strokeWidth,
          icon: shape.icon,
          onResize: (newSize: { width: number; height: number }) => {
            handleNodeResize(shape.id, newSize);
          },
          onChange: (newData: any) => {
            onNodeDataChange(shape.id, newData);
          }
        } as NodeData;
        
        const node = {
          id: shape.id,
          type: shape.type,
          position: { x: shape.x, y: shape.y },
          data: nodeData,
          resizable: true,
          minWidth: 50,
          minHeight: 30,
        };
        
        return node;
      });
      setNodes(initialNodes);
    }
  }, [state.shapes, onNodeDataChange, handleNodeResize, setNodes]);

  const onConnectStart = useCallback(() => {
    setIsConnecting(true);
  }, []);

  const onConnectEnd = useCallback(() => {
    setIsConnecting(false);
  }, []);

  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) {
      return;
    }
    
    const newEdge: Edge = { 
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      source: params.source,
      target: params.target,
      sourceHandle: params.sourceHandle || null,
      targetHandle: params.targetHandle || null,
      type: 'smoothstep',
      style: { 
        stroke: '#3b82f6', 
        strokeWidth: 2,
        strokeDasharray: '0',
      },
      animated: false,
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
    setIsConnecting(false);
    
    setLastAction({
      type: 'ADD_CONNECTION',
      edge: newEdge,
      timestamp: Date.now()
    });
  }, [setEdges]);

  const undoLastAction = useCallback(() => {
    if (!lastAction) return;
    
    switch (lastAction.type) {
      case 'ADD_CONNECTION':
        if (lastAction.edge) {
          setEdges((eds) => eds.filter(edge => edge.id !== lastAction.edge!.id));
        }
        setLastAction(null);
        break;
      case 'ADD_NODE':
        if (lastAction.node) {
          setNodes((nds) => nds.filter(node => node.id !== lastAction.node!.id));
        }
        setLastAction(null);
        break;
    }
  }, [lastAction, setEdges, setNodes]);

  const cancelConnection = useCallback(() => {
    setIsConnecting(false);
    const connectingElement = document.querySelector('.react-flow__connection-line');
    if (connectingElement) {
      const event = new Event('mouseup', { bubbles: true });
      document.dispatchEvent(event);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isConnecting) {
        event.preventDefault();
        cancelConnection();
      }
      
      if (event.key === 'z' && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
        event.preventDefault();
        undoLastAction();
      }
      
      if (event.key === 'Delete') {
        event.preventDefault();
        setNodes((nds) => nds.filter(node => !node.selected));
        setEdges((eds) => eds.filter(edge => !edge.selected));
      }
      
      if (event.key === 'Backspace') {
        const activeElement = document.activeElement;
        const isTextInput = activeElement && (
          activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' ||
          (activeElement as HTMLElement).contentEditable === 'true'
        );
        
        if (!isTextInput) {
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isConnecting, cancelConnection, undoLastAction, setNodes, setEdges]);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (isConnecting) {
      cancelConnection();
    }
  }, [isConnecting, cancelConnection]);

  const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  const getShapeWidth = (shapeId: string) => {
    const shapeDefinition = findShapeById(shapeId);
    return shapeDefinition?.width || 80;
  };

  const getShapeHeight = (shapeId: string) => {
    const shapeDefinition = findShapeById(shapeId);
    return shapeDefinition?.height || 60;
  };

  const getShapeFill = (shapeId: string) => {
    return getDefaultFill(shapeId);
  };

  const getShapeStroke = (shapeId: string) => {
    return getDefaultStroke(shapeId);
  };

  const getServiceType = (shapeId: string): string | undefined => {
    if (shapeId.startsWith('aws-')) return 'aws';
    if (shapeId.startsWith('azure-')) return 'azure';
    if (shapeId.startsWith('gcp-')) return 'gcp';
    return undefined;
  };

  // Enhanced service data extraction with fallbacks
  const getServiceData = (shapeId: string) => {
    const shapeDefinition = findShapeById(shapeId);
    
    let icon: any = shapeDefinition?.icon || null;
    let name: string = shapeDefinition?.name || shapeId;
    let description: string = shapeDefinition?.description || shapeDefinition?.name || shapeId;
    let category: string | undefined = shapeDefinition?.category;
    let iconUrl: string | undefined;
    let iconRaw: string | undefined;

    if (shapeId.startsWith('aws-') && awsAllServices) {
      if (awsAllServices[shapeId]) {
        const dynamic = awsAllServices[shapeId];
        icon = dynamic.icon || icon;
        name = dynamic.name || name;
        description = dynamic.description || description;
        category = dynamic.category || category;
        iconUrl = (dynamic as any).iconUrl;
        iconRaw = (dynamic as any).iconRaw;
      }
    }

    if (!icon && !iconUrl && !iconRaw) {
      const localFallbacks: { [key: string]: string } = {
        'aws-ec2': '/icons/aws/aws-ec2.svg',
        'aws-s3': '/icons/aws/aws-s3.svg',
        'aws-lambda': '/icons/aws/aws-lambda.svg',
        'aws-rds': '/icons/aws/aws-rds.svg',
        'aws-vpc': '/icons/aws/aws-vpc.svg',
        'gcp-compute-engine': '/icons/gcp/gcp-compute-engine.svg',
        'gcp-cloud-storage': '/icons/gcp/gcp-cloud-storage.svg',
        'gcp-cloud-functions': '/icons/gcp/gcp-cloud-functions.svg',
        'azure-vm': '/icons/azure/azure-vm.svg',
        'azure-storage': '/icons/azure/azure-storage.svg',
        'azure-functions': '/icons/azure/azure-functions.svg',
      };
      
      iconUrl = localFallbacks[shapeId];
      
      if (!iconUrl) {
        const cdnFallbacks: { [key: string]: string } = {
          'aws-aws-activate': 'https://icon.icepanel.io/AWS/svg/Miscellaneous/AWS-Activate.svg',
          'aws-ec2': 'https://icon.icepanel.io/AWS/svg/Compute/Amazon-EC2.svg',
          'aws-s3': 'https://icon.icepanel.io/AWS/svg/Storage/Amazon-S3.svg',
          'aws-lambda': 'https://icon.icepanel.io/AWS/svg/Compute/AWS-Lambda.svg',
          'aws-rds': 'https://icon.icepanel.io/AWS/svg/Database/Amazon-RDS.svg',
          'aws-vpc': 'https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Amazon-VPC.svg',
          'aws-cloudformation': 'https://icon.icepanel.io/AWS/svg/Management-Governance/AWS-CloudFormation.svg',
          'aws-cloudwatch': 'https://icon.icepanel.io/AWS/svg/Management-Governance/Amazon-CloudWatch.svg',
          'aws-iam': 'https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/AWS-Identity-and-Access-Management.svg',
          'gcp-compute-engine': 'https://cloud.google.com/images/products/compute-engine.svg',
          'gcp-cloud-storage': 'https://cloud.google.com/images/products/storage.svg',
          'gcp-cloud-functions': 'https://cloud.google.com/images/products/cloud-functions.svg',
        };
        
        iconUrl = cdnFallbacks[shapeId];
      }
      
      if (!iconUrl) {
        if (shapeId.startsWith('aws-')) {
          iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg';
        } else if (shapeId.startsWith('gcp-')) {
          iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg';
        } else if (shapeId.startsWith('azure-')) {
          iconUrl = 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg';
        }
      }
      
      if (!iconUrl) {
        const serviceType = shapeId.startsWith('aws-') ? 'AWS' : 
                          shapeId.startsWith('gcp-') ? 'GCP' : 
                          shapeId.startsWith('azure-') ? 'AZURE' : 'ICON';
        iconUrl = `https://via.placeholder.com/64x64/4285F4/FFFFFF?text=${serviceType}`;
      }
    }

    return { name, category, color: shapeDefinition?.color || '#ffffff', description, icon, iconUrl, iconRaw };
  };

  // Enhanced drag and drop with proper icon handling
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    if (!reactFlowWrapper.current) {
      console.error('ReactFlow wrapper not found');
      return;
    }
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    
    try {
      const jsonData = event.dataTransfer.getData('application/json');
      if (!jsonData) return;
      const dragData = JSON.parse(jsonData);
      if (!dragData.shapeId) return;

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const getNodeType = (shapeId: string) => {
        if (shapeId.startsWith('aws-')) return 'aws-icon';
        if (shapeId.startsWith('azure-')) return 'azure-icon';
        if (shapeId.startsWith('gcp-')) return 'gcp-icon';
        if (shapeId === 'rect' || shapeId === 'rectangle') return 'rect';
        if (shapeId === 'circle') return 'circle';
        if (shapeId === 'triangle') return 'triangle';
        if (shapeId === 'diamond') return 'diamond';
        if (shapeId === 'hexagon') return 'hexagon';
        if (shapeId === 'star') return 'star';
        if (shapeId === 'line') return 'line';
        if (shapeId === 'text') return 'textNode';
        if (shapeId === 'process') return 'process';
        if (shapeId === 'terminator') return 'terminator';
        if (shapeId === 'decision') return 'decision';
        if (shapeId === 'document') return 'document';
        if (shapeId === 'data') return 'data';
        if (shapeId === 'arrow-right') return 'arrow-right';
        if (shapeId === 'arrow-left') return 'arrow-left';
        if (shapeId === 'arrow-up') return 'arrow-up';
        if (shapeId === 'arrow-down') return 'arrow-down';
        if (shapeId === 'cloud') return 'cloud';
        if (shapeId === 'server') return 'server';
        if (shapeId === 'database') return 'database';
        if (shapeId === 'router') return 'router';
        if (shapeId === 'firewall') return 'firewall';
        if (shapeId === 'user') return 'user';
        if (shapeId === 'users') return 'users';
        if (shapeId === 'building') return 'building';
        if (shapeId.includes('bpmn')) return 'bpmn-node';
        return 'rect';
      };

      const nodeType = dragData.nodeType || getNodeType(dragData.shapeId);
      const serviceData = getServiceData(dragData.shapeId);
      let iconUrlFromDrag: string | undefined = dragData.iconUrl || dragData.icon;
      let iconRawFromDrag: string | undefined = dragData.iconRaw;
      if (typeof iconUrlFromDrag === 'string' && iconUrlFromDrag.startsWith('data%3A')) {
        try { iconUrlFromDrag = decodeURIComponent(iconUrlFromDrag); } catch {}
      }

      const nodeId = `node_${Date.now()}`;
      const serviceType = getServiceType(dragData.shapeId);
      const defaultFill = getShapeFill(dragData.shapeId);
      const defaultStroke = getShapeStroke(dragData.shapeId);
      const colorByService: Record<string, string> = { aws: '#FF9900', azure: '#0078D4', gcp: '#4285F4' };
      const resolvedFill = defaultFill === '#FFFFFF' && serviceType ? (colorByService[serviceType] || defaultFill) : defaultFill;
      const resolvedStroke = (defaultStroke === '#333333' || defaultStroke === '#000000') && serviceType ? (colorByService[serviceType] || defaultStroke) : defaultStroke;
      const isCloudService = !!serviceType;

      let finalIcon = iconUrlFromDrag || serviceData?.iconUrl || serviceData?.icon;
      let finalIconRaw = iconRawFromDrag || serviceData?.iconRaw;
      let finalIconSrc = iconUrlFromDrag || serviceData?.iconUrl;

      if (!finalIcon && !finalIconRaw && !finalIconSrc) {
        const hardFallbacks: { [key: string]: string } = {
          'aws-aws-activate': 'https://icon.icepanel.io/AWS/svg/Miscellaneous/AWS-Activate.svg',
          'aws-ec2': 'https://icon.icepanel.io/AWS/svg/Compute/Amazon-EC2.svg',
          'aws-s3': 'https://icon.icepanel.io/AWS/svg/Storage/Amazon-S3.svg',
          'aws-lambda': 'https://icon.icepanel.io/AWS/svg/Compute/AWS-Lambda.svg',
          'aws-rds': 'https://icon.icepanel.io/AWS/svg/Database/Amazon-RDS.svg',
          'aws-vpc': 'https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Amazon-VPC.svg',
          'aws-cloudformation': 'https://icon.icepanel.io/AWS/svg/Management-Governance/AWS-CloudFormation.svg',
          'aws-cloudwatch': 'https://icon.icepanel.io/AWS/svg/Management-Governance/Amazon-CloudWatch.svg',
          'aws-iam': 'https://icon.icepanel.io/AWS/svg/Security-Identity-Compliance/AWS-Identity-and-Access-Management.svg',
        };
        finalIcon = hardFallbacks[dragData.shapeId];
        finalIconSrc = finalIcon;
        if (!finalIcon) {
          if (serviceType === 'aws') finalIcon = 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg';
          else if (serviceType === 'gcp') finalIcon = 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg';
          else if (serviceType === 'azure') finalIcon = 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg';
          else finalIcon = `https://via.placeholder.com/64x64/4285F4/FFFFFF?text=${serviceType?.toUpperCase() || 'ICON'}`;
          finalIconSrc = finalIcon;
        }
      }

      const newNode: Node<NodeData> = {
        id: nodeId,
        type: nodeType,
        position,
        data: {
          label: serviceData?.name || dragData.label || dragData.shapeId,
          width: getShapeWidth(dragData.shapeId),
          height: getShapeHeight(dragData.shapeId),
          fill: resolvedFill,
          stroke: resolvedStroke,
          strokeWidth: 2,
          shapeId: dragData.shapeId,
          serviceType,
          serviceName: serviceData?.name || dragData.shapeId,
          description: serviceData?.description || '',
          category: serviceData?.category || '',
          icon: finalIcon,
          iconUrl: finalIconSrc,
          iconSrc: finalIconSrc,
          iconRaw: finalIconRaw,
          iconOnly: dragData.iconOnly === true || isCloudService,
          onChange: (newData: any) => onNodeDataChange(nodeId, newData),
        },
      };

      setNodes((currentNodes) => [...currentNodes, newNode]);

      addShape({
        id: nodeId,
        type: dragData.shapeId,
        x: position.x,
        y: position.y,
        width: getShapeWidth(dragData.shapeId),
        height: getShapeHeight(dragData.shapeId),
        fill: resolvedFill,
        stroke: resolvedStroke,
        strokeWidth: 2,
        text: serviceData?.name || dragData.shapeId,
        icon: finalIcon,
        serviceType,
        serviceName: serviceData?.name,
      });

    } catch (error) {
      console.error('Drop error:', error);
    }
  }, [project, setNodes, onNodeDataChange, addShape, getServiceData]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleNodesChange = useCallback((changes: any[]) => {
    onNodesChange(changes);
    
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        updateShape(change.id, { 
          x: change.position.x, 
          y: change.position.y 
        });
      }
    });
  }, [onNodesChange, updateShape]);

  const onPaneClick = useCallback((event: React.MouseEvent) => {
    if (state.tool === 'select') return;
    
    if (!reactFlowWrapper.current) return;
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const nodeId = generateId();
    const width = 80;
    const height = 60;

    if (state.tool === 'text') {
      const textNode: Node<NodeData> = {
        id: nodeId,
        type: 'textNode',
        position,
        data: {
          label: 'Double-click to edit',
          width: 120,
          height: 40,
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0,
          minWidth: 50,
          minHeight: 20,
          onResize: (newSize: { width: number; height: number }) => {
            handleNodeResize(nodeId, newSize);
          },
          onChange: (newData: any) => onNodeDataChange(nodeId, newData),
        },
      };
      setNodes((nds) => nds.concat(textNode));
      return;
    }

    const newNode: Node<NodeData> = {
      id: nodeId,
      type: state.tool,
      position,
      data: {
        label: state.tool,
        width: width,
        height: height,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        minWidth: 50,
        minHeight: 30,
        onResize: (newSize: { width: number; height: number }) => {
          handleNodeResize(nodeId, newSize);
        },
        onChange: (newData: any) => onNodeDataChange(nodeId, newData),
      },
    };

    setNodes((nds) => nds.concat(newNode));
    
    setLastAction({
      type: 'ADD_NODE',
      node: newNode,
      timestamp: Date.now()
    });
    
    addShape({
      id: nodeId,
      type: state.tool,
      x: position.x,
      y: position.y,
      width: width,
      height: height,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
    });
  }, [state.tool, project, setNodes, addShape, onNodeDataChange, handleNodeResize]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setEdges((eds) => eds.map(e => ({ ...e, selected: e.id === edge.id })));
  }, [setEdges]);

  return (
    <div className="canvas-container" ref={reactFlowWrapper}>
      <ReactFlow
        className="react-flow"
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        snapToGrid={state.grid?.snap || false}
        snapGrid={[state.grid?.size || 20, state.grid?.size || 20]}
        multiSelectionKeyCode="Control"
        selectionKeyCode="Shift"
        deleteKeyCode="Delete"
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        connectOnClick={true}
        nodeDragThreshold={1}
        nodeOrigin={[0, 0]}
        minZoom={0.5}
        maxZoom={2}
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        selectNodesOnDrag={true}
        panOnScroll={false}
        panOnDrag={true}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        onInit={(instance) => {
          reactFlowInstanceRef.current = instance;
          (window as any).__REACT_FLOW_INSTANCE__ = instance;
        }}
        isValidConnection={(connection: Connection) => {
          if (connection.source === connection.target) {
            return false;
          }
          
          const existingEdge = edges.find(
            edge => edge.source === connection.source && edge.target === connection.target
          );
          
          if (existingEdge) {
            return false;
          }
          
          return true;
        }}
      >
        <Background 
          color="#e5e5e5" 
          gap={state.grid?.size || 20} 
          variant={BackgroundVariant.Lines}
        />
        {/* Controls removed per request to hide +/- UI */}

        {isConnecting && (
          <Panel position="top-center" className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50">
            <div className="font-medium text-center">
              🔗 Connecting... Click on any blue handle to connect • Press ESC or Right-click to cancel
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default DrawingCanvas;