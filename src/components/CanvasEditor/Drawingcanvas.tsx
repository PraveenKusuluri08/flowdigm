// components/CanvasEditor/DrawingCanvas.tsx - FIXED VERSION
import React, { useCallback, useRef, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
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
import { validateShapeLabel, autoCorrectShape } from '../../utils/shapeValidation';
import { 
  RectangleNode,
  CircleNode,
  AWSServiceNode,
  AzureServiceNode,
  GCPServiceNode,
  AWSEC2Node,
  AWSS3Node,
  AWSLambdaNode,
  AWSRDSNode,
  AWSVPCNode,
  AzureVMNode,
  AzureStorageNode,
  AzureFunctionsNode,
  GCPComputeNode,
  GCPStorageNode,
  GCPFunctionsNode,
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
  'aws-ec2': AWSEC2Node,
  'aws-s3': AWSS3Node,
  'aws-lambda': AWSLambdaNode,
  'aws-rds': AWSRDSNode,
  'aws-vpc': AWSVPCNode,
  
  // Azure Services
  'azure-service': AzureServiceNode,
  'azure-vm': AzureVMNode,
  'azure-storage': AzureStorageNode,
  'azure-functions': AzureFunctionsNode,
  
  // GCP Services
  'gcp-service': GCPServiceNode,
  'gcp-compute': GCPComputeNode,
  'gcp-storage': GCPStorageNode,
  'gcp-functions': GCPFunctionsNode,
  
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
  const { state, addShape, updateShape } = useCanvas();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  
  // Store ReactFlow instance for export
  const reactFlowInstanceRef = useRef<any>(null);
  
  // FIXED: Initialize nodes and edges state FIRST, before any callbacks that use them
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Connection and undo state
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  // Simple node data change handler - NOW defined after setNodes is available
  const onNodeDataChange = useCallback((nodeId: string, newData: any) => {
    console.log('🔄 Node data change called:', nodeId, newData);
    
    // Validate shape label if label was changed
    if (newData.label !== undefined) {
      console.log('🔍 Validating shape label:', newData.label);
      const validation = validateShapeLabel(newData);
      
      if (!validation.isValid && validation.expectedShapeId && validation.confidence >= 0.8) {
        console.log('🔧 Auto-correcting shape:', {
          current: validation.currentShapeId,
          expected: validation.expectedShapeId,
          confidence: validation.confidence
        });
        
        // Show user notification about the change
        if (window.confirm(`The label "${newData.label}" suggests this should be a ${validation.expectedShapeName}. Would you like to change the shape automatically?`)) {
          const correctedData = autoCorrectShape(newData);
          if (correctedData) {
            newData = correctedData;
            console.log('✅ Shape auto-corrected to:', newData.shapeId);
          }
        }
      } else if (!validation.isValid && validation.suggestions.length > 0) {
        console.log('💡 Shape validation suggestion:', validation.suggestions[0]);
        // Could show a non-intrusive notification here
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
          
          // If shape was changed, update the node type as well
          if (newData.shapeId && newData.shapeId !== node.data.shapeId) {
            updatedNode.type = newData.shapeId;
          }
          
          return updatedNode;
        }
        return node;
      });
    });
  }, [setNodes]);

  // Simple resize handler - NOW defined after setNodes is available
  const handleNodeResize = useCallback((nodeId: string, newSize: { width: number; height: number }) => {
    console.log('🎯 handleNodeResize called!');
    console.log('🎯 Resizing node:', nodeId, 'to:', newSize);
    console.log('🎯 Current nodes count:', nodes.length);
    
    setNodes((nds) => {
      console.log('🎯 setNodes callback - updating node:', nodeId);
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
          console.log('🎯 Updated node data:', updatedNode.data);
          return updatedNode;
        }
        return node;
      });
      console.log('🎯 setNodes returning updated nodes');
      return updatedNodes;
    });
    
    updateShape(nodeId, {
      width: newSize.width,
      height: newSize.height,
    });
  }, [setNodes, updateShape]);

  // Initialize nodes from state
  useEffect(() => {
    console.log('Initializing nodes from state shapes. Shapes count:', state.shapes?.length || 0);
    if (state.shapes && state.shapes.length > 0) {
      const initialNodes = state.shapes.map((shape: any) => {
        console.log('Converting shape to node:', shape);
        
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
            console.log('🎯 onChange called for node:', shape.id, newData);
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
        
        console.log('Created initial node:', node);
        return node;
      });
      setNodes(initialNodes);
    }
  }, [state.shapes, onNodeDataChange, handleNodeResize, setNodes]);

  // Debug: Log when nodes change
  useEffect(() => {
    console.log('🎯 Nodes changed:', nodes.length, 'nodes');
    nodes.forEach((node, index) => {
      console.log(`  Node ${index}:`, { id: node.id, type: node.type, position: node.position });
    });
  }, [nodes]);

  // Test function to manually add a node
  const addTestNode = () => {
    const testNode: Node<NodeData> = {
      id: `test_${Date.now()}`,
      type: 'rect',
      position: { x: 200, y: 200 },
      data: {
        label: 'Test Node',
        width: 120,
        height: 80,
        fill: '#ff0000',
        stroke: '#000000',
        strokeWidth: 2,
      },
    };
    
    console.log('🧪 Manually adding test node:', testNode);
    setNodes((current) => [...current, testNode]);
  };

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
      
      // Delete selected shapes ONLY with Delete key (not Backspace)
      if (event.key === 'Delete') {
        event.preventDefault();
        setNodes((nds) => nds.filter(node => !node.selected));
        setEdges((eds) => eds.filter(edge => !edge.selected));
      }
      
      // Prevent backspace from deleting shapes (allow it for text editing)
      if (event.key === 'Backspace') {
        // Only prevent default if we're not in a text input/textarea
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

  // Right-click to cancel connection
  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    if (isConnecting) {
      cancelConnection();
    }
  }, [isConnecting, cancelConnection]);

  // Helper functions
  const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  const getShapeWidth = (shapeId: string) => {
    const shapeDefinition = findShapeById(shapeId);
    return shapeDefinition.width;
  };

  const getShapeHeight = (shapeId: string) => {
    const shapeDefinition = findShapeById(shapeId);
    return shapeDefinition.height;
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

  const getServiceData = (shapeId: string) => {
    const shapeDefinition = findShapeById(shapeId);
    return {
      name: shapeDefinition.name,
      category: shapeDefinition.category,
      color: shapeDefinition.color || '#ffffff',
      description: shapeDefinition.description || shapeDefinition.name,
      icon: shapeDefinition.icon || null
    };
  };

  // Handle drop from sidebar - SIMPLIFIED WORKING VERSION
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    console.log('🎯 Drop event triggered');

    if (!reactFlowWrapper.current) {
      console.error('❌ ReactFlow wrapper not found');
      return;
    }
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    
    try {
      const jsonData = event.dataTransfer.getData('application/json');
      console.log('📦 Raw JSON data:', jsonData);
      
      if (!jsonData) {
        console.error('❌ No data found');
        return;
      }
      
      const dragData = JSON.parse(jsonData);
      console.log('📦 Parsed drag data:', dragData);
      
      if (!dragData.shapeId) {
        console.error('❌ No shapeId');
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      console.log('📍 Calculated position:', position);

      // Determine the correct node type based on shapeId
      const getNodeType = (shapeId: string) => {
        // Basic shapes
        if (shapeId === 'rect' || shapeId === 'rectangle') return 'rect';
        if (shapeId === 'circle') return 'circle';
        if (shapeId === 'triangle') return 'triangle';
        if (shapeId === 'diamond') return 'diamond';
        if (shapeId === 'hexagon') return 'hexagon';
        if (shapeId === 'star') return 'star';
        if (shapeId === 'line') return 'line';
        if (shapeId === 'text') return 'textNode';
        
        // Flowchart shapes
        if (shapeId === 'process') return 'process';
        if (shapeId === 'terminator') return 'terminator';
        if (shapeId === 'decision') return 'decision';
        if (shapeId === 'document') return 'document';
        if (shapeId === 'data') return 'data';
        
        // Arrows
        if (shapeId === 'arrow-right') return 'arrow-right';
        if (shapeId === 'arrow-left') return 'arrow-left';
        if (shapeId === 'arrow-up') return 'arrow-up';
        if (shapeId === 'arrow-down') return 'arrow-down';
        
        // Infrastructure
        if (shapeId === 'cloud') return 'cloud';
        if (shapeId === 'server') return 'server';
        if (shapeId === 'database') return 'database';
        if (shapeId === 'router') return 'router';
        if (shapeId === 'firewall') return 'firewall';
        if (shapeId === 'user') return 'user';
        if (shapeId === 'users') return 'users';
        if (shapeId === 'building') return 'building';
        
        // AWS Services
        if (shapeId.startsWith('aws-')) return 'aws-service';
        
        // Azure Services
        if (shapeId.startsWith('azure-')) return 'azure-service';
        
        // GCP Services
        if (shapeId.startsWith('gcp-')) return 'gcp-service';
        
        // BPMN shapes
        if (shapeId.includes('bpmn')) return 'bpmn-node';
        
        // Default to rectangle if unknown
        return 'rect';
      };

      const nodeType = getNodeType(dragData.shapeId);
      console.log('🎯 Using node type:', nodeType, 'for shape:', dragData.shapeId);

      // Get service data for cloud services
      const serviceData = getServiceData(dragData.shapeId);
      console.log('🔍 Service data:', serviceData);

      // Create a node with the correct type and data
      const nodeId = `node_${Date.now()}`;
      const newNode: Node<NodeData> = {
        id: nodeId,
        type: nodeType,
        position,
        data: {
          label: dragData.shapeId,
          width: getShapeWidth(dragData.shapeId),
          height: getShapeHeight(dragData.shapeId),
          fill: getShapeFill(dragData.shapeId),
          stroke: getShapeStroke(dragData.shapeId),
          strokeWidth: 2,
          shapeId: dragData.shapeId,
          serviceType: getServiceType(dragData.shapeId),
          serviceName: serviceData?.name || dragData.shapeId,
          description: serviceData?.description || '',
          category: serviceData?.category || '',
          icon: serviceData?.icon || null,
          onChange: (newData: any) => {
            console.log('🎯 onChange called for node:', nodeId, newData);
            onNodeDataChange(nodeId, newData);
          }
        },
      };

      console.log('✅ Creating node:', newNode);
      
      // Add node to canvas using the functional update
      setNodes((currentNodes) => {
        console.log('🎯 Current nodes before adding:', currentNodes.length);
        const newNodes = [...currentNodes, newNode];
        console.log('🎯 Nodes after adding:', newNodes.length);
        console.log('🎯 All nodes:', newNodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })));
        return newNodes;
      });

      console.log('✅ Node added successfully');

    } catch (error) {
      console.error('❌ Drop error:', error);
    }
  }, [project, setNodes, onNodeDataChange, getServiceData, getShapeWidth, getShapeHeight, getShapeFill, getShapeStroke, getServiceType]);

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
  }, [state.tool, project, setNodes, addShape, onNodeDataChange, generateId]);

  // Handle edge clicks
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
        // IMPROVED: Better connection and selection behavior
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        connectOnClick={true}
        // Enable ReactFlow's built-in resizing
        nodeDragThreshold={1}
        nodeOrigin={[0, 0]}
        minZoom={0.5}
        maxZoom={2}

        // Better connection line styling
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        // Improved selection behavior - FIXED: Enable selection on drag for resizing
        selectNodesOnDrag={true}
        // FIXED GRID: Disable panning and zooming to keep grid fixed
        panOnScroll={false}
        panOnDrag={true} // Temporarily enable to test drag and drop
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        // Set initial viewport to avoid blind spots
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
          variant={BackgroundVariant.Lines}
        />
        
        <Controls 
          showZoom={true} 
          showFitView={true} 
          showInteractive={true}
        >
          {/* Test Button */}
          <button
            onClick={addTestNode}
            className="react-flow__controls-button hover:bg-gray-100"
            title="Add Test Node"
          >
            🧪
          </button>
          
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
      </ReactFlow>
    </div>
  );
};

export default DrawingCanvas;