// Test functions for FlowDigm save/load/import functionality
// Add this to browser console to test functionality

// Test function to add sample shapes for testing
window.addTestShapes = function() {
  console.log('🧪 Adding test shapes...');
  
  // Get the canvas context
  const event = new CustomEvent('addTestShapes', {
    detail: {
      shapes: [
        {
          id: 'test-rect-1',
          type: 'rect',
          x: 100,
          y: 100,
          width: 120,
          height: 80,
          text: 'Test Rectangle',
          fill: '#e3f2fd',
          stroke: '#1976d2',
          strokeWidth: 2
        },
        {
          id: 'test-circle-1',
          type: 'circle',
          x: 300,
          y: 150,
          width: 100,
          height: 100,
          text: 'Test Circle',
          fill: '#e8f5e8',
          stroke: '#4caf50',
          strokeWidth: 2
        },
        {
          id: 'test-diamond-1',
          type: 'diamond',
          x: 500,
          y: 120,
          width: 100,
          height: 100,
          text: 'Test Diamond',
          fill: '#fff3e0',
          stroke: '#ff9800',
          strokeWidth: 2
        }
      ]
    }
  });
  
  window.dispatchEvent(event);
  console.log('✅ Test shapes added!');
};

// Test function to check current canvas state
window.checkCanvasState = function() {
  console.log('🔍 Checking canvas state...');
  
  // Try to get React component state (this is a hack for testing)
  const reactFiberKey = Object.keys(document.querySelector('#root')).find(key => key.startsWith('__reactFiber'));
  if (reactFiberKey) {
    console.log('React fiber found, attempting to access state...');
  }
  
  console.log('Current URL:', window.location.href);
  console.log('Local storage:', { ...localStorage });
  console.log('Session storage:', { ...sessionStorage });
};

// Test save functionality
window.testSave = function() {
  console.log('🧪 Testing save functionality...');
  
  // Simulate clicking save button
  const saveButton = document.querySelector('[data-testid="save-button"]') || 
                     document.querySelector('button:contains("Save")') ||
                     Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Save'));
  
  if (saveButton) {
    console.log('Save button found, clicking...');
    saveButton.click();
  } else {
    console.log('❌ Save button not found');
  }
};

// Test load functionality  
window.testLoad = function() {
  console.log('🧪 Testing load functionality...');
  
  // Simulate clicking load button
  const loadButton = document.querySelector('[data-testid="load-button"]') || 
                     document.querySelector('button:contains("Open")') ||
                     Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Open'));
  
  if (loadButton) {
    console.log('Load button found, clicking...');
    loadButton.click();
  } else {
    console.log('❌ Load button not found');
  }
};

// Test import functionality
window.testImport = function() {
  console.log('🧪 Testing import functionality...');
  
  // Simulate clicking import button  
  const importButton = document.querySelector('[data-testid="import-button"]') || 
                       document.querySelector('button:contains("Import")') ||
                       Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Import'));
  
  if (importButton) {
    console.log('Import button found, clicking...');
    importButton.click();
  } else {
    console.log('❌ Import button not found');
  }
};

console.log('🧪 FlowDigm test functions loaded!');
console.log('Available functions:');
console.log('- window.addTestShapes() - Add sample shapes to canvas');
console.log('- window.checkCanvasState() - Check current state');
console.log('- window.testSave() - Test save functionality');
console.log('- window.testLoad() - Test load functionality');
console.log('- window.testImport() - Test import functionality');
