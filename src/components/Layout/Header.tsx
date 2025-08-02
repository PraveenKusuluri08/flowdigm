/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
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
  Settings
} from 'lucide-react';

const Header = () => {

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [fileName, setFileName] = useState('Untitled Diagram');
  const [isEditingName, setIsEditingName] = useState(false);

  const handleDropdownToggle = (dropdown:any) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleFileNameEdit = () => {
    setIsEditingName(true);
  };

  const handleFileNameSave = (e:any) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setIsEditingName(false);
    }
  };

  const DropdownMenu = ({ items, isOpen }) => {
  const [openSubmenuId, setOpenSubmenuId] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-48">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => item.MenuItems && setOpenSubmenuId(item.id)}
          // onMouseLeave={() => item.MenuItems && setOpenSubmenuId(null)}
        >
          {item.separator ? (
            <div className="border-t border-gray-200 my-1" />
          ) : (
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              {item.icon && <item.icon size={16} />}
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="ml-auto text-xs text-gray-500">{item.shortcut}</span>
              )}
              {item.MenuItems && (
                <span className="ml-2 text-gray-400">&gt;</span> 
              )}
            </button>
          )}

          {item.MenuItems && openSubmenuId === item.id && (
            <div className="absolute top-0 left-full ml-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-44">
              {item.MenuItems.map((subItem) => (
                <button
                  key={subItem.id}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  {subItem.icon && <subItem.icon size={16} />}
                  <span>{subItem.label}</span>
                  {subItem.shortcut && (
                    <span className="ml-auto text-xs text-gray-500">{subItem.shortcut}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


  const ExportMenuItems = [
  { id: 'export-1', label: 'PNG', icon: Download, shortcut: 'Ctrl+Shift+P' },
  { id: 'export-2', label: 'JPEG', icon: Download, shortcut: 'Ctrl+Shift+J' },
  { id: 'export-3', label: 'SVG', icon: Download, shortcut: 'Ctrl+Shift+S' },
  { id: 'export-4', label: 'PDF', icon: Download, shortcut: 'Ctrl+Shift+D' },
  { id: 'export-5', label: 'XML', icon: Download, shortcut: 'Ctrl+Shift+X' },
];

const fileMenuItems = [
  { id: 'file-1', label: 'New', icon: File, shortcut: 'Ctrl+N' },
  { id: 'file-2', label: 'Open...', icon: File, shortcut: 'ctrl+O' },
  { id: 'file-separator-1', separator: true },
  { id: 'file-3', label: 'Save', icon: Save, shortcut: 'Ctrl+S' },
  { id: 'file-4', label: 'Save as...', shortcut: 'Ctrl+Shift+S' },
  { id: 'file-5', label: 'Rename...', shortcut: 'F2' },
  { id: 'file-separator-2', separator: true },
  { id: 'file-6', label: 'Import from...', icon: Download },
  { id: 'file-7', label: 'Export as...', icon: Download, MenuItems: ExportMenuItems },
  { id: 'file-separator-3', separator: true },
  { id: 'file-8', label: 'Share...', icon: Share2 },
  { id: 'file-9', label: 'Publish...', icon: Share2 },
  { id: 'file-separator-4', separator: true },
  { id: 'file-10', label: 'Page setup...', icon: Settings },
  { id: 'file-11', label: 'Print...', shortcut: 'Ctrl+P' },
];

const editMenuItems = [
  { id: 'edit-1', label: 'Undo', icon: Undo, shortcut: 'Ctrl+Z' },
  { id: 'edit-2', label: 'Redo', icon: Redo, shortcut: 'Ctrl+Y' },
  { id: 'edit-separator-1', separator: true },
  { id: 'edit-3', label: 'Cut', icon: Scissors, shortcut: 'Ctrl+X' },
  { id: 'edit-4', label: 'Copy', icon: Copy, shortcut: 'Ctrl+C' },
  { id: 'edit-5', label: 'Paste', icon: ClipboardPaste, shortcut: 'Ctrl+V' },
  { id: 'edit-separator-2', separator: true },
  { id: 'edit-6', label: 'Select all', shortcut: 'Ctrl+A' },
  { id: 'edit-7', label: 'Select none', shortcut: 'Ctrl+Shift+A' },
  { id: 'edit-separator-3', separator: true },
  { id: 'edit-8', label: 'Find...', icon: Search, shortcut: 'Ctrl+F' },
];

const viewMenuItems = [
  { id: 'view-1', label: 'Zoom in', icon: ZoomIn, shortcut: 'Ctrl++' },
  { id: 'view-2', label: 'Zoom out', icon: ZoomOut, shortcut: 'Ctrl+-' },
  { id: 'view-3', label: 'Actual size', shortcut: 'Ctrl+0' },
  { id: 'view-4', label: 'Fit page', icon: Maximize, shortcut: 'Ctrl+Shift+H' },
  { id: 'view-5', label: 'Fit width', shortcut: 'Ctrl+Shift+W' },
  { id: 'view-separator-1', separator: true },
  { id: 'view-6', label: 'Grid', icon: Grid3X3, shortcut: 'Ctrl+Shift+G' },
  { id: 'view-7', label: 'Page view', shortcut: 'Ctrl+Shift+P' },
  { id: 'view-separator-2', separator: true },
  { id: 'view-8', label: 'Layers', icon: Layers, shortcut: 'Ctrl+Shift+L' },
  { id: 'view-9', label: 'Outline', shortcut: 'Ctrl+Shift+O' },
];


  return (
    <div className="bg-white border-b border-gray-200 relative">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 h-14">
        {/* Left Section - Logo and File Name */}
        <div className="flex items-center gap-4">
          {/* Draw.io Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">d</span>
            </div>
            <span className="font-semibold text-gray-800 hidden sm:block">draw.io</span>
          </div>
          
          {/* File Name */}
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
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
            <span className="text-xs text-gray-500 hidden md:block">Saved to Device</span>
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 hidden sm:block">
            Share
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="flex items-center px-4 py-1 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-1">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('file')}
              className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center gap-1"
            >
              File
              <ChevronDown size={14} />
            </button>
            <DropdownMenu 
              items={fileMenuItems} 
              isOpen={activeDropdown === 'file'} 
            />
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('edit')}
              className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center gap-1"
            >
              Edit
              <ChevronDown size={14} />
            </button>
            <DropdownMenu 
              items={editMenuItems} 
              isOpen={activeDropdown === 'edit'} 
            />
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('view')}
              className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center gap-1"
            >
              View
              <ChevronDown size={14} />
            </button>
            <DropdownMenu 
              items={viewMenuItems} 
              isOpen={activeDropdown === 'view'} 
            />
          </div>

          {/* Arrange Menu */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('arrange')}
              className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center gap-1"
            >
              Arrange
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Extras Menu */}
          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('extras')}
              className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center gap-1"
            >
              Extras
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => handleDropdownToggle('help')}
              className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded flex items-center gap-1"
            >
              Help
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Undo">
            <Undo size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Redo">
            <Redo size={16} />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Zoom out">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs px-2 min-w-12 text-center">100%</span>
          <button className="p-1.5 hover:bg-gray-200 rounded" title="Zoom in">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default Header;