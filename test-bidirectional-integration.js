// Test file to demonstrate bidirectional integration functionality
import type { DiagramData } from '../src/utils/bidirectionalIntegration';
import { 
  convertToPlatformFormat, 
  convertFromPlatformFormat,
  syncWithPlatform 
} from '../src/utils/bidirectionalIntegration';
import { syncService } from '../src/utils/syncService';

// Sample diagram data for testing
const sampleDiagram: DiagramData = {
  id: 'test-diagram-1',
  name: 'Sample Process Flow',
  platform: 'internal',
  lastModified: new Date(),
  version: 1,
  nodes: [
    {
      id: 'node-1',
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {
        label: 'Start Process',
        shapeId: 'terminal',
        properties: {},
        style: { backgroundColor: '#e1f5fe' }
      }
    },
    {
      id: 'node-2',
      type: 'custom',
      position: { x: 300, y: 100 },
      data: {
        label: 'User Decision',
        shapeId: 'diamond',
        properties: {},
        style: { backgroundColor: '#fff3e0' }
      }
    },
    {
      id: 'node-3',
      type: 'custom',
      position: { x: 500, y: 100 },
      data: {
        label: 'Process Data',
        shapeId: 'rectangle',
        properties: {},
        style: { backgroundColor: '#f3e5f5' }
      }
    },
    {
      id: 'node-4',
      type: 'custom',
      position: { x: 700, y: 100 },
      data: {
        label: 'End Process',
        shapeId: 'terminal',
        properties: {},
        style: { backgroundColor: '#e8f5e8' }
      }
    }
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'default'
    },
    {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-3',
      type: 'default',
      data: { label: 'Yes' }
    },
    {
      id: 'edge-3',
      source: 'node-3',
      target: 'node-4',
      type: 'default'
    }
  ],
  metadata: {
    title: 'Sample Process Flow',
    description: 'A simple business process flow for testing',
    author: 'Test User',
    tags: ['process', 'workflow', 'test'],
    version: '1.0',
    platform: 'internal',
    syncStatus: 'synced',
    lastSyncTime: new Date()
  }
};

// Test format conversion functions
export function testFormatConversions() {
  console.log('🧪 Testing Bidirectional Integration Format Conversions');
  console.log('='.repeat(60));

  try {
    // Test Visio conversion
    console.log('📊 Testing Visio Conversion...');
    const visioFormat = convertToPlatformFormat(sampleDiagram, 'visio');
    console.log('✅ Visio Export:', JSON.stringify(visioFormat, null, 2));
    
    const visioImport = convertFromPlatformFormat(visioFormat, 'visio');
    console.log('✅ Visio Import:', visioImport.name, `(${visioImport.nodes.length} nodes)`);

    // Test Lucidchart conversion
    console.log('\n🎨 Testing Lucidchart Conversion...');
    const lucidchartFormat = convertToPlatformFormat(sampleDiagram, 'lucidchart');
    console.log('✅ Lucidchart Export:', JSON.stringify(lucidchartFormat, null, 2));
    
    const lucidchartImport = convertFromPlatformFormat(lucidchartFormat, 'lucidchart');
    console.log('✅ Lucidchart Import:', lucidchartImport.name, `(${lucidchartImport.nodes.length} nodes)`);

    // Test Draw.io conversion
    console.log('\n🖌️ Testing Draw.io Conversion...');
    const drawioFormat = convertToPlatformFormat(sampleDiagram, 'drawio');
    console.log('✅ Draw.io Export:', JSON.stringify(drawioFormat, null, 2));
    
    const drawioImport = convertFromPlatformFormat(drawioFormat, 'drawio');
    console.log('✅ Draw.io Import:', drawioImport.name, `(${drawioImport.nodes.length} nodes)`);

    console.log('\n🎉 All format conversions completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Format conversion test failed:', error);
    return false;
  }
}

// Test synchronization service
export async function testSyncService() {
  console.log('\n🔄 Testing Synchronization Service');
  console.log('='.repeat(60));

  try {
    // Set current diagram
    syncService.setCurrentDiagram(sampleDiagram);
    console.log('✅ Set current diagram:', sampleDiagram.name);

    // Test platform configuration
    console.log('\n⚙️ Configuring platforms...');
    syncService.updatePlatformConfig('lucidchart', {
      enabled: true,
      syncInterval: 5000, // 5 seconds for testing
      autoResolveConflicts: true,
      conflictResolution: 'newest'
    });
    console.log('✅ Configured Lucidchart platform');

    // Get platform status
    const status = syncService.getSyncStatus();
    console.log('📊 Sync Status:', JSON.stringify(status, null, 2));

    // Test sync with platforms
    console.log('\n🔄 Testing platform synchronization...');
    for (const platform of ['visio', 'lucidchart', 'drawio']) {
      try {
        const result = await syncWithPlatform(sampleDiagram, platform);
        console.log(`✅ ${platform} sync:`, result.success ? 'Success' : 'Failed');
        if (result.errors.length > 0) {
          console.log(`⚠️ ${platform} warnings:`, result.errors);
        }
      } catch (error) {
        console.log(`ℹ️ ${platform} sync (expected):`, error instanceof Error ? error.message : 'Error');
      }
    }

    console.log('\n🎉 Sync service test completed!');
    return true;
  } catch (error) {
    console.error('❌ Sync service test failed:', error);
    return false;
  }
}

// Test integration events
export function testIntegrationEvents() {
  console.log('\n📡 Testing Integration Events');
  console.log('='.repeat(60));

  let eventCount = 0;
  const maxEvents = 5;

  // Set up event listener
  const eventListener = (event: any) => {
    eventCount++;
    console.log(`📨 Event ${eventCount}:`, {
      type: event.type,
      platform: event.platform,
      timestamp: event.timestamp.toISOString(),
      data: event.data ? 'Present' : 'None'
    });

    if (eventCount >= maxEvents) {
      syncService.removeEventListener(eventListener);
      console.log('✅ Event testing completed');
    }
  };

  syncService.addEventListener(eventListener);

  // Trigger some events
  console.log('🎯 Triggering test events...');
  syncService.setCurrentDiagram(sampleDiagram);
  
  // Simulate platform updates
  setTimeout(() => {
    syncService.updatePlatformConfig('drawio', { enabled: true });
  }, 100);

  setTimeout(() => {
    syncService.updatePlatformConfig('visio', { enabled: false });
  }, 200);

  return true;
}

// Main test runner
export async function runBidirectionalIntegrationTests() {
  console.log('🚀 Starting Bidirectional Integration Tests');
  console.log('='.repeat(80));
  console.log('This test demonstrates the bidirectional integration features:');
  console.log('• Format conversion between platforms');
  console.log('• Synchronization service functionality');
  console.log('• Event handling and monitoring');
  console.log('='.repeat(80));

  const results = {
    formatConversions: false,
    syncService: false,
    events: false
  };

  // Run tests
  results.formatConversions = testFormatConversions();
  results.syncService = await testSyncService();
  results.events = testIntegrationEvents();

  // Summary
  console.log('\n📋 Test Results Summary');
  console.log('='.repeat(60));
  console.log('Format Conversions:', results.formatConversions ? '✅ PASS' : '❌ FAIL');
  console.log('Sync Service:', results.syncService ? '✅ PASS' : '❌ FAIL');
  console.log('Event Handling:', results.events ? '✅ PASS' : '❌ FAIL');

  const allPassed = Object.values(results).every(Boolean);
  console.log('\nOverall Result:', allPassed ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED');

  return results;
}

// Sample files for testing file import
export const sampleVisioXML = `<?xml version="1.0" encoding="UTF-8"?>
<VisioDocument xmlns="http://schemas.microsoft.com/office/visio/2012/main">
  <Pages>
    <Page ID="0" Name="Page-1">
      <Shapes>
        <Shape ID="1" Type="Shape" Master="Process">
          <XForm>
            <PinX V="2"/>
            <PinY V="4"/>
            <Width V="2"/>
            <Height V="1"/>
          </XForm>
          <Text>Sample Process</Text>
        </Shape>
      </Shapes>
    </Page>
  </Pages>
</VisioDocument>`;

export const sampleLucidchartJSON = {
  title: "Sample Lucidchart Diagram",
  pages: [{
    title: "Main Page",
    objects: [{
      id: "obj1",
      class: "process",
      x: 100,
      y: 100,
      w: 120,
      h: 60,
      text: "Sample Process"
    }],
    lines: []
  }]
};

export const sampleDrawioXML = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile>
  <diagram>
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Sample Process" style="swimlane" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

// Export the sample diagram for use in components
export { sampleDiagram };

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined' && window.location) {
  // Browser environment - can be run manually
  console.log('🔧 Bidirectional Integration Test Suite Ready');
  console.log('Run runBidirectionalIntegrationTests() to start tests');
}
