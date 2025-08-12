import React, { useState } from 'react';

interface RightSidebarProps {
  selectedNode: any;
  onStyleChange: (style: any) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ selectedNode, onStyleChange }) => {
  const [activeTab, setActiveTab] = useState<'style' | 'text' | 'arrange'>('style');

  const handleStyleChange = (property: string, value: any) => {
    if (selectedNode) {
      onStyleChange({
        ...selectedNode,
        [property]: value
      });
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

  return (
    <div className="w-full bg-white border-l border-gray-200 flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-sm font-medium text-gray-700">Format</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 px-3 py-2 text-xs font-medium ${
            activeTab === 'style' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('style')}
        >
          Style
        </button>
        <button
          className={`flex-1 px-3 py-2 text-xs font-medium ${
            activeTab === 'text' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('text')}
        >
          Text
        </button>
        <button
          className={`flex-1 px-3 py-2 text-xs font-medium ${
            activeTab === 'arrange' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('arrange')}
        >
          Arrange
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {!selectedNode ? (
          <div className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-sm font-medium">No Selection</p>
              <p className="text-xs text-gray-400 mt-1">Select an element to edit its properties</p>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Quick Actions</h3>
              
              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  Select All
                </button>
                <button className="w-full px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Clear Selection
                </button>
                <button className="w-full px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Copy Style
                </button>
                <button className="w-full px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Paste Style
                </button>
              </div>
            </div>
            
            {/* Canvas Properties */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Canvas</h3>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Background Color</label>
                  <input
                    type="color"
                    value="#ffffff"
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
                
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
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-xs text-gray-700">Show Grid</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-xs text-gray-700">Snap to Grid</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'style' && (
              <div className="space-y-4">
                {/* Fill */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fill</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={selectedNode.fill || '#ffffff'}
                      onChange={(e) => handleStyleChange('fill', e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedNode.fill || '#ffffff'}
                      onChange={(e) => handleStyleChange('fill', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Stroke */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stroke</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={selectedNode.stroke || '#000000'}
                      onChange={(e) => handleStyleChange('stroke', e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedNode.stroke || '#000000'}
                      onChange={(e) => handleStyleChange('stroke', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Stroke Width */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stroke Width</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={selectedNode.strokeWidth || 1}
                    onChange={(e) => handleStyleChange('strokeWidth', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </div>

                {/* Opacity */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(selectedNode.opacity || 1) * 100}
                    onChange={(e) => handleStyleChange('opacity', parseInt(e.target.value) / 100)}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {Math.round((selectedNode.opacity || 1) * 100)}%
                  </div>
                </div>

                {/* Shadow */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Shadow</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedNode.shadow || false}
                      onChange={(e) => handleStyleChange('shadow', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-xs text-gray-700">Enable shadow</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-gray-200">
                  <button className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 mb-2">
                    Edit...
                  </button>
                  <button className="w-full px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 mb-2">
                    Copy Style
                  </button>
                  <button className="w-full px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    Set as Default Style
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-4">
                {/* Text Content */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
                  <textarea
                    value={selectedNode.label || ''}
                    onChange={(e) => handleStyleChange('label', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded resize-none"
                    rows={3}
                    placeholder="Enter text..."
                  />
                </div>

                {/* Font Family */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Font</label>
                  <select
                    value={selectedNode.fontFamily || 'Arial'}
                    onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                  <select
                    value={selectedNode.fontSize || 12}
                    onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    {fontSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Color */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={selectedNode.fontColor || '#000000'}
                      onChange={(e) => handleStyleChange('fontColor', e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedNode.fontColor || '#000000'}
                      onChange={(e) => handleStyleChange('fontColor', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>

                {/* Text Formatting */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Format</label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.fontWeight === 'bold' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('fontWeight', selectedNode.fontWeight === 'bold' ? 'normal' : 'bold')}
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.fontStyle === 'italic' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('fontStyle', selectedNode.fontStyle === 'italic' ? 'normal' : 'italic')}
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.textDecoration === 'underline' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('textDecoration', selectedNode.textDecoration === 'underline' ? 'none' : 'underline')}
                      title="Underline"
                    >
                      U
                    </button>
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.textAlign === 'left' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('textAlign', 'left')}
                      title="Align Left"
                    >
                      ⬅️
                    </button>
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.textAlign === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('textAlign', 'center')}
                      title="Align Center"
                    >
                      ↔️
                    </button>
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.textAlign === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('textAlign', 'right')}
                      title="Align Right"
                    >
                      ➡️
                    </button>
                  </div>
                </div>

                {/* Vertical Alignment */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vertical Alignment</label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.verticalAlign === 'top' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('verticalAlign', 'top')}
                      title="Align Top"
                    >
                      ⬆️
                    </button>
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.verticalAlign === 'middle' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('verticalAlign', 'middle')}
                      title="Align Middle"
                    >
                      ↔️
                    </button>
                    <button
                      className={`px-2 py-1 text-xs border rounded ${
                        selectedNode.verticalAlign === 'bottom' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}
                      onClick={() => handleStyleChange('verticalAlign', 'bottom')}
                      title="Align Bottom"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Line Height</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={selectedNode.lineHeight || 1.2}
                    onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {selectedNode.lineHeight || 1.2}
                  </div>
                </div>

                {/* Letter Spacing */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Letter Spacing</label>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    step="0.5"
                    value={selectedNode.letterSpacing || 0}
                    onChange={(e) => handleStyleChange('letterSpacing', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {selectedNode.letterSpacing || 0}px
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'arrange' && (
              <div className="space-y-4">
                {/* Position */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500">X</label>
                      <input
                        type="number"
                        value={Math.round(selectedNode.x || 0)}
                        onChange={(e) => handleStyleChange('x', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Y</label>
                      <input
                        type="number"
                        value={Math.round(selectedNode.y || 0)}
                        onChange={(e) => handleStyleChange('y', parseInt(e.target.value))}
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
                      <label className="block text-xs text-gray-500">Width</label>
                      <input
                        type="number"
                        value={Math.round(selectedNode.width || 100)}
                        onChange={(e) => handleStyleChange('width', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Height</label>
                      <input
                        type="number"
                        value={Math.round(selectedNode.height || 100)}
                        onChange={(e) => handleStyleChange('height', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Rotation */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rotation</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedNode.rotation || 0}
                    onChange={(e) => handleStyleChange('rotation', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 text-center">
                    {selectedNode.rotation || 0}°
                  </div>
                </div>

                {/* Z-Index */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Layer</label>
                  <div className="flex space-x-1">
                    <button className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      To Front
                    </button>
                    <button className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      To Back
                    </button>
                  </div>
                  <div className="flex space-x-1 mt-1">
                    <button className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      Forward
                    </button>
                    <button className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      Backward
                    </button>
                  </div>
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
