// Real-time editing sync service for bidirectional integration
import type { DiagramData } from './bidirectionalIntegration';
import { syncService } from './syncService';
import { convertToPlatformFormat, convertFromPlatformFormat } from './bidirectionalIntegration';

export interface EditSession {
  id: string;
  diagramId: string;
  platform: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  isActive: boolean;
  editableUrl?: string;
  shareToken?: string;
}

export interface EditChange {
  id: string;
  sessionId: string;
  timestamp: Date;
  type: 'node_added' | 'node_updated' | 'node_deleted' | 'edge_added' | 'edge_updated' | 'edge_deleted' | 'metadata_updated';
  elementId: string;
  oldValue?: any;
  newValue?: any;
  author: {
    userId: string;
    name: string;
    platform: string;
  };
}

export interface PlatformEditor {
  platform: string;
  canEdit: boolean;
  editUrl?: string;
  embedUrl?: string;
  shareUrl?: string;
  collaborativeFeatures: {
    realTimeEditing: boolean;
    comments: boolean;
    versionHistory: boolean;
    permissions: boolean;
  };
}

// Platform-specific edit URL generators
export class EditUrlGenerator {
  static generateVisioEditUrl(diagramId: string, shareToken?: string): string {
    // Generate URL for editing in Visio Online
    const baseUrl = 'https://office.live.com/start/Visio.aspx';
    const params = new URLSearchParams({
      action: 'edit',
      file: diagramId,
      token: shareToken || 'demo_token'
    });
    return `${baseUrl}?${params.toString()}`;
  }

  static generateLucidchartEditUrl(documentId: string, shareToken?: string): string {
    // Generate URL for editing in Lucidchart
    const baseUrl = 'https://lucidchart.com/documents/edit';
    return `${baseUrl}/${documentId}${shareToken ? `?token=${shareToken}` : ''}`;
  }

  static generateDrawioEditUrl(fileId: string, storageType: 'github' | 'gdrive' = 'gdrive'): string {
    // Generate URL for editing in Draw.io
    const baseUrl = 'https://app.diagrams.net';
    const params = new URLSearchParams({
      mode: 'edit',
      storage: storageType,
      file: fileId
    });
    return `${baseUrl}?${params.toString()}`;
  }

  static generateEmbedUrl(platform: string, diagramId: string, options: {
    readonly?: boolean;
    showToolbar?: boolean;
    allowComments?: boolean;
  } = {}): string {
    const { readonly = false, showToolbar = true, allowComments = false } = options;

    switch (platform) {
      case 'visio':
        return `https://office.live.com/embed/Visio.aspx?src=${diagramId}&readonly=${readonly}&toolbar=${showToolbar}`;
      
      case 'lucidchart':
        const lucidParams = new URLSearchParams({
          id: diagramId,
          readonly: readonly.toString(),
          toolbar: showToolbar.toString(),
          comments: allowComments.toString()
        });
        return `https://lucidchart.com/documents/embeddedchart/${diagramId}?${lucidParams.toString()}`;
      
      case 'drawio':
        const drawioParams = new URLSearchParams({
          embed: '1',
          readonly: readonly ? '1' : '0',
          toolbar: showToolbar ? '1' : '0',
          file: diagramId
        });
        return `https://embed.diagrams.net?${drawioParams.toString()}`;
      
      default:
        throw new Error(`Unsupported platform for embed: ${platform}`);
    }
  }
}

// Real-time edit synchronization
export class RealTimeEditSync {
  private activeSessions: Map<string, EditSession> = new Map();
  private changeBuffer: Map<string, EditChange[]> = new Map();
  private syncIntervals: Map<string, number> = new Map();
  private webhookListeners: Map<string, Function[]> = new Map();

  // Start editing session on external platform
  async startEditSession(diagram: DiagramData, platform: string, userId: string): Promise<EditSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Upload current diagram to platform in editable format
      const editableData = await this.prepareEditableFormat(diagram, platform);
      const uploadResult = await this.uploadToplatform(editableData, platform, diagram.name);
      
      // Generate edit URLs
      const editUrl = this.generateEditUrl(platform, uploadResult.fileId, uploadResult.shareToken);
      
      const session: EditSession = {
        id: sessionId,
        diagramId: diagram.id,
        platform,
        userId,
        startTime: new Date(),
        lastActivity: new Date(),
        isActive: true,
        editableUrl: editUrl,
        shareToken: uploadResult.shareToken
      };

      this.activeSessions.set(sessionId, session);
      this.changeBuffer.set(sessionId, []);
      
      // Start monitoring for changes
      this.startChangeMonitoring(session);
      
      return session;
    } catch (error) {
      console.error('Failed to start edit session:', error);
      throw new Error(`Failed to start editing session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // End editing session and sync final changes
  async endEditSession(sessionId: string): Promise<DiagramData | null> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    try {
      // Stop monitoring
      this.stopChangeMonitoring(sessionId);
      
      // Fetch final version from platform
      const finalData = await this.fetchFromPlatform(session.platform, session.diagramId);
      const updatedDiagram = convertFromPlatformFormat(finalData, session.platform);
      
      // Apply any buffered changes
      const changes = this.changeBuffer.get(sessionId) || [];
      const finalDiagram = this.applyChanges(updatedDiagram, changes);
      
      // Update local diagram
      syncService.setCurrentDiagram(finalDiagram);
      
      // Cleanup
      this.activeSessions.delete(sessionId);
      this.changeBuffer.delete(sessionId);
      
      session.isActive = false;
      session.lastActivity = new Date();
      
      return finalDiagram;
    } catch (error) {
      console.error('Failed to end edit session:', error);
      throw new Error(`Failed to end editing session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get all active editing sessions
  getActiveSessions(): EditSession[] {
    return Array.from(this.activeSessions.values()).filter(session => session.isActive);
  }

  // Get session by ID
  getSession(sessionId: string): EditSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  // Check if diagram is currently being edited
  isBeingEdited(diagramId: string): boolean {
    return Array.from(this.activeSessions.values()).some(
      session => session.diagramId === diagramId && session.isActive
    );
  }

  // Get platform editors for a diagram
  async getPlatformEditors(diagram: DiagramData): Promise<PlatformEditor[]> {
    const editors: PlatformEditor[] = [];
    
    for (const platform of ['visio', 'lucidchart', 'drawio']) {
      try {
        const canEdit = await this.checkEditCapability(diagram, platform);
        const editUrl = canEdit ? this.generateEditUrl(platform, diagram.id) : undefined;
        const embedUrl = this.generateEmbedUrl(platform, diagram.id);
        
        editors.push({
          platform,
          canEdit,
          editUrl,
          embedUrl,
          shareUrl: editUrl,
          collaborativeFeatures: this.getPlatformFeatures(platform)
        });
      } catch (error) {
        console.error(`Failed to check edit capability for ${platform}:`, error);
      }
    }
    
    return editors;
  }

  // Public methods for monitoring control
  startMonitoring(): void {
    console.log('Started real-time edit monitoring');
    // Global monitoring is handled per session, this is just a flag
  }

  stopMonitoring(): void {
    console.log('Stopped real-time edit monitoring');
    // Stop all active sessions
    this.activeSessions.forEach((_session, sessionId) => {
      this.stopChangeMonitoring(sessionId);
    });
  }

  // Public method to get edit URL for a session
  getEditUrlForSession(sessionId: string): string | null {
    const session = this.activeSessions.get(sessionId);
    return session?.editableUrl || null;
  }

  // Prepare diagram data in platform-specific editable format
  private async prepareEditableFormat(diagram: DiagramData, platform: string): Promise<any> {
    const platformData = convertToPlatformFormat(diagram, platform);
    
    // Add platform-specific editing metadata
    const editableData = {
      ...platformData,
      editingMetadata: {
        originalId: diagram.id,
        sourceApplication: 'FlowDigm',
        editingEnabled: true,
        lastModified: new Date().toISOString(),
        version: diagram.version,
        syncRequired: true
      }
    };

    // Platform-specific enhancements
    switch (platform) {
      case 'visio':
        return this.enhanceForVisioEdit(editableData);
      case 'lucidchart':
        return this.enhanceForLucidchartEdit(editableData);
      case 'drawio':
        return this.enhanceForDrawioEdit(editableData);
      default:
        return editableData;
    }
  }

  private enhanceForVisioEdit(data: any): any {
    return {
      ...data,
      visioMetadata: {
        editingMode: 'collaborative',
        autoSave: true,
        sharePermissions: 'edit',
        trackChanges: true
      }
    };
  }

  private enhanceForLucidchartEdit(data: any): any {
    return {
      ...data,
      lucidMetadata: {
        collaborationEnabled: true,
        commentingEnabled: true,
        versioningEnabled: true,
        realTimeSync: true
      }
    };
  }

  private enhanceForDrawioEdit(data: any): any {
    return {
      ...data,
      drawioMetadata: {
        mode: 'edit',
        autosave: true,
        collaborative: true,
        plugins: ['realtime', 'comments']
      }
    };
  }

  // Upload to platform for editing
  private async uploadToplatform(data: any, platform: string, fileName: string): Promise<{
    fileId: string;
    shareToken: string;
    editUrl: string;
  }> {
    // This would integrate with actual platform APIs
    console.log(`Uploading to ${platform}:`, fileName, 'Data size:', JSON.stringify(data).length);
    
    // Mock implementation
    const fileId = `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shareToken = `token_${fileId}`;
    const editUrl = this.generateEditUrl(platform, fileId, shareToken);
    
    return { fileId, shareToken, editUrl };
  }

  // Generate platform-specific edit URL
  private generateEditUrl(platform: string, fileId: string, shareToken?: string): string {
    switch (platform) {
      case 'visio':
        return EditUrlGenerator.generateVisioEditUrl(fileId, shareToken);
      case 'lucidchart':
        return EditUrlGenerator.generateLucidchartEditUrl(fileId, shareToken);
      case 'drawio':
        return EditUrlGenerator.generateDrawioEditUrl(fileId);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Generate embed URL
  private generateEmbedUrl(platform: string, fileId: string, options = {}): string {
    return EditUrlGenerator.generateEmbedUrl(platform, fileId, options);
  }

  // Start monitoring changes from platform
  private startChangeMonitoring(session: EditSession): void {
    const interval = setInterval(async () => {
      try {
        await this.checkForChanges(session);
      } catch (error) {
        console.error('Error monitoring changes:', error);
      }
    }, 5000); // Check every 5 seconds

    this.syncIntervals.set(session.id, interval);
  }

  // Stop monitoring changes
  private stopChangeMonitoring(sessionId: string): void {
    const interval = this.syncIntervals.get(sessionId);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(sessionId);
    }
  }

  // Check for changes from platform
  private async checkForChanges(session: EditSession): Promise<void> {
    try {
      const currentData = await this.fetchFromPlatform(session.platform, session.diagramId);
      const changes = await this.detectChanges(session, currentData);
      
      if (changes.length > 0) {
        const existingChanges = this.changeBuffer.get(session.id) || [];
        this.changeBuffer.set(session.id, [...existingChanges, ...changes]);
        
        // Update session activity
        session.lastActivity = new Date();
        
        // Notify listeners
        this.notifyChangeListeners(session, changes);
      }
    } catch (error) {
      console.error('Failed to check for changes:', error);
    }
  }

  // Fetch current data from platform
  private async fetchFromPlatform(platform: string, diagramId: string): Promise<any> {
    // This would call actual platform APIs
    console.log(`Fetching from ${platform}:`, diagramId);
    
    // Mock implementation - return updated data
    return {
      id: diagramId,
      lastModified: new Date(),
      nodes: [],
      edges: [],
      version: Math.floor(Math.random() * 10) + 1
    };
  }

  // Detect changes between versions
  private async detectChanges(session: EditSession, newData: any): Promise<EditChange[]> {
    const changes: EditChange[] = [];
    
    // This would implement actual change detection logic
    // For demo, we'll simulate some changes based on data
    console.log('Checking for changes in session:', session.id, 'Data version:', newData.version);
    
    if (Math.random() > 0.8) { // 20% chance of changes
      changes.push({
        id: `change_${Date.now()}`,
        sessionId: session.id,
        timestamp: new Date(),
        type: 'node_updated',
        elementId: 'node_1',
        oldValue: { label: 'Old Label' },
        newValue: { label: 'New Label' },
        author: {
          userId: session.userId,
          name: 'User',
          platform: session.platform
        }
      });
    }
    
    return changes;
  }

  // Apply changes to diagram
  private applyChanges(diagram: DiagramData, changes: EditChange[]): DiagramData {
    let updatedDiagram = { ...diagram };
    
    for (const change of changes) {
      switch (change.type) {
        case 'node_updated':
          const nodeIndex = updatedDiagram.nodes.findIndex(n => n.id === change.elementId);
          if (nodeIndex >= 0 && change.newValue) {
            updatedDiagram.nodes[nodeIndex] = { ...updatedDiagram.nodes[nodeIndex], ...change.newValue };
          }
          break;
        
        case 'node_added':
          if (change.newValue) {
            updatedDiagram.nodes.push(change.newValue);
          }
          break;
        
        case 'node_deleted':
          updatedDiagram.nodes = updatedDiagram.nodes.filter(n => n.id !== change.elementId);
          break;
        
        case 'edge_updated':
          const edgeIndex = updatedDiagram.edges.findIndex(e => e.id === change.elementId);
          if (edgeIndex >= 0 && change.newValue) {
            updatedDiagram.edges[edgeIndex] = { ...updatedDiagram.edges[edgeIndex], ...change.newValue };
          }
          break;
        
        case 'edge_added':
          if (change.newValue) {
            updatedDiagram.edges.push(change.newValue);
          }
          break;
        
        case 'edge_deleted':
          updatedDiagram.edges = updatedDiagram.edges.filter(e => e.id !== change.elementId);
          break;
      }
    }
    
    updatedDiagram.lastModified = new Date();
    updatedDiagram.version += 1;
    
    return updatedDiagram;
  }

  // Notify change listeners
  private notifyChangeListeners(session: EditSession, changes: EditChange[]): void {
    const listeners = this.webhookListeners.get(session.platform) || [];
    for (const listener of listeners) {
      try {
        listener({ session, changes });
      } catch (error) {
        console.error('Error in change listener:', error);
      }
    }
  }

  // Check if platform supports editing
  private async checkEditCapability(diagram: DiagramData, platform: string): Promise<boolean> {
    console.log('Checking edit capability for diagram:', diagram.id, 'on platform:', platform);
    // Check if diagram format is compatible with platform
    const supportedFormats = {
      visio: ['vsdx', 'vsd', 'xml'],
      lucidchart: ['json', 'xml'],
      drawio: ['drawio', 'xml', 'svg']
    };
    
    const platformFormats = supportedFormats[platform as keyof typeof supportedFormats] || [];
    
    // Check if diagram's source platform is compatible or if we can convert
    const diagramPlatform = diagram.platform || diagram.metadata.platform;
    console.log('Diagram platform:', diagramPlatform, 'Target platform:', platform);
    
    // All platforms support basic editing, format conversion handled elsewhere
    return platformFormats.length > 0;
  }

  // Get platform collaborative features
  private getPlatformFeatures(platform: string): PlatformEditor['collaborativeFeatures'] {
    const features = {
      visio: {
        realTimeEditing: true,
        comments: true,
        versionHistory: true,
        permissions: true
      },
      lucidchart: {
        realTimeEditing: true,
        comments: true,
        versionHistory: true,
        permissions: true
      },
      drawio: {
        realTimeEditing: false,
        comments: false,
        versionHistory: false,
        permissions: false
      }
    };
    
    return features[platform as keyof typeof features] || {
      realTimeEditing: false,
      comments: false,
      versionHistory: false,
      permissions: false
    };
  }

  // Add webhook listener for platform changes
  addChangeListener(platform: string, listener: Function): void {
    const listeners = this.webhookListeners.get(platform) || [];
    listeners.push(listener);
    this.webhookListeners.set(platform, listeners);
  }

  // Remove webhook listener
  removeChangeListener(platform: string, listener: Function): void {
    const listeners = this.webhookListeners.get(platform) || [];
    const filtered = listeners.filter(l => l !== listener);
    this.webhookListeners.set(platform, filtered);
  }
}

// Singleton instance
export const realTimeEditSync = new RealTimeEditSync();
