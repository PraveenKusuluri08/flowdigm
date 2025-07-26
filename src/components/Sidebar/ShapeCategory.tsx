// components/Sidebar/ShapeCategory.jsx
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';
import ShapeItem from './ShapeItem';

const ShapeCategory = ({ categoryKey, category }) => {
  const { state, dispatch } = useSidebar();
  const isExpanded = state.expandedCategories.includes(categoryKey);
  
  // Filter shapes based on search
  const filteredShapes = category.shapes.filter(shape =>
    shape.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    shape.type.toLowerCase().includes(state.searchTerm.toLowerCase())
  );
  
  // Don't render category if no shapes match search
  if (state.searchTerm && filteredShapes.length === 0) {
    return null;
  }
  
  const handleToggleCategory = () => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: categoryKey });
  };
  
  return (
    <div className="group">
      <button
        onClick={handleToggleCategory}
        className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 text-left"
      >
        {isExpanded ? (
          <ChevronDown size={16} className="text-gray-500" />
        ) : (
          <ChevronRight size={16} className="text-gray-500" />
        )}
        <category.icon size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{category.name}</span>
        <span className="text-xs text-gray-500 ml-auto">{filteredShapes.length}</span>
      </button>
      
      {isExpanded && (
        <div className="pl-4">
          {filteredShapes.map(shape => (
            <ShapeItem key={shape.id} shape={shape} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShapeCategory;