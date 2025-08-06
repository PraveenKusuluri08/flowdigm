# Bidirectional Integration Feature

This document describes the comprehensive bidirectional integration system that enables seamless synchronization between your flowchart application and external platforms like Visio, Lucidchart, and Draw.io.

## Overview

The bidirectional integration feature provides:

- **Real-time synchronization** with external platforms
- **File import/export** capabilities for various formats
- **Conflict resolution** for simultaneous edits
- **Automatic shape validation** during sync
- **Platform-specific format conversion**

## Supported Platforms

### Microsoft Visio
- **File Formats**: `.vsdx`, `.vsd`, `.xml`
- **Capabilities**: Import/Export diagrams, shape mapping
- **Sync Method**: File-based synchronization

### Lucidchart
- **File Formats**: `.json`, `.xml`
- **Capabilities**: API-based sync, real-time collaboration
- **Sync Method**: REST API integration

### Draw.io
- **File Formats**: `.drawio`, `.xml`, `.svg`, `.png`
- **Capabilities**: XML-based import/export
- **Sync Method**: File-based synchronization

## Key Features

### 1. Smart Shape Mapping
The system automatically maps shapes between different platforms:

```typescript
const PLATFORM_SHAPE_MAPPING = {
  visio: {
    'rectangle': 'Process',
    'diamond': 'Decision',
    'circle': 'Connector'
  },
  lucidchart: {
    'rectangle': 'process',
    'diamond': 'decision',
    'circle': 'start_end'
  },
  drawio: {
    'rectangle': 'swimlane',
    'diamond': 'rhombus',
    'circle': 'ellipse'
  }
};
```

### 2. Real-time Synchronization
Automatic synchronization with configurable intervals:

- **Visio**: 30 seconds (file-based)
- **Lucidchart**: 60 seconds (API-based)
- **Draw.io**: 45 seconds (file-based)

### 3. Conflict Resolution
When conflicts occur during synchronization, the system provides:

- **Manual Resolution**: User chooses which version to keep
- **Automatic Resolution**: Based on timestamps or platform priority
- **Merge Strategy**: Intelligent merging of non-conflicting changes

### 4. Validation Integration
All imported diagrams are automatically validated using the existing shape validation system:

```typescript
export function validateSyncedDiagram(diagram: DiagramData): ValidationResult[] {
  return diagram.nodes.map(node => validateShapeLabel(node.data));
}
```

## Usage

### Opening the Integration Panel

Click the ⚡ Integration button in the left sidebar to open the integration panel.

### Importing Diagrams

1. Open the Integration Panel
2. Go to the **Import** tab
3. Drag and drop files or click "Choose File"
4. Supported formats: `.vsdx`, `.vsd`, `.xml`, `.drawio`, `.json`

### Exporting Diagrams

1. Open the Integration Panel
2. Go to the **Export** tab
3. Choose your desired format:
   - Visio (VSDX)
   - Lucidchart (JSON)
   - Draw.io (XML)
   - Generic XML

### Setting up Synchronization

1. Open the Integration Panel
2. Go to the **Sync** tab
3. Enable desired platforms
4. Configure sync intervals and conflict resolution
5. Click "Sync Now" for manual sync or enable auto-sync

## Technical Architecture

### Core Components

#### 1. Integration Utilities (`bidirectionalIntegration.ts`)
- Platform format conversion
- Shape mapping between platforms
- Sync result handling

#### 2. File Handlers (`fileHandlers.ts`)
- File parsing for different formats
- Export functionality
- VSDX ZIP handling with JSZip

#### 3. Sync Service (`syncService.ts`)
- Real-time synchronization engine
- Event-driven architecture
- Conflict resolution logic

#### 4. React Integration (`useBidirectionalIntegration.tsx`)
- React hooks for integration state
- Component integration
- Event handling

#### 5. UI Components (`IntegrationPanel.tsx`)
- User interface for integration
- Import/Export controls
- Sync status monitoring

### Data Flow

```
External Platform ↔ File Handler ↔ Format Converter ↔ Sync Service ↔ React App
```

1. **Import**: External file → Parse → Convert → Validate → Display
2. **Export**: Internal data → Convert → Format → Download
3. **Sync**: Monitor → Detect changes → Resolve conflicts → Update

## Configuration

### Platform Configuration

```typescript
interface PlatformConfig {
  platform: string;
  syncInterval: number; // milliseconds
  autoResolveConflicts: boolean;
  conflictResolution: 'local' | 'remote' | 'newest' | 'manual';
  webhookUrl?: string;
  apiKey?: string;
  enabled: boolean;
}
```

### Usage Example

```typescript
// Enable Lucidchart sync with 2-minute intervals
syncService.updatePlatformConfig('lucidchart', {
  enabled: true,
  syncInterval: 120000,
  autoResolveConflicts: true,
  conflictResolution: 'newest'
});
```

## API Reference

### Core Functions

#### Import/Export
```typescript
// Import a diagram file
const diagram = await importDiagramFile(file);

// Export to specific format
const blob = await exportDiagramFile(diagram, 'vsdx');
```

#### Synchronization
```typescript
// Start sync service
syncService.start();

// Force sync specific platform
await syncService.forceSync('lucidchart');

// Listen to sync events
syncService.addEventListener((event) => {
  console.log('Sync event:', event);
});
```

#### React Hooks
```typescript
// Main integration hook
const [state, actions] = useBidirectionalIntegration({
  autoStart: true,
  enabledPlatforms: ['lucidchart', 'drawio']
});

// Platform-specific hook
const { config, status, forceSync } = usePlatformSync('visio');

// Event monitoring hook
const { events, recentErrors } = useSyncEvents({
  platforms: ['lucidchart'],
  eventTypes: ['sync_error']
});
```

## Error Handling

The integration system provides comprehensive error handling:

### Common Errors
- **File Format Errors**: Invalid or corrupted files
- **Network Errors**: API connectivity issues
- **Validation Errors**: Shape validation failures
- **Conflict Errors**: Synchronization conflicts

### Error Recovery
- Automatic retry for network issues
- Fallback to manual conflict resolution
- Graceful degradation for unsupported features

## Security Considerations

### API Keys
- Store API keys securely
- Use environment variables for sensitive data
- Implement token refresh mechanisms

### File Handling
- Validate file types and sizes
- Sanitize imported data
- Prevent malicious file uploads

### Data Privacy
- Local processing when possible
- Encrypted API communications
- User consent for cloud synchronization

## Performance Optimization

### Efficient Syncing
- Delta synchronization (only changes)
- Compression for large diagrams
- Batched API requests

### Memory Management
- Stream processing for large files
- Garbage collection optimization
- Background processing

## Future Enhancements

### Planned Features
1. **Microsoft Teams Integration**
2. **Google Drawings Support**
3. **Miro Integration**
4. **Real-time Collaborative Editing**
5. **Version History**
6. **Advanced Conflict Resolution UI**

### Potential Improvements
- Machine learning for better shape mapping
- Predictive conflict detection
- Custom platform integrations
- Workflow automation

## Troubleshooting

### Common Issues

#### Import Failures
- Check file format compatibility
- Verify file is not corrupted
- Ensure file size limits

#### Sync Issues
- Verify API credentials
- Check network connectivity
- Review platform-specific settings

#### Performance Problems
- Reduce sync frequency
- Optimize diagram complexity
- Check browser memory usage

### Debug Tools

Enable debug logging:
```typescript
// Enable verbose logging
console.log('Debug mode enabled');
syncService.addEventListener(console.log);
```

## Contributing

To contribute to the bidirectional integration feature:

1. Follow the existing architecture patterns
2. Add comprehensive tests for new platforms
3. Update documentation for new features
4. Ensure compatibility with existing validation system

## License

This bidirectional integration feature is part of the main application and follows the same licensing terms.
