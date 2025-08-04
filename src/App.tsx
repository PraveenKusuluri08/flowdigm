import React, { useState } from 'react';
import { CanvasProvider } from './context/CanvasEditorProvider';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import MainLeftNavbar from './components/MainLeftNavbar';
import LeftSidebar from './components/Sidebar/LeftSidebar';
import Toolbar from './components/CanvasEditor/Toolbar';
import DrawingCanvas from './components/CanvasEditor/Drawingcanvas';
import Header from './components/Layout/Header';

function App() {
  const [activeSection, setActiveSection] = useState('shapes');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'ai':
        return (
          <div className="flex h-full">
            {/* Chat Section - 60% */}
            <div className="w-3/5 flex flex-col border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">ArchPlot AI Assistant</h2>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
                    Hello! I'm your AI assistant. How can I help you with your diagrams today?
                  </div>
                </div>
              </div>
              
              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>
            
            {/* AI Generated Content - 40% */}
            <div className="w-2/5 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">ArchPlot AI Generated Content</h2>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-medium text-gray-800 mb-2">Suggested Diagram Structure</h3>
                  <p className="text-sm text-gray-600">
                    Based on your conversation, here's a suggested structure for your diagram:
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    <li>Start with a process node</li>
                    <li>Add decision points for key choices</li>
                    <li>Include input/output operations</li>
                    <li>End with a terminator</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-blue-100 transition-colors">
                      Create flowchart template
                    </button>
                    <button className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-blue-100 transition-colors">
                      Generate process diagram
                    </button>
                    <button className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-blue-100 transition-colors">
                      Suggest improvements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'shapes':
        return (
          <div className="flex flex-col h-full">
            <Header />
            <div className="flex flex-1">
              <LeftSidebar />
              <div className="flex-1 flex flex-col canvas-container">
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
      case 'diagrams':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">ArchPlot Diagrams</h2>
              <p className="text-gray-600">Manage and organize your diagrams here.</p>
              <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to ArchPlot</h2>
              <p className="text-gray-600">Select a section from the sidebar to get started.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CanvasProvider>
        <ReactFlowProvider>
          <MainLeftNavbar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <div className="flex-1 overflow-hidden">
            {renderContent()}
          </div>
        </ReactFlowProvider>
      </CanvasProvider>
    </div>
  );
}

export default App;