import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, 
  Upload, 
  Download, 
  FileText, 
  Image, 
  X, 
  FolderOpen,
  Plus,
  Trash2,
  Clock,
  Star,
  Search
} from 'lucide-react';
import { fileManager, FlowDigmFile } from '../utils/fileManager';
import { ArchPlotFileFormat } from '../utils/archplotFileFormat';

interface FileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load' | 'import' | 'export';
  onSave?: (filename: string) => void;
  onLoad?: (file: FlowDigmFile) => void;
  onImport?: (file: File) => void;
  onExport?: (format: string, options: any) => void;
  currentNodes?: any[];
  currentEdges?: any[];
}

const FileDialog: React.FC<FileDialogProps> = ({
  isOpen,
  onClose,
  mode,
  onSave,
  onLoad,
  onImport,
  onExport,
  currentNodes = [],
  currentEdges = []
}) => {
  const [filename, setFilename] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('flowdigm');
  const [exportOptions, setExportOptions] = useState({
    quality: 100,
    scale: 2,
    backgroundColor: '#ffffff',
    includeMetadata: true
  });
  const [recentFiles, setRecentFiles] = useState<FlowDigmFile[]>([]);
  const [autoSaveFiles, setAutoSaveFiles] = useState<FlowDigmFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadRecentFiles();
      loadAutoSaveFiles();
      const currentFile = fileManager.getCurrentFile();
      if (currentFile) {
        setFilename(currentFile.name);
      }
    }
  }, [isOpen]);

  const loadRecentFiles = () => {
    const recent = localStorage.getItem('flowdigm_recent_files');
    if (recent) {
      try {
        setRecentFiles(JSON.parse(recent));
      } catch (error) {
        console.warn('Failed to load recent files');
      }
    }
  };

  const loadAutoSaveFiles = () => {
    const autoSaves: FlowDigmFile[] = [];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('flowdigm_autosave_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          if (data) {
            autoSaves.push(data);
          }
        } catch (error) {
          console.warn('Failed to load auto-save file:', key);
        }
      }
    });
    setAutoSaveFiles(autoSaves);
  };

  const addToRecentFiles = (file: FlowDigmFile) => {
    const recent = recentFiles.filter(f => f.name !== file.name);
    recent.unshift(file);
    const limited = recent.slice(0, 10);
    localStorage.setItem('flowdigm_recent_files', JSON.stringify(limited));
    setRecentFiles(limited);
  };

  const handleSave = async () => {
    if (!filename.trim()) {
      alert('Please enter a filename');
      return;
    }

    try {
      if (onSave) {
        onSave(filename);
      } else {
        await fileManager.saveAs(currentNodes, currentEdges, filename);
      }
      
      // Add to recent files
      const savedFile = fileManager.getCurrentFile();
      if (savedFile) {
        addToRecentFiles(savedFile);
      }
      
      onClose();
    } catch (error) {
      alert(`Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleLoad = async (file: FlowDigmFile) => {
    try {
      if (onLoad) {
        onLoad(file);
      }
      addToRecentFiles(file);
      onClose();
    } catch (error) {
      alert(`Load failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleImport = async (file: File) => {
    try {
      if (onImport) {
        onImport(file);
      } else {
        const format = file.name.split('.').pop()?.toLowerCase() || 'json';
        await fileManager.importFromFormat(file, format);
      }
      onClose();
    } catch (error) {
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExport = async () => {
    try {
      if (onExport) {
        onExport(selectedFormat, exportOptions);
      } else {
        await fileManager.exportToFormat(currentNodes, currentEdges, selectedFormat, exportOptions);
      }
      onClose();
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImport(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAutoSaveRecovery = async (file: FlowDigmFile) => {
    try {
      if (onLoad) {
        onLoad(file);
      }
      // Remove from auto-save after recovery
      const key = `flowdigm_autosave_${file.name}`;
      localStorage.removeItem(key);
      loadAutoSaveFiles();
      onClose();
    } catch (error) {
      alert(`Recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredRecentFiles = recentFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAutoSaveFiles = autoSaveFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {mode === 'save' && <Save className="w-6 h-6 text-blue-500" />}
            {mode === 'load' && <FolderOpen className="w-6 h-6 text-green-500" />}
            {mode === 'import' && <Upload className="w-6 h-6 text-purple-500" />}
            {mode === 'export' && <Download className="w-6 h-6 text-orange-500" />}
            <h2 className="text-xl font-semibold text-gray-800">
              {mode === 'save' && 'Save Diagram'}
              {mode === 'load' && 'Open Diagram'}
              {mode === 'import' && 'Import File'}
              {mode === 'export' && 'Export Diagram'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
          {mode === 'save' && (
            <div className="space-y-6">
              {/* Filename Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filename
                </label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter filename..."
                  autoFocus
                />
              </div>

              {/* Save Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Save Options</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeMetadata}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                      className="mr-2"
                    />
                    Include metadata
                  </label>
                </div>
              </div>

              {/* Recent Files */}
              {recentFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Files</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {recentFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => setFilename(file.name)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-gray-500">
                              Modified: {new Date(file.modified).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {file.nodes.length} nodes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Auto-save Recovery */}
              {autoSaveFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Auto-save Recovery
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {autoSaveFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-gray-500">
                              Auto-saved: {new Date(file.modified).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAutoSaveRecovery(file)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
                        >
                          Recover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'load' && (
            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Files
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search files..."
                  />
                </div>
              </div>

              {/* File List */}
              <div className="space-y-4">
                {filteredRecentFiles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Files</h3>
                    <div className="space-y-2">
                      {filteredRecentFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleLoad(file)}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-gray-500">
                                Modified: {new Date(file.modified).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {file.nodes.length} nodes, {file.edges.length} edges
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Open File Button */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Open File...</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'import' && (
            <div className="space-y-6">
              {/* Supported Formats */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Supported Formats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">ArchPlot (.archplot)</span>
                    </div>
                    <p className="text-sm text-gray-600">Native ArchPlot format</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span className="font-medium">JSON (.json)</span>
                    </div>
                    <p className="text-sm text-gray-600">Standard JSON format</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">DrawIO (.drawio, .xml)</span>
                    </div>
                    <p className="text-sm text-gray-600">DrawIO XML format</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">SVG (.svg)</span>
                    </div>
                    <p className="text-sm text-gray-600">Scalable Vector Graphics</p>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="border-t pt-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Choose File to Import...</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'export' && (
            <div className="space-y-6">
              {/* Export Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'png', label: 'PNG Image', icon: Image, color: 'text-blue-500' },
                    { value: 'svg', label: 'SVG Vector', icon: FileText, color: 'text-green-500' },
                    { value: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-red-500' },
                    { value: 'json', label: 'JSON Data', icon: FileText, color: 'text-purple-500' },
                    { value: 'drawio', label: 'DrawIO XML', icon: FileText, color: 'text-orange-500' },
                    { value: 'html', label: 'HTML Page', icon: FileText, color: 'text-indigo-500' }
                  ].map((format) => (
                    <div
                      key={format.value}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        selectedFormat === format.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedFormat(format.value)}
                    >
                      <div className="flex items-center gap-2">
                        <format.icon className={`w-5 h-5 ${format.color}`} />
                        <span className="font-medium">{format.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Export Options</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Quality</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={exportOptions.quality}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500">{exportOptions.quality}%</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Scale</label>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.5"
                      value={exportOptions.scale}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-500">{exportOptions.scale}x</div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Background Color</label>
                    <input
                      type="color"
                      value={exportOptions.backgroundColor}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeMetadata}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                      className="mr-2"
                    />
                    Include metadata
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          {mode === 'save' && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          )}
          {mode === 'export' && (
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Export
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".archplot,.json,.xml,.drawio,.svg,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default FileDialog;
