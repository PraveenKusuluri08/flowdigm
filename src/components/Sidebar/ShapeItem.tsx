// components/Sidebar/ShapeItem.tsx - Create this component for sidebar items

import React from 'react';

interface ShapeItemProps {
  shape: {
    id: string;
    name: string;
    icon: React.ComponentType<any> | (() => JSX.Element);
    tooltip?: string;
  };
}

export const ShapeItem: React.FC<ShapeItemProps> = ({ shape }) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log('Dragging shape:', shape.id);
    
    // Create drag data
    const dragData = {
      shapeId: shape.id,
      shapeName: shape.name,
      timestamp: Date.now()
    };
    
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
    
    if (typeof IconComponent === 'function') {
      try {
        return <IconComponent />;
      } catch (error) {
        console.error('Error rendering icon:', error);
        return <div className="w-6 h-6 bg-gray-400 rounded"></div>;
      }
    } else {
      return <IconComponent size={24} />;
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-move select-none rounded"
      title={shape.tooltip || shape.name}
    >
      <div className="flex-shrink-0">
        {renderIcon()}
      </div>
      <span className="text-sm truncate">{shape.tooltip}</span>
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