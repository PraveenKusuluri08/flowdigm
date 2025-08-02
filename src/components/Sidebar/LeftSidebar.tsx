// components/Sidebar/LeftSidebar.jsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from './Searchbar';
import QuickAccess from './QuickAccess';
import ShapeCategory from './ShapeCategory';
import { shapeCategories } from './shapeDefinition';
import { useNavigation } from '../../hooks/useNavigation';

const LeftSidebar = () => {
  const { isShapesSidebarCollapsed, setIsShapesSidebarCollapsed } = useNavigation();

  const handleToggleCollapse = () => {
    setIsShapesSidebarCollapsed(!isShapesSidebarCollapsed);
  };

  return (
    <div className={`
      bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out
      ${isShapesSidebarCollapsed ? 'w-12' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        {!isShapesSidebarCollapsed && (
          <h2 className="text-sm font-medium text-gray-700">Shapes</h2>
        )}
        <button
          onClick={handleToggleCollapse}
          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors duration-200"
          title={isShapesSidebarCollapsed ? 'Expand Shapes Panel' : 'Collapse Shapes Panel'}
        >
          {isShapesSidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>
      
      {!isShapesSidebarCollapsed && (
        <>
          {/* Search */}
          <SearchBar />
          
          {/* Quick Access */}
          <QuickAccess />
          
          <div className="flex-1 overflow-y-auto">
            {Object.entries(shapeCategories).map(([key, category]) => (
              <ShapeCategory key={key} categoryKey={key} category={category} />
            ))}
          </div>
        </>
      )}
      
      {/* Collapsed state - show minimal icons */}
      {isShapesSidebarCollapsed && (
        <div className="flex-1 flex flex-col items-center py-4 space-y-3">
          {Object.entries(shapeCategories).slice(0, 6).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <button
                key={key}
                className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800 transition-colors duration-200"
                title={category.name}
                onClick={() => setIsShapesSidebarCollapsed(false)}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;