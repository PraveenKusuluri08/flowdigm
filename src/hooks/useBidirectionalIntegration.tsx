// React hook for bidirectional integration
import { useState, useEffect, useCallback, useRef } from 'react';
import type { DiagramData, SyncResult } from '../utils/bidirectionalIntegration';
import type { SyncEvent, PlatformConfig } from '../utils/syncService';
import { syncService } from '../utils/syncService';

export interface UseBidirectionalIntegrationOptions {
  autoStart?: boolean;
  enabledPlatforms?: string[];
  onSyncEvent?: (event: SyncEvent) => void;
}

export interface BidirectionalIntegrationState {
  isActive: boolean;
  currentDiagram: DiagramData | null;
  platforms: PlatformConfig[];
  syncStatuses: Record<string, {
    enabled: boolean;
    lastSync?: Date;
    nextSync?: Date;
    interval: number;
  }>;
  recentEvents: SyncEvent[];
}

export interface BidirectionalIntegrationActions {
  startSync: () => void;
  stopSync: () => void;
  setDiagram: (diagram: DiagramData | null) => void;
  updatePlatformConfig: (platform: string, config: Partial<PlatformConfig>) => void;
  forceSync: (platform?: string) => Promise<SyncResult[]>;
  clearEvents: () => void;
}

export function useBidirectionalIntegration(
  options: UseBidirectionalIntegrationOptions = {}
): [BidirectionalIntegrationState, BidirectionalIntegrationActions] {
  const { autoStart = false, enabledPlatforms = [], onSyncEvent } = options;
  
  // State
  const [isActive, setIsActive] = useState(false);
  const [currentDiagram, setCurrentDiagram] = useState<DiagramData | null>(null);
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([]);
  const [syncStatuses, setSyncStatuses] = useState<Record<string, any>>({});
  const [recentEvents, setRecentEvents] = useState<SyncEvent[]>([]);
  
  // Refs for callbacks
  const onSyncEventRef = useRef(onSyncEvent);
  const maxEventsRef = useRef(50); // Maximum number of events to keep
  
  // Update ref when callback changes
  useEffect(() => {
    onSyncEventRef.current = onSyncEvent;
  }, [onSyncEvent]);

  // Sync event handler
  const handleSyncEvent = useCallback((event: SyncEvent) => {
    // Add to recent events
    setRecentEvents(prev => {
      const newEvents = [event, ...prev];
      return newEvents.slice(0, maxEventsRef.current);
    });

    // Call external handler if provided
    if (onSyncEventRef.current) {
      onSyncEventRef.current(event);
    }
  }, []);

  // Initialize sync service
  useEffect(() => {
    // Add event listener
    syncService.addEventListener(handleSyncEvent);

    // Enable specified platforms
    if (enabledPlatforms.length > 0) {
      enabledPlatforms.forEach(platform => {
        const config = syncService.getPlatformConfig(platform);
        if (config) {
          syncService.updatePlatformConfig(platform, { enabled: true });
        }
      });
    }

    // Auto-start if requested
    if (autoStart) {
      syncService.start();
      setIsActive(true);
    }

    // Cleanup on unmount
    return () => {
      syncService.removeEventListener(handleSyncEvent);
      if (autoStart) {
        syncService.stop();
      }
    };
  }, [autoStart, enabledPlatforms, handleSyncEvent]);

  // Update state when service state changes
  useEffect(() => {
    const updateState = () => {
      setIsActive(syncService.isRunning());
      setCurrentDiagram(syncService.getCurrentDiagram());
      setPlatforms(syncService.getAllPlatforms());
      setSyncStatuses(syncService.getSyncStatus());
    };

    // Initial state update
    updateState();

    // Set up periodic state updates
    const interval = setInterval(updateState, 1000);

    return () => clearInterval(interval);
  }, []);

  // Actions
  const startSync = useCallback(() => {
    syncService.start();
    setIsActive(true);
  }, []);

  const stopSync = useCallback(() => {
    syncService.stop();
    setIsActive(false);
  }, []);

  const setDiagram = useCallback((diagram: DiagramData | null) => {
    syncService.setCurrentDiagram(diagram);
    setCurrentDiagram(diagram);
  }, []);

  const updatePlatformConfig = useCallback((platform: string, config: Partial<PlatformConfig>) => {
    syncService.updatePlatformConfig(platform, config);
    // State will be updated by the periodic update
  }, []);

  const forceSync = useCallback(async (platform?: string): Promise<SyncResult[]> => {
    return await syncService.forcSync(platform);
  }, []);

  const clearEvents = useCallback(() => {
    setRecentEvents([]);
  }, []);

  // State object
  const state: BidirectionalIntegrationState = {
    isActive,
    currentDiagram,
    platforms,
    syncStatuses,
    recentEvents
  };

  // Actions object
  const actions: BidirectionalIntegrationActions = {
    startSync,
    stopSync,
    setDiagram,
    updatePlatformConfig,
    forceSync,
    clearEvents
  };

  return [state, actions];
}

// Hook for platform-specific sync status
export function usePlatformSync(platform: string) {
  const [state, actions] = useBidirectionalIntegration();
  
  const platformConfig = state.platforms.find(p => p.platform === platform);
  const platformStatus = state.syncStatuses[platform];
  const platformEvents = state.recentEvents.filter(e => e.platform === platform);

  const updateConfig = useCallback((config: Partial<PlatformConfig>) => {
    actions.updatePlatformConfig(platform, config);
  }, [actions, platform]);

  const forceSync = useCallback(async () => {
    return await actions.forceSync(platform);
  }, [actions, platform]);

  return {
    config: platformConfig,
    status: platformStatus,
    events: platformEvents,
    updateConfig,
    forceSync,
    isEnabled: platformConfig?.enabled || false,
    isActive: state.isActive
  };
}

// Hook for sync event monitoring
export function useSyncEvents(options: {
  platforms?: string[];
  eventTypes?: SyncEvent['type'][];
  maxEvents?: number;
} = {}) {
  const { platforms, eventTypes, maxEvents = 20 } = options;
  const [state] = useBidirectionalIntegration();

  const filteredEvents = state.recentEvents
    .filter(event => {
      if (platforms && !platforms.includes(event.platform)) return false;
      if (eventTypes && !eventTypes.includes(event.type)) return false;
      return true;
    })
    .slice(0, maxEvents);

  const eventsByType = filteredEvents.reduce((acc, event) => {
    if (!acc[event.type]) acc[event.type] = [];
    acc[event.type].push(event);
    return acc;
  }, {} as Record<string, SyncEvent[]>);

  const eventsByPlatform = filteredEvents.reduce((acc, event) => {
    if (!acc[event.platform]) acc[event.platform] = [];
    acc[event.platform].push(event);
    return acc;
  }, {} as Record<string, SyncEvent[]>);

  const recentErrors = filteredEvents
    .filter(event => event.type === 'sync_error')
    .slice(0, 5);

  const recentConflicts = filteredEvents
    .filter(event => event.type === 'conflict_detected')
    .slice(0, 5);

  return {
    events: filteredEvents,
    eventsByType,
    eventsByPlatform,
    recentErrors,
    recentConflicts,
    totalEvents: filteredEvents.length
  };
}

// Hook for integration panel state
export function useIntegrationPanel() {
  const [state, actions] = useBidirectionalIntegration();
  const [isVisible, setIsVisible] = useState(false);

  const openPanel = useCallback(() => setIsVisible(true), []);
  const closePanel = useCallback(() => setIsVisible(false), []);
  const togglePanel = useCallback(() => setIsVisible(prev => !prev), []);

  const handleDiagramImport = useCallback((diagram: DiagramData) => {
    actions.setDiagram(diagram);
    // Auto-enable sync for the imported platform
    const platformConfig = state.platforms.find(p => p.platform === diagram.platform);
    if (platformConfig && !platformConfig.enabled) {
      actions.updatePlatformConfig(diagram.platform, { enabled: true });
    }
  }, [actions, state.platforms]);

  const handleDiagramUpdate = useCallback((diagram: DiagramData) => {
    actions.setDiagram(diagram);
  }, [actions]);

  return {
    ...state,
    ...actions,
    isVisible,
    openPanel,
    closePanel,
    togglePanel,
    handleDiagramImport,
    handleDiagramUpdate
  };
}
