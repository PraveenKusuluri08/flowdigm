import React from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import LeftSidebar from '../Sidebar/LeftSidebar';

const ContentArea: React.FC = () => {
  const { activeSection, isMainNavCollapsed } = useNavigation();

  // Adjust width based on main nav state
  const contentWidth = isMainNavCollapsed ? 'w-80' : 'w-64';

  const renderContent = () => {
    switch (activeSection) {
      case 'ai':
        return (
          <div className={`${contentWidth} bg-white border-r border-gray-200 flex flex-col h-full`}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
            </div>
            <div className="flex-1 p-4">
              <div className="text-center text-gray-500">
                <p className="mb-4">AI features will be implemented here</p>
                <ul className="text-sm text-left space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Auto-generate diagrams
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Smart shape suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Layout optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Text-to-diagram conversion
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Coming Soon</p>
                  <p className="text-xs text-blue-600 mt-1">AI-powered diagram creation tools</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'shapes':
        return <LeftSidebar />;
      
      case 'diagrams':
        return (
          <div className={`${contentWidth} bg-white border-r border-gray-200 flex flex-col h-full`}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">My Diagrams</h2>
            </div>
            <div className="flex-1 p-4">
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <h3 className="font-medium text-sm">Untitled Diagram</h3>
                  <p className="text-xs text-gray-500 mt-1">Modified today</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <h3 className="font-medium text-sm">System Architecture</h3>
                  <p className="text-xs text-gray-500 mt-1">Modified yesterday</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <h3 className="font-medium text-sm">Database Schema</h3>
                  <p className="text-xs text-gray-500 mt-1">Modified 2 days ago</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                  <h3 className="font-medium text-sm">User Flow Diagram</h3>
                  <p className="text-xs text-gray-500 mt-1">Modified 3 days ago</p>
                </div>
              </div>
              <button className="w-full mt-4 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                Create New Diagram
              </button>
            </div>
          </div>
        );
      
      default:
        // Show nothing when no section is active - clean state
        return null;
    }
  };

  return renderContent();
};

export default ContentArea;
