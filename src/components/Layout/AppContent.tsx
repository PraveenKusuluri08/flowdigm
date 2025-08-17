import React from 'react';
import { SidebarProvider } from '../../context/Sidebarprovider';
import Header from './Header';
import MainLeftNavBar from './MainLeftNavBar';
import ContentArea from './ContentArea';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useNavigation } from '../../hooks/useNavigation';

const AppContent: React.FC = () => {
  const { 
    setIsMainNavCollapsed, 
    isMainNavCollapsed, 
    setIsShapesSidebarCollapsed, 
    isShapesSidebarCollapsed 
  } = useNavigation();

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
    },
    "cmd+\\": (e) => {
      e.preventDefault();
      setIsMainNavCollapsed(!isMainNavCollapsed);
      console.log("Navigation toggle shortcut triggered");
    },
    "cmd+shift+\\": (e) => {
      e.preventDefault();
      setIsShapesSidebarCollapsed(!isShapesSidebarCollapsed);
      console.log("Shapes sidebar toggle shortcut triggered");
    }
  });

  return (
    <SidebarProvider>
      <div className="h-screen flex bg-gray-100">
        {/* Main Left Navigation - Full Height */}
        <MainLeftNavBar />
        
        {/* Right Side Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />
          
          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Dynamic Content Area based on navigation */}
            <ContentArea />
            
            {/* Canvas Area */}
            <div className="flex-1 bg-white">
              {/* This is where the drawing canvas will go */}
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center max-w-md">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Welcome to Flowdigm</h2>
                  <p className="text-gray-600 mb-6">A powerful diagramming tool built with React and TypeScript</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="p-4 bg-gray-50 rounded-lg text-left">
                      <h3 className="font-medium text-gray-800 mb-2">Get Started:</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Click <strong>Shapes</strong> to access drawing tools</li>
                        <li>• Try <strong>AI Assistant</strong> for smart features</li>
                        <li>• Browse <strong>Diagrams</strong> to manage your work</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1 text-gray-500">
                    <p><strong>Keyboard shortcuts:</strong></p>
                    <p><kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700">Cmd+\</kbd> Toggle main navigation</p>
                    <p><kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700">Cmd+Shift+\</kbd> Toggle shapes panel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppContent;
