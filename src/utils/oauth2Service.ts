// OAuth2 Authentication Service for Lucidchart and Microsoft Graph
import type { UserCredentials } from './userAuthSync';

export interface OAuth2Config {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope: string[];
  authUrl: string;
  tokenUrl: string;
  revokeUrl?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export interface AuthState {
  state: string;
  codeVerifier?: string; // For PKCE
  platform: string;
  redirectUri: string;
}

export class OAuth2Service {
  private configs: Record<string, OAuth2Config> = {
    lucidchart: {
      clientId: import.meta.env.VITE_LUCIDCHART_CLIENT_ID || 'demo-lucidchart-client-id',
      clientSecret: import.meta.env.VITE_LUCIDCHART_CLIENT_SECRET,
      redirectUri: `${window.location.origin}/oauth/callback/lucidchart`,
      scope: ['lucidchart.documents.read', 'lucidchart.documents.write', 'lucidchart.user.read'],
      authUrl: 'https://lucidchart.com/oauth2/authorize',
      tokenUrl: 'https://api.lucidchart.com/oauth2/token',
      revokeUrl: 'https://api.lucidchart.com/oauth2/revoke'
    },
    visio: {
      clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || 'demo-microsoft-client-id',
      redirectUri: `${window.location.origin}/oauth/callback/microsoft`,
      scope: [
        'https://graph.microsoft.com/Files.ReadWrite',
        'https://graph.microsoft.com/Sites.ReadWrite.All',
        'https://graph.microsoft.com/User.Read'
      ],
      authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    },
    drawio: {
      clientId: import.meta.env.VITE_DRAWIO_CLIENT_ID || 'demo-google-client-id',
      redirectUri: `${window.location.origin}/oauth/callback/drawio`,
      scope: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly'],
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token'
    }
  };

  private authStates: Map<string, AuthState> = new Map();

  /**
   * Generate OAuth2 authorization URL with PKCE for secure authentication
   */
  async generateAuthUrl(platform: string): Promise<{ authUrl: string; state: string }> {
    const config = this.configs[platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const state = this.generateRandomString(32);
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store auth state for validation
    this.authStates.set(state, {
      state,
      codeVerifier,
      platform,
      redirectUri: config.redirectUri
    });

    const params = new URLSearchParams({
      client_id: config.clientId,
      response_type: 'code',
      redirect_uri: config.redirectUri,
      scope: config.scope.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `${config.authUrl}?${params.toString()}`;
    return { authUrl, state };
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    platform: string,
    code: string,
    state: string
  ): Promise<UserCredentials> {
    const config = this.configs[platform];
    const authState = this.authStates.get(state);

    if (!config || !authState || authState.platform !== platform) {
      throw new Error('Invalid authentication state');
    }

    const tokenData = await this.requestAccessToken(platform, code, authState);
    const userInfo = await this.fetchUserInfo(platform, tokenData.access_token);

    const credentials: UserCredentials = {
      platform,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      userId: userInfo.id,
      email: userInfo.email,
      displayName: userInfo.name
    };

    // Clean up auth state
    this.authStates.delete(state);

    return credentials;
  }

  /**
   * Refresh expired access token
   */
  async refreshToken(credentials: UserCredentials): Promise<UserCredentials> {
    if (!credentials.refreshToken) {
      throw new Error('No refresh token available');
    }

    const config = this.configs[credentials.platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${credentials.platform}`);
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: credentials.refreshToken,
      client_id: config.clientId
    });

    if (config.clientSecret) {
      body.append('client_secret', config.clientSecret);
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body.toString()
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const tokenData: TokenResponse = await response.json();

    return {
      ...credentials,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || credentials.refreshToken,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
    };
  }

  /**
   * Revoke access token and clean up credentials
   */
  async revokeToken(credentials: UserCredentials): Promise<void> {
    const config = this.configs[credentials.platform];
    if (!config?.revokeUrl) {
      return; // Platform doesn't support token revocation
    }

    try {
      await fetch(config.revokeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${credentials.accessToken}`
        },
        body: new URLSearchParams({
          token: credentials.accessToken
        }).toString()
      });
    } catch (error) {
      console.warn('Token revocation failed:', error);
      // Continue with cleanup even if revocation fails
    }
  }

  /**
   * Check if credentials are valid and not expired
   */
  isTokenValid(credentials: UserCredentials): boolean {
    return credentials.expiresAt ? credentials.expiresAt > new Date(Date.now() + 5 * 60 * 1000) : false; // 5 minutes buffer
  }

  /**
   * Get valid credentials, refreshing if necessary
   */
  async getValidCredentials(credentials: UserCredentials): Promise<UserCredentials> {
    if (this.isTokenValid(credentials)) {
      return credentials;
    }

    if (credentials.refreshToken) {
      return await this.refreshToken(credentials);
    }

    throw new Error('Credentials expired and no refresh token available');
  }

  // Private helper methods

  private async requestAccessToken(
    platform: string,
    code: string,
    authState: AuthState
  ): Promise<TokenResponse> {
    const config = this.configs[platform];
    
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: authState.redirectUri,
      client_id: config.clientId,
      code_verifier: authState.codeVerifier || ''
    });

    if (config.clientSecret) {
      body.append('client_secret', config.clientSecret);
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  private async fetchUserInfo(platform: string, accessToken: string): Promise<any> {
    let userInfoUrl: string;
    
    switch (platform) {
      case 'lucidchart':
        userInfoUrl = 'https://api.lucidchart.com/users/me';
        break;
      case 'visio':
        userInfoUrl = 'https://graph.microsoft.com/v1.0/me';
        break;
      case 'drawio':
        userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    const response = await fetch(userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    const userInfo = await response.json();
    
    // Normalize user info across platforms
    return {
      id: userInfo.id || userInfo.userId,
      email: userInfo.email || userInfo.mail || userInfo.userPrincipalName,
      name: userInfo.name || userInfo.displayName || `${userInfo.givenName || ''} ${userInfo.surname || ''}`.trim()
    };
  }

  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    
    return result;
  }

  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
}

// Export singleton instance
export const oauth2Service = new OAuth2Service();
