// Cloud Integration UI Component for Lucidchart and Visio
import React, { useState, useCallback } from 'react';
import { 
  Cloud, 
  Download, 
  Upload, 
  RefreshCw, 
  LogIn,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  ExternalLink,
  RotateCcw,
  X
} from 'lucide-react';
import { cloudSyncManager } from '../utils/cloudSyncManager';
import type { CloudDocument } from '../utils/cloudDocumentManager';
import type { DiagramData } from '../utils/bidirectionalIntegration';
import type { UserCredentials } from '../utils/userAuthSync';
import { OAuthCallbackHandler } from './OAuthCallbackHandler';

interface CloudIntegrationProps {
  currentDiagram?: DiagramData;
  onDiagramImported?: (diagram: DiagramData) => void;
  onDiagramExported?: (document: CloudDocument) => void;
}

interface PlatformCredentials {
  [platform: string]: UserCredentials | null;
}

interface PlatformDocuments {
  [platform: string]: CloudDocument[];
}

export const CloudIntegration: React.FC<CloudIntegrationProps> = ({
  currentDiagram,
  onDiagramImported,
  onDiagramExported
}) => {
  const [credentials, setCredentials] = useState<PlatformCredentials>({
    lucidchart: null,
    visio: null,
    drawio: null
  });
  
  const [documents, setDocuments] = useState<PlatformDocuments>({
    lucidchart: [],
    visio: [],
    drawio: []
  });
  
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showOAuthCallback, setShowOAuthCallback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const platforms = [
    {
      id: 'lucidchart',
      name: 'Lucidchart',
      icon: '📊',
      description: 'Professional diagramming and visualization',
      color: 'orange'
    },
    {
      id: 'visio',
      name: 'Microsoft Visio',
      icon: '📋',
      description: 'Enterprise diagramming and process mapping',
      color: 'blue'
    },
    {
      id: 'drawio',
      name: 'Draw.io',
      icon: '🎨',
      description: 'Free online diagram software',
      color: 'green'
    }
  ];

  // Handle OAuth callback
  const handleOAuthComplete = useCallback((success: boolean, platform?: string) => {
    setShowOAuthCallback(false);
    if (success && platform) {
      // Refresh documents for the connected platform
      loadDocuments(platform);
    }
  }, []);

  // Authenticate with a platform
  const authenticatePlatform = async (platform: string) => {
    try {
      setLoading(prev => ({ ...prev, [platform]: true }));
      setError(null);

      const { authUrl } = await cloudSyncManager.authenticatePlatform(platform);
      
      // Open OAuth URL in popup or redirect
      window.open(authUrl, '_blank', 'width=600,height=700');
      setShowOAuthCallback(true);
      
    } catch (err) {
      console.error('Authentication failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  // Load documents from a platform
  const loadDocuments = async (platform: string) => {
    const platformCredentials = credentials[platform];
    if (!platformCredentials) return;

    try {
      setLoading(prev => ({ ...prev, [`${platform}-docs`]: true }));
      setError(null);

      const docs = await cloudSyncManager.fetchDocuments(platformCredentials, {
        limit: 20,
        search: searchQuery || undefined,
        sortBy: 'modified'
      });

      setDocuments(prev => ({ ...prev, [platform]: docs }));
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(prev => ({ ...prev, [`${platform}-docs`]: false }));
    }
  };

  // Import document from cloud
  const importDocument = async (platform: string, documentId: string) => {
    const platformCredentials = credentials[platform];
    if (!platformCredentials) return;

    try {
      setLoading(prev => ({ ...prev, [`import-${documentId}`]: true }));
      setError(null);

      const diagram = await cloudSyncManager.importDocument(platformCredentials, documentId);
      console.log('Imported diagram:', diagram);
      onDiagramImported?.(diagram);
      
    } catch (err) {
      console.error('Import failed:', err);
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setLoading(prev => ({ ...prev, [`import-${documentId}`]: false }));
    }
  };

  // Export diagram to cloud
  const exportDiagram = async (platform: string, createNew = false) => {
    if (!currentDiagram) return;
    
    const platformCredentials = credentials[platform];
    if (!platformCredentials) return;

    try {
      setLoading(prev => ({ ...prev, [`export-${platform}`]: true }));
      setError(null);

      const savedDoc = await cloudSyncManager.exportDocument(
        platformCredentials,
        currentDiagram,
        {
          createNew,
          name: currentDiagram.name || 'Exported Diagram'
        }
      );

      console.log('Exported document:', savedDoc);
      onDiagramExported?.(savedDoc);
      
      // Refresh documents list
      loadDocuments(platform);
      
    } catch (err) {
      console.error('Export failed:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoading(prev => ({ ...prev, [`export-${platform}`]: false }));
    }
  };

  // Filter documents based on search
  const getFilteredDocuments = (platform: string) => {
    const platformDocs = documents[platform] || [];
    if (!searchQuery) return platformDocs;
    
    return platformDocs.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getPlatformColor = (platform: string, type: 'bg' | 'border' | 'text') => {
    const platformConfig = platforms.find(p => p.id === platform);
    const color = platformConfig?.color || 'gray';
    
    switch (type) {
      case 'bg':
        return color === 'orange' ? 'bg-orange-50' : 
               color === 'green' ? 'bg-green-50' : 'bg-blue-50';
      case 'border':
        return color === 'orange' ? 'border-orange-200' : 
               color === 'green' ? 'border-green-200' : 'border-blue-200';
      case 'text':
        return color === 'orange' ? 'text-orange-800' : 
               color === 'green' ? 'text-green-800' : 'text-blue-800';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* OAuth Callback Handler */}
      {showOAuthCallback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Completing Authentication</h3>
              <button 
                onClick={() => setShowOAuthCallback(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <OAuthCallbackHandler onComplete={handleOAuthComplete} />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cloud Integration</h2>
        <p className="text-gray-600">
          Connect to Lucidchart and Microsoft Visio to import and export diagrams directly
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {platforms.map(platform => {
          const isConnected = credentials[platform.id] !== null;
          const isLoading = loading[platform.id];
          const platformDocs = documents[platform.id] || [];

          return (
            <div
              key={platform.id}
              className={`border-2 rounded-lg p-6 transition-all ${getPlatformColor(platform.id, 'border')} ${getPlatformColor(platform.id, 'bg')}`}
            >
              {/* Platform Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <h3 className={`font-semibold ${getPlatformColor(platform.id, 'text')}`}>
                      {platform.name}
                    </h3>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isConnected && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {isLoading && <RefreshCw className="w-5 h-5 animate-spin text-gray-500" />}
                </div>
              </div>

              {/* Authentication Section */}
              {!isConnected ? (
                <div className="text-center py-6">
                  <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Connect to access your {platform.name} documents</p>
                  <button
                    onClick={() => authenticatePlatform(platform.id)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-md text-white font-medium transition-colors flex items-center gap-2 mx-auto ${
                      platform.color === 'orange' 
                        ? 'bg-orange-600 hover:bg-orange-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <LogIn className="w-4 h-4" />
                    Connect to {platform.name}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Export Current Diagram */}
                  {currentDiagram && (
                    <div className="p-3 bg-white rounded border">
                      <h4 className="font-medium text-gray-800 mb-2">Export Current Diagram</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {currentDiagram.name} ({currentDiagram.nodes.length} shapes)
                      </p>
                      <button
                        onClick={() => exportDiagram(platform.id, true)}
                        disabled={loading[`export-${platform.id}`]}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Export to {platform.name}
                      </button>
                    </div>
                  )}

                  {/* Documents List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Your Documents</h4>
                      <button
                        onClick={() => loadDocuments(platform.id)}
                        disabled={loading[`${platform.id}-docs`]}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    {loading[`${platform.id}-docs`] ? (
                      <div className="text-center py-4">
                        <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Loading documents...</p>
                      </div>
                    ) : platformDocs.length === 0 ? (
                      <div className="text-center py-4">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No documents found</p>
                        <button
                          onClick={() => loadDocuments(platform.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Refresh
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {getFilteredDocuments(platform.id).slice(0, 5).map(doc => (
                          <div key={doc.id} className="p-3 bg-white rounded border hover:border-gray-300 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-gray-800 truncate">{doc.name}</h5>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {doc.modifiedAt.toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {doc.owner.name}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                <button
                                  onClick={() => importDocument(platform.id, doc.id)}
                                  disabled={loading[`import-${doc.id}`]}
                                  className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                  title="Import document"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => window.open(doc.url, '_blank')}
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                  title="Open in platform"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Search Documents */}
      {Object.values(credentials).some(cred => cred !== null) && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Documents
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your documents..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Search will be applied when you refresh document lists
          </p>
        </div>
      )}

      {/* Sync Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Integration Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {platforms.map(platform => (
            <div key={platform.id} className="flex items-center justify-between">
              <span className="text-gray-600">{platform.name}:</span>
              <span className={`font-medium ${
                credentials[platform.id] ? 'text-green-600' : 'text-gray-400'
              }`}>
                {credentials[platform.id] ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CloudIntegration;
