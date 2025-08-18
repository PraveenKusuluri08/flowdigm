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
        return React.createElement(IconComponent as React.ComponentType<any>, { size: 20 });
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
          ? 'flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 border-transparent hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 cursor-move select-none min-h-[60px] transition-all duration-300 shadow-sm hover:shadow-lg group'
          : 'flex items-center gap-2 p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-move select-none rounded-lg border-2 border-transparent hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg group'
      }
      title={shape.tooltip || shape.name}
    >
      <div className={`${isGrid ? 'flex-shrink-0 text-gray-700 group-hover:scale-110 transition-transform duration-300' : 'flex-shrink-0 group-hover:scale-110 transition-transform duration-300'}`}>
        {renderIcon()}
      </div>
      {!isGrid && (
        <span className="text-xs font-medium truncate">
          {shape.tooltip}
        </span>
      )}
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