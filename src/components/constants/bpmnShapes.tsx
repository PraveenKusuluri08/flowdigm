import React from 'react';

// BPMN Event Icons as React Components
const BPMNEventIcons = {
  'bpmn-start-event': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" fill="#4ade80" stroke="#22c55e"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
    </svg>
  ),
  'bpmn-intermediate-event': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" fill="white" stroke="#6b7280"/>
      <circle cx="12" cy="12" r="6" fill="white" stroke="#6b7280"/>
    </svg>
  ),
  'bpmn-end-event': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" fill="#ef4444" stroke="#dc2626"/>
      <circle cx="12" cy="12" r="6" fill="#ef4444"/>
    </svg>
  ),
  'bpmn-message-start': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" fill="#4ade80" stroke="#22c55e"/>
      <path d="M8 9h8M8 12h6M8 15h4" stroke="white" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-timer-start': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" fill="#4ade80" stroke="#22c55e"/>
      <circle cx="12" cy="12" r="6" fill="white"/>
      <path d="M12 6v6l4 2" stroke="#22c55e" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-signal-start': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" fill="#4ade80" stroke="#22c55e"/>
      <path d="M12 2l3 9h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="white"/>
    </svg>
  )
};

// BPMN Activity Icons as React Components
const BPMNActivityIcons = {
  'bpmn-task': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="3" y="6" width="18" height="12" rx="2" fill="white" stroke="#6b7280"/>
      <path d="M8 10h8M8 13h6M8 16h4" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-user-task': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="3" y="6" width="18" height="12" rx="2" fill="white" stroke="#6b7280"/>
      <circle cx="12" cy="10" r="2" fill="#6b7280"/>
      <path d="M8 16c0-2 1.5-3 4-3s4 1 4 3" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-service-task': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="3" y="6" width="18" height="12" rx="2" fill="white" stroke="#6b7280"/>
      <path d="M12 8l-2 4 2 4 2-4-2-4z" fill="#6b7280"/>
    </svg>
  ),
  'bpmn-script-task': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="3" y="6" width="18" height="12" rx="2" fill="white" stroke="#6b7280"/>
      <path d="M8 10l2 2 6-6" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-subprocess': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="3" y="6" width="18" height="12" rx="2" fill="white" stroke="#6b7280"/>
      <rect x="6" y="9" width="12" height="6" fill="white" stroke="#6b7280" strokeWidth="1"/>
      <path d="M9 12h6" stroke="#6b7280" strokeWidth="1"/>
    </svg>
  )
};

// BPMN Gateway Icons as React Components
const BPMNGatewayIcons = {
  'bpmn-exclusive-gateway': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <polygon points="12,2 22,12 12,22 2,12" fill="white" stroke="#6b7280"/>
      <path d="M9 12h6" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-parallel-gateway': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <polygon points="12,2 22,12 12,22 2,12" fill="white" stroke="#6b7280"/>
      <path d="M9 12h6M12 9v6" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-inclusive-gateway': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <polygon points="12,2 22,12 12,22 2,12" fill="white" stroke="#6b7280"/>
      <circle cx="12" cy="12" r="3" fill="white" stroke="#6b7280"/>
    </svg>
  ),
  'bpmn-event-gateway': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <polygon points="12,2 22,12 12,22 2,12" fill="white" stroke="#6b7280"/>
      <circle cx="12" cy="12" r="4" fill="white" stroke="#6b7280"/>
    </svg>
  )
};

// BPMN Data Icons as React Components
const BPMNDataIcons = {
  'bpmn-data-object': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M4 6h16v12H4z" fill="white" stroke="#6b7280"/>
      <path d="M4 6l4-2h8l4 2" fill="white" stroke="#6b7280"/>
      <path d="M8 10h8M8 13h6M8 16h4" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-data-store': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="4" y="8" width="16" height="8" fill="white" stroke="#6b7280"/>
      <path d="M4 8l4-2h8l4 2" fill="white" stroke="#6b7280"/>
      <path d="M8 12h8M8 15h6" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-data-input': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M4 6h16v12H4z" fill="white" stroke="#6b7280"/>
      <path d="M4 6l4-2h8l4 2" fill="white" stroke="#6b7280"/>
      <path d="M8 10h8M8 13h6" stroke="#6b7280" strokeWidth="1.5"/>
      <path d="M12 16l2-2 2 2" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-data-output': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M4 6h16v12H4z" fill="white" stroke="#6b7280"/>
      <path d="M4 6l4-2h8l4 2" fill="white" stroke="#6b7280"/>
      <path d="M8 10h8M8 13h6" stroke="#6b7280" strokeWidth="1.5"/>
      <path d="M12 16l-2-2-2 2" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  )
};

// BPMN Artifact Icons as React Components
const BPMNArtifactIcons = {
  'bpmn-text-annotation': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M4 6h16v12H4z" fill="white" stroke="#6b7280"/>
      <path d="M8 10h8M8 13h6M8 16h4" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  ),
  'bpmn-group': () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="2" y="4" width="20" height="16" fill="none" stroke="#6b7280" strokeDasharray="4 2"/>
      <path d="M6 8h12M6 12h12M6 16h8" stroke="#6b7280" strokeWidth="1.5"/>
    </svg>
  )
};

// Combine all BPMN icons
export const BPMNIcons = {
  ...BPMNEventIcons,
  ...BPMNActivityIcons,
  ...BPMNGatewayIcons,
  ...BPMNDataIcons,
  ...BPMNArtifactIcons
};

// BPMN Shape Categories
export const bpmnShapes = {
  events: {
    name: 'Events',
    icon: '⚡',
    collapsed: false,
    layout: 'grid',
    shapes: {
      'bpmn-start-event': {
        name: 'Start Event',
        tooltip: 'Process start point',
        icon: BPMNIcons['bpmn-start-event'],
        width: 40,
        height: 40
      },
      'bpmn-intermediate-event': {
        name: 'Intermediate Event',
        tooltip: 'Event during process',
        icon: BPMNIcons['bpmn-intermediate-event'],
        width: 40,
        height: 40
      },
      'bpmn-end-event': {
        name: 'End Event',
        tooltip: 'Process end point',
        icon: BPMNIcons['bpmn-end-event'],
        width: 40,
        height: 40
      },
      'bpmn-message-start': {
        name: 'Message Start',
        tooltip: 'Message-triggered start',
        icon: BPMNIcons['bpmn-message-start'],
        width: 40,
        height: 40
      },
      'bpmn-timer-start': {
        name: 'Timer Start',
        tooltip: 'Timer-triggered start',
        icon: BPMNIcons['bpmn-timer-start'],
        width: 40,
        height: 40
      },
      'bpmn-signal-start': {
        name: 'Signal Start',
        tooltip: 'Signal-triggered start',
        icon: BPMNIcons['bpmn-signal-start'],
        width: 40,
        height: 40
      }
    }
  },
  
  activities: {
    name: 'Activities',
    icon: '📋',
    collapsed: true,
    layout: 'grid',
    shapes: {
      'bpmn-task': {
        name: 'Task',
        tooltip: 'Basic task activity',
        icon: BPMNIcons['bpmn-task'],
        width: 100,
        height: 60
      },
      'bpmn-user-task': {
        name: 'User Task',
        tooltip: 'Human-performed task',
        icon: BPMNIcons['bpmn-user-task'],
        width: 100,
        height: 60
      },
      'bpmn-service-task': {
        name: 'Service Task',
        tooltip: 'Automated service task',
        icon: BPMNIcons['bpmn-service-task'],
        width: 100,
        height: 60
      },
      'bpmn-script-task': {
        name: 'Script Task',
        tooltip: 'Script execution task',
        icon: BPMNIcons['bpmn-script-task'],
        width: 100,
        height: 60
      },
      'bpmn-subprocess': {
        name: 'Subprocess',
        tooltip: 'Embedded subprocess',
        icon: BPMNIcons['bpmn-subprocess'],
        width: 120,
        height: 80
      }
    }
  },
  
  gateways: {
    name: 'Gateways',
    icon: '🔀',
    collapsed: true,
    layout: 'grid',
    shapes: {
      'bpmn-exclusive-gateway': {
        name: 'Exclusive Gateway',
        tooltip: 'XOR decision point',
        icon: BPMNIcons['bpmn-exclusive-gateway'],
        width: 50,
        height: 50
      },
      'bpmn-parallel-gateway': {
        name: 'Parallel Gateway',
        tooltip: 'AND split/join',
        icon: BPMNIcons['bpmn-parallel-gateway'],
        width: 50,
        height: 50
      },
      'bpmn-inclusive-gateway': {
        name: 'Inclusive Gateway',
        tooltip: 'OR decision point',
        icon: BPMNIcons['bpmn-inclusive-gateway'],
        width: 50,
        height: 50
      },
      'bpmn-event-gateway': {
        name: 'Event Gateway',
        tooltip: 'Event-based gateway',
        icon: BPMNIcons['bpmn-event-gateway'],
        width: 50,
        height: 50
      }
    }
  },
  
  data: {
    name: 'Data Objects',
    icon: '💾',
    collapsed: true,
    layout: 'grid',
    shapes: {
      'bpmn-data-object': {
        name: 'Data Object',
        tooltip: 'Process data',
        icon: BPMNIcons['bpmn-data-object'],
        width: 80,
        height: 60
      },
      'bpmn-data-store': {
        name: 'Data Store',
        tooltip: 'Persistent data',
        icon: BPMNIcons['bpmn-data-store'],
        width: 80,
        height: 60
      },
      'bpmn-data-input': {
        name: 'Data Input',
        tooltip: 'Input data',
        icon: BPMNIcons['bpmn-data-input'],
        width: 80,
        height: 60
      },
      'bpmn-data-output': {
        name: 'Data Output',
        tooltip: 'Output data',
        icon: BPMNIcons['bpmn-data-output'],
        width: 80,
        height: 60
      }
    }
  },
  
  artifacts: {
    name: 'Artifacts',
    icon: '📝',
    collapsed: true,
    layout: 'grid',
    shapes: {
      'bpmn-text-annotation': {
        name: 'Text Annotation',
        tooltip: 'Additional information',
        icon: BPMNIcons['bpmn-text-annotation'],
        width: 80,
        height: 60
      },
      'bpmn-group': {
        name: 'Group',
        tooltip: 'Logical grouping',
        icon: BPMNIcons['bpmn-group'],
        width: 120,
        height: 80
      }
    }
  }
}; 