// components/Sidebar/QuickAccess.jsx

const QuickAccess = () => {
  // For now, we'll show a simple placeholder since we don't have the context
  // In the future, this could be enhanced with local storage or other state management
  
  return (
    <div className="border-b border-white/20 bg-gradient-to-r from-purple-50/50 to-pink-50/30">
      <div className="p-6">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-wide mb-4 flex items-center">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-3 animate-pulse"></div>
          Quick Access
        </h3>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
          <div className="text-sm text-gray-600 text-center py-4 font-medium">
            Recent and favorite shapes will appear here
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;