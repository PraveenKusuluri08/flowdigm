import { useState } from 'react';
import { CanvasProvider } from './context/CanvasEditorProvider';
import { SidebarProvider } from './context/Sidebarprovider';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import MainLeftNavbar from './components/MainLeftNavbar';
import LeftSidebar from './components/Sidebar/LeftSidebar';
import Toolbar from './components/CanvasEditor/Toolbar';
import DrawingCanvas from './components/CanvasEditor/Drawingcanvas';
import Header from './components/Layout/Header';
import BPMNEditor from './components/BPMN/BPMNEditor';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

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
            <Header />
            <div className="shapes-content">
              <LeftSidebar />
              <div className="canvas-area">
                <div className="canvas-toolbar">
                  <Toolbar />
                </div>
                <div className="canvas-content">
                  <DrawingCanvas />
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
      case 'shapes':
        return <DrawingCanvas />;
      default:
        return <DrawingCanvas />;
    }
  };

  return (
    <div className="app">
      <CanvasProvider>
        <SidebarProvider>
          <ReactFlowProvider>
            <MainLeftNavbar 
              activeSection={activeSection} 
              onSectionChange={handleSectionChange}
              collapsed={sidebarCollapsed}
              setCollapsed={setSidebarCollapsed}
            />
            <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
              {renderContent()}
            </div>
          </ReactFlowProvider>
        </SidebarProvider>
      </CanvasProvider>
    </div>
  );
}

export default App;