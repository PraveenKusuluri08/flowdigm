// User Authentication and Platform Connection UI Component
import React, { useState, useEffect } from 'react';
import { 
  User, 
  LogIn, 
  LogOut, 
  Link, 
  Unlink, 
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Users,
  Crown,
  Zap
} from 'lucide-react';
import { userAuthSync, type UserSyncProfile, type PlatformConnection } from '../utils/userAuthSync';

interface UserAuthPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onUserAuthenticated: (profile: UserSyncProfile) => void;
}

const UserAuthPanel: React.FC<UserAuthPanelProps> = ({
  isVisible,
  onClose,
  onUserAuthenticated
}) => {
  const [userProfile, setUserProfile] = useState<UserSyncProfile | null>(null);
  const [platformConnections, setPlatformConnections] = useState<Map<string, PlatformConnection>>(new Map());
  const [activeTab, setActiveTab] = useState<'login' | 'platforms' | 'projects' | 'settings'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    // Check if user is already authenticated
    const profile = userAuthSync.getUserProfile();
    if (profile) {
      setUserProfile(profile);
      setPlatformConnections(userAuthSync.getPlatformConnections());
      setActiveTab('platforms');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const profile = await userAuthSync.authenticateUser(loginForm.email, loginForm.password);
      setUserProfile(profile);
      setPlatformConnections(userAuthSync.getPlatformConnections());
      setActiveTab('platforms');
      onUserAuthenticated(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setUserProfile(null);
    setPlatformConnections(new Map());
    setActiveTab('login');
    setLoginForm({ email: '', password: '', rememberMe: false });
  };

  const handlePlatformConnect = async (platform: 'visio' | 'lucidchart' | 'drawio') => {
    setIsLoading(true);
    setError(null);

    try {
      const connection = await userAuthSync.connectToPlatform(platform);
      setPlatformConnections(prev => new Map(prev.set(platform, connection)));
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to connect to ${platform}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformDisconnect = async (platform: string) => {
    setIsLoading(true);
    try {
      await userAuthSync.disconnectFromPlatform(platform);
      setPlatformConnections(prev => {
        const newMap = new Map(prev);
        newMap.delete(platform);
        return newMap;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to disconnect from ${platform}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {userProfile ? 'Account & Platform Connections' : 'Sign In to Your Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[600px]">
          {/* Sidebar Navigation */}
          {userProfile && (
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('platforms')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'platforms'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Link className="w-4 h-4 inline mr-2" />
                  Platform Connections
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'projects'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Cross-Platform Projects
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
              </div>

              {/* User Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{userProfile.displayName}</p>
                    <p className="text-xs text-gray-500">{userProfile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-600 uppercase">
                    {userProfile.subscription.plan}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-3 h-3 inline mr-1" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Login Tab */}
            {!userProfile && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Connect Your Diagramming Platforms
                  </h3>
                  <p className="text-gray-600">
                    Sign in to sync and edit your diagrams across Visio, Lucidchart, and Draw.io
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button className="text-blue-600 hover:text-blue-800">
                      Create one now
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Platform Connections Tab */}
            {userProfile && activeTab === 'platforms' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Platform Connections</h3>
                  <p className="text-gray-600">
                    Connect your external diagramming platforms to enable cross-platform editing and sync.
                  </p>
                </div>

                <div className="grid gap-4">
                  {['visio', 'lucidchart', 'drawio'].map(platform => {
                    const connection = platformConnections.get(platform);
                    const isConnected = connection?.isConnected || false;

                    return (
                      <div
                        key={platform}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              platform === 'visio' ? 'bg-blue-100' :
                              platform === 'lucidchart' ? 'bg-orange-100' : 'bg-green-100'
                            }`}>
                              {platform === 'visio' && <Shield className="w-5 h-5 text-blue-600" />}
                              {platform === 'lucidchart' && <Zap className="w-5 h-5 text-orange-600" />}
                              {platform === 'drawio' && <CheckCircle className="w-5 h-5 text-green-600" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 capitalize">
                                {platform === 'drawio' ? 'Draw.io' : platform}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {isConnected ? 
                                  `Connected • Last sync: ${connection?.lastSync?.toLocaleString()}` :
                                  'Not connected'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isConnected ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <button
                                  onClick={() => handlePlatformDisconnect(platform)}
                                  disabled={isLoading}
                                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                  <Unlink className="w-4 h-4 inline mr-1" />
                                  Disconnect
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handlePlatformConnect(platform as 'visio' | 'lucidchart' | 'drawio')}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                              >
                                <Link className="w-4 h-4" />
                                Connect
                              </button>
                            )}
                          </div>
                        </div>

                        {isConnected && connection?.permissions && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span className={connection.permissions.read ? 'text-green-600' : 'text-gray-400'}>
                                ✓ Read
                              </span>
                              <span className={connection.permissions.write ? 'text-green-600' : 'text-gray-400'}>
                                ✓ Write
                              </span>
                              <span className={connection.permissions.share ? 'text-green-600' : 'text-gray-400'}>
                                ✓ Share
                              </span>
                              <span className={connection.permissions.collaborate ? 'text-green-600' : 'text-gray-400'}>
                                ✓ Collaborate
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Cross-Platform Benefits</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Edit diagrams natively in each platform</li>
                    <li>• Real-time sync across all connected platforms</li>
                    <li>• Collaborative editing with team members</li>
                    <li>• Automatic backup and version control</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {userProfile && activeTab === 'projects' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Cross-Platform Projects</h3>
                  <p className="text-gray-600">
                    Manage projects that sync across multiple platforms.
                  </p>
                </div>

                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No cross-platform projects yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a diagram and use the Integration Panel to set up cross-platform projects
                  </p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {userProfile && activeTab === 'settings' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Sync Settings</h3>
                  <p className="text-gray-600">
                    Configure how your diagrams sync across platforms.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userProfile.preferences.autoSync}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable automatic sync</span>
                    </label>
                    <p className="text-xs text-gray-500 ml-6">
                      Automatically sync changes across all connected platforms
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sync Interval
                    </label>
                    <select className="w-32 px-3 py-2 border border-gray-300 rounded-md">
                      <option value="1">1 minute</option>
                      <option value="5" selected>5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collaboration Mode
                    </label>
                    <select className="w-40 px-3 py-2 border border-gray-300 rounded-md">
                      <option value="private">Private</option>
                      <option value="team">Team</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuthPanel;
