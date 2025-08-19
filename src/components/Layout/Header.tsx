import React, { useState, useRef } from 'react';
import { 
  Save, 
  Upload, 
  Download, 
  Undo, 
  Redo, 
  Trash2, 
  Copy, 
  Clipboard, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  FileText,
  Image,
  Share2,
  Settings
} from 'lucide-react';

interface HeaderProps {
  onSave?: () => void;
  onImport?: (file: File) => void;
  onExport?: (format: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitView?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSave,
  onImport,
  onExport,
  onUndo,
  onRedo,
  onDelete,
  onCopy,
  onPaste,
  onZoomIn,
  onZoomOut,
  onFitView,
  canUndo = false,
  canRedo = false,
  hasSelection = false
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImport) {
      onImport(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format);
    }
  };

  const handleZoomIn = () => {
    if (onZoomIn) {
      onZoomIn();
      setZoomLevel(prev => Math.min(prev + 10, 200));
    }
  };

  const handleZoomOut = () => {
    if (onZoomOut) {
      onZoomOut();
      setZoomLevel(prev => Math.max(prev - 10, 25));
    }
  };

  const handleFitView = () => {
    if (onFitView) {
      onFitView();
      setZoomLevel(100);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-3 py-1.5 flex items-center justify-between">
      {/* Left side - File operations */}
      <div className="flex items-center space-x-1">
        {/* File Menu */}
        <div className="relative group">
          <button className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <FileText size={14} />
            <span>File</span>
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="py-1">
              <button
                onClick={onSave}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Save size={14} />
                <span>Save</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Upload size={14} />
                <span>Import</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => handleExport('svg')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Download size={14} />
                <span>Export as SVG</span>
              </button>
              <button
                onClick={() => handleExport('png')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Image size={14} />
                <span>Export as PNG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Import/Export Buttons */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Import file"
        >
          <Upload size={14} />
          <span>Import</span>
        </button>

        <button
          onClick={onSave}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Save diagram"
        >
          <Save size={14} />
          <span>Save</span>
        </button>

        <button
          onClick={() => handleExport('svg')}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Export as SVG"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* Center - Edit operations */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            canUndo 
              ? 'text-gray-600 hover:bg-gray-100' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo size={14} />
          <span>Undo</span>
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            canRedo 
              ? 'text-gray-600 hover:bg-gray-100' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo size={14} />
          <span>Redo</span>
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        <button
          onClick={onCopy}
          disabled={!hasSelection}
          className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            hasSelection 
              ? 'text-gray-600 hover:bg-gray-100' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Copy"
        >
          <Copy size={14} />
          <span>Copy</span>
        </button>

        <button
          onClick={onPaste}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Paste"
        >
          <Clipboard size={14} />
          <span>Paste</span>
        </button>

        <button
          onClick={onDelete}
          disabled={!hasSelection}
          className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            hasSelection 
              ? 'text-red-600 hover:bg-red-50' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Delete"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>

      {/* Right side - View controls */}
      <div className="flex items-center space-x-1">
        <button
          onClick={handleZoomOut}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>

        <span className="text-xs font-medium text-gray-600 min-w-[50px] text-center">
          {zoomLevel}%
        </span>

        <button
          onClick={handleZoomIn}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={handleFitView}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Fit to view"
        >
          <Maximize2 size={14} />
        </button>

        <div className="w-px h-5 bg-gray-300"></div>

        <button className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">
          <Share2 size={14} />
          <span>Share</span>
        </button>

        <button className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.drawio,.vsdx,.xml,.json"
        onChange={handleFileImport}
        className="hidden"
      />
    </div>
  );
};

export default Header;
