/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useState } from "react";
import icon from "../../assets/images/logo.jpeg"
import {
  File,
  MoreHorizontal,
  ChevronDown,
  Save,
  Download,
  Upload,
} from "lucide-react";
import { CanvasContext } from "../../context/CanvasEditorProvider";
import { createFileInput } from "../../utils/importExportUtils";

const Header = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'png',
    quality: 100,
    scale: 100,
    width: '',
    height: '',
    backgroundColor: '#ffffff',
    transparent: false,
    border: 0,
    includeGrid: false,
    cropToContent: true,
    embedImages: true
  });

  const context = useContext(CanvasContext) as any;
  const {state, setFileNameContext, exportCanvas, importFromFile, importImageFile, saveToDevice, loadFromDevice, createNewDiagram, openImageFile } = context;

  if (!context) {
    return <div>Loading...</div>;
  }

  // Use filename from context state
  const fileName = state.filename || "Untitled Diagram";

  const handleFileNameEdit = () => {
    setIsEditingName(true);
  };

  const handleFileNameSave = (e: any) => {
    if (e.key === "Enter" || e.type === "blur") {
      setIsEditingName(false);
      // Ensure the filename is saved to context
      if (e.target && e.target.value) {
        setFileNameContext(e.target.value);
      }
    }
  };

  // Import/Export handlers
  // Save/Load handlers
  const handleSave = useCallback(async () => {
    try {
      await saveToDevice();
      alert('File saved successfully!');
    } catch (error) {
      alert('Failed to save file: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, [saveToDevice]);

  const handleSaveAs = useCallback(async () => {
    try {
      const currentFileName = state.filename || 'Untitled Diagram';
      const newFileName = prompt('Enter file name:', currentFileName);
      if (newFileName && newFileName.trim()) {
        const trimmedName = newFileName.trim();
        await saveToDevice(trimmedName);
        setFileNameContext(trimmedName);
        alert('File saved successfully!');
      }
    } catch (error) {
      console.error('Save As failed:', error);
      alert('Failed to save file: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, [saveToDevice, state.filename, setFileNameContext]);

  const handleLoad = useCallback(async () => {
    try {
      await loadFromDevice();
      alert('File loaded successfully!');
    } catch (error) {
      alert('Failed to load file: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, [loadFromDevice]);

  const handleImport = useCallback(() => {
    // Accept comprehensive file formats
    const input = createFileInput('.json,.svg,.png,.jpg,.jpeg,.gif,.bmp,.webp,.pdf,.docx,.pptx,.ppt', false);
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        try {
          const ext = file.name.toLowerCase().split('.').pop();
          
          // Handle different file types
          if (ext === 'json') {
            await importFromFile(file);
          } else if (['pdf', 'docx', 'pptx', 'ppt'].includes(ext || '')) {
            // For document formats, show a notification about the import
            alert(`Importing ${ext?.toUpperCase()} files is supported but may convert content to image representation.`);
            await importImageFile(file);
          } else {
            // Handle image formats
            await importImageFile(file);
          }
        } catch (error) {
          alert('Failed to import file: ' + error);
        }
      }
    };
    input.click();
  }, [importFromFile]);

  const handleExport = useCallback(async (format: string) => {
    try {
      console.log('🚀 Starting export for format:', format);
      
      // Check if there's any content to export
      const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
      const contextShapes = state.shapes || [];
      
      let hasContent = false;
      let nodeCount = 0;
      
      if (reactFlowInstance) {
        const nodes = reactFlowInstance.getNodes() || [];
        nodeCount = nodes.length;
        hasContent = nodes.length > 0;
        console.log('📊 ReactFlow nodes found:', nodeCount);
      }
      
      if (!hasContent && contextShapes.length > 0) {
        hasContent = true;
        nodeCount = contextShapes.length;
        console.log('📊 Context shapes found:', nodeCount);
      }
      
      if (!hasContent) {
        alert('No content to export! Please add some shapes to the canvas first.');
        return;
      }
      
      console.log(`✅ Found ${nodeCount} items to export`);
      
      // Call the export function from context
      await exportCanvas(format);
      
      console.log('✅ Export completed successfully');
      alert(`Successfully exported ${nodeCount} items as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('❌ Export failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to export: ${errorMessage}`);
    }
  }, [exportCanvas, state.shapes]);

  const handleAdvancedExport = useCallback(async () => {
    try {
      console.log('🚀 Starting advanced export with options:', exportOptions);
      
      // Check if there's any content to export
      const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
      const contextShapes = state.shapes || [];
      
      let hasContent = false;
      let nodeCount = 0;
      
      if (reactFlowInstance) {
        const nodes = reactFlowInstance.getNodes() || [];
        nodeCount = nodes.length;
        hasContent = nodes.length > 0;
        console.log('📊 ReactFlow nodes found:', nodeCount);
      }
      
      if (!hasContent && contextShapes.length > 0) {
        hasContent = true;
        nodeCount = contextShapes.length;
        console.log('📊 Context shapes found:', nodeCount);
      }
      
      if (!hasContent) {
        alert('No content to export! Please add some shapes to the canvas first.');
        return;
      }
      
      console.log(`✅ Found ${nodeCount} items to export`);
      
      // Call the advanced export function from context
      await exportCanvas(exportOptions.format, undefined, exportOptions);
      
      console.log('✅ Advanced export completed successfully');
      alert(`Successfully exported ${nodeCount} items as ${exportOptions.format.toUpperCase()} with custom options!`);
    } catch (error: any) {
      console.error('❌ Advanced export failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to export: ${errorMessage}`);
    }
  }, [exportCanvas, state.shapes, exportOptions]);

  const handleExportClick = (format: string) => {
    if (format === 'advanced') {
      setShowAdvancedExport(true);
      setShowExportDropdown(false);
    } else {
      handleExport(format);
      setShowExportDropdown(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 relative">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 h-14">
        {/* Left Section - Logo and File Name */}
        <div className="flex items-center gap-1">
          {/* ArchPlot Logo */}
          <div className="flex items-center">
            <img
              src={icon}
              alt="ArchPlot Logo"
              className="w-10 h-10 rounded-lg"
            />
          </div>

          {/* File Name */}
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileNameContext(e.target.value)}
                onBlur={handleFileNameSave}
                onKeyDown={handleFileNameSave}
                className="px-2 py-1 border border-blue-500 rounded text-sm font-medium min-w-48"
                autoFocus
              />
            ) : (
              <button
                onClick={handleFileNameEdit}
                className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-medium text-gray-800"
              >
                {fileName}
              </button>
            )}
            <span className="text-xs text-gray-500 hidden md:block">
              Saved to Device
            </span>
          </div>
        </div>

        {/* Right Section - File Actions and User Actions */}
        <div className="flex items-center gap-2">
          {/* File Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={createNewDiagram}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-600"
              title="New (Ctrl+N)"
            >
              <File size={16} />
              <span className="text-sm">New</span>
            </button>
            <button
              onClick={handleLoad}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-600"
              title="Open... (Ctrl+O)"
            >
              <Upload size={16} />
              <span className="text-sm">Open</span>
            </button>
            <button
              onClick={openImageFile}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-600"
              title="Open Image... (Ctrl+Shift+O)"
            >
              <Upload size={16} />
              <span className="text-sm">Open Image</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-600"
              title="Save (Ctrl+S)"
            >
              <Save size={16} />
              <span className="text-sm">Save</span>
            </button>
            <button
              onClick={handleSaveAs}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-600"
              title="Save as... (Ctrl+Shift+S)"
            >
              <Save size={16} />
              <span className="text-sm">Save As</span>
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-600"
              title="Import from..."
            >
              <Upload size={16} />
              <span className="text-sm">Import</span>
            </button>
            
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-gray-600"
                title="Export as..."
              >
                <Download size={16} />
                <span className="text-sm">Export</span>
                <ChevronDown size={12} />
              </button>
              
              {showExportDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48">
                  {/* Image Formats */}
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Image Formats
                  </div>
                  <button
                    onClick={() => handleExportClick('png')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>PNG...</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('jpeg')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>JPEG...</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('webp')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>WebP...</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('svg')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>SVG...</span>
                  </button>
                  
                  {/* Document Formats */}
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Document Formats
                  </div>
                  <button
                    onClick={() => handleExportClick('pdf')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>PDF...</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('docx')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>DOCX...</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('pptx')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>PPTX...</span>
                  </button>
                  
                  {/* Web Formats */}
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Web Formats
                  </div>
                  <button
                    onClick={() => handleExportClick('html')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>HTML...</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('xml')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>XML...</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('url')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={14} />
                    <span>URL...</span>
                  </button>
                  
                  {/* Advanced Options */}
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => handleExportClick('advanced')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 font-medium"
                  >
                    <Download size={14} />
                    <span>Advanced...</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 hidden sm:block">
            Share
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {showExportDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExportDropdown(false)}
        />
      )}

      {/* Advanced Export Dialog */}
      {showAdvancedExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Export Options</h3>
              <button
                onClick={() => setShowAdvancedExport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  value={exportOptions.format}
                  onChange={(e) => setExportOptions({...exportOptions, format: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                  <option value="svg">SVG</option>
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="pptx">PPTX</option>
                  <option value="html">HTML</option>
                  <option value="xml">XML</option>
                </select>
              </div>

              {/* Quality (for image formats) */}
              {['png', 'jpeg', 'webp'].includes(exportOptions.format) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: {exportOptions.quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={exportOptions.quality}
                    onChange={(e) => setExportOptions({...exportOptions, quality: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
              )}

              {/* Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scale: {exportOptions.scale}%
                </label>
                <input
                  type="range"
                  min="25"
                  max="400"
                  value={exportOptions.scale}
                  onChange={(e) => setExportOptions({...exportOptions, scale: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              {/* Custom Dimensions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={exportOptions.width}
                    onChange={(e) => setExportOptions({...exportOptions, width: e.target.value})}
                    placeholder="Auto"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={exportOptions.height}
                    onChange={(e) => setExportOptions({...exportOptions, height: e.target.value})}
                    placeholder="Auto"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              </div>

              {/* Background */}
              {exportOptions.format !== 'svg' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={exportOptions.backgroundColor}
                      onChange={(e) => setExportOptions({...exportOptions, backgroundColor: e.target.value})}
                      className="w-12 h-8 border border-gray-300 rounded"
                      disabled={exportOptions.transparent}
                    />
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={exportOptions.transparent}
                        onChange={(e) => setExportOptions({...exportOptions, transparent: e.target.checked})}
                      />
                      <span className="text-sm">Transparent</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Border */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border: {exportOptions.border}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={exportOptions.border}
                  onChange={(e) => setExportOptions({...exportOptions, border: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeGrid}
                    onChange={(e) => setExportOptions({...exportOptions, includeGrid: e.target.checked})}
                  />
                  <span className="text-sm">Include grid</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exportOptions.cropToContent}
                    onChange={(e) => setExportOptions({...exportOptions, cropToContent: e.target.checked})}
                  />
                  <span className="text-sm">Crop to content</span>
                </label>
                {['html', 'xml'].includes(exportOptions.format) && (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportOptions.embedImages}
                      onChange={(e) => setExportOptions({...exportOptions, embedImages: e.target.checked})}
                    />
                    <span className="text-sm">Embed images</span>
                  </label>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAdvancedExport(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAdvancedExport();
                  setShowAdvancedExport(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
