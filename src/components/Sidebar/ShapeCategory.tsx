// components/Sidebar/ShapeCategory.tsx - Fixed import
import React, { type JSX } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';
import {ShapeItem} from './ShapeItem'; // This should now work

interface ShapeCategoryProps {
  categoryKey: string;
  category: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    shapes: Array<{
      id: string;
      name?: string;
      tooltip?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: React.ComponentType<any> | (() => JSX.Element);
      type?: string;
    }>;
  };
}

const ShapeCategory: React.FC<ShapeCategoryProps> = ({ categoryKey, category }) => {
  const { state, dispatch } = useSidebar();
  const isExpanded = state.expandedCategories.includes(categoryKey);
  
  // Safe filter function with proper null/undefined checks
  const filteredShapes = category.shapes.filter(shape => {
    if (!state.searchTerm) return true; // Show all if no search term
    
    const searchLower = state.searchTerm.toLowerCase();
    
    // Safely check shape properties with fallbacks
    const shapeName = (shape.tooltip || shape.name || '').toLowerCase();
    const shapeType = (shape.type || '').toLowerCase();
    const shapeId = (shape.id || '').toLowerCase();
    
    return shapeName.includes(searchLower) || 
           shapeType.includes(searchLower) || 
           shapeId.includes(searchLower);
  });
  
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
        className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 text-left rounded-md transition-colors"
      >
        {isExpanded ? (
          <ChevronDown size={16} className="text-gray-500" />
        ) : (
          <ChevronRight size={16} className="text-gray-500" />
        )}
        <category.icon size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{category.name}</span>
        <span className="text-xs text-gray-500 ml-auto">
          ({filteredShapes.length})
        </span>
      </button>
      
      {isExpanded && (
        <div className="ml-4 space-y-1 border-l border-gray-200 pl-2">
          {filteredShapes.length > 0 ? (
            filteredShapes.map(shape => (
              <ShapeItem key={shape.id} shape={shape} />
            ))
          ) : (
            <div className="text-xs text-gray-500 p-2">No shapes available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShapeCategory;