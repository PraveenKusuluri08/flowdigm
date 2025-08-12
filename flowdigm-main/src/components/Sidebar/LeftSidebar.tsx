// components/Sidebar/LeftSidebar.jsx
import React from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import SearchBar from './Searchbar';
import QuickAccess from './QuickAccess';
import ShapeCategory from './ShapeCategory';
import { shapeCategories } from './shapeDefinition';

const LeftSidebar = () => {
  const { state } = useSidebar();
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Shapes</h2>
      </div>
      
      {/* Search */}
      <SearchBar />
      
      {/* Quick Access */}
      <QuickAccess />
      
      <div className="flex-1 overflow-y-auto">
        {Object.entries(shapeCategories).map(([key, category]) => (
          <ShapeCategory key={key} categoryKey={key} category={category} />
        ))}
      </div>
      
      {/* Footer Info - Optional Debug Info */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
          <div>Selected: {state.selectedShape?.name || 'None'}</div>
          <div>Recent: {state.recentShapes.length}</div>
          <div>Favorites: {state.favoriteShapes.length}</div>
        </div>
      )} */}
    </div>
  );
};

export default LeftSidebar;