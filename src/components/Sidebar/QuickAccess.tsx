// components/Sidebar/QuickAccess.jsx
import React from 'react';
import { useSidebar } from '../../hooks/useSidebar';

const QuickAccess = () => {
  const { state, dispatch } = useSidebar();
  
  const handleQuickShapeClick = (shape) => {
    dispatch({ type: 'SELECT_SHAPE', payload: shape });
    dispatch({ type: 'ADD_TO_RECENT', payload: shape });
  };
  
  if (state.recentShapes.length === 0 && state.favoriteShapes.length === 0) {
    return null;
  }
  
  return (
    <div className="border-b border-gray-200">
      {state.favoriteShapes.length > 0 && (
        <div className="p-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Favorites
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {state.favoriteShapes.slice(0, 8).map(shape => (
              <div
                key={`fav-${shape.id}`}
                onClick={() => handleQuickShapeClick(shape)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                title={shape.name}
              >
                <shape.icon size={14} className="text-gray-600" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {state.recentShapes.length > 0 && (
        <div className="p-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Recent
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {state.recentShapes.slice(0, 8).map(shape => (
              <div
                key={`recent-${shape.id}`}
                onClick={() => handleQuickShapeClick(shape)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                title={shape.name}
              >
                <shape.icon size={14} className="text-gray-600" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickAccess;