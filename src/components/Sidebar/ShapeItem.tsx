// components/Sidebar/ShapeItem.tsx - Create this component for sidebar items

import React from 'react';

interface ShapeItemProps {
  shape: {
    id: string;
    name: string;
    icon: React.ComponentType<any> | (() => React.ReactElement);
    tooltip?: string;
  };
  variant?: 'grid' | 'list';
}

export const ShapeItem: React.FC<ShapeItemProps> = ({ shape, variant = 'grid' }) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log('Dragging shape:', shape.id, 'with data:', shape);
    
    // Create drag data
    const dragData = {
      shapeId: shape.id,
      shapeName: shape.name || shape.tooltip,
      timestamp: Date.now()
    };
    
    console.log('Setting drag data:', dragData);
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // Visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Restore visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  };

  const renderIcon = () => {
    const IconComponent = shape.icon;
    
    try {
      // For BPMN icons that are function components
      if (typeof IconComponent === 'function') {
        return (IconComponent as () => React.ReactElement)();
      } else {
        // For regular React components
        return React.createElement(IconComponent as React.ComponentType<any>, { size: 24 });
      }
    } catch (error) {
      console.error('Error rendering icon:', error);
      return <div className="w-6 h-6 bg-gray-400 rounded"></div>;
    }
  };

  const isGrid = variant === 'grid';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={
        isGrid
          ? 'flex flex-col items-center justify-center gap-1 p-2 rounded border border-transparent hover:border-gray-300 hover:bg-gray-50 cursor-move select-none min-h-[64px]'
          : 'flex items-center gap-2 p-2 hover:bg-gray-100 cursor-move select-none rounded'
      }
      title={shape.tooltip || shape.name}
    >
      <div className={isGrid ? 'flex-shrink-0 text-gray-700' : 'flex-shrink-0'}>
        {renderIcon()}
      </div>
      <span className={isGrid ? 'text-xs text-gray-700 text-center truncate w-full' : 'text-sm truncate'}>
        {shape.tooltip}
      </span>
    </div>
  );
};

// Usage in your sidebar component
export const SidebarCategory: React.FC<{
  category: any;
  isCollapsed: boolean;
  onToggle: () => void;
}> = ({ category, isCollapsed, onToggle }) => {
  const CategoryIcon = category.icon;

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-100 rounded"
      >
        <div className="flex items-center gap-2">
          <CategoryIcon size={16} />
          <span className="font-medium">{category.name}</span>
        </div>
        <span className={`transform transition-transform ${isCollapsed ? '' : 'rotate-90'}`}>
          ▶
        </span>
      </button>
      
      {!isCollapsed && (
        <div className="ml-4 space-y-1">
          {category.shapes.map((shape: any) => (
            <ShapeItem key={shape.id} shape={shape} />
          ))}
        </div>
      )}
    </div>
  );
};