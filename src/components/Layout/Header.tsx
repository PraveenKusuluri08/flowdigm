/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useState, useRef } from "react";
import icon from "../../assets/images/logo.jpeg"
import {
  File,
  Layers,
  MoreHorizontal,
  ChevronDown,
  Save,
  Download,
  Share2,
  Undo,
  Redo,
  Copy,
  Scissors,
  ClipboardPaste,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid3X3,
  Settings,
  Upload,
} from "lucide-react";
import { CanvasContext } from "../../context/CanvasEditorProvider";
import { createFileInput } from "../../utils/importExportUtils";

const Header = () => {
  const [fileName, setFileName] = useState("Untitled Diagram");
  const [isEditingName, setIsEditingName] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const context = useContext(CanvasContext) as any;
  const {state, setFileNameContext, exportCanvas, importFromFile, saveToDevice, loadFromDevice, checkForAutoSave, checkUnsavedWork, createNewDiagram, openImageFile } = context;

  if (!context) {
    return <div>Loading...</div>;
  }

  const handleFileNameEdit = () => {
    setIsEditingName(true);
  };

  const handleFileNameSave = (e: any) => {
    if (e.key === "Enter" || e.type === "blur") {
      setIsEditingName(false);
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
      const newFileName = prompt('Enter file name:', state.filename || 'Untitled Diagram');
      if (newFileName) {
        await saveToDevice(newFileName);
        setFileNameContext(newFileName);
        alert('File saved successfully!');
      }
    } catch (error) {
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
    const input = createFileInput('.json', false);
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        try {
          await importFromFile(file);
        } catch (error) {
          alert('Failed to import file: ' + error);
        }
      }
    };
    input.click();
  }, [importFromFile]);

  const handleExport = useCallback(async (format: string) => {
    try {
      console.log('Starting export for format:', format);
      
      // Get the canvas element for image exports
      let canvasElement: HTMLElement | null = null;
      
      if (format === 'png' || format === 'jpeg') {
        // Try multiple selectors to find the canvas
        canvasElement = document.querySelector('.react-flow') as HTMLElement;
        if (!canvasElement) {
          canvasElement = document.querySelector('[data-testid="react-flow"]') as HTMLElement;
        }
        if (!canvasElement) {
          canvasElement = document.querySelector('.react-flow__viewport') as HTMLElement;
        }
        if (!canvasElement) {
          // Fallback to the main canvas container
          canvasElement = document.querySelector('.react-flow__renderer') as HTMLElement;
        }
        
        console.log('Found canvas element:', canvasElement);
        
        if (!canvasElement) {
          throw new Error('Could not find ReactFlow canvas element');
        }
      }
      
      await exportCanvas(format, canvasElement);
      console.log('Export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export: ' + (error instanceof Error ? error.message : String(error)));
    }
  }, [exportCanvas]);

  const handleExportClick = (format: string) => {
    handleExport(format);
    setShowExportDropdown(false);
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
          <div className="flex items-center gap-1">
            <button
              onClick={createNewDiagram}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-gray-600"
              title="New (Ctrl+N)"
            >
              <File size={16} />
              <span className="text-sm">New</span>
            </button>
            <button
              onClick={handleLoad}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-gray-600"
              title="Open... (Ctrl+O)"
            >
              <Upload size={16} />
              <span className="text-sm">Open</span>
            </button>
            <button
              onClick={openImageFile}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-gray-600"
              title="Open Image... (Ctrl+Shift+O)"
            >
              <Upload size={16} />
              <span className="text-sm">Image</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-gray-600"
              title="Save (Ctrl+S)"
            >
              <Save size={16} />
              <span className="text-sm">Save</span>
            </button>
            <button
              onClick={handleSaveAs}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-gray-600"
              title="Save as... (Ctrl+Shift+S)"
            >
              <Save size={16} />
              <span className="text-sm">Save As</span>
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-gray-600"
              title="Import from..."
            >
              <Upload size={16} />
              <span className="text-sm">Import</span>
            </button>
            
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-gray-600"
                title="Export as..."
              >
                <Download size={16} />
                <span className="text-sm">Export</span>
                <ChevronDown size={12} />
              </button>
              
              {showExportDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-32">
                  <button
                    onClick={() => handleExportClick('png')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={16} />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('jpeg')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={16} />
                    <span>JPEG</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('svg')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={16} />
                    <span>SVG</span>
                  </button>
                  <button
                    onClick={() => handleExportClick('json')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download size={16} />
                    <span>JSON</span>
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
    </div>
  );
};

export default Header;
