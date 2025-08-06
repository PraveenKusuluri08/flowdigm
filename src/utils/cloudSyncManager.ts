// Comprehensive Sync Manager for Cloud-based Bidirectional Integration
import type { DiagramData, SyncResult, SyncConflict } from './bidirectionalIntegration';
import type { UserCredentials } from './userAuthSync';
import { oauth2Service } from './oauth2Service';
import { cloudDocumentManager, type CloudDocument } from './cloudDocumentManager';

export interface SyncSession {
  id: string;
  platform: string;
  documentId: string;
  localDiagram: DiagramData;
  remoteDiagram: DiagramData;
  status: 'active' | 'paused' | 'conflict' | 'error' | 'completed';
  lastSync: Date;
  conflictCount: number;
  autoSync: boolean;
  syncInterval: number; // milliseconds
}

export interface SyncConfiguration {
  autoSync: boolean;
  syncInterval: number; // minutes
  conflictResolution: 'manual' | 'local-wins' | 'remote-wins' | 'merge';
  retryAttempts: number;
  retryDelay: number; // seconds
}

export interface SyncStats {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  conflictsResolved: number;
  lastSyncTime?: Date;
  averageSyncTime: number; // milliseconds
}

export class CloudSyncManager {
  private activeSessions: Map<string, SyncSession> = new Map();
  private syncTimers: Map<string, number> = new Map();
  private defaultConfig: SyncConfiguration = {
    autoSync: true,
    syncInterval: 5, // 5 minutes
    conflictResolution: 'manual',
    retryAttempts: 3,
    retryDelay: 5 // 5 seconds
  };
  private syncStats: Map<string, SyncStats> = new Map();

  /**
   * Initialize OAuth2 authentication for a platform
   */
  async authenticatePlatform(platform: string): Promise<{ authUrl: string; state: string }> {
    try {
      const authUrl = await oauth2Service.generateAuthUrl(platform);
      const urlParams = new URL(authUrl).searchParams;
      const state = urlParams.get('state') || '';
      
      return { authUrl, state };
    } catch (error) {
      console.error('Authentication initialization failed:', error);
      throw new Error(`Failed to initialize authentication for ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Complete OAuth2 authentication flow
   */
  async completeAuthentication(
    platform: string,
    code: string,
    state: string
  ): Promise<UserCredentials> {
    try {
      const credentials = await oauth2Service.exchangeCodeForToken(platform, code, state);
      console.log(`Authentication completed for ${platform}:`, credentials.email);
      return credentials;
    } catch (error) {
      console.error('Authentication completion failed:', error);
      throw new Error(`Failed to complete authentication for ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch available documents from a platform
   */
  async fetchDocuments(
    credentials: UserCredentials,
    options: { limit?: number; search?: string; sortBy?: 'name' | 'modified' } = {}
  ): Promise<CloudDocument[]> {
    try {
      const documents = await cloudDocumentManager.fetchDocuments(credentials, options);
      console.log(`Fetched ${documents.length} documents from ${credentials.platform}`);
      return documents;
    } catch (error) {
      console.error('Document fetching failed:', error);
      throw new Error(`Failed to fetch documents from ${credentials.platform}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import a document from cloud platform to local canvas
   */
  async importDocument(
    credentials: UserCredentials,
    documentId: string
  ): Promise<DiagramData> {
    try {
      console.log(`Importing document ${documentId} from ${credentials.platform}...`);
      
      const documentContent = await cloudDocumentManager.fetchDocument(credentials, documentId);
      const diagramData = documentContent.diagramData;
      
      // Enhance metadata with import information
      diagramData.metadata = {
        ...diagramData.metadata,
        syncStatus: 'synced',
        lastSyncTime: new Date()
      };

      console.log(`Successfully imported document: ${diagramData.name} with ${diagramData.nodes.length} nodes`);
      return diagramData;
    } catch (error) {
      console.error('Document import failed:', error);
      throw new Error(`Failed to import document ${documentId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export/save local diagram to cloud platform
   */
  async exportDocument(
    credentials: UserCredentials,
    diagramData: DiagramData,
    options: { documentId?: string; createNew?: boolean; name?: string } = {}
  ): Promise<CloudDocument> {
    try {
      console.log(`Exporting diagram to ${credentials.platform}...`);
      
      const savedDocument = await cloudDocumentManager.saveDocument(
        credentials,
        options.documentId || '',
        diagramData,
        options
      );

      console.log(`Successfully exported diagram: ${savedDocument.name}`);
      return savedDocument;
    } catch (error) {
      console.error('Document export failed:', error);
      throw new Error(`Failed to export document to ${credentials.platform}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Start bidirectional sync session for a document
   */
  async startSyncSession(
    credentials: UserCredentials,
    documentId: string,
    localDiagram: DiagramData,
    config: Partial<SyncConfiguration> = {}
  ): Promise<SyncSession> {
    try {
      const sessionId = `${credentials.platform}-${documentId}-${Date.now()}`;
      const finalConfig = { ...this.defaultConfig, ...config };

      // Fetch current remote state
      const documentContent = await cloudDocumentManager.fetchDocument(credentials, documentId);
      
      const session: SyncSession = {
        id: sessionId,
        platform: credentials.platform,
        documentId,
        localDiagram,
        remoteDiagram: documentContent.diagramData,
        status: 'active',
        lastSync: new Date(),
        conflictCount: 0,
        autoSync: finalConfig.autoSync,
        syncInterval: finalConfig.syncInterval * 60 * 1000 // Convert to milliseconds
      };

      this.activeSessions.set(sessionId, session);

      // Initialize sync stats
      if (!this.syncStats.has(sessionId)) {
        this.syncStats.set(sessionId, {
          totalSyncs: 0,
          successfulSyncs: 0,
          failedSyncs: 0,
          conflictsResolved: 0,
          averageSyncTime: 0
        });
      }

      // Start auto-sync if enabled
      if (session.autoSync) {
        this.startAutoSync(sessionId, credentials);
      }

      // Perform initial sync
      await this.performSync(sessionId, credentials);

      console.log(`Started sync session ${sessionId} for ${credentials.platform}`);
      return session;
    } catch (error) {
      console.error('Failed to start sync session:', error);
      throw new Error(`Failed to start sync session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stop sync session and cleanup
   */
  async stopSyncSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Sync session ${sessionId} not found`);
    }

    // Stop auto-sync timer
    const timer = this.syncTimers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.syncTimers.delete(sessionId);
    }

    // Update session status
    session.status = 'completed';
    this.activeSessions.delete(sessionId);

    console.log(`Stopped sync session ${sessionId}`);
  }

  /**
   * Get all active sync sessions
   */
  getActiveSessions(): SyncSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Get sync statistics for a session
   */
  getSyncStats(sessionId: string): SyncStats | undefined {
    return this.syncStats.get(sessionId);
  }

  /**
   * Force manual sync for a session
   */
  async manualSync(
    sessionId: string,
    credentials: UserCredentials,
    localDiagram: DiagramData
  ): Promise<SyncResult> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error(`Sync session ${sessionId} not found`);
      }

      // Update local diagram
      session.localDiagram = localDiagram;

      // Perform sync
      return await this.performSync(sessionId, credentials);
    } catch (error) {
      console.error('Manual sync failed:', error);
      throw new Error(`Manual sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Resolve sync conflicts
   */
  async resolveConflicts(
    sessionId: string,
    credentials: UserCredentials,
    resolution: 'local' | 'remote' | 'merge',
    mergedDiagram?: DiagramData
  ): Promise<SyncResult> {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) {
        throw new Error(`Sync session ${sessionId} not found`);
      }

      let resolvedDiagram: DiagramData;

      switch (resolution) {
        case 'local':
          resolvedDiagram = session.localDiagram;
          break;
        case 'remote':
          resolvedDiagram = session.remoteDiagram;
          break;
        case 'merge':
          if (!mergedDiagram) {
            throw new Error('Merged diagram required for merge resolution');
          }
          resolvedDiagram = mergedDiagram;
          break;
        default:
          throw new Error(`Invalid resolution type: ${resolution}`);
      }

      // Save resolved diagram to remote
      await cloudDocumentManager.saveDocument(
        credentials,
        session.documentId,
        resolvedDiagram
      );

      // Update session
      session.localDiagram = resolvedDiagram;
      session.remoteDiagram = resolvedDiagram;
      session.status = 'active';
      session.conflictCount = 0;
      session.lastSync = new Date();

      // Update stats
      const stats = this.syncStats.get(sessionId);
      if (stats) {
        stats.conflictsResolved++;
      }

      console.log(`Resolved conflicts for session ${sessionId} using ${resolution} strategy`);

      return {
        success: true,
        changes: [],
        conflicts: [],
        errors: [],
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Conflict resolution failed:', error);
      throw new Error(`Failed to resolve conflicts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private methods

  private startAutoSync(
    sessionId: string,
    credentials: UserCredentials
  ): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const timer = setInterval(async () => {
      try {
        await this.performSync(sessionId, credentials);
      } catch (error) {
        console.error(`Auto-sync failed for session ${sessionId}:`, error);
        
        const session = this.activeSessions.get(sessionId);
        if (session) {
          session.status = 'error';
        }
      }
    }, session.syncInterval);

    this.syncTimers.set(sessionId, timer);
  }

  private async performSync(
    sessionId: string,
    credentials: UserCredentials
  ): Promise<SyncResult> {
    const startTime = Date.now();
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Sync session ${sessionId} not found`);
    }

    try {
      // Fetch current remote state
      const documentContent = await cloudDocumentManager.fetchDocument(
        credentials,
        session.documentId
      );
      
      const remoteLastModified = documentContent.document.modifiedAt;
      const localLastModified = session.localDiagram.lastModified;

      // Check if remote has been modified since last sync
      const hasRemoteChanges = remoteLastModified > session.lastSync;
      const hasLocalChanges = localLastModified > session.lastSync;

      let syncResult: SyncResult;

      if (!hasRemoteChanges && !hasLocalChanges) {
        // No changes on either side
        syncResult = {
          success: true,
          changes: [],
          conflicts: [],
          errors: [],
          timestamp: new Date()
        };
      } else if (hasLocalChanges && !hasRemoteChanges) {
        // Only local changes - push to remote
        await cloudDocumentManager.saveDocument(
          credentials,
          session.documentId,
          session.localDiagram
        );
        
        session.remoteDiagram = session.localDiagram;
        
        syncResult = {
          success: true,
          changes: [{ 
            type: 'modified', 
            elementType: 'metadata', 
            elementId: session.documentId,
            oldValue: documentContent.diagramData,
            newValue: session.localDiagram,
            platform: credentials.platform
          }],
          conflicts: [],
          errors: [],
          timestamp: new Date()
        };
      } else if (!hasLocalChanges && hasRemoteChanges) {
        // Only remote changes - pull from remote
        session.localDiagram = documentContent.diagramData;
        session.remoteDiagram = documentContent.diagramData;
        
        syncResult = {
          success: true,
          changes: [{ 
            type: 'modified', 
            elementType: 'metadata', 
            elementId: session.documentId,
            oldValue: session.localDiagram,
            newValue: documentContent.diagramData,
            platform: credentials.platform
          }],
          conflicts: [],
          errors: [],
          timestamp: new Date()
        };
      } else {
        // Both have changes - conflict detected
        const conflicts = this.detectConflicts(session.localDiagram, documentContent.diagramData);
        
        session.status = 'conflict';
        session.conflictCount = conflicts.length;
        
        syncResult = {
          success: false,
          changes: [],
          conflicts,
          errors: [`Sync conflict detected: ${conflicts.length} conflicts found`],
          timestamp: new Date()
        };
      }

      // Update session
      session.lastSync = new Date();
      
      // Update stats
      const stats = this.syncStats.get(sessionId);
      if (stats) {
        stats.totalSyncs++;
        if (syncResult.success) {
          stats.successfulSyncs++;
        } else {
          stats.failedSyncs++;
        }
        stats.lastSyncTime = new Date();
        
        const syncTime = Date.now() - startTime;
        stats.averageSyncTime = (stats.averageSyncTime * (stats.totalSyncs - 1) + syncTime) / stats.totalSyncs;
      }

      return syncResult;
    } catch (error) {
      // Update stats
      const stats = this.syncStats.get(sessionId);
      if (stats) {
        stats.totalSyncs++;
        stats.failedSyncs++;
        stats.lastSyncTime = new Date();
      }

      throw error;
    }
  }

  private detectConflicts(localDiagram: DiagramData, remoteDiagram: DiagramData): SyncConflict[] {
    const conflicts: SyncConflict[] = [];

    // Compare nodes
    for (const localNode of localDiagram.nodes) {
      const remoteNode = remoteDiagram.nodes.find(n => n.id === localNode.id);
      if (remoteNode) {
        // Check for property conflicts
        if (JSON.stringify(localNode.data) !== JSON.stringify(remoteNode.data)) {
          conflicts.push({
            elementType: 'node',
            elementId: localNode.id,
            platform: remoteDiagram.platform,
            localValue: localNode.data,
            remoteValue: remoteNode.data
          });
        }
      }
    }

    // Compare edges
    for (const localEdge of localDiagram.edges) {
      const remoteEdge = remoteDiagram.edges.find(e => e.id === localEdge.id);
      if (remoteEdge) {
        if (JSON.stringify(localEdge.data) !== JSON.stringify(remoteEdge.data)) {
          conflicts.push({
            elementType: 'edge',
            elementId: localEdge.id,
            platform: remoteDiagram.platform,
            localValue: localEdge.data,
            remoteValue: remoteEdge.data
          });
        }
      }
    }

    return conflicts;
  }
}

// Export singleton instance
export const cloudSyncManager = new CloudSyncManager();
