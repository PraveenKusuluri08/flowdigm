import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, 
  Download, 
  FileText, 
  Image, 
  File, 
  X, 
  FolderOpen,
  Settings,
  Check,
  AlertCircle
} from 'lucide-react';
import { ArchPlotFileFormat } from '../utils/archplotFileFormat';
import { exportCanvas } from '../utils/importExportUtils';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filename: string, format: string, options?: any) => Promise<void>;
  currentNodes: any[];
  currentEdges: any[];
  currentFilename?: string;
}

interface SaveFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  icon: React.ReactNode;
  category: 'native' | 'image' | 'document' | 'web';
  options?: any;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  currentNodes,
  currentEdges,
  currentFilename = 'Untitled Diagram'
}) => {
  const [filename, setFilename] = useState(currentFilename);
  const [selectedFormat, setSelectedFormat] = useState<string>('archplot');
  const [saveOptions, setSaveOptions] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filenameInputRef = useRef<HTMLInputElement>(null);

  const saveFormats: SaveFormat[] = [
    // Native Formats
    {
      id: 'archplot',
      name: 'ArchPlot Diagram',
      extension: '.archplot',
      description: 'Native ArchPlot format with full data preservation',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      category: 'native',
      options: {
        includeMetadata: true,
        includeViewport: true,
        includeCanvasSettings: true
      }
    },
    {
      id: 'json',
      name: 'JSON Data',
      extension: '.json',
      description: 'Raw data format for integration',
      icon: <FileText className="w-5 h-5 text-green-500" />,
      category: 'native'
    },
    {
      id: 'xml',
      name: 'XML Format',
      extension: '.xml',
      description: 'Standard XML format for compatibility',
      icon: <FileText className="w-5 h-5 text-orange-500" />,
      category: 'native'
    },

    // Image Formats
    {
      id: 'png',
      name: 'PNG Image',
      extension: '.png',
      description: 'High-quality raster image',
      icon: <Image className="w-5 h-5 text-purple-500" />,
      category: 'image',
      options: {
        quality: 'high',
        background: 'white',
        scale: 1,
        includeGrid: false
      }
    },
    {
      id: 'svg',
      name: 'SVG Vector',
      extension: '.svg',
      description: 'Scalable vector graphics',
      icon: <Image className="w-5 h-5 text-red-500" />,
      category: 'image',
      options: {
        includeStyles: true,
        includeMetadata: true
      }
    },
    {
      id: 'jpg',
      name: 'JPEG Image',
      extension: '.jpg',
      description: 'Compressed image format',
      icon: <Image className="w-5 h-5 text-yellow-500" />,
      category: 'image',
      options: {
        quality: 0.9,
        background: 'white',
        scale: 1
      }
    },
    {
      id: 'webp',
      name: 'WebP Image',
      extension: '.webp',
      description: 'Modern web-optimized format',
      icon: <Image className="w-5 h-5 text-blue-400" />,
      category: 'image',
      options: {
        quality: 0.9,
        background: 'white',
        scale: 1
      }
    },

    // Document Formats
    {
      id: 'pdf',
      name: 'PDF Document',
      extension: '.pdf',
      description: 'Portable document format',
      icon: <File className="w-5 h-5 text-red-600" />,
      category: 'document',
      options: {
        pageSize: 'A4',
        orientation: 'landscape',
        includeMetadata: true
      }
    },
    {
      id: 'pptx',
      name: 'PowerPoint',
      extension: '.pptx',
      description: 'Microsoft PowerPoint presentation',
      icon: <File className="w-5 h-5 text-orange-600" />,
      category: 'document',
      options: {
        slideTitle: filename,
        includeNotes: false
      }
    },
    {
      id: 'docx',
      name: 'Word Document',
      extension: '.docx',
      description: 'Microsoft Word document',
      icon: <File className="w-5 h-5 text-blue-600" />,
      category: 'document',
      options: {
        documentTitle: filename,
        includeDescription: true
      }
    },

    // Web Formats
    {
      id: 'html',
      name: 'HTML Page',
      extension: '.html',
      description: 'Interactive web page',
      icon: <File className="w-5 h-5 text-green-600" />,
      category: 'web',
      options: {
        includeScripts: true,
        includeStyles: true,
        responsive: true
      }
    },
    {
      id: 'url',
      name: 'Share URL',
      extension: '',
      description: 'Share via URL link',
      icon: <File className="w-5 h-5 text-purple-600" />,
      category: 'web',
      options: {
        public: false,
        expires: 'never'
      }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setFilename(currentFilename);
      setError('');
      loadRecentFiles();
      // Focus filename input
      setTimeout(() => {
        filenameInputRef.current?.focus();
        filenameInputRef.current?.select();
      }, 100);
    }
  }, [isOpen, currentFilename]);

  // Update filename when format changes
  useEffect(() => {
    const format = saveFormats.find(f => f.id === selectedFormat);
    if (format && format.extension) {
      // Remove any existing extension and add the new one
      const baseName = filename.replace(/\.[^/.]+$/, '');
      setFilename(baseName + format.extension);
    }
  }, [selectedFormat]);

  const loadRecentFiles = () => {
    try {
      const recent = localStorage.getItem('archplot_recent_files');
      if (recent) {
        setRecentFiles(JSON.parse(recent).slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load recent files:', error);
    }
  };

  const handleSave = async () => {
    if (!filename.trim()) {
      setError('Please enter a filename');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const selectedFormatData = saveFormats.find(f => f.id === selectedFormat);
      if (!selectedFormatData) {
        throw new Error('Invalid format selected');
      }

      // Add extension if not present
      let finalFilename = filename;
      if (selectedFormatData.extension && !filename.endsWith(selectedFormatData.extension)) {
        finalFilename = filename + selectedFormatData.extension;
      }

      // Merge format options with user options
      const options = {
        ...selectedFormatData.options,
        ...saveOptions
      };

      await onSave(finalFilename, selectedFormat, options);
      
      // Add to recent files
      addToRecentFiles(finalFilename);
      
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const addToRecentFiles = (filename: string) => {
    try {
      const recent = localStorage.getItem('archplot_recent_files');
      const recentFiles = recent ? JSON.parse(recent) : [];
      const updatedFiles = [filename, ...recentFiles.filter((f: string) => f !== filename)].slice(0, 10);
      localStorage.setItem('archplot_recent_files', JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Failed to save recent files:', error);
    }
  };

  const handleFormatChange = (formatId: string) => {
    setSelectedFormat(formatId);
    const format = saveFormats.find(f => f.id === formatId);
    if (format?.options) {
      setSaveOptions(format.options);
    }
    
    // Update filename with new extension
    if (format && format.extension) {
      const baseName = filename.replace(/\.[^/.]+$/, '');
      setFilename(baseName + format.extension);
    }
  };

  const getFormatOptions = () => {
    const format = saveFormats.find(f => f.id === selectedFormat);
    if (!format) return null;

    switch (format.id) {
      case 'png':
      case 'jpg':
      case 'webp':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-base font-black text-gray-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3"></div>
                Quality
              </label>
              <select
                value={saveOptions.quality || 'high'}
                onChange={(e) => setSaveOptions({...saveOptions, quality: e.target.value})}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <option value="low">Low Quality</option>
                <option value="medium">Medium Quality</option>
                <option value="high">High Quality</option>
                <option value="ultra">Ultra High Quality</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-black text-gray-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3"></div>
                Background
              </label>
              <select
                value={saveOptions.background || 'white'}
                onChange={(e) => setSaveOptions({...saveOptions, background: e.target.value})}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <option value="white">White Background</option>
                <option value="transparent">Transparent Background</option>
                <option value="black">Black Background</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-black text-gray-800 mb-3 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mr-3"></div>
                Scale Factor
              </label>
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={saveOptions.scale || 1}
                onChange={(e) => setSaveOptions({...saveOptions, scale: parseFloat(e.target.value)})}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
                placeholder="1.0"
              />
            </div>
          </div>
        );

      case 'pdf':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Page Size
              </label>
              <select
                value={saveOptions.pageSize || 'A4'}
                onChange={(e) => setSaveOptions({...saveOptions, pageSize: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="A4">A4 (210 × 297 mm)</option>
                <option value="A3">A3 (297 × 420 mm)</option>
                <option value="Letter">Letter (8.5 × 11 in)</option>
                <option value="Legal">Legal (8.5 × 14 in)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Orientation
              </label>
              <select
                value={saveOptions.orientation || 'landscape'}
                onChange={(e) => setSaveOptions({...saveOptions, orientation: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="portrait">Portrait (Tall)</option>
                <option value="landscape">Landscape (Wide)</option>
              </select>
            </div>
          </div>
        );

      case 'archplot':
        return (
          <div className="space-y-6">
            <div className="flex items-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <input
                type="checkbox"
                id="includeMetadata"
                checked={saveOptions.includeMetadata !== false}
                onChange={(e) => setSaveOptions({...saveOptions, includeMetadata: e.target.checked})}
                className="mr-4 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500/20"
              />
              <label htmlFor="includeMetadata" className="text-base font-bold text-gray-800">
                Include metadata (author, tags, etc.)
              </label>
            </div>
            <div className="flex items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <input
                type="checkbox"
                id="includeViewport"
                checked={saveOptions.includeViewport !== false}
                onChange={(e) => setSaveOptions({...saveOptions, includeViewport: e.target.checked})}
                className="mr-4 w-5 h-5 text-green-600 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-500/20"
              />
              <label htmlFor="includeViewport" className="text-base font-bold text-gray-800">
                Include viewport state (zoom, pan)
              </label>
            </div>
            <div className="flex items-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <input
                type="checkbox"
                id="includeCanvasSettings"
                checked={saveOptions.includeCanvasSettings !== false}
                onChange={(e) => setSaveOptions({...saveOptions, includeCanvasSettings: e.target.checked})}
                className="mr-4 w-5 h-5 text-purple-600 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-purple-500/20"
              />
              <label htmlFor="includeCanvasSettings" className="text-base font-bold text-gray-800">
                Include canvas settings (grid, background)
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getCategoryFormats = (category: string) => {
    return saveFormats.filter(f => f.category === category);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12"></div>
          
          <div className="flex items-center space-x-4 relative z-10">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
              <Save className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white drop-shadow-lg">Save As</h2>
              <p className="text-blue-100 font-medium">Choose format and save your diagram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 text-white hover:text-white/80 backdrop-blur-sm border border-white/20 hover:border-white/40"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[700px]">
          {/* Left Panel - Format Selection */}
          <div className="w-1/2 border-r border-white/20 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-blue-50/30">
            <div className="p-8">
              {/* Filename */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse"></div>
                  Filename
                </label>
                <div className="relative group">
                  <input
                    ref={filenameInputRef}
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg group-hover:shadow-xl group-hover:border-blue-300"
                    placeholder="Enter filename"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium bg-white/80 px-3 py-1 rounded-lg border border-gray-200">
                    {saveFormats.find(f => f.id === selectedFormat)?.extension}
                  </div>
                </div>
              </div>

              {/* Recent Files */}
              {recentFiles.length > 0 && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-800 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-3 animate-pulse"></div>
                    Recent Files
                  </label>
                  <div className="space-y-3">
                    {recentFiles.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => setFilename(file)}
                        className="w-full text-left px-5 py-4 text-sm text-gray-700 hover:bg-white/90 hover:shadow-xl rounded-2xl flex items-center space-x-4 transition-all duration-300 border-2 border-transparent hover:border-blue-200 hover:scale-[1.02] group"
                      >
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-md">
                          <FolderOpen className="w-5 h-5 text-blue-700" />
                        </div>
                        <span className="truncate font-semibold group-hover:text-blue-700 transition-colors duration-300">{file}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Format Categories */}
              <div className="space-y-10">
                {/* Native Formats */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4 shadow-lg"></div>
                    Native Formats
                  </h3>
                  <div className="space-y-4">
                    {getCategoryFormats('native').map((format) => (
                      <button
                        key={format.id}
                        onClick={() => handleFormatChange(format.id)}
                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group ${
                          selectedFormat === format.id
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl scale-[1.02]'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 hover:shadow-lg hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                            selectedFormat === format.id 
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/25' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-purple-100'
                          }`}>
                            {React.cloneElement(format.icon as React.ReactElement, { 
                              className: `w-6 h-6 ${selectedFormat === format.id ? 'text-white' : 'text-gray-600'}` 
                            })}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-lg">{format.name}</div>
                            <div className="text-sm text-gray-600 font-medium">{format.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Formats */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mr-4 shadow-lg"></div>
                    Image Formats
                  </h3>
                  <div className="space-y-4">
                    {getCategoryFormats('image').map((format) => (
                      <button
                        key={format.id}
                        onClick={() => handleFormatChange(format.id)}
                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group ${
                          selectedFormat === format.id
                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-xl scale-[1.02]'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 hover:shadow-lg hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                            selectedFormat === format.id 
                              ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/25' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-purple-100 group-hover:to-pink-100'
                          }`}>
                            {React.cloneElement(format.icon as React.ReactElement, { 
                              className: `w-6 h-6 ${selectedFormat === format.id ? 'text-white' : 'text-gray-600'}` 
                            })}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-lg">{format.name}</div>
                            <div className="text-sm text-gray-600 font-medium">{format.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Formats */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mr-4 shadow-lg"></div>
                    Document Formats
                  </h3>
                  <div className="space-y-4">
                    {getCategoryFormats('document').map((format) => (
                      <button
                        key={format.id}
                        onClick={() => handleFormatChange(format.id)}
                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group ${
                          selectedFormat === format.id
                            ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-xl scale-[1.02]'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 hover:shadow-lg hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                            selectedFormat === format.id 
                              ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/25' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-orange-100 group-hover:to-red-100'
                          }`}>
                            {React.cloneElement(format.icon as React.ReactElement, { 
                              className: `w-6 h-6 ${selectedFormat === format.id ? 'text-white' : 'text-gray-600'}` 
                            })}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-lg">{format.name}</div>
                            <div className="text-sm text-gray-600 font-medium">{format.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Web Formats */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-4 shadow-lg"></div>
                    Web Formats
                  </h3>
                  <div className="space-y-4">
                    {getCategoryFormats('web').map((format) => (
                      <button
                        key={format.id}
                        onClick={() => handleFormatChange(format.id)}
                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group ${
                          selectedFormat === format.id
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl scale-[1.02]'
                            : 'border-gray-200 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 hover:shadow-lg hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-center space-x-5">
                          <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                            selectedFormat === format.id 
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/25' 
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-green-100 group-hover:to-emerald-100'
                          }`}>
                            {React.cloneElement(format.icon as React.ReactElement, { 
                              className: `w-6 h-6 ${selectedFormat === format.id ? 'text-white' : 'text-gray-600'}` 
                            })}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-lg">{format.name}</div>
                            <div className="text-sm text-gray-600 font-medium">{format.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Options and Preview */}
          <div className="w-1/2 flex flex-col bg-gradient-to-br from-white to-gray-50/50">
            <div className="p-8 flex-1 overflow-y-auto">
              {/* Selected Format Info */}
              <div className="mb-10">
                <div className="flex items-center space-x-5 mb-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    {React.cloneElement(saveFormats.find(f => f.id === selectedFormat)?.icon as React.ReactElement, { 
                      className: 'w-7 h-7 text-white' 
                    })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">
                      {saveFormats.find(f => f.id === selectedFormat)?.name}
                    </h3>
                    <p className="text-base text-gray-600 font-medium">
                      {saveFormats.find(f => f.id === selectedFormat)?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Format Options */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-black text-gray-900 flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 animate-pulse"></div>
                    Options
                  </h4>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center space-x-3 px-5 py-3 text-sm font-bold text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200"
                  >
                    <Settings className="w-5 h-5" />
                    <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
                  </button>
                </div>
                
                {showAdvanced && (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8 border-2 border-gray-100 shadow-lg">
                    {getFormatOptions()}
                  </div>
                )}
              </div>

              {/* Content Preview */}
              <div>
                <h4 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 animate-pulse"></div>
                  Content Preview
                </h4>
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100 shadow-xl">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                      <div className="font-black text-blue-600 mb-2 text-lg">Nodes</div>
                      <div className="text-4xl font-black text-gray-900">{currentNodes.length}</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                      <div className="font-black text-green-600 mb-2 text-lg">Edges</div>
                      <div className="text-4xl font-black text-gray-900">{currentEdges.length}</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                      <div className="font-black text-purple-600 mb-2 text-lg">Format</div>
                      <div className="text-2xl font-black text-gray-900">{saveFormats.find(f => f.id === selectedFormat)?.extension || 'None'}</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                      <div className="font-black text-orange-600 mb-2 text-lg">File Size</div>
                      <div className="text-2xl font-black text-gray-900">~{(currentNodes.length + currentEdges.length) * 0.5}KB</div>
                    </div>
                  </div>
                  <div className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                    <div className="font-black text-gray-800 mb-2 text-lg">Filename</div>
                    <div className="text-lg text-gray-700 font-mono bg-gray-100 px-4 py-2 rounded-xl">{filename}</div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-8 p-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl shadow-md">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="font-black text-red-800 text-lg">Error</div>
                      <div className="text-base text-red-700 font-medium">{error}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-700 font-medium">
                  <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/50 shadow-md">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                    <span className="font-bold">{currentNodes.length} nodes</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/50 shadow-md">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
                    <span className="font-bold">{currentEdges.length} edges</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={onClose}
                    className="px-8 py-4 text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-white/80 hover:border-gray-300 hover:shadow-lg transition-all duration-300 font-bold backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !filename.trim()}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-4 font-black shadow-2xl hover:shadow-3xl hover:scale-105"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6" />
                        <span>Save File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveDialog;
