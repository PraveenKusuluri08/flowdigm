// App.jsx - Complete integrated application
import React from 'react';
import { SidebarProvider } from './context/Sidebarprovider';
import { CanvasProvider } from './context/CanvasEditorProvider';
import Header from './components/Layout/Header';
import LeftSidebar from './components/Sidebar/LeftSidebar';
import DrawingCanvas from './components/CanvasEditor/Drawingcanvas';
import Toolbar from './components/CanvasEditor/Toolbar';
// import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

// Main app component with keyboard shortcuts
const AppContent = () => {
  // useKeyboardShortcuts();
  
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <Toolbar />
          
          {/* Drawing Canvas */}
          <DrawingCanvas />
        </div>
      </div>
    </div>
  );
};

// Root App component with all providers
const App = () => {
  return (
    <SidebarProvider>
      <CanvasProvider>
        <AppContent />
      </CanvasProvider>
    </SidebarProvider>
  );
};

export default App;