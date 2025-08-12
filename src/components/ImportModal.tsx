import React, { useState, useCallback, useContext } from 'react';
import { 
  Upload, 
  X, 
  Cloud, 
  HardDrive, 
  Globe,
  Github,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { CanvasContext } from '../context/CanvasEditorProvider';
import { createFileInput } from '../utils/importExportUtils';

interface ImportModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ImportSource {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  formats: string[];
  action: () => void;
  isEnabled: boolean;
  status?: 'idle' | 'loading' | 'success' | 'error';
}

const ImportModal: React.FC<ImportModalProps> = ({ isVisible, onClose }) => {
  const context = useContext(CanvasContext) as any;
  const { importFromFile } = context;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSource, setProcessingSource] = useState<string>('');
  const [importStatus, setImportStatus] = useState<Record<string, string>>({});

  // Handle local file import
  const handleLocalImport = useCallback(() => {
    setProcessingSource('device');
    setIsProcessing(true);
    
    const input = createFileInput('.json,.flowdigm,.svg,.xml,.drawio,.vsdx,.csv,.txt,.png,.jpg,.jpeg,.gif,.bmp,.webp,.pdf,.docx,.pptx,.ppt', false);
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        try {
          const ext = file.name.toLowerCase().split('.').pop();
          console.log(`🔄 Importing file: ${file.name} (${ext})`);
          
          // Use our enhanced importFile function for all formats
          await importFromFile(file);
          
          setImportStatus(prev => ({
            ...prev,
            device: `Successfully imported ${file.name}`
          }));
          
          // Auto-close modal after successful import
          setTimeout(() => {
            onClose();
          }, 1500);
          
        } catch (error) {
          console.error('Import failed:', error);
          setImportStatus(prev => ({
            ...prev,
            device: `Failed to import: ${error}`
          }));
        }
      }
      setIsProcessing(false);
      setProcessingSource('');
    };
    input.click();
  }, [importFromFile, onClose]);

  // Handle cloud service imports (placeholder functions)
  const handleGoogleDriveImport = useCallback(() => {
    setProcessingSource('googledrive');
    setIsProcessing(true);
    
    // Placeholder for Google Drive integration
    setTimeout(() => {
      setImportStatus(prev => ({
        ...prev,
        googledrive: 'Google Drive integration coming soon! Please use Device import for now.'
      }));
      setIsProcessing(false);
      setProcessingSource('');
    }, 1000);
  }, []);

  const handleOneDriveImport = useCallback(() => {
    setProcessingSource('onedrive');
    setIsProcessing(true);
    
    // Placeholder for OneDrive integration
    setTimeout(() => {
      setImportStatus(prev => ({
        ...prev,
        onedrive: 'OneDrive integration coming soon! Please use Device import for now.'
      }));
      setIsProcessing(false);
      setProcessingSource('');
    }, 1000);
  }, []);

  const handleDropboxImport = useCallback(() => {
    setProcessingSource('dropbox');
    setIsProcessing(true);
    
    // Placeholder for Dropbox integration
    setTimeout(() => {
      setImportStatus(prev => ({
        ...prev,
        dropbox: 'Dropbox integration coming soon! Please use Device import for now.'
      }));
      setIsProcessing(false);
      setProcessingSource('');
    }, 1000);
  }, []);

  const handleGitHubImport = useCallback(() => {
    setProcessingSource('github');
    setIsProcessing(true);
    
    // Placeholder for GitHub integration
    setTimeout(() => {
      setImportStatus(prev => ({
        ...prev,
        github: 'GitHub integration coming soon! Please use Device import for now.'
      }));
      setIsProcessing(false);
      setProcessingSource('');
    }, 1000);
  }, []);

  const handleGitLabImport = useCallback(() => {
    setProcessingSource('gitlab');
    setIsProcessing(true);
    
    // Placeholder for GitLab integration
    setTimeout(() => {
      setImportStatus(prev => ({
        ...prev,
        gitlab: 'GitLab integration coming soon! Please use Device import for now.'
      }));
      setIsProcessing(false);
      setProcessingSource('');
    }, 1000);
  }, []);

  const handleBrowserImport = useCallback(() => {
    setProcessingSource('browser');
    setIsProcessing(true);
    
    // Open a simple file input for browser-based import
    handleLocalImport();
  }, [handleLocalImport]);

  const handleURLImport = useCallback(() => {
    setProcessingSource('url');
    setIsProcessing(true);
    
    const url = prompt('Enter the URL of the file to import:');
    if (url) {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const fileName = url.split('/').pop() || 'imported-file';
          const file = new File([blob], fileName, { type: blob.type });
          return importFromFile(file);
        })
        .then(() => {
          setImportStatus(prev => ({
            ...prev,
            url: `Successfully imported from ${url}`
          }));
          setTimeout(() => onClose(), 1500);
        })
        .catch(error => {
          setImportStatus(prev => ({
            ...prev,
            url: `Failed to import from URL: ${error}`
          }));
        })
        .finally(() => {
          setIsProcessing(false);
          setProcessingSource('');
        });
    } else {
      setIsProcessing(false);
      setProcessingSource('');
    }
  }, [importFromFile, onClose]);

  const importSources: ImportSource[] = [
    {
      id: 'googledrive',
      name: 'Google Drive',
      icon: Cloud,
      description: 'Import from Google Drive',
      formats: ['All supported formats'],
      action: handleGoogleDriveImport,
      isEnabled: true
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: Cloud,
      description: 'Import from Microsoft OneDrive',
      formats: ['All supported formats'],
      action: handleOneDriveImport,
      isEnabled: true
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: Cloud,
      description: 'Import from Dropbox',
      formats: ['All supported formats'],
      action: handleDropboxImport,
      isEnabled: true
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      description: 'Import from GitHub repository',
      formats: ['JSON', 'SVG', 'XML', 'CSV', 'TXT'],
      action: handleGitHubImport,
      isEnabled: true
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      icon: Github,
      description: 'Import from GitLab repository',
      formats: ['JSON', 'SVG', 'XML', 'CSV', 'TXT'],
      action: handleGitLabImport,
      isEnabled: true
    },
    {
      id: 'browser',
      name: 'Browser',
      icon: Globe,
      description: 'Browse and select files',
      formats: ['All supported formats'],
      action: handleBrowserImport,
      isEnabled: true
    },
    {
      id: 'device',
      name: 'Device',
      icon: HardDrive,
      description: 'Upload from your device',
      formats: ['JSON', 'FlowDigm', 'SVG', 'XML', 'Draw.io', 'Visio', 'CSV', 'TXT', 'Images', 'Documents'],
      action: handleLocalImport,
      isEnabled: true
    },
    {
      id: 'url',
      name: 'URL',
      icon: ExternalLink,
      description: 'Import from a web URL',
      formats: ['All supported formats'],
      action: handleURLImport,
      isEnabled: true
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Import Diagram</h2>
              <p className="text-sm text-gray-600">Choose your import source and file format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Supported Formats Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">📁 Supported File Formats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
              <div><strong>Diagrams:</strong> JSON, FlowDigm, SVG, XML, Draw.io, Visio (VSDX)</div>
              <div><strong>Data:</strong> CSV (node/edge lists), TXT (flow syntax)</div>
              <div><strong>Images:</strong> PNG, JPG, JPEG, GIF, BMP, WebP</div>
              <div><strong>Documents:</strong> PDF, DOCX, PPTX, PPT</div>
            </div>
          </div>

          {/* Import Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {importSources.map(source => {
              const Icon = source.icon;
              const isCurrentlyProcessing = isProcessing && processingSource === source.id;
              const hasStatus = importStatus[source.id];
              
              return (
                <button
                  key={source.id}
                  onClick={source.action}
                  disabled={!source.isEnabled || isProcessing}
                  className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                    isCurrentlyProcessing
                      ? 'border-blue-500 bg-blue-50'
                      : hasStatus
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  } ${
                    !source.isEnabled || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCurrentlyProcessing
                        ? 'bg-blue-500'
                        : hasStatus
                        ? 'bg-green-500'
                        : 'bg-gray-100'
                    }`}>
                      {isCurrentlyProcessing ? (
                        <RefreshCw className="w-5 h-5 text-white animate-spin" />
                      ) : hasStatus ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 ${
                          source.id === 'device' ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{source.name}</h3>
                      <p className="text-sm text-gray-600">{source.description}</p>
                    </div>
                  </div>
                  
                  {/* Formats */}
                  <div className="text-xs text-gray-500 mb-2">
                    <span className="font-medium">Formats: </span>
                    {source.formats.join(', ')}
                  </div>
                  
                  {/* Status */}
                  {hasStatus && (
                    <div className={`text-xs p-2 rounded ${
                      importStatus[source.id]?.includes('Successfully') 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {importStatus[source.id]}
                    </div>
                  )}
                  
                  {/* Action Text */}
                  <div className="text-sm font-medium text-blue-600 mt-2">
                    {isCurrentlyProcessing ? 'Processing...' : 'Select Source'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cloud Integration Notice */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Cloud Integration Status</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  <strong>Device/Browser/URL imports</strong> are fully functional with all format support.
                  Cloud service integrations (Google Drive, OneDrive, Dropbox, GitHub, GitLab) are coming soon!
                  For now, you can download files from these services and use the Device import option.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">💡 Quick Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>JSON/FlowDigm:</strong> Native diagram format with full fidelity</li>
              <li>• <strong>SVG/XML:</strong> Automatically extracts shapes and converts to diagrams</li>
              <li>• <strong>CSV:</strong> Import node/edge data (supports source,target columns)</li>
              <li>• <strong>TXT:</strong> Parse flow syntax (A → B, Process1 -- Process2)</li>
              <li>• <strong>Images:</strong> Convert to diagram elements with intelligent shape detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
