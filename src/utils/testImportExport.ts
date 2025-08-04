// utils/testImportExport.ts - Test file for import/export functionality
import type { CanvasData } from '../types/importExport';
import { exportAsJSON, importFromJSON } from './importExportUtils';

// Test data
const testCanvasData: CanvasData = {
  nodes: [
    {
      id: 'test-node-1',
      type: 'rectangle',
      position: { x: 100, y: 100 },
      data: {
        label: 'Test Rectangle',
        width: 80,
        height: 60,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2
      }
    },
    {
      id: 'test-node-2',
      type: 'circle',
      position: { x: 200, y: 200 },
      data: {
        label: 'Test Circle',
        width: 60,
        height: 60,
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2
      }
    }
  ],
  edges: [
    {
      id: 'test-edge-1',
      source: 'test-node-1',
      target: 'test-node-2',
      type: 'smoothstep',
      style: { stroke: '#333', strokeWidth: 2 }
    }
  ],
  viewport: {
    x: 0,
    y: 0,
    zoom: 1
  },
  grid: {
    visible: true,
    size: 20,
    snap: false
  },
  fileName: 'Test Diagram',
  version: '1.0'
};

// Test export functionality
export const testExport = () => {
  try {
    exportAsJSON(testCanvasData, 'test-export');
    console.log('✅ Export test passed');
    return true;
  } catch (error) {
    console.error('❌ Export test failed:', error);
    return false;
  }
};

// Test import functionality (simulated)
export const testImport = async () => {
  try {
    // Create a mock file
    const jsonString = JSON.stringify(testCanvasData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'test-import.json', { type: 'application/json' });
    
    const importedData = await importFromJSON(file);
    
    // Verify the imported data matches the original
    if (JSON.stringify(importedData) === JSON.stringify(testCanvasData)) {
      console.log('✅ Import test passed');
      return true;
    } else {
      console.error('❌ Import test failed: data mismatch');
      return false;
    }
  } catch (error) {
    console.error('❌ Import test failed:', error);
    return false;
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('🧪 Running import/export tests...');
  
  const exportResult = testExport();
  const importResult = await testImport();
  
  if (exportResult && importResult) {
    console.log('🎉 All tests passed!');
  } else {
    console.log('💥 Some tests failed!');
  }
  
  return exportResult && importResult;
}; 