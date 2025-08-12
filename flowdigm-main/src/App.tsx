// App.jsx - How to integrate all components
import React from 'react';
import { SidebarProvider } from './context/Sidebarprovider';
import Header from './components/Layout/Header';
import LeftSidebar from './components/Sidebar/LeftSidebar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const App = () => {
  useKeyboardShortcuts({
    "cmd+b": (e) => {
      e.preventDefault();
      console.log("New file shortcut triggered");
      // Add logic to create a new file
    },
    "cmd+s": (e) => {
      e.preventDefault();
      console.log("Save file shortcut triggered");
      // Add logic to save the current file
    }
  })
  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <Header />
        
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <LeftSidebar />
          
          {/* Canvas Area */}
          
        </div>
      </div>
    </SidebarProvider>
  );
};

export default App;