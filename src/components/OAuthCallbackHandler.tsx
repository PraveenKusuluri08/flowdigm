// OAuth2 Callback Handler Component
import React, { useEffect, useState } from 'react';
import { bidirectionalIntegrationService } from '../utils/bidirectionalIntegrationService';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface AuthCallbackState {
  status: 'loading' | 'success' | 'error';
  platform?: string;
  message?: string;
  userEmail?: string;
}

interface OAuthCallbackProps {
  onComplete?: (success: boolean, platform?: string) => void;
}

export const OAuthCallbackHandler: React.FC<OAuthCallbackProps> = ({ onComplete }) => {
  const [authState, setAuthState] = useState<AuthCallbackState>({ status: 'loading' });

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        // Determine platform from URL path
        const platform = window.location.pathname.includes('lucidchart') ? 'lucidchart' : 
                          window.location.pathname.includes('microsoft') ? 'visio' : 
                          window.location.pathname.includes('drawio') ? 'drawio' : '';

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        if (!platform) {
          throw new Error('Unable to determine platform from callback URL');
        }

        setAuthState({ 
          status: 'loading', 
          platform,
          message: `Completing authentication with ${platform}...` 
        });

        // Complete OAuth authentication using the bidirectional integration service
        const credentials = await bidirectionalIntegrationService.completeAuthentication(platform, code, state);

        setAuthState({
          status: 'success',
          platform,
          userEmail: credentials.email,
          message: `Successfully connected to ${platform}!`
        });

        // Call completion callback
        if (onComplete) {
          onComplete(true, platform);
        }

        // Clear URL parameters and redirect back to app
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);

      } catch (error) {
        console.error('OAuth callback failed:', error);
        setAuthState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Authentication failed'
        });

        // Call completion callback
        if (onComplete) {
          onComplete(false);
        }
      }
    };

    // Only handle callback if we have the required URL parameters
    if (window.location.search.includes('code=')) {
      handleOAuthCallback();
    }
  }, [onComplete]);

  const getStatusIcon = () => {
    switch (authState.status) {
      case 'loading':
        return <Loader className="w-8 h-8 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (authState.status) {
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  const getTextColor = () => {
    switch (authState.status) {
      case 'loading':
        return 'text-blue-800';
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
    }
  };

  const getPlatformDisplayName = (platform: string) => {
    switch (platform) {
      case 'lucidchart':
        return 'Lucidchart';
      case 'visio':
        return 'Microsoft Visio';
      case 'drawio':
        return 'Draw.io';
      default:
        return platform;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className={`max-w-md w-full p-8 rounded-lg border-2 ${getStatusColor()}`}>
        <div className="text-center">
          <div className="mx-auto mb-4">
            {getStatusIcon()}
          </div>
          
          <h2 className={`text-xl font-semibold mb-2 ${getTextColor()}`}>
            {authState.status === 'loading' && 'Completing Authentication'}
            {authState.status === 'success' && 'Authentication Successful'}
            {authState.status === 'error' && 'Authentication Failed'}
          </h2>
          
          {authState.platform && (
            <p className={`text-sm mb-4 ${getTextColor()}`}>
              Platform: <span className="font-medium">{getPlatformDisplayName(authState.platform)}</span>
            </p>
          )}
          
          {authState.userEmail && authState.status === 'success' && (
            <p className={`text-sm mb-4 ${getTextColor()}`}>
              Connected as: <span className="font-medium">{authState.userEmail}</span>
            </p>
          )}
          
          <p className={`text-sm ${getTextColor()}`}>
            {authState.message}
          </p>
          
          {authState.status === 'success' && (
            <p className="text-xs text-gray-600 mt-4">
              Redirecting to application...
            </p>
          )}
          
          {authState.status === 'error' && (
            <div className="mt-4">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
              >
                Return to App
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallbackHandler;
