// components/Sidebar/QuickAccess.jsx
import React from 'react';

const QuickAccess = () => {
  // For now, we'll show a simple placeholder since we don't have the context
  // In the future, this could be enhanced with local storage or other state management
  
  return (
    <div className="border-b border-gray-200">
      <div className="p-2">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Quick Access
        </h3>
        <div className="text-xs text-gray-400 text-center py-2">
          Recent and favorite shapes will appear here
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;