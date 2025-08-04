import React from 'react';

// Simple BPMN Icon Components using SVG shapes
export const StartEvent = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="white" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" fill="currentColor"/>
  </svg>
);

export const EndEvent = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="white" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" fill="currentColor"/>
  </svg>
);

export const Task = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const UserTask = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
    <circle cx="8" cy="12" r="2" fill="currentColor"/>
    <path d="M12 10 L20 10 M12 14 L20 14" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const GatewayParallel = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 22,12 12,22 2,12" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12 L16 12" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 8 L12 16" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const GatewayXOR = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 22,12 12,22 2,12" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 12 L16 12" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const DataObject = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="6" width="16" height="12" fill="white" stroke="currentColor" strokeWidth="2" transform="skewX(-10)"/>
  </svg>
);

export const SubprocessCollapsed = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="8" width="16" height="8" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const ManualTask = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 10 L18 10 M6 14 L18 14" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const BusinessRuleTask = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 10 L18 10 M6 14 L18 14 M6 18 L14 18" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const ReceiveTask = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 12 L18 12" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 8 L12 16" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const CallActivity = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="8" width="16" height="8" fill="white" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

export const GatewayComplex = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 22,12 12,22 2,12" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 8 L18 16 M6 16 L18 8" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const Group = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
  </svg>
);

export const Pool = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="6" width="16" height="12" fill="currentColor" opacity="0.1"/>
  </svg>
);

export const Process = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="6" width="20" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 12 L18 12" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// Export all BPMN icons
export const BPMNIcons = {
  // Events
  'start-event': StartEvent,
  'start-event-timer': StartEvent,
  'start-event-message': StartEvent,
  'start-event-signal': StartEvent,
  'intermediate-event-catch': StartEvent,
  'intermediate-event-catch-timer': StartEvent,
  'end-event': EndEvent,
  'end-event-error': EndEvent,
  
  // Activities
  'task': Task,
  'user-task': UserTask,
  'manual-task': ManualTask,
  'business-rule-task': BusinessRuleTask,
  'receive-task': ReceiveTask,
  'call-activity': CallActivity,
  'subprocess-collapsed': SubprocessCollapsed,
  
  // Gateways
  'gateway-parallel': GatewayParallel,
  'gateway-xor': GatewayXOR,
  'gateway-complex': GatewayComplex,
  
  // Data Objects
  'data-object': DataObject,
  'group': Group,
  'pool': Pool,
  'process': Process,
}; 