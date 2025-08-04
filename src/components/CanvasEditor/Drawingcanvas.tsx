// components/CanvasEditor/DrawingCanvas.tsx - WORKING VERSION
import React, { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
  useReactFlow,
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

import { useCanvas } from '../../hooks/useCanvas';
import { findShapeById } from '../Sidebar/shapeDefinition';
import { 
  awsServices, 
  googleCloudServices, 
  azureServices 
} from '../Sidebar/CloudServiceIcons';
import { 
  RectangleNode,
  CircleNode,
  AWSServiceNode,
  AzureServiceNode,
  GCPServiceNode,
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
  BuildingNode
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
  textNode: TextNode, // For floating text tool
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
  
  // AWS Services
  'aws-service': AWSServiceNode,
  
  // Azure Services
  'azure-service': AzureServiceNode,
  
  // GCP Services
  'gcp-service': GCPServiceNode,
  
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
  icon?: string; // For imported images
  shapeId?: string; // Original shape ID from sidebar
  description?: string;
  category?: string;
  onResize?: (newSize: { width: number; height: number }) => void;
  onChange?: (newData: any) => void; // For text editing
  minWidth?: number; // Added for minWidth
  minHeight?: number; // Added for minHeight
}

interface LastAction {
  type: 'ADD_CONNECTION' | 'ADD_NODE';
  edge?: Edge;
  node?: Node;
  timestamp: number;
}

const DrawingCanvas = () => {
  const { state, addShape, updateShape, exportCanvas } = useCanvas();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, getNodes, getEdges } = useReactFlow();
  
  // Store ReactFlow instance for export
  const reactFlowInstanceRef = useRef<any>(null);
  
  // Connection and undo state
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  
  // Convert existing shapes to nodes
  const convertShapeToNode = useCallback((shape: any) => {
    console.log('Converting shape to node:', shape);
    
    const nodeData = {
      ...shape,
      label: shape.text || shape.serviceName || shape.type,
      width: shape.width,
      height: shape.height,
      fill: shape.fill,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      icon: shape.icon, // Make sure icon is included for imported images
      // CRITICAL: Add resize callback to each node
      onResize: (newSize: { width: number; height: number }) => {
        handleNodeResize(shape.id, newSize);
      }
    } as NodeData;
    
    const node = {
      id: shape.id,
      type: shape.type,
      position: { x: shape.x, y: shape.y },
      data: nodeData,
      // Enable resizing for all nodes
      resizable: true,
      // Set minimum size
      minWidth: 50,
      minHeight: 30,
    };
    
    console.log('Created node:', node);
    return node;
  }, []);

  const initialNodes = state.shapes?.map(convertShapeToNode) || [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync nodes with context state changes
  useEffect(() => {
    console.log('Syncing nodes with context state. Shapes count:', state.shapes?.length || 0);
    const newNodes = state.shapes?.map(convertShapeToNode) || [];
    setNodes(newNodes);
  }, [state.shapes, convertShapeToNode, setNodes]);

  // Handle node data changes (for text editing)
  const onNodeDataChange = useCallback((nodeId: string, newData: any) => {
    console.log('🔄 Node data change called:', nodeId, newData);
    console.log('🔄 Current nodes count:', nodes.length);
    
    setNodes((nds) => {
      console.log('🔄 Updating nodes, current count:', nds.length);
      const updatedNodes = nds.map((node) => {
        if (node.id === nodeId) {
          console.log('🔄 Found node to update:', nodeId);
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
          console.log('🔄 Updated node data:', updatedNode.data);
          return updatedNode;
        }
        return node;
      });
      console.log('🔄 Nodes updated, new count:', updatedNodes.length);
      return updatedNodes;
    });
  }, [setNodes, nodes.length]);

  const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  // WORKING resize handler
  const handleNodeResize = useCallback((nodeId: string, newSize: { width: number; height: number }) => {
    console.log('Resizing node:', nodeId, 'to:', newSize); // Debug log
    
    // Update ReactFlow nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              width: newSize.width,
              height: newSize.height,
            },
          };
        }
        return node;
      })
    );

    // Update your context/state
    updateShape(nodeId, {
      width: newSize.width,
      height: newSize.height,
    });
  }, [setNodes, updateShape]);

  // Connection handlers
  const onConnectStart = useCallback(() => {
    setIsConnecting(true);
  }, []);

  const onConnectEnd = useCallback(() => {
    setIsConnecting(false);
  }, []);

  const onConnect = useCallback((params: Connection) => {
    console.log('Connection attempt:', params);
    
    if (!params.source || !params.target) {
      console.log('Missing source or target');
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
        strokeDasharray: '0', // Solid line instead of dashed
      },
      animated: false,
    };
    
    console.log('Creating new edge:', newEdge);
    setEdges((eds) => addEdge(newEdge, eds));
    setIsConnecting(false);
    
    // Track for undo
    setLastAction({
      type: 'ADD_CONNECTION',
      edge: newEdge,
      timestamp: Date.now()
    });
  }, [setEdges]);

  // Undo functionality
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

  // Cancel connection
  const cancelConnection = useCallback(() => {
    setIsConnecting(false);
    const connectingElement = document.querySelector('.react-flow__connection-line');
    if (connectingElement) {
      const event = new Event('mouseup', { bubbles: true });
      document.dispatchEvent(event);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cancel connection with Escape
      if (event.key === 'Escape' && isConnecting) {
        event.preventDefault();
        cancelConnection();
      }
      
      // Undo with Ctrl+Z
      if (event.key === 'z' && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
        event.preventDefault();
        undoLastAction();
      }
      
      // Delete selected
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setNodes((nds) => nds.filter(node => !node.selected));
        setEdges((eds) => eds.filter(edge => !edge.selected));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isConnecting, cancelConnection, undoLastAction, setNodes, setEdges]);

  // Right-click to cancel connection
  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (isConnecting) {
      cancelConnection();
    }
  }, [isConnecting, cancelConnection]);

  // Map shape ID to node type - moved outside callback for better performance
  const getNodeType = useCallback((shapeId: string) => {
    console.log('Mapping shape ID to node type:', shapeId);
    
    // Basic shapes
    if (['rect', 'rectangle', 'process'].includes(shapeId)) return 'rect';
    if (['circle', 'terminator', 'connector', 'usecase', 'interface'].includes(shapeId)) return 'circle';
    if (['triangle'].includes(shapeId)) return 'triangle';
    if (['diamond', 'decision'].includes(shapeId)) return 'diamond';
    if (['hexagon'].includes(shapeId)) return 'hexagon';
    if (['star'].includes(shapeId)) return 'star';
    if (['line'].includes(shapeId)) return 'line';
    if (['text'].includes(shapeId)) return 'text';
    if (['cloud'].includes(shapeId)) return 'cloud';
    if (['server', 'infrastructure', 'datacenter'].includes(shapeId)) return 'server';
    if (['database', 'data'].includes(shapeId)) return 'database';
    
    // Arrows
    if (['arrow-right'].includes(shapeId)) return 'arrow-right';
    if (['arrow-left'].includes(shapeId)) return 'arrow-left';
    if (['arrow-up'].includes(shapeId)) return 'arrow-up';
    if (['arrow-down'].includes(shapeId)) return 'arrow-down';
    
    // Flowchart
    if (['document'].includes(shapeId)) return 'document';
    
    // Users & Devices
    if (['user', 'admin', 'actor'].includes(shapeId)) return 'user';
    if (['users'].includes(shapeId)) return 'users';
    
    // Infrastructure
    if (['router'].includes(shapeId)) return 'router';
    if (['firewall', 'vpn'].includes(shapeId)) return 'firewall';
    if (['load-balancer'].includes(shapeId)) return 'server';
    if (['cdn'].includes(shapeId)) return 'cloud';
    
    // Enterprise
    if (['building', 'office', 'factory', 'branch'].includes(shapeId)) return 'building';
    
    // UML
    if (['class', 'component', 'package'].includes(shapeId)) return 'rect';
    
    // AWS Services
    if (shapeId.startsWith('aws-')) return 'aws-service';
    
    // Azure Services
    if (shapeId.startsWith('azure-')) return 'azure-service';
    
    // GCP Services
    if (shapeId.startsWith('gcp-')) return 'gcp-service';
    
    // BPMN 2.0 Shapes
    if (shapeId.startsWith('bpmn-')) return shapeId;
    
    // Default to rectangle
    console.log('No specific mapping found, defaulting to rect for:', shapeId);
    return 'rect';
  }, []);

  // Handle drop from sidebar
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    console.log('🎯 Drop event triggered');

    if (!reactFlowWrapper.current) {
      console.error('❌ ReactFlow wrapper not found');
      return;
    }
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    console.log('📍 ReactFlow bounds:', reactFlowBounds);
    console.log('📍 Drop coordinates:', { clientX: event.clientX, clientY: event.clientY });
    
    try {
      const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
      console.log('📦 Parsed drag data:', dragData);
      
      if (!dragData.shapeId) {
        console.error('❌ No shapeId in drag data');
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      console.log('📍 Calculated position:', position);
      console.log('📍 ReactFlow bounds left/top:', reactFlowBounds.left, reactFlowBounds.top);

      const shapeDefinition = findShapeById(dragData.shapeId);
      console.log('🔍 Shape definition found:', shapeDefinition);
      
      if (!shapeDefinition) {
        console.error('❌ No shape definition found for:', dragData.shapeId);
        return;
      }

      const nodeId = generateId();
      const width = getShapeWidth(dragData.shapeId);
      const height = getShapeHeight(dragData.shapeId);

      // Get service data for cloud services
      const serviceData = getServiceData(dragData.shapeId);
      console.log('☁️ Service data:', serviceData);

      const nodeType = getNodeType(dragData.shapeId);
      console.log('🎨 Node type:', nodeType);
      
      // Get the specific icon for BPMN shapes
      let nodeIcon = serviceData?.icon;
      if (dragData.shapeId.startsWith('bpmn-') && shapeDefinition) {
        nodeIcon = (shapeDefinition as any).icon;
        console.log('🎨 BPMN icon found:', nodeIcon);
      }
      
      const newNode: Node<NodeData> = {
        id: nodeId,
        type: nodeType,
        position,
        data: {
          label: serviceData?.name || (shapeDefinition as any).tooltip || dragData.shapeId,
          width: width,
          height: height,
          fill: getShapeFill(dragData.shapeId),
          stroke: getShapeStroke(dragData.shapeId),
          strokeWidth: 2,
          serviceType: getServiceType(dragData.shapeId) || undefined,
          serviceName: serviceData?.name || (shapeDefinition as any).tooltip,
          icon: nodeIcon,
          description: serviceData?.description,
          category: serviceData?.category,
          shapeId: dragData.shapeId,
          onChange: (newData: any) => onNodeDataChange(nodeId, newData),
          minWidth: 50,
          minHeight: 30,
        },
      };

      console.log('✅ Adding new node to canvas:', newNode);
      setNodes((nds) => nds.concat(newNode));
      
      // Track for undo
      setLastAction({
        type: 'ADD_NODE',
        node: newNode,
        timestamp: Date.now()
      });
      
      // Update context
      addShape({
        id: newNode.id,
        type: dragData.shapeId,
        x: position.x,
        y: position.y,
        width: width,
        height: height,
        fill: newNode.data.fill,
        stroke: newNode.data.stroke,
        strokeWidth: 2,
        serviceType: newNode.data.serviceType,
        serviceName: newNode.data.serviceName,
      });

      // Show success feedback
      console.log('✅ Shape created successfully:', dragData.shapeId, 'as', nodeType);

    } catch (error) {
      console.error('❌ Drop error:', error);
    }
  }, [project, setNodes, addShape, handleNodeResize, onNodeDataChange]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node position changes
  const handleNodesChange = useCallback((changes: any[]) => {
    onNodesChange(changes);
    
    // Update positions in context
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        updateShape(change.id, { 
          x: change.position.x, 
          y: change.position.y 
        });
      }
    });
  }, [onNodesChange, updateShape]);

  // Handle canvas click for drawing tools
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

    // Handle text tool specifically
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
  }, [state.tool, project, setNodes, addShape, handleNodeResize, onNodeDataChange]);

  // Handle edge clicks
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setEdges((eds) => eds.map(e => ({ ...e, selected: e.id === edge.id })));
  }, [setEdges]);

  // Helper functions
  const getShapeWidth = (shapeId: string) => {
    if (shapeId.startsWith('aws-') || shapeId.startsWith('azure-') || shapeId.startsWith('gcp-')) {
      return 120;
    }
    // BPMN shapes have specific dimensions
    if (shapeId.startsWith('bpmn-')) {
      const shapeDefinition = findShapeById(shapeId);
      return (shapeDefinition as any)?.width || 80;
    }
    return 80;
  };

  const getShapeHeight = (shapeId: string) => {
    if (shapeId.startsWith('aws-') || shapeId.startsWith('azure-') || shapeId.startsWith('gcp-')) {
      return 80;
    }
    // BPMN shapes have specific dimensions
    if (shapeId.startsWith('bpmn-')) {
      const shapeDefinition = findShapeById(shapeId);
      return (shapeDefinition as any)?.height || 60;
    }
    return 60;
  };

  const getShapeFill = (shapeId: string) => '#ffffff';

  const getShapeStroke = (shapeId: string) => {
    if (shapeId.startsWith('aws-')) return '#FF9900';
    if (shapeId.startsWith('azure-')) return '#0078D4';
    if (shapeId.startsWith('gcp-')) return '#4285F4';
    return '#000000';
  };

  const getServiceType = (shapeId: string) => {
    if (shapeId.startsWith('aws-')) return 'aws';
    if (shapeId.startsWith('azure-')) return 'azure';
    if (shapeId.startsWith('gcp-')) return 'gcp';
    return null;
  };

  const getServiceData = (shapeId: string) => {
    // Check AWS services
    for (const category of Object.values(awsServices)) {
      if (category[shapeId]) {
        return category[shapeId];
      }
    }
    
    // Check Google Cloud services
    for (const category of Object.values(googleCloudServices)) {
      if (category[shapeId]) {
        return category[shapeId];
      }
    }
    
    // Check Azure services
    for (const category of Object.values(azureServices)) {
      if (category[shapeId]) {
        return category[shapeId];
      }
    }
    
    return null;
  };

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
        // IMPROVED: Better connection and selection behavior
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        connectOnClick={true}
        // Enable ReactFlow's built-in resizing
        nodeResizable={true}
        // Better connection line styling
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
        connectionLineType="smoothstep"
        // Improved selection behavior
        selectNodesOnDrag={false}
        // FIXED GRID: Disable panning and zooming to keep grid fixed
        panOnScroll={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        // Set initial viewport to avoid blind spots
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        // Handle node resizing with ReactFlow's built-in system
        onNodeResize={(event, node, newSize) => {
          handleNodeResize(node.id, newSize);
        }}
        onInit={(instance) => {
          reactFlowInstanceRef.current = instance;
          // Store instance globally for export
          (window as any).__REACT_FLOW_INSTANCE__ = instance;
          console.log('ReactFlow initialized successfully');
        }}
        // Better connection validation
        isValidConnection={(connection: Connection) => {
          console.log('Validating connection:', connection);
          
          // Prevent self-connections
          if (connection.source === connection.target) {
            console.log('Self-connection rejected');
            return false;
          }
          
          // Prevent duplicate connections
          const existingEdge = edges.find(
            edge => edge.source === connection.source && edge.target === connection.target
          );
          
          if (existingEdge) {
            console.log('Duplicate connection rejected');
            return false;
          }
          
          console.log('Connection is valid');
          return true;
        }}
      >
        <Background 
          color="#e5e5e5" 
          gap={state.grid?.size || 20} 
          variant="lines"
        />
        
        <Controls 
          showZoom={true} 
          showFitView={true} 
          showInteractive={true}
        >
          {/* Undo Button */}
          <button
            onClick={undoLastAction}
            disabled={!lastAction}
            className={`react-flow__controls-button ${!lastAction ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            title="Undo Last Action (Ctrl+Z)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6"/>
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/>
            </svg>
          </button>
        </Controls>
        
        {/* Connection Instructions Panel */}
        {isConnecting && (
          <Panel position="top-center" className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50">
            <div className="font-medium text-center">
              🔗 Connecting... Click on any blue handle to connect • Press ESC or Right-click to cancel
            </div>
          </Panel>
        )}
        
        {/* Instructions Panel */}
        {/* <Panel position="bottom-center" className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50">
          <div className="text-sm text-center">
            <span className="font-medium">🎯 Select shape → Blue border appears → Drag blue dots to resize</span>
            <br />
            <span className="text-gray-300">🔗 Click and drag from blue handles to connect • Ctrl+Z: Undo • Delete: Remove</span>
          </div>
        </Panel> */}
      </ReactFlow>
    </div>
  );
};

export default DrawingCanvas;