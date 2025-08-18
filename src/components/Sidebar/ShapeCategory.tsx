// components/Sidebar/ShapeCategory.tsx - Fixed import
import React, { useMemo, useState, type JSX } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
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

const ShapeCategory: React.FC<ShapeCategoryProps> = ({ categoryKey: _categoryKey, category }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const shapesArray = useMemo(() => {
    const arr = Array.isArray(category.shapes)
      ? category.shapes
      : Object.entries(category.shapes || {}).map(([id, shape]) => ({
          id,
          name: shape.name || shape.tooltip || id,
          tooltip: shape.tooltip,
          icon: shape.icon,
          type: shape.type
        }));
    return arr;
  }, [category.shapes]);

  const filteredShapes = shapesArray;

  const handleToggleCategory = () => setIsExpanded(!isExpanded);

  const renderIcon = () => {
    if (typeof category.icon === 'string') return <span className="text-sm">{category.icon}</span>;
    const IconComponent = category.icon;
    return <IconComponent size={14} className="text-gray-600" />;
  };

  const useGrid = (category as any).layout === 'grid';

  return (
    <div className="group">
      <button
        onClick={handleToggleCategory}
        className="w-full flex items-center gap-2 p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-left rounded-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:shadow-lg"
      >
        {isExpanded ? (
          <ChevronDown size={14} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <ChevronRight size={14} className="text-blue-600 group-hover:scale-110 transition-transform duration-300" />
        )}
        <div className="p-1 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
          {renderIcon()}
        </div>
        <span className="text-xs font-bold text-gray-800">{category.name}</span>
        <span className="text-xs font-medium text-blue-600 ml-auto bg-blue-100 px-1 py-0.5 rounded text-xs">({filteredShapes.length})</span>
      </button>

      {isExpanded && (
        <div className={`mt-2 ${useGrid ? 'grid grid-cols-4 gap-2 px-2' : 'ml-4 space-y-1 border-l-2 border-blue-200 pl-2'}`}>
          {filteredShapes.length > 0 ? (
            filteredShapes.map(shape => (
              <ShapeItem
                key={shape.id}
                variant={useGrid ? 'grid' : 'list'}
                shape={{
                  id: shape.id,
                  name: shape.name || shape.tooltip || shape.id,
                  icon: shape.icon,
                  tooltip: shape.tooltip
                }}
              />
            ))
          ) : (
            <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-xl border border-gray-200">No shapes available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShapeCategory;