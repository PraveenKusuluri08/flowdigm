// Bidirectional Integration Types and Interfaces

export interface DiagramData {
  id: string;
  name: string;
  platform: string;
  lastModified: Date;
  version: number;
  nodes?: any[];
  edges?: any[];
  metadata?: any;
}

export interface SyncResult {
  success: boolean;
  platform: string;
  documentId?: string;
  timestamp: Date;
  changes?: any[];
  conflicts?: SyncConflict[];
  error?: string;
}

export interface SyncConflict {
  id: string;
  type: 'node' | 'edge' | 'property';
  localValue: any;
  remoteValue: any;
  elementId: string;
  description: string;
}

export interface UserCredentials {
  platform: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  email?: string;
}

// Stub implementations
export const bidirectionalIntegration = {
  sync: async (diagram: DiagramData): Promise<SyncResult> => ({
    success: true,
    platform: diagram.platform,
    timestamp: new Date()
  }),
  
  resolveConflicts: async (conflicts: SyncConflict[]): Promise<SyncResult> => ({
    success: true,
    platform: 'local',
    timestamp: new Date()
  })
};
