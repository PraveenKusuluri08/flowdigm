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
    icon: React.ComponentType<any> | string;
    shapes: Array<{
      id: string;
      name?: string;
      tooltip?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: React.ComponentType<any> | (() => JSX.Element);
      type?: string;
    }> | Record<string, {
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
  
  // Convert shapes to array format if it's an object
  const shapesArray = Array.isArray(category.shapes) 
    ? category.shapes 
    : Object.entries(category.shapes || {}).map(([id, shape]) => ({
        id,
        name: shape.name || shape.tooltip || id,
        tooltip: shape.tooltip,
        icon: shape.icon,
        type: shape.type
      }));
  
  // Safe filter function with proper null/undefined checks
  const filteredShapes = shapesArray.filter(shape => {
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

  // Handle icon rendering for both string and component types
  const renderIcon = () => {
    if (typeof category.icon === 'string') {
      return <span className="text-lg">{category.icon}</span>;
    }
    const IconComponent = category.icon;
    return <IconComponent size={16} className="text-gray-600" />;
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
        {renderIcon()}
        <span className="text-sm font-medium text-gray-700">{category.name}</span>
        <span className="text-xs text-gray-500 ml-auto">
          ({filteredShapes.length})
        </span>
      </button>
      
      {isExpanded && (
        <div className="ml-4 space-y-1 border-l border-gray-200 pl-2">
          {filteredShapes.length > 0 ? (
            filteredShapes.map(shape => (
              <ShapeItem 
                key={shape.id} 
                shape={{
                  id: shape.id,
                  name: shape.name || shape.tooltip || shape.id,
                  icon: shape.icon,
                  tooltip: shape.tooltip
                }} 
              />
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