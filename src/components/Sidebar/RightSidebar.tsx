import React, { useState, useEffect } from 'react';

interface RightSidebarProps {
  selectedNode: any;
  onStyleChange: (style: any) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedNode, onStyleChange }) => {
  const [activeTab, setActiveTab] = useState<'style' | 'text' | 'arrange'>('style');
  const [copiedStyle, setCopiedStyle] = useState<any>(null);

  const handleStyleChange = (property: string, value: any) => {
    console.log('🎨 RightSidebar: Style change:', property, value);
    if (selectedNode && onStyleChange) {
      const newStyle = { [property]: value };
      console.log('🎨 RightSidebar: Applying style:', newStyle);
      onStyleChange(newStyle);
    }
  };

  const handleTextChange = (property: string, value: any) => {
    console.log('🎨 RightSidebar: Text change:', property, value);
    if (selectedNode && onStyleChange) {
      const newStyle = { [property]: value };
      console.log('🎨 RightSidebar: Applying text style:', newStyle);
      onStyleChange(newStyle);
      
      // Force a re-render by updating the selectedNode state
      setTimeout(() => {
        console.log('🎨 RightSidebar: Text style applied, node data should be updated');
      }, 100);
    }
  };

  const copyStyle = () => {
    if (selectedNode) {
      console.log('🎨 RightSidebar: Copying style from node:', selectedNode.id);
      setCopiedStyle(selectedNode.data);
    }
  };

  const pasteStyle = () => {
    if (copiedStyle && selectedNode && onStyleChange) {
      console.log('🎨 RightSidebar: Pasting style to node:', selectedNode.id);
      onStyleChange(copiedStyle);
    }
  };

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Arial Black',
    'Impact',
    'Comic Sans MS',
    'Courier New',
    'Lucida Console',
    'Lucida Sans Unicode',
    'MS Sans Serif',
    'MS Serif',
    'Symbol',
    'Webdings',
    'Wingdings'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];

  const nodeData = selectedNode?.data || {};

  console.log('🎨 RightSidebar: Current node data:', nodeData);

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="p-2 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-sm font-medium text-gray-700">
          {selectedNode ? `Format: ${selectedNode.type || 'Element'}` : 'Format'}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 px-2 py-1 text-xs font-medium transition-colors ${
            activeTab === 'style' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button
          className={`flex-1 px-2 py-1 text-xs font-medium transition-colors ${
            activeTab === 'text' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('text')}
        >
          Text
        </button>
        <button
          className={`flex-1 px-2 py-1 text-xs font-medium transition-colors ${
            activeTab === 'arrange' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('arrange')}
        >
          Arrange
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {!selectedNode ? (
          <div className="space-y-3">
            <div className="text-center text-gray-500 py-4">
              <div className="text-2xl mb-1">📝</div>
              <p className="text-xs font-medium">No Selection</p>
              <p className="text-xs text-gray-400">Select an element to edit</p>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Quick Actions</h3>
              
              <div className="space-y-1">
                <button className="w-full px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Select All
                </button>
                <button className="w-full px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  Clear Selection
                </button>
              </div>
            </div>
            
            {/* Canvas Properties */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Canvas</h3>
              
              <div className="space-y-1">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Grid Size</label>
                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded">
                    <option value="10">10px</option>
                    <option value="20" selected>20px</option>
                    <option value="50">50px</option>
                    <option value="100">100px</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-3 h-3" defaultChecked />
                  <span className="text-xs text-gray-700">Show Grid</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="text-xs text-gray-700">Snap to Grid</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'style' && (
              <div className="space-y-3">
                {/* Fill */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fill</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={nodeData.fill || '#ffffff'}
                      onChange={(e) => handleStyleChange('fill', e.target.value)}
                      className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={nodeData.fill || '#ffffff'}
                      onChange={(e) => handleStyleChange('fill', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                {/* Stroke */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stroke</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={nodeData.stroke || '#d1d5db'}
                      onChange={(e) => handleStyleChange('stroke', e.target.value)}
                      className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={nodeData.stroke || '#d1d5db'}
                      onChange={(e) => handleStyleChange('stroke', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      placeholder="#d1d5db"
                    />
                  </div>
                </div>

                {/* Stroke Width */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stroke Width</label>
                  <input
                    type="number"
                    value={nodeData.strokeWidth || 2}
                    onChange={(e) => handleStyleChange('strokeWidth', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    min="0"
                    max="20"
                  />
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Opacity</label>
                  <input
                    type="range"
                    value={nodeData.opacity || 100}
                    onChange={(e) => handleStyleChange('opacity', parseInt(e.target.value))}
                    className="w-full"
                    min="0"
                    max="100"
                  />
                  <div className="text-xs text-gray-500 text-center">{nodeData.opacity || 100}%</div>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-3">
                {/* Font Family */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                  <select
                    value={nodeData.fontFamily || 'Arial'}
                    onChange={(e) => handleTextChange('fontFamily', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    {fontFamilies.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                  <select
                    value={nodeData.fontSize || 12}
                    onChange={(e) => handleTextChange('fontSize', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    {fontSizes.map(size => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                {/* Text Color */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={nodeData.color || '#000000'}
                      onChange={(e) => handleTextChange('color', e.target.value)}
                      className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={nodeData.color || '#000000'}
                      onChange={(e) => handleTextChange('color', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleTextChange('textAlign', 'left')}
                      className={`flex-1 px-2 py-1 text-xs border rounded ${
                        nodeData.textAlign === 'left' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
                      }`}
                    >
                      Left
                    </button>
                    <button
                      onClick={() => handleTextChange('textAlign', 'center')}
                      className={`flex-1 px-2 py-1 text-xs border rounded ${
                        nodeData.textAlign === 'center' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
                      }`}
                    >
                      Center
                    </button>
                    <button
                      onClick={() => handleTextChange('textAlign', 'right')}
                      className={`flex-1 px-2 py-1 text-xs border rounded ${
                        nodeData.textAlign === 'right' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
                      }`}
                    >
                      Right
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'arrange' && (
              <div className="space-y-3">
                {/* Position */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">X</label>
                      <input
                        type="number"
                        value={selectedNode.position.x}
                        onChange={(e) => {
                          // Handle position change
                        }}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Y</label>
                      <input
                        type="number"
                        value={selectedNode.position.y}
                        onChange={(e) => {
                          // Handle position change
                        }}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Width</label>
                      <input
                        type="number"
                        value={nodeData.width || 100}
                        onChange={(e) => handleStyleChange('width', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        min="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Height</label>
                      <input
                        type="number"
                        value={nodeData.height || 100}
                        onChange={(e) => handleStyleChange('height', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                        min="10"
                      />
                    </div>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rotation</label>
                  <input
                    type="range"
                    value={nodeData.rotation || 0}
                    onChange={(e) => handleStyleChange('rotation', parseInt(e.target.value))}
                    className="w-full"
                    min="0"
                    max="360"
                  />
                  <div className="text-xs text-gray-500 text-center">{nodeData.rotation || 0}°</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
