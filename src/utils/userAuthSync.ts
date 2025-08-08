// User Authentication and Sync Types

export interface UserCredentials {
  platform: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  email?: string;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface AuthResult {
  success: boolean;
  credentials?: UserCredentials;
  error?: string;
}

// Stub implementations
export const userAuthSync = {
  authenticate: async (platform: string): Promise<AuthResult> => ({
    success: true,
    credentials: {
      platform,
      accessToken: 'stub-token',
      refreshToken: 'stub-refresh',
      expiresAt: new Date(Date.now() + 3600000)
    }
  }),
  
  refreshToken: async (credentials: UserCredentials): Promise<UserCredentials> => ({
    ...credentials,
    accessToken: 'new-stub-token',
    expiresAt: new Date(Date.now() + 3600000)
  }),
  
  revokeToken: async (credentials: UserCredentials): Promise<boolean> => true
}; 