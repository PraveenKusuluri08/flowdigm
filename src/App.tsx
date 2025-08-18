import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ReactFlow, Node, Edge, useReactFlow, addEdge, Connection, useNodesState, useEdgesState, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

// Components
import MainLeftNavbar from './components/MainLeftNavbar';
import LeftSidebar from './components/Sidebar/LeftSidebar';
import RightSidebar from './components/Sidebar/RightSidebar';
import DrawingCanvas from './components/CanvasEditor/Drawingcanvas';
import Header from './components/Layout/Header';
import BPMNEditor from './components/BPMN/BPMNEditor';
import CloudIntegration from './components/CloudIntegration';
import { useIntegrationPanel } from './hooks/useBidirectionalIntegration';
import { RawIconNode } from './components/CanvasEditor/ReactFlowNodes';
import Toolbar from './components/CanvasEditor/Toolbar';

// Context providers
import { CanvasProvider } from './context/CanvasEditorProvider';
import { SidebarProvider } from './context/Sidebarprovider';

// Import/Export utilities
import { 
  UniversalImportHandler, 
  UniversalExportHandler, 
  downloadBlob,
  ExportOptions 
} from './utils/bidirectionalImportExport';

// Node types
const nodeTypes = {
  rawIconNode: RawIconNode,
};

function AppContent() {
  const [activeSection, setActiveSection] = useState('shapes');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Debug logging for nodes and edges changes
  useEffect(() => {
    console.log('🔄 App state updated - Nodes:', nodes.length, 'Edges:', edges.length);
    console.log('📊 Current nodes:', nodes);
    console.log('🔗 Current edges:', edges);
  }, [nodes, edges]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  
  // Integration panel state and actions
  const integrationPanel = useIntegrationPanel();
  
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleIntegrationOpen = () => {
    integrationPanel.openPanel();
  };

  // Handle connections
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setHasSelection(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setHasSelection(false);
  }, []);

  // Zoom controls
  const onZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);

  const onZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);

  const onFitView = useCallback(() => {
    reactFlowInstance.fitView();
  }, [reactFlowInstance]);

  // Edit operations
  const onUndo = useCallback(() => {
    // Implement undo functionality
    console.log('Undo');
  }, []);

  const onRedo = useCallback(() => {
    // Implement redo functionality
    console.log('Redo');
  }, []);

  const onDelete = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
      setHasSelection(false);
    }
  }, [selectedNode, setNodes, setEdges]);

  const onCopy = useCallback(() => {
    if (selectedNode) {
      // Implement copy functionality
      console.log('Copy node:', selectedNode);
    }
  }, [selectedNode]);

  const onPaste = useCallback(() => {
    // Implement paste functionality
    console.log('Paste');
  }, []);

  // Style change handler
  const onStyleChange = useCallback((style: any) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, ...style } }
            : node
        )
      );
    }
  }, [selectedNode, setNodes]);

  // Import functionality
  const onImport = useCallback(async (file: File) => {
    try {
      console.log('Importing file:', file.name);
      const importedDiagram = await UniversalImportHandler.importFile(file);
      
      // Add imported nodes to canvas
      setNodes((nds) => [...nds, ...importedDiagram.nodes]);
      setEdges((eds) => [...eds, ...importedDiagram.edges]);
      
      // Fit view to show all imported content
      setTimeout(() => {
        reactFlowInstance.fitView();
      }, 100);
      
      console.log('Successfully imported:', importedDiagram);
      alert(`Successfully imported ${importedDiagram.nodes.length} nodes and ${importedDiagram.edges.length} edges from ${file.name}`);
    } catch (error) {
      console.error('Import failed:', error);
      alert(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [setNodes, setEdges, reactFlowInstance]);

  // Export functionality
  const onExport = useCallback(async (format: string) => {
    try {
      if (nodes.length === 0) {
        alert('No content to export! Please add some elements to the canvas first.');
        return;
      }

      const options: ExportOptions = {
        format: format as any,
        quality: 100,
        scale: 100,
        backgroundColor: '#ffffff',
        includeMetadata: true
      };

      const blob = await UniversalExportHandler.exportDiagram(nodes, edges, options);
      const filename = `flowdigm-diagram.${format}`;
      downloadBlob(blob, filename);
      
      console.log('Successfully exported diagram');
      alert(`Successfully exported diagram as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [nodes, edges]);

  // File management functionality
  const onSave = useCallback(async () => {
    try {
      console.log('Save requested with nodes:', nodes.length, 'edges:', edges.length);
      
      if (nodes.length === 0) {
        alert('No content to save! Please add some elements to the canvas first.');
        return;
      }
      
      // This will be handled by the SaveDialog component in DrawingCanvas
      console.log('Save dialog will be opened');
    } catch (error) {
      console.error('Save failed:', error);
      alert(`Save failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [nodes, edges]);

  const onOpen = useCallback(async () => {
    try {
      console.log('Open requested');
      
      // Create file input for opening files
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.archplot,.json,.xml,.drawio,.svg';
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const { fileManager } = await import('./utils/fileManager');
            const loadedFile = await fileManager.loadFile(file);
            setNodes(loadedFile.nodes || []);
            setEdges(loadedFile.edges || []);
            console.log('✅ File loaded successfully:', loadedFile.name);
            alert(`File loaded successfully: ${loadedFile.name}`);
          } catch (error) {
            console.error('Load failed:', error);
            alert(`Load failed: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      };
      input.click();
    } catch (error) {
      console.error('Open failed:', error);
      alert(`Open failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [setNodes, setEdges]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-section">
            <div className="dashboard-header">
              <div className="dashboard-title">
                <h1>Welcome to ArchPlot</h1>
                <p>Create, collaborate, and visualize your ideas with powerful diagramming tools</p>
              </div>
              <div className="dashboard-actions">
                <button className="btn-secondary">
                  <span>👥</span>
                  Invite Team
                </button>
                <button className="btn-primary">
                  <span>⚡</span>
                  Upgrade
                </button>
                <div className="user-menu">
                  <span className="notification-bell">🔔</span>
                  <div className="user-avatar">AP</div>
                </div>
              </div>
            </div>

            <div className="dashboard-content">
              {/* Welcome Banner */}
              <div className="welcome-banner">
                <div className="banner-content">
                  <h2>🚀 Start Creating Amazing Diagrams</h2>
                  <p>Choose from our collection of templates or start with a blank canvas. Create professional diagrams in minutes.</p>
                  <div className="banner-features">
                    <span className="feature">⚡ AI-Powered</span>
                    <span className="feature">🔄 Real-time</span>
                    <span className="feature">📊 Multiple Formats</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="stats-section">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <h3>12</h3>
                    <p>Total Diagrams</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏰</div>
                  <div className="stat-content">
                    <h3>3</h3>
                    <p>This Week</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <h3>15s</h3>
                    <p>Avg. Generation</p>
                  </div>
                </div>
              </div>

              {/* Templates Section */}
              <div className="templates-section">
                <h3>Quick Start Templates</h3>
                <div className="templates-grid">
                  <div className="template-card primary">
                    <div className="template-icon">📊</div>
                    <h4>Flowchart</h4>
                    <p>Create process flows and decision trees</p>
                  </div>
                  <div className="template-card">
                    <div className="template-icon">🏗️</div>
                    <h4>Architecture</h4>
                    <p>Design system and network diagrams</p>
                  </div>
                  <div className="template-card">
                    <div className="template-icon">👥</div>
                    <h4>Organization</h4>
                    <p>Build org charts and team structures</p>
                  </div>
                  <div className="template-card">
                    <div className="template-icon">🔗</div>
                    <h4>Network</h4>
                    <p>Map network topologies and connections</p>
                  </div>
                </div>
              </div>

              {/* Recent Projects */}
              <div className="recent-section">
                <div className="section-header">
                  <h3>Recent Projects</h3>
                  <button className="btn-text">View All</button>
                </div>
                <div className="projects-list">
                  <div className="project-item">
                    <div className="project-icon">📊</div>
                    <div className="project-info">
                      <h4>System Architecture v2</h4>
                      <p>Updated 2 hours ago</p>
                    </div>
                    <div className="project-actions">
                      <span className="star">⭐</span>
                      <span className="menu">⋯</span>
                    </div>
                  </div>
                  <div className="project-item">
                    <div className="project-icon">🔗</div>
                    <div className="project-info">
                      <h4>Network Topology</h4>
                      <p>Updated yesterday</p>
                    </div>
                    <div className="project-actions">
                      <span className="star">☆</span>
                      <span className="menu">⋯</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'shapes':
        return (
          <div className="shapes-section">
            <Header 
              onSave={onSave}
              onOpen={onOpen}
              onImport={onImport}
              onExport={onExport}
              onUndo={onUndo}
              onRedo={onRedo}
              onDelete={onDelete}
              onCopy={onCopy}
              onPaste={onPaste}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onFitView={onFitView}
              canUndo={canUndo}
              canRedo={canRedo}
              hasSelection={hasSelection}
            />
            <div className="shapes-content">
              <LeftSidebar />
              <div className="canvas-area">
                <div className="canvas-toolbar">
                  <Toolbar />
                </div>
                <div className="canvas-content">
                  <DrawingCanvas 
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'bpmn':
        return (
          <div className="bpmn-section">
            <BPMNEditor 
              onSave={(xml) => console.log('BPMN saved:', xml)}
              onExport={(svg) => console.log('BPMN exported:', svg)}
            />
          </div>
        );
      case 'ai':
        return (
          <div className="ai-section">
            <div className="ai-chat-section">
              <div className="ai-header">
                <h2>🤖 AI Assistant</h2>
                <p>Get help with your diagrams and workflows</p>
              </div>
              
              <div className="ai-messages">
                <div className="message assistant">
                  <div className="message-bubble">
                    Hello! I'm your AI assistant. I can help you create diagrams, suggest improvements, and answer questions about your projects. What would you like to work on today?
                  </div>
                </div>
              </div>
              
              <div className="ai-input-section">
                <div className="ai-input-container">
                  <input 
                    type="text" 
                    className="ai-input" 
                    placeholder="Ask me anything about your diagrams..."
                  />
                  <button className="ai-send-btn">Send</button>
                </div>
              </div>
            </div>
            
            <div className="ai-content-section">
              <div className="ai-suggestion-card">
                <h3>💡 Quick Suggestions</h3>
                <ul className="ai-suggestion-list">
                  <li>Create a flowchart for your business process</li>
                  <li>Design a network architecture diagram</li>
                  <li>Build an organizational chart</li>
                  <li>Map your system dependencies</li>
                </ul>
              </div>
              
              <div className="ai-actions-card">
                <h3>🚀 AI Actions</h3>
                <button className="ai-action-btn">
                  Generate process diagram
                </button>
                <button className="ai-action-btn">
                  Suggest improvements
                </button>
              </div>
            </div>
          </div>
        );
      case 'diagrams':
        return (
          <div className="diagrams-section">
            <h2>Diagrams</h2>
            <p>Your saved diagrams will appear here...</p>
          </div>
        );
      case 'save':
        return (
          <div className="save-section">
            <h2>Save</h2>
            <p>Save your current diagram...</p>
          </div>
        );
      case 'export':
        return (
          <div className="export-section">
            <h2>Export</h2>
            <p>Export your diagram in various formats...</p>
          </div>
        );
      case 'share':
        return (
          <div className="share-section">
            <h2>Share</h2>
            <p>Share your diagram with others...</p>
          </div>
        );
      default:
        return <DrawingCanvas />;
    }
  };

  return (
    <div className="app">
      <MainLeftNavbar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onIntegrationOpen={handleIntegrationOpen}
      />
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {renderContent()}
      </div>
      
      {/* Cloud Integration Modal */}
      {integrationPanel.isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Cloud Integration</h2>
              </div>
              <button
                onClick={integrationPanel.closePanel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
              <CloudIntegration />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <CanvasProvider>
      <SidebarProvider>
        <ReactFlowProvider>
          <AppContent />
        </ReactFlowProvider>
      </SidebarProvider>
    </CanvasProvider>
  );
}

export default App;