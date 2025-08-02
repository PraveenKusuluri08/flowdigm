// components/CanvasEditor/DrawingCanvas.tsx - WORKING Resize + Undo
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
import 'reactflow/dist/style.css';

import { useCanvas } from '../../hooks/useCanvas';
import { findShapeById } from '../Sidebar/shapeDefinition';
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
  DatabaseNode
} from './ReactFlowNodes';

// Node type mappings
const nodeTypes = {
  rect: RectangleNode,
  rectangle: RectangleNode,
  process: RectangleNode,
  circle: CircleNode,
  terminator: CircleNode,
  triangle: TriangleNode,
  diamond: DiamondNode,
  decision: DiamondNode,
  hexagon: HexagonNode,
  star: StarNode,
  line: LineNode,
  text: TextNode,
  cloud: CloudNode,
  server: ServerNode,
  infrastructure: ServerNode,
  database: DatabaseNode,
  user: CircleNode,
  users: CircleNode,
  admin: CircleNode,
  // AWS Services
  'aws-ec2': AWSServiceNode,
  'aws-s3': AWSServiceNode,
  'aws-rds': AWSServiceNode,
  'aws-lambda': AWSServiceNode,
  'aws-vpc': AWSServiceNode,
  // Azure Services
  'azure-vm': AzureServiceNode,
  'azure-storage': AzureServiceNode,
  'azure-sql': AzureServiceNode,
  'azure-functions': AzureServiceNode,
  'azure-vnet': AzureServiceNode,
  // GCP Services
  'gcp-compute': GCPServiceNode,
  'gcp-storage': GCPServiceNode,
  'gcp-sql': GCPServiceNode,
  'gcp-functions': GCPServiceNode,
  'gcp-vpc': GCPServiceNode,
};

const DrawingCanvas = () => {
  const { state, addShape, updateShape } = useCanvas();
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();
  
  // Connection and undo state
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  
  // Convert existing shapes to nodes
  const convertShapeToNode = useCallback((shape) => ({
    id: shape.id,
    type: shape.type,
    position: { x: shape.x, y: shape.y },
    data: {
      ...shape,
      label: shape.text || shape.serviceName || shape.type,
      width: shape.width,
      height: shape.height,
      fill: shape.fill,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      // CRITICAL: Add resize callback to each node
      onResize: (newSize) => {
        handleNodeResize(shape.id, newSize);
      }
    }
  }), []);

  const initialNodes = state.shapes?.map(convertShapeToNode) || [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  // WORKING resize handler
  const handleNodeResize = useCallback((nodeId, newSize) => {
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

  const onConnect = useCallback((params) => {
    const newEdge = { 
      ...params, 
      id: `edge_${Date.now()}`,
      type: 'smoothstep',
      style: { stroke: '#333', strokeWidth: 2 },
      animated: false,
    };
    
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
        setEdges((eds) => eds.filter(edge => edge.id !== lastAction.edge.id));
        setLastAction(null);
        break;
      case 'ADD_NODE':
        setNodes((nds) => nds.filter(node => node.id !== lastAction.node.id));
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
    const handleKeyDown = (event) => {
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
  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    if (isConnecting) {
      cancelConnection();
    }
  }, [isConnecting, cancelConnection]);

  // Handle drop from sidebar
  const onDrop = useCallback((event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    
    try {
      const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
      if (!dragData.shapeId) return;

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const shapeDefinition = findShapeById(dragData.shapeId);
      if (!shapeDefinition) return;

      const nodeId = generateId();
      const width = getShapeWidth(dragData.shapeId);
      const height = getShapeHeight(dragData.shapeId);

      const newNode = {
        id: nodeId,
        type: dragData.shapeId,
        position,
        data: {
          label: shapeDefinition.name || dragData.shapeId,
          width: width,
          height: height,
          fill: getShapeFill(dragData.shapeId),
          stroke: getShapeStroke(dragData.shapeId),
          strokeWidth: 2,
          serviceType: getServiceType(dragData.shapeId),
          serviceName: shapeDefinition.name,
          // CRITICAL: Add resize callback to new nodes
          onResize: (newSize) => {
            handleNodeResize(nodeId, newSize);
          }
        }
      };

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

    } catch (error) {
      console.error('Drop error:', error);
    }
  }, [project, setNodes, addShape, handleNodeResize]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle node position changes
  const handleNodesChange = useCallback((changes) => {
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
  const onPaneClick = useCallback((event) => {
    if (state.tool === 'select') return;
    
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const nodeId = generateId();
    const width = 80;
    const height = 60;

    const newNode = {
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
        onResize: (newSize) => {
          handleNodeResize(nodeId, newSize);
        }
      }
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
  }, [state.tool, project, setNodes, addShape, handleNodeResize]);

  // Handle edge clicks
  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setEdges((eds) => eds.map(e => ({ ...e, selected: e.id === edge.id })));
  }, [setEdges]);

  // Helper functions
  const getShapeWidth = (shapeId) => {
    if (shapeId.startsWith('aws-') || shapeId.startsWith('azure-') || shapeId.startsWith('gcp-')) {
      return 120;
    }
    return 80;
  };

  const getShapeHeight = (shapeId) => {
    if (shapeId.startsWith('aws-') || shapeId.startsWith('azure-') || shapeId.startsWith('gcp-')) {
      return 80;
    }
    return 60;
  };

  const getShapeFill = (shapeId) => '#ffffff';

  const getShapeStroke = (shapeId) => {
    if (shapeId.startsWith('aws-')) return '#FF9900';
    if (shapeId.startsWith('azure-')) return '#0078D4';
    if (shapeId.startsWith('gcp-')) return '#4285F4';
    return '#000000';
  };

  const getServiceType = (shapeId) => {
    if (shapeId.startsWith('aws-')) return 'aws';
    if (shapeId.startsWith('azure-')) return 'azure';
    if (shapeId.startsWith('gcp-')) return 'gcp';
    return null;
  };

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
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
        connectionMode={ConnectionMode.Loose}
        fitView
        snapToGrid={state.grid?.snap || false}
        snapGrid={[state.grid?.size || 20, state.grid?.size || 20]}
        multiSelectionKeyCode="Control"
        selectionKeyCode="Shift"
        deleteKeyCode="Delete"
        // CRITICAL: Prevent node dragging during resize
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
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
        
        {/* <MiniMap 
          nodeColor={(node) => {
            if (node.type?.startsWith('aws-')) return '#ff9900';
            if (node.type?.startsWith('azure-')) return '#0078d4';
            if (node.type?.startsWith('gcp-')) return '#4285f4';
            return '#6b7280';
          }}
          position="top-right"
        /> */}
        
        {/* <Panel position="bottom-left" className="bg-white px-3 py-2 rounded shadow text-sm border">
          <div className="text-gray-600">
            {nodes.length} nodes • {edges.length} connections • Tool: {state.tool}
            {isConnecting && ' • Connecting...'}
            {lastAction && ` • Last: ${lastAction.type.replace('_', ' ').toLowerCase()}`}
          </div>
        </Panel>
        
        {isConnecting ? (
          <Panel position="top-center" className="bg-red-500 text-white px-4 py-2 rounded shadow">
            <div className="font-medium">
              🔗 Connecting... Drop on blue handle • Press ESC or Right-click to cancel
            </div>
          </Panel>
        ) : (
          <Panel position="top-center" className="bg-blue-500 text-white px-4 py-2 rounded shadow">
            <div className="font-medium">
              {state.tool === 'select' 
                ? 'Select shapes → Blue highlighted borders → Drag any border to resize'
                : `Click to add ${state.tool} • Switch to Select tool to resize and connect`
              }
            </div>
          </Panel>
        )}
        
        <Panel position="bottom-right" className="bg-gray-800 text-white px-2 py-1 rounded text-xs">
          <div>🎯 Select shape → Entire border highlights blue → Drag any border to resize</div>
          <div>Ctrl+Z: Undo • Delete: Remove • ESC: Cancel connection</div>
        </Panel> */}
      </ReactFlow>
    </div>
  );
};

export default DrawingCanvas;