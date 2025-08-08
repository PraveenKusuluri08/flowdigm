// React hook for bidirectional integration
import { useState, useEffect, useCallback, useRef } from 'react';
import type { DiagramData, SyncResult } from '../utils/bidirectionalIntegration';

// Stub implementation for syncService
const syncService = {
  addEventListener: (handler: any) => {},
  removeEventListener: (handler: any) => {},
  getPlatformConfig: (platform: string) => null,
  updatePlatformConfig: (platform: string, config: any) => {},
  start: () => {},
  stop: () => {}
};

export interface SyncEvent {
  type: string;
  platform: string;
  timestamp: Date;
  data?: any;
}

export interface PlatformConfig {
  platform: string;
  enabled: boolean;
  interval: number;
  lastSync?: Date;
}

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
  const updateState = () => {
    // This would update state based on service state
    // For now, just a placeholder
  };

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
    setCurrentDiagram(diagram);
  }, []);

  const updatePlatformConfig = useCallback((platform: string, config: Partial<PlatformConfig>) => {
    syncService.updatePlatformConfig(platform, config);
    setPlatforms(prev => 
      prev.map(p => p.platform === platform ? { ...p, ...config } : p)
    );
  }, []);

  const forceSync = useCallback(async (platform?: string): Promise<SyncResult[]> => {
    // Placeholder implementation
    return [];
  }, []);

  const clearEvents = useCallback(() => {
    setRecentEvents([]);
  }, []);

  return [
    {
      isActive,
      currentDiagram,
      platforms,
      syncStatuses,
      recentEvents
    },
    {
      startSync,
      stopSync,
      setDiagram,
      updatePlatformConfig,
      forceSync,
      clearEvents
    }
  ];
}

// Additional hooks for specific use cases
export function usePlatformSync(platform: string) {
  const [state, actions] = useBidirectionalIntegration({
    enabledPlatforms: [platform]
  });

  return {
    ...state,
    ...actions,
    platform
  };
}

export function useSyncEvents(options: {
  platforms?: string[];
  eventTypes?: SyncEvent['type'][];
  maxEvents?: number;
} = {}) {
  const { platforms = [], eventTypes = [], maxEvents = 50 } = options;
  const [state] = useBidirectionalIntegration();

  const filteredEvents = state.recentEvents.filter(event => {
    if (platforms.length > 0 && !platforms.includes(event.platform)) {
      return false;
    }
    if (eventTypes.length > 0 && !eventTypes.includes(event.type)) {
      return false;
    }
    return true;
  }).slice(0, maxEvents);

  return {
    events: filteredEvents,
    totalEvents: state.recentEvents.length
  };
}

export function useIntegrationPanel() {
  const [state, actions] = useBidirectionalIntegration({
    autoStart: true
  });

  return {
    ...state,
    ...actions,
    isConnected: state.platforms.some(p => p.enabled),
    activePlatforms: state.platforms.filter(p => p.enabled)
  };
}
