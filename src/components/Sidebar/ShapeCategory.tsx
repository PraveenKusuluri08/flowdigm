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
    if (typeof category.icon === 'string') return <span className="text-lg">{category.icon}</span>;
    const IconComponent = category.icon;
    return <IconComponent size={16} className="text-gray-600" />;
  };

  const useGrid = (category as any).layout === 'grid';

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
        <span className="text-xs text-gray-500 ml-auto">({filteredShapes.length})</span>
      </button>

      {isExpanded && (
        <div className={useGrid ? 'grid grid-cols-3 gap-2 px-2' : 'ml-4 space-y-1 border-l border-gray-200 pl-2'}>
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
            <div className="text-xs text-gray-500 p-2">No shapes available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShapeCategory;