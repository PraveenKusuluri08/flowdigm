// Real-time synchronization service for bidirectional integration
import type { DiagramData, SyncResult, SyncConflict } from './bidirectionalIntegration';
import { syncWithPlatform, validateSyncedDiagram } from './bidirectionalIntegration';

export interface SyncService {
  start(): void;
  stop(): void;
  isRunning(): boolean;
  addPlatform(platform: string, config: PlatformConfig): void;
  removePlatform(platform: string): void;
  forcSync(platform?: string): Promise<SyncResult[]>;
}

export interface PlatformConfig {
  platform: string;
  syncInterval: number; // in milliseconds
  autoResolveConflicts: boolean;
  conflictResolution: 'local' | 'remote' | 'newest' | 'manual';
  webhookUrl?: string;
  apiKey?: string;
  enabled: boolean;
}

export interface SyncEvent {
  type: 'sync_start' | 'sync_complete' | 'sync_error' | 'conflict_detected' | 'diagram_updated';
  platform: string;
  timestamp: Date;
  data?: any;
  error?: string;
}

type SyncEventListener = (event: SyncEvent) => void;

class BidirectionalSyncService implements SyncService {
  private isActive = false;
  private intervals: Map<string, number> = new Map();
  private platforms: Map<string, PlatformConfig> = new Map();
  private listeners: Set<SyncEventListener> = new Set();
  private currentDiagram: DiagramData | null = null;
  private lastSyncTimes: Map<string, Date> = new Map();

  constructor() {
    // Initialize with default platform configurations
    this.addPlatform('visio', {
      platform: 'visio',
      syncInterval: 30000, // 30 seconds
      autoResolveConflicts: false,
      conflictResolution: 'manual',
      enabled: false
    });

    this.addPlatform('lucidchart', {
      platform: 'lucidchart',
      syncInterval: 60000, // 1 minute
      autoResolveConflicts: true,
      conflictResolution: 'newest',
      enabled: false
    });

    this.addPlatform('drawio', {
      platform: 'drawio',
      syncInterval: 45000, // 45 seconds
      autoResolveConflicts: true,
      conflictResolution: 'local',
      enabled: false
    });
  }

  // Event handling
  addEventListener(listener: SyncEventListener): void {
    this.listeners.add(listener);
  }

  removeEventListener(listener: SyncEventListener): void {
    this.listeners.delete(listener);
  }

  private emit(event: SyncEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in sync event listener:', error);
      }
    });
  }

  // Diagram management
  setCurrentDiagram(diagram: DiagramData | null): void {
    this.currentDiagram = diagram;
    if (diagram) {
      this.emit({
        type: 'diagram_updated',
        platform: diagram.platform,
        timestamp: new Date(),
        data: { diagramId: diagram.id, name: diagram.name }
      });
    }
  }

  getCurrentDiagram(): DiagramData | null {
    return this.currentDiagram;
  }

  // Platform management
  addPlatform(platform: string, config: PlatformConfig): void {
    this.platforms.set(platform, config);
    
    if (this.isActive && config.enabled) {
      this.startPlatformSync(platform);
    }
  }

  removePlatform(platform: string): void {
    this.stopPlatformSync(platform);
    this.platforms.delete(platform);
  }

  updatePlatformConfig(platform: string, config: Partial<PlatformConfig>): void {
    const existingConfig = this.platforms.get(platform);
    if (existingConfig) {
      const newConfig = { ...existingConfig, ...config };
      this.platforms.set(platform, newConfig);
      
      // Restart sync if interval changed
      if (config.syncInterval && this.isActive && newConfig.enabled) {
        this.stopPlatformSync(platform);
        this.startPlatformSync(platform);
      }
    }
  }

  getPlatformConfig(platform: string): PlatformConfig | undefined {
    return this.platforms.get(platform);
  }

  getAllPlatforms(): PlatformConfig[] {
    return Array.from(this.platforms.values());
  }

  // Sync service lifecycle
  start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    
    // Start sync for all enabled platforms
    this.platforms.forEach((config, platform) => {
      if (config.enabled) {
        this.startPlatformSync(platform);
      }
    });

    console.log('Bidirectional sync service started');
  }

  stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    // Stop all platform syncs
    this.intervals.forEach((_, platform) => {
      this.stopPlatformSync(platform);
    });

    console.log('Bidirectional sync service stopped');
  }

  isRunning(): boolean {
    return this.isActive;
  }

  // Platform-specific sync management
  private startPlatformSync(platform: string): void {
    const config = this.platforms.get(platform);
    if (!config || !config.enabled) return;

    // Clear existing interval if any
    this.stopPlatformSync(platform);

    // Set up recurring sync
    const interval = setInterval(() => {
      this.syncPlatform(platform);
    }, config.syncInterval);

    this.intervals.set(platform, interval);
    console.log(`Started sync for platform: ${platform} (interval: ${config.syncInterval}ms)`);
  }

  private stopPlatformSync(platform: string): void {
    const interval = this.intervals.get(platform);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(platform);
      console.log(`Stopped sync for platform: ${platform}`);
    }
  }

  // Core sync functionality
  private async syncPlatform(platform: string): Promise<void> {
    if (!this.currentDiagram) return;

    const config = this.platforms.get(platform);
    if (!config || !config.enabled) return;

    this.emit({
      type: 'sync_start',
      platform,
      timestamp: new Date()
    });

    try {
      const result = await syncWithPlatform(this.currentDiagram, platform, {
        direction: 'bidirectional'
      });

      this.lastSyncTimes.set(platform, new Date());

      if (result.success) {
        // Handle successful sync
        if (result.changes.length > 0) {
          await this.handleSyncChanges(platform, result);
        }

        if (result.conflicts.length > 0) {
          await this.handleSyncConflicts(platform, result.conflicts, config);
        }

        this.emit({
          type: 'sync_complete',
          platform,
          timestamp: new Date(),
          data: {
            changes: result.changes.length,
            conflicts: result.conflicts.length
          }
        });
      } else {
        throw new Error(result.errors.join(', '));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      
      this.emit({
        type: 'sync_error',
        platform,
        timestamp: new Date(),
        error: errorMessage
      });

      console.error(`Sync failed for platform ${platform}:`, errorMessage);
    }
  }

  private async handleSyncChanges(platform: string, result: SyncResult): Promise<void> {
    if (!this.currentDiagram) return;

    // Apply changes to current diagram
    let hasChanges = false;
    const updatedDiagram = { ...this.currentDiagram };

    for (const change of result.changes) {
      switch (change.type) {
        case 'added':
          if (change.elementType === 'node' && change.newValue) {
            updatedDiagram.nodes.push(change.newValue);
            hasChanges = true;
          } else if (change.elementType === 'edge' && change.newValue) {
            updatedDiagram.edges.push(change.newValue);
            hasChanges = true;
          }
          break;
          
        case 'modified':
          if (change.elementType === 'node' && change.newValue) {
            const nodeIndex = updatedDiagram.nodes.findIndex(n => n.id === change.elementId);
            if (nodeIndex >= 0) {
              updatedDiagram.nodes[nodeIndex] = change.newValue;
              hasChanges = true;
            }
          } else if (change.elementType === 'edge' && change.newValue) {
            const edgeIndex = updatedDiagram.edges.findIndex(e => e.id === change.elementId);
            if (edgeIndex >= 0) {
              updatedDiagram.edges[edgeIndex] = change.newValue;
              hasChanges = true;
            }
          }
          break;
          
        case 'deleted':
          if (change.elementType === 'node') {
            updatedDiagram.nodes = updatedDiagram.nodes.filter(n => n.id !== change.elementId);
            hasChanges = true;
          } else if (change.elementType === 'edge') {
            updatedDiagram.edges = updatedDiagram.edges.filter(e => e.id !== change.elementId);
            hasChanges = true;
          }
          break;
      }
    }

    if (hasChanges) {
      updatedDiagram.lastModified = new Date();
      updatedDiagram.version += 1;
      
      // Validate the updated diagram
      const validationResults = validateSyncedDiagram(updatedDiagram);
      const hasValidationErrors = validationResults.some(r => !r.isValid);
      
      if (hasValidationErrors) {
        console.warn(`Validation errors detected after sync from ${platform}:`, validationResults);
      }

      this.setCurrentDiagram(updatedDiagram);
    }
  }

  private async handleSyncConflicts(
    platform: string, 
    conflicts: SyncConflict[], 
    config: PlatformConfig
  ): Promise<void> {
    this.emit({
      type: 'conflict_detected',
      platform,
      timestamp: new Date(),
      data: { conflicts: conflicts.length }
    });

    if (config.autoResolveConflicts) {
      await this.resolveConflictsAutomatically(conflicts, config.conflictResolution);
    } else {
      // Store conflicts for manual resolution
      console.log(`Manual conflict resolution required for ${platform}:`, conflicts);
    }
  }

  private async resolveConflictsAutomatically(
    conflicts: SyncConflict[], 
    strategy: PlatformConfig['conflictResolution']
  ): Promise<void> {
    for (const conflict of conflicts) {
      switch (strategy) {
        case 'local':
          // Keep local version, no action needed
          break;
          
        case 'remote':
          // Apply remote version
          await this.applyConflictResolution(conflict, 'remote');
          break;
          
        case 'newest':
          // Choose based on timestamp (if available)
          const useRemote = this.isRemoteNewer(conflict);
          await this.applyConflictResolution(conflict, useRemote ? 'remote' : 'local');
          break;
          
        case 'manual':
          // Should not reach here if autoResolveConflicts is true
          console.warn('Manual conflict resolution strategy with auto-resolve enabled');
          break;
      }
    }
  }

  private isRemoteNewer(conflict: SyncConflict): boolean {
    // This would need to be implemented based on the specific conflict data structure
    // For now, we'll default to remote being newer
    console.log('Checking if remote is newer for conflict:', conflict.elementId);
    return true;
  }

  private async applyConflictResolution(conflict: SyncConflict, resolution: 'local' | 'remote'): Promise<void> {
    if (!this.currentDiagram || resolution === 'local') return;

    // Apply remote resolution
    const updatedDiagram = { ...this.currentDiagram };
    
    if (conflict.elementType === 'node') {
      const nodeIndex = updatedDiagram.nodes.findIndex(n => n.id === conflict.elementId);
      if (nodeIndex >= 0 && conflict.remoteValue) {
        updatedDiagram.nodes[nodeIndex] = conflict.remoteValue;
      }
    } else if (conflict.elementType === 'edge') {
      const edgeIndex = updatedDiagram.edges.findIndex(e => e.id === conflict.elementId);
      if (edgeIndex >= 0 && conflict.remoteValue) {
        updatedDiagram.edges[edgeIndex] = conflict.remoteValue;
      }
    }

    this.setCurrentDiagram(updatedDiagram);
  }

  // Force sync functionality
  async forcSync(platform?: string): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    if (platform) {
      // Sync specific platform
      await this.syncPlatform(platform);
      // Note: We can't easily return the result here due to the async nature
      // In a real implementation, we'd need to modify syncPlatform to return the result
    } else {
      // Sync all enabled platforms
      const enabledPlatforms = Array.from(this.platforms.entries())
        .filter(([, config]) => config.enabled)
        .map(([platform]) => platform);

      for (const p of enabledPlatforms) {
        await this.syncPlatform(p);
      }
    }

    return results;
  }

  // Utility methods
  getLastSyncTime(platform: string): Date | undefined {
    return this.lastSyncTimes.get(platform);
  }

  getActivePlatforms(): string[] {
    return Array.from(this.intervals.keys());
  }

  getSyncStatus(): Record<string, { 
    enabled: boolean; 
    lastSync?: Date; 
    nextSync?: Date; 
    interval: number; 
  }> {
    const status: Record<string, any> = {};
    
    this.platforms.forEach((config, platform) => {
      const lastSync = this.lastSyncTimes.get(platform);
      const nextSync = lastSync 
        ? new Date(lastSync.getTime() + config.syncInterval)
        : undefined;

      status[platform] = {
        enabled: config.enabled,
        lastSync,
        nextSync,
        interval: config.syncInterval
      };
    });

    return status;
  }
}

// Singleton instance
export const syncService = new BidirectionalSyncService();

// Export the class for testing/advanced usage
export { BidirectionalSyncService };
