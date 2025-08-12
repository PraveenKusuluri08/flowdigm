import React from 'react';

interface TextToolbarProps {
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  onStyleChange: (property: string, value: any) => void;
  currentStyles: any;
}

const TextToolbar: React.FC<TextToolbarProps> = ({
  x,
  y,
  isVisible,
  onClose,
  onStyleChange,
  currentStyles
}) => {
  if (!isVisible) return null;

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
    'Courier New'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ffa500', '#800080', '#008000', '#ffc0cb', '#a52a2a', '#808080', '#c0c0c0', '#000080'
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        onClick={onClose}
      />
      
      {/* Floating Toolbar */}
      <div
        className="fixed bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50"
        style={{
          left: x,
          top: y - 60,
          minWidth: '300px'
        }}
      >
        <div className="flex items-center space-x-2">
          {/* Font Family */}
          <select
            value={currentStyles.fontFamily || 'Arial'}
            onChange={(e) => onStyleChange('fontFamily', e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded"
            style={{ fontFamily: currentStyles.fontFamily || 'Arial' }}
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>

          {/* Font Size */}
          <select
            value={currentStyles.fontSize || 12}
            onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value))}
            className="px-2 py-1 text-xs border border-gray-300 rounded w-16"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* Bold */}
          <button
            className={`px-2 py-1 text-xs border rounded font-bold ${
              currentStyles.fontWeight === 'bold' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
            onClick={() => onStyleChange('fontWeight', currentStyles.fontWeight === 'bold' ? 'normal' : 'bold')}
            title="Bold"
          >
            B
          </button>

          {/* Italic */}
          <button
            className={`px-2 py-1 text-xs border rounded italic ${
              currentStyles.fontStyle === 'italic' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
            onClick={() => onStyleChange('fontStyle', currentStyles.fontStyle === 'italic' ? 'normal' : 'italic')}
            title="Italic"
          >
            I
          </button>

          {/* Underline */}
          <button
            className={`px-2 py-1 text-xs border rounded underline ${
              currentStyles.textDecoration === 'underline' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
            onClick={() => onStyleChange('textDecoration', currentStyles.textDecoration === 'underline' ? 'none' : 'underline')}
            title="Underline"
          >
            U
          </button>

          {/* Color Picker */}
          <div className="relative">
            <input
              type="color"
              value={currentStyles.fontColor || '#000000'}
              onChange={(e) => onStyleChange('fontColor', e.target.value)}
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
              title="Text Color"
            />
          </div>

          {/* Quick Colors */}
          <div className="flex space-x-1">
            {colors.slice(0, 8).map((color) => (
              <button
                key={color}
                className="w-4 h-4 border border-gray-300 rounded cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => onStyleChange('fontColor', color)}
                title={`Color: ${color}`}
              />
            ))}
          </div>

          {/* Alignment */}
          <div className="flex space-x-1 ml-2">
            <button
              className={`px-2 py-1 text-xs border rounded ${
                currentStyles.textAlign === 'left' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => onStyleChange('textAlign', 'left')}
              title="Align Left"
            >
              ⬅️
            </button>
            <button
              className={`px-2 py-1 text-xs border rounded ${
                currentStyles.textAlign === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => onStyleChange('textAlign', 'center')}
              title="Align Center"
            >
              ↔️
            </button>
            <button
              className={`px-2 py-1 text-xs border rounded ${
                currentStyles.textAlign === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
              onClick={() => onStyleChange('textAlign', 'right')}
              title="Align Right"
            >
              ➡️
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TextToolbar;
