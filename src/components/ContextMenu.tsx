import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  selectedNode?: any;
  hasSelectedNode: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  isVisible,
  onClose,
  onAction,
  selectedNode,
  hasSelectedNode
}) => {
  if (!isVisible) return null;

  const handleAction = (action: string) => {
    onAction(action);
    onClose();
  };

  const menuStyle = {
    position: 'fixed' as const,
    left: x,
    top: y,
    zIndex: 1000,
  };

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        className="fixed inset-0 z-999"
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="bg-white border border-gray-300 rounded-lg shadow-lg py-1 min-w-48 z-1000"
        style={menuStyle}
      >
        {hasSelectedNode ? (
          <>
            {/* Node-specific actions */}
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('delete')}
            >
              <span className="mr-2">🗑️</span>
              Delete
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('cut')}
            >
              <span className="mr-2">✂️</span>
              Cut
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('copy')}
            >
              <span className="mr-2">📋</span>
              Copy
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('copyAsImage')}
            >
              <span className="mr-2">🖼️</span>
              Copy as Image
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('copyAsSvg')}
            >
              <span className="mr-2">📐</span>
              Copy as SVG
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('duplicate')}
            >
              <span className="mr-2">📄</span>
              Duplicate
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('lock')}
            >
              <span className="mr-2">🔒</span>
              {selectedNode?.locked ? 'Unlock' : 'Lock'}
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('setDefaultStyle')}
            >
              <span className="mr-2">🎨</span>
              Set as Default Style
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('toFront')}
            >
              <span className="mr-2">⬆️</span>
              To Front
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('toBack')}
            >
              <span className="mr-2">⬇️</span>
              To Back
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('bringForward')}
            >
              <span className="mr-2">↗️</span>
              Bring Forward
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('sendBackward')}
            >
              <span className="mr-2">↙️</span>
              Send Backward
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('editStyle')}
            >
              <span className="mr-2">🎨</span>
              Edit Style...
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('editData')}
            >
              <span className="mr-2">📊</span>
              Edit Data...
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('editLink')}
            >
              <span className="mr-2">🔗</span>
              Edit Link...
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('editConnectionPoints')}
            >
              <span className="mr-2">📍</span>
              Edit Connection Points...
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('addToScratchpad')}
            >
              <span className="mr-2">📝</span>
              Add to Scratchpad
            </button>
          </>
        ) : (
          <>
            {/* Canvas actions (when no node is selected) */}
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('paste')}
            >
              <span className="mr-2">📋</span>
              Paste
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('selectAll')}
            >
              <span className="mr-2">☑️</span>
              Select All
            </button>
            
            <div className="border-t border-gray-200 my-1"></div>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('zoomIn')}
            >
              <span className="mr-2">🔍+</span>
              Zoom In
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('zoomOut')}
            >
              <span className="mr-2">🔍-</span>
              Zoom Out
            </button>
            
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
              onClick={() => handleAction('fitToPage')}
            >
              <span className="mr-2">📄</span>
              Fit to Page
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ContextMenu;
