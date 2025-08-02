// components/Sidebar/ShapeItem.jsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';

interface Shape{
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface ShapeItemProps {
  shape: Shape;
}

const ShapeItem = ({ shape }:ShapeItemProps) => {
  const { state, dispatch } = useSidebar();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e: { dataTransfer: { setData: (arg0: string, arg1: string) => void; effectAllowed: string; }; }) => {
    setIsDragging(true);
    dispatch({ type: 'SET_DRAGGED_SHAPE', payload: shape });
    dispatch({ type: 'ADD_TO_RECENT', payload: shape });
    
    // Set drag data
    e.dataTransfer.setData('application/json', JSON.stringify(shape));
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    dispatch({ type: 'SET_DRAGGED_SHAPE', payload: null });
  };
  
  const handleClick = () => {
    dispatch({ type: 'SELECT_SHAPE', payload: shape });
  };
  
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: shape });
  };
  
  const isSelected = state.selectedShape?.id === shape.id;
  const isFavorite = state.favoriteShapes.some(s => s.id === shape.id);
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`
        group flex items-center gap-2 p-2 m-1 rounded cursor-pointer transition-all
        ${isSelected ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'}
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      title={shape.name}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white">
        <shape.icon size={16} className="text-gray-600" />
      </div>
      <span className="text-sm text-gray-700 truncate flex-1">{shape.name}</span>
      <button
        onClick={handleToggleFavorite}
        className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity ${
          isFavorite ? 'opacity-100 text-yellow-500' : 'text-gray-400'
        }`}
      >
        <Star size={12} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
};

export default ShapeItem;