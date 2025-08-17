/**
 * OAuth Callback Routes
 * 
 * These routes handle OAuth2 callbacks from different platforms
 */

import React from 'react';
import OAuthCallbackHandler from '../components/OAuthCallbackHandler';

export const OAuthRoutes = {
  '/oauth/callback/lucidchart': () => <OAuthCallbackHandler />,
  '/oauth/callback/microsoft': () => <OAuthCallbackHandler />,
  '/oauth/callback/drawio': () => <OAuthCallbackHandler />
};

// Simple router component for OAuth callbacks
export const OAuthRouter: React.FC = () => {
  const currentPath = window.location.pathname;
  
  if (currentPath.startsWith('/oauth/callback/')) {
    return <OAuthCallbackHandler />;
  }
  
  return null;
};

export default OAuthRouter;
