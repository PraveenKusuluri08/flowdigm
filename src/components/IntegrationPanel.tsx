import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  Zap,
  Settings,
  X,
  Cloud,
  HardDrive,
  Search,
  FolderOpen,
  ExternalLink,
  User,
  Shield,
  Edit,
  Eye
} from 'lucide-react';
import type { DiagramData, SyncResult, SyncConflict } from '../utils/bidirectionalIntegration';
import { syncWithPlatform, INTEGRATION_PLATFORMS } from '../utils/bidirectionalIntegration';
import { importDiagramFile, exportDiagramFile } from '../utils/fileHandlers';
import type { CloudFile, PlatformConnection } from '../utils/cloudConnectors';
import { 
  connectToPlatform, 
  listCloudFiles, 
  downloadCloudFile 
} from '../utils/cloudConnectors';
import { RealTimeEditSync } from '../utils/realTimeEditSync';
import { userAuthSync, type UserSyncProfile } from '../utils/userAuthSync';
import UserAuthPanel from './UserAuthPanel';

interface IntegrationPanelProps {
  currentDiagram?: DiagramData | null;
  onDiagramImport: (diagram: DiagramData) => void;
  onDiagramUpdate: (diagram: DiagramData) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface SyncStatus {
  platform: string;
  status: 'idle' | 'syncing' | 'success' | 'error';
  lastSync?: Date;
  error?: string;
}

const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  currentDiagram,
  onDiagramImport,
  isVisible,
  onClose
}) => {
  // User authentication state
  const [userProfile, setUserProfile] = useState<UserSyncProfile | null>(userAuthSync.getUserProfile());
  const [userPlatformConnections, setUserPlatformConnections] = useState(userAuthSync.getPlatformConnections());

    const [activeTab, setActiveTab] = useState<'import' | 'export' | 'sync' | 'edit' | 'auth'>('import');
  const [syncStatuses, setSyncStatuses] = useState<Record<string, SyncStatus>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [syncConflicts, setSyncConflicts] = useState<SyncConflict[]>([]);
  const [autoSync, setAutoSync] = useState(false);
  
  // Cloud integration state
  const [importSource, setImportSource] = useState<'local' | 'cloud'>('local');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [platformConnections, setPlatformConnections] = useState<Record<string, PlatformConnection>>({});
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time editing state
  const [editSync] = useState(() => new RealTimeEditSync());
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Platform connection handling
  const handlePlatformConnect = useCallback(async (platform: string) => {
    setIsProcessing(true);
    try {
      const connection = await connectToPlatform(platform);
      setPlatformConnections(prev => ({
        ...prev,
        [platform]: connection
      }));
      
      // Load files from the connected platform
      if (connection.isConnected) {
        await loadCloudFiles(platform);
      }
    } catch (error) {
      console.error('Platform connection failed:', error);
      setSyncStatuses(prev => ({
        ...prev,
        [platform]: {
          platform,
          status: 'error',
          error: error instanceof Error ? error.message : 'Connection failed'
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Load files from cloud platform
  const loadCloudFiles = useCallback(async (platform: string) => {
    setIsLoadingFiles(true);
    try {
      const files = await listCloudFiles(platform);
      setCloudFiles(files);
    } catch (error) {
      console.error('Failed to load cloud files:', error);
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  // Cloud file import handling
  const handleCloudFileImport = useCallback(async (file: CloudFile) => {
    setIsProcessing(true);
    try {
      const blob = await downloadCloudFile(file.platform, file.id);
      
      // Convert blob to File object for existing import handler
      const fileObj = new File([blob], file.name, { 
        type: blob.type || 'application/octet-stream' 
      });
      
      const diagram = await importDiagramFile(fileObj);
      onDiagramImport(diagram);
      
      setSyncStatuses(prev => ({
        ...prev,
        [file.platform]: {
          platform: file.platform,
          status: 'success',
          lastSync: new Date()
        }
      }));
      
      console.log('Selected cloud file:', file.name);
    } catch (error) {
      console.error('Cloud import failed:', error);
      setSyncStatuses(prev => ({
        ...prev,
        [file.platform]: {
          platform: file.platform,
          status: 'error',
          error: error instanceof Error ? error.message : 'Cloud import failed'
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  }, [onDiagramImport]);

  // Filter cloud files based on search
  const filteredCloudFiles = cloudFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const diagram = await importDiagramFile(file);
      onDiagramImport(diagram);
      
      // Update sync status
      setSyncStatuses(prev => ({
        ...prev,
        [diagram.platform]: {
          platform: diagram.platform,
          status: 'success',
          lastSync: new Date()
        }
      }));
    } catch (error) {
      console.error('Import failed:', error);
      setSyncStatuses(prev => ({
        ...prev,
        generic: {
          platform: 'generic',
          status: 'error',
          error: error instanceof Error ? error.message : 'Import failed'
        }
      }));
    } finally {
      setIsProcessing(false);
      // Clear the input
      event.target.value = '';
    }
  }, [onDiagramImport]);

  // File export handling
  const handleFileExport = useCallback(async (format: string) => {
    if (!currentDiagram) return;

    setIsProcessing(true);
    try {
      const blob = await exportDiagramFile(currentDiagram, format);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDiagram.name}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSyncStatuses(prev => ({
        ...prev,
        [format]: {
          platform: format,
          status: 'success',
          lastSync: new Date()
        }
      }));
    } catch (error) {
      console.error('Export failed:', error);
      setSyncStatuses(prev => ({
        ...prev,
        [format]: {
          platform: format,
          status: 'error',
          error: error instanceof Error ? error.message : 'Export failed'
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  }, [currentDiagram]);

  // Platform sync handling
  const handlePlatformSync = useCallback(async (platform: string) => {
    if (!currentDiagram) return;

    setSyncStatuses(prev => ({
      ...prev,
      [platform]: {
        platform,
        status: 'syncing'
      }
    }));

    try {
      const result: SyncResult = await syncWithPlatform(currentDiagram, platform);
      
      if (result.success) {
        setSyncStatuses(prev => ({
          ...prev,
          [platform]: {
            platform,
            status: 'success',
            lastSync: result.timestamp
          }
        }));

        if (result.conflicts.length > 0) {
          setSyncConflicts(result.conflicts);
        }
      } else {
        setSyncStatuses(prev => ({
          ...prev,
          [platform]: {
            platform,
            status: 'error',
            error: result.errors.join(', ')
          }
        }));
      }
    } catch (error) {
      setSyncStatuses(prev => ({
        ...prev,
        [platform]: {
          platform,
          status: 'error',
          error: error instanceof Error ? error.message : 'Sync failed'
        }
      }));
    }
  }, [currentDiagram]);

  // Real-time editing functions
  const handleEditInPlatform = useCallback(async (platform: string) => {
    if (!currentDiagram) return;

    setIsProcessing(true);
    try {
      // Log detailed shape information for debugging
      console.log('Starting edit session for diagram:', currentDiagram.id, 'on platform:', platform);
      console.log('Diagram contains shapes:', currentDiagram.nodes.map(node => ({
        id: node.id,
        shapeId: node.data.shapeId,
        label: node.data.label,
        position: node.position
      })));

      // Start edit session
      const session = await editSync.startEditSession(currentDiagram, platform, 'current-user');      // Update active sessions
      setActiveSessions(prev => [...prev, session]);
      
      // Start monitoring if not already active
      if (!isMonitoring) {
        setIsMonitoring(true);
        editSync.startMonitoring();
      }
      
      // Open edit URL in new tab
      if (session.editableUrl) {
        window.open(session.editableUrl, '_blank');
      }
      
      setSyncStatuses(prev => ({
        ...prev,
        [platform]: {
          platform,
          status: 'success',
          lastSync: new Date()
        }
      }));
    } catch (error) {
      console.error('Failed to start edit session:', error);
      setSyncStatuses(prev => ({
        ...prev,
        [platform]: {
          platform,
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to start edit session'
        }
      }));
    } finally {
      setIsProcessing(false);
    }
  }, [currentDiagram, editSync, isMonitoring]);

  const handleStopMonitoring = useCallback(() => {
    editSync.stopMonitoring();
    setIsMonitoring(false);
    setActiveSessions([]);
  }, [editSync]);

  // User authentication handler
  const handleUserAuthenticated = useCallback((profile: UserSyncProfile) => {
    setUserProfile(profile);
    // Update platform connections from the authenticated user
    const connections = userAuthSync.getPlatformConnections();
    setUserPlatformConnections(new Map(Object.entries(connections)));
  }, []);

  // Render status icon
  const renderStatusIcon = (status: SyncStatus['status']) => {
    switch (status) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">Bidirectional Integration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'import', label: 'Import', icon: Upload },
            { id: 'export', label: 'Export', icon: Download },
            { id: 'sync', label: 'Sync', icon: RefreshCw },
            { id: 'edit', label: 'Edit', icon: Edit },
            { id: 'auth', label: userProfile ? 'Account' : 'Sign In', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'auth' && userProfile && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Import Diagram</h3>
                <p className="text-gray-600 mb-6">
                  Import diagrams from your local computer or directly from cloud platforms like Visio, Lucidchart, and Draw.io.
                </p>
              </div>

              {/* Import Source Selector */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setImportSource('local')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ${
                    importSource === 'local'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <HardDrive className="w-4 h-4" />
                  Local Files
                </button>
                <button
                  onClick={() => setImportSource('cloud')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ${
                    importSource === 'cloud'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Cloud className="w-4 h-4" />
                  Cloud Platforms
                </button>
              </div>

              {/* Local File Import */}
              {importSource === 'local' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop a file here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supported formats: .vsdx, .vsd, .xml, .drawio, .json
                  </p>
                  <input
                    type="file"
                    accept=".vsdx,.vsd,.xml,.drawio,.json"
                    onChange={handleFileImport}
                    disabled={isProcessing}
                    className="hidden"
                    id="file-import"
                  />
                  <label
                    htmlFor="file-import"
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer ${
                      isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </label>
                </div>
              )}

              {/* Cloud Platform Import */}
              {importSource === 'cloud' && (
                <div className="space-y-4">
                  {/* Platform Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Platform
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {INTEGRATION_PLATFORMS.map(platform => {
                        const isConnected = platformConnections[platform.id]?.isConnected;
                        const connection = platformConnections[platform.id];
                        
                        return (
                          <button
                            key={platform.id}
                            onClick={() => {
                              if (isConnected) {
                                setSelectedPlatform(platform.id);
                                loadCloudFiles(platform.id);
                              } else {
                                handlePlatformConnect(platform.id);
                              }
                            }}
                            disabled={isProcessing}
                            className={`p-4 border rounded-lg text-left transition-colors ${
                              selectedPlatform === platform.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                platform.id === 'visio' ? 'bg-blue-100' :
                                platform.id === 'lucidchart' ? 'bg-orange-100' :
                                'bg-red-100'
                              }`}>
                                <Zap className={`w-4 h-4 ${
                                  platform.id === 'visio' ? 'text-blue-600' :
                                  platform.id === 'lucidchart' ? 'text-orange-600' :
                                  'text-red-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{platform.name}</div>
                                <div className="text-xs text-gray-500">
                                  {platform.supportedFormats.join(', ')}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {isConnected ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <User className="w-3 h-3 text-gray-400" />
                                  </>
                                ) : (
                                  <Shield className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                            
                            {isConnected && connection?.accountInfo && (
                              <div className="text-xs text-gray-600">
                                Connected as {connection.accountInfo.displayName}
                              </div>
                            )}
                            
                            <div className="text-xs text-blue-600 mt-1">
                              {isConnected ? 'Browse Files' : 'Connect Account'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* File Browser */}
                  {selectedPlatform && platformConnections[selectedPlatform]?.isConnected && (
                    <div className="border border-gray-200 rounded-lg">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-3">
                          <FolderOpen className="w-5 h-5 text-gray-500" />
                          <span className="font-medium text-gray-800">
                            {INTEGRATION_PLATFORMS.find(p => p.id === selectedPlatform)?.name} Files
                          </span>
                          <button
                            onClick={() => loadCloudFiles(selectedPlatform)}
                            disabled={isLoadingFiles}
                            className="ml-auto p-1 text-gray-500 hover:text-gray-700"
                          >
                            <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                        
                        {/* Search */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto">
                        {isLoadingFiles ? (
                          <div className="p-8 text-center">
                            <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Loading files...</p>
                          </div>
                        ) : filteredCloudFiles.length === 0 ? (
                          <div className="p-8 text-center">
                            <FileText className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">
                              {searchQuery ? 'No files match your search' : 'No files found'}
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-200">
                            {filteredCloudFiles.map(file => (
                              <button
                                key={file.id}
                                onClick={() => handleCloudFileImport(file)}
                                disabled={isProcessing}
                                className="w-full p-4 text-left hover:bg-gray-50 transition-colors disabled:opacity-50"
                              >
                                <div className="flex items-center gap-3">
                                  {file.thumbnailUrl ? (
                                    <img 
                                      src={file.thumbnailUrl} 
                                      alt={file.name}
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                      <FileText className="w-5 h-5 text-gray-500" />
                                    </div>
                                  )}
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-800 truncate">
                                      {file.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {new Date(file.lastModified).toLocaleDateString()} • {(file.size / 1024).toFixed(1)} KB
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {file.permissions.write && (
                                      <div title="Write access">
                                        <Shield className="w-4 h-4 text-green-500" />
                                      </div>
                                    )}
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Platform Status Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INTEGRATION_PLATFORMS.map(platform => (
                  <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">{platform.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Supported: {platform.supportedFormats.join(', ')}
                    </p>
                    <div className="flex items-center gap-2">
                      {renderStatusIcon(syncStatuses[platform.id]?.status || 'idle')}
                      <span className="text-sm text-gray-600">
                        {syncStatuses[platform.id]?.lastSync 
                          ? `Last: ${syncStatuses[platform.id]?.lastSync?.toLocaleString()}`
                          : 'Never synced'
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Export Diagram</h3>
                <p className="text-gray-600 mb-6">
                  Export your diagram to various formats for use in other applications.
                </p>
              </div>

              {!currentDiagram ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No diagram available to export</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { format: 'vsdx', name: 'Visio (VSDX)', icon: FileText },
                    { format: 'json', name: 'Lucidchart (JSON)', icon: FileText },
                    { format: 'drawio', name: 'Draw.io (XML)', icon: FileText },
                    { format: 'xml', name: 'Generic XML', icon: FileText }
                  ].map(exportOption => {
                    const Icon = exportOption.icon;
                    const status = syncStatuses[exportOption.format];
                    
                    return (
                      <button
                        key={exportOption.format}
                        onClick={() => handleFileExport(exportOption.format)}
                        disabled={isProcessing}
                        className={`p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left ${
                          isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-blue-500" />
                          <span className="font-medium text-gray-800">{exportOption.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStatusIcon(status?.status || 'idle')}
                          <span className="text-sm text-gray-600">
                            {status?.lastSync ? `Exported: ${status.lastSync.toLocaleString()}` : 'Not exported'}
                          </span>
                        </div>
                        {status?.error && (
                          <p className="text-sm text-red-600 mt-1">{status.error}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Platform Synchronization</h3>
                  <p className="text-gray-600">
                    Keep your diagrams synchronized across different platforms.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="rounded"
                    />
                    Auto-sync
                  </label>
                </div>
              </div>

              {!currentDiagram ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No diagram available to sync</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {INTEGRATION_PLATFORMS.map(platform => {
                    const status = syncStatuses[platform.id];
                    
                    return (
                      <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Zap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{platform.name}</h4>
                              <p className="text-sm text-gray-600">
                                {platform.apiEndpoint ? 'API Integration' : 'File-based'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handlePlatformSync(platform.id)}
                            disabled={isProcessing || status?.status === 'syncing'}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                              status?.status === 'syncing'
                                ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                          >
                            <RefreshCw className={`w-4 h-4 ${status?.status === 'syncing' ? 'animate-spin' : ''}`} />
                            {status?.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          {renderStatusIcon(status?.status || 'idle')}
                          <span className="text-gray-600">
                            {status?.lastSync 
                              ? `Last sync: ${status.lastSync.toLocaleString()}`
                              : 'Never synced'
                            }
                          </span>
                        </div>
                        
                        {status?.error && (
                          <p className="text-sm text-red-600 mt-2">{status.error}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Conflict Resolution */}
              {syncConflicts.length > 0 && (
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h4 className="font-medium text-orange-800 mb-3">Sync Conflicts Detected</h4>
                  <div className="space-y-2">
                    {syncConflicts.map((conflict, index) => (
                      <div key={index} className="text-sm text-orange-700">
                        <p>
                          <strong>{conflict.elementType}</strong> ({conflict.elementId}) has conflicts from {conflict.platform}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">External Platform Editing</h3>
                  <p className="text-gray-600">
                    Edit your diagrams directly in external platforms with real-time sync.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Active Sessions: {activeSessions.length}
                  </span>
                </div>
              </div>

              {!currentDiagram ? (
                <div className="text-center py-8">
                  <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No diagram available to edit</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {INTEGRATION_PLATFORMS.map(platform => {
                    const status = syncStatuses[platform.id];
                    const isEditingSupported = ['visio', 'lucidchart', 'drawio'].includes(platform.id);

                    return (
                      <div
                        key={platform.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {platform.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{platform.name}</h4>
                              <p className="text-sm text-gray-600">
                                Edit diagrams with {currentDiagram?.nodes?.length || 0} shapes in {platform.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {renderStatusIcon(status?.status || 'idle')}
                            {/* Show platform connection status */}
                            {userProfile && Object.keys(userPlatformConnections).includes(platform.id) && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {isEditingSupported ? (
                              <button
                                onClick={() => handleEditInPlatform(platform.id)}
                                disabled={isProcessing || !userProfile || !Object.keys(userPlatformConnections).includes(platform.id)}
                                className={`px-4 py-2 rounded-md text-white text-sm flex items-center gap-2 transition-colors ${
                                  userProfile && Object.keys(userPlatformConnections).includes(platform.id)
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={
                                  !userProfile 
                                    ? 'Please sign in first'
                                    : !Object.keys(userPlatformConnections).includes(platform.id)
                                    ? `Connect to ${platform.name} in Authentication tab first`
                                    : `Edit all ${currentDiagram?.nodes?.length || 0} shapes in ${platform.name} with full bidirectional sync`
                                }
                              >
                                <Edit className="w-4 h-4" />
                                {userProfile && Object.keys(userPlatformConnections).includes(platform.id) 
                                  ? `Edit in ${platform.name}` 
                                  : 'Connect Account'}
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500">Editing not supported</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Shape compatibility info */}
                        {currentDiagram && currentDiagram.nodes && currentDiagram.nodes.length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Shape Compatibility</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">Total Shapes:</span>
                                <span className="ml-2 font-medium">{currentDiagram.nodes.length}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Editable:</span>
                                <span className="ml-2 font-medium text-green-600">
                                  {currentDiagram.nodes.filter(node => 
                                    node.data.shapeId && !node.data.shapeId.startsWith('unknown')
                                  ).length}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Shape Types:</span>
                                <span className="ml-2 font-medium">
                                  {new Set(currentDiagram.nodes.map(node => {
                                    const shapeId = node.data.shapeId || 'unknown';
                                    if (shapeId.startsWith('aws-')) return 'AWS';
                                    if (shapeId.startsWith('azure-')) return 'Azure';
                                    if (shapeId.startsWith('gcp-')) return 'GCP';
                                    if (shapeId.startsWith('bpmn-')) return 'BPMN';
                                    return 'Basic';
                                  })).size} categories
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Platform:</span>
                                <span className="ml-2 font-medium capitalize">{platform.id}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {status?.error && (
                          <p className="text-sm text-red-600 mt-2">{status.error}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Authentication Warning */}
              {!userProfile && (
                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Authentication Required</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">
                    Please sign in through the Authentication tab to enable external editing features and sync your diagrams across platforms.
                  </p>
                  <button
                    onClick={() => setActiveTab('auth')}
                    className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                  >
                    Go to Authentication
                  </button>
                </div>
              )}

              {/* Active Edit Sessions */}
              {activeSessions.length > 0 && (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-800">Active Edit Sessions</h4>
                    <button
                      onClick={handleStopMonitoring}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Stop All Sessions
                    </button>
                  </div>
                  <div className="space-y-2">
                    {activeSessions.map((session, index) => (
                      <div key={index} className="text-sm text-blue-700 flex items-center justify-between">
                        <span>
                          <strong>{session.platform}</strong> - Started: {session.startTime.toLocaleTimeString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            session.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {session.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {session.editableUrl && (
                            <button
                              onClick={() => window.open(session.editableUrl, '_blank')}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time Sync Status */}
              {isMonitoring && (
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-800 font-medium">
                      Real-time sync monitoring active
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Changes from external platforms will be automatically synced back to your diagram.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">User Authentication</h3>
              
              {/* Show Auth Panel based on authentication state */}
              <UserAuthPanel 
                isVisible={true}
                onClose={() => {}}
                onUserAuthenticated={handleUserAuthenticated}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;
