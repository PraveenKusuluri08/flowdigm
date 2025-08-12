// Test utility for the comprehensive export function
// This file can be loaded in the browser console to test export functionality

console.log('🚀 Comprehensive Export Function Test Utility Loaded');
console.log('📋 Available test functions:');
console.log('  - testAllFormats() - Test all export formats');
console.log('  - testFormat(format) - Test specific format');
console.log('  - testWithOptions(format, options) - Test with custom options');
console.log('  - createTestCanvas() - Create a test canvas with sample content');

// Create a test canvas with sample shapes
function createTestCanvas() {
    const existingCanvas = document.getElementById('test-export-canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    const canvas = document.createElement('div');
    canvas.id = 'test-export-canvas';
    canvas.className = 'react-flow';
    canvas.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50px;
        width: 600px;
        height: 400px;
        background: white;
        border: 2px solid #ddd;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    `;

    // Add sample shapes
    const shapes = [
        { type: 'rect', x: 50, y: 50, width: 100, height: 60, label: 'Rectangle', color: '#e3f2fd' },
        { type: 'circle', x: 200, y: 40, width: 80, height: 80, label: 'Circle', color: '#f3e5f5' },
        { type: 'diamond', x: 350, y: 60, width: 80, height: 60, label: 'Diamond', color: '#e8f5e8' },
        { type: 'rect', x: 100, y: 180, width: 150, height: 50, label: 'Process', color: '#fff3e0' },
        { type: 'rect', x: 300, y: 200, width: 120, height: 40, label: 'Decision', color: '#fce4ec' }
    ];

    shapes.forEach((shape, index) => {
        const shapeDiv = document.createElement('div');
        shapeDiv.className = 'react-flow__node';
        shapeDiv.style.cssText = `
            position: absolute;
            left: ${shape.x}px;
            top: ${shape.y}px;
            width: ${shape.width}px;
            height: ${shape.height}px;
            background: ${shape.color};
            border: 2px solid #333;
            border-radius: ${shape.type === 'circle' ? '50%' : '4px'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            user-select: none;
            ${shape.type === 'diamond' ? 'transform: rotate(45deg);' : ''}
        `;
        shapeDiv.textContent = shape.label;
        canvas.appendChild(shapeDiv);
    });

    // Add connections
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;

    // Add sample connections
    const connections = [
        { from: { x: 150, y: 80 }, to: { x: 240, y: 80 } },
        { from: { x: 280, y: 80 }, to: { x: 350, y: 90 } },
        { from: { x: 175, y: 110 }, to: { x: 175, y: 180 } }
    ];

    connections.forEach(conn => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', conn.from.x);
        line.setAttribute('y1', conn.from.y);
        line.setAttribute('x2', conn.to.x);
        line.setAttribute('y2', conn.to.y);
        line.setAttribute('stroke', '#666');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(line);
    });

    // Add arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#666');
    
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
    canvas.appendChild(svg);

    // Add title
    const title = document.createElement('div');
    title.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
        color: #333;
        background: rgba(255,255,255,0.9);
        padding: 5px 10px;
        border-radius: 4px;
    `;
    title.textContent = 'Test Export Canvas';
    canvas.appendChild(title);

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 12px;
    `;
    closeBtn.textContent = '✕ Close';
    closeBtn.onclick = () => canvas.remove();
    canvas.appendChild(closeBtn);

    document.body.appendChild(canvas);
    
    console.log('✅ Test canvas created with sample shapes');
    return canvas;
}

// Test a specific format
async function testFormat(format, useTestCanvas = true) {
    console.log(`🔄 Testing ${format.toUpperCase()} export...`);
    
    try {
        let canvasElement = null;
        
        if (useTestCanvas) {
            canvasElement = createTestCanvas();
        } else {
            // Try to find existing ReactFlow canvas
            canvasElement = document.querySelector('.react-flow') || 
                          document.querySelector('[data-testid="rf__wrapper"]') ||
                          document.querySelector('#canvas-container');
        }
        
        if (!canvasElement) {
            throw new Error('No canvas element found for export');
        }
        
        // Check if the comprehensive export function is available
        if (typeof window.exportFile === 'function') {
            console.log('✅ Using window.exportFile function');
            await window.exportFile(format, `test-diagram-${format}`, {
                quality: 1.0,
                scale: 2,
                backgroundColor: '#ffffff',
                includeMetadata: true
            });
        } else {
            // Try to import and use the function directly
            console.log('🔍 Attempting to access export function from module...');
            
            // Check if we can access the canvas context
            if (window.__CANVAS_CONTEXT__ && window.__CANVAS_CONTEXT__.exportCanvas) {
                console.log('✅ Using canvas context export function');
                await window.__CANVAS_CONTEXT__.exportCanvas(format, canvasElement);
            } else {
                throw new Error('Export functions not available. Make sure you are in the FlowDigm application context.');
            }
        }
        
        console.log(`✅ ${format.toUpperCase()} export completed successfully!`);
        
        if (useTestCanvas && canvasElement && canvasElement.id === 'test-export-canvas') {
            setTimeout(() => canvasElement.remove(), 2000);
        }
        
    } catch (error) {
        console.error(`❌ ${format.toUpperCase()} export failed:`, error);
        throw error;
    }
}

// Test with custom options
async function testWithOptions(format, options = {}) {
    console.log(`🔧 Testing ${format.toUpperCase()} export with options:`, options);
    
    const defaultOptions = {
        quality: 1.0,
        scale: 2,
        backgroundColor: '#ffffff',
        includeMetadata: true,
        ...options
    };
    
    try {
        const canvasElement = createTestCanvas();
        
        if (typeof window.exportFile === 'function') {
            await window.exportFile(format, `test-diagram-${format}-custom`, defaultOptions);
        } else if (window.__CANVAS_CONTEXT__ && window.__CANVAS_CONTEXT__.exportCanvas) {
            await window.__CANVAS_CONTEXT__.exportCanvas(format, canvasElement);
        } else {
            throw new Error('Export functions not available');
        }
        
        console.log(`✅ ${format.toUpperCase()} export with options completed!`);
        setTimeout(() => canvasElement.remove(), 2000);
        
    } catch (error) {
        console.error(`❌ ${format.toUpperCase()} export with options failed:`, error);
        throw error;
    }
}

// Test all supported formats
async function testAllFormats() {
    console.log('🚀 Testing all export formats...');
    
    const formats = ['png', 'jpeg', 'svg', 'pdf', 'pptx', 'docx'];
    const results = {};
    
    for (const format of formats) {
        try {
            console.log(`\n📋 Testing ${format.toUpperCase()}...`);
            await testFormat(format, true);
            results[format] = 'SUCCESS';
            
            // Small delay between exports
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error(`❌ ${format.toUpperCase()} failed:`, error.message);
            results[format] = `FAILED: ${error.message}`;
        }
    }
    
    console.log('\n📊 Export Test Results:');
    console.table(results);
    
    const successCount = Object.values(results).filter(r => r === 'SUCCESS').length;
    console.log(`\n🎯 Summary: ${successCount}/${formats.length} formats exported successfully`);
    
    return results;
}

// Quick test functions for each format
window.testPNG = () => testFormat('png');
window.testJPEG = () => testFormat('jpeg');
window.testSVG = () => testFormat('svg');
window.testPDF = () => testFormat('pdf');
window.testPPTX = () => testFormat('pptx');
window.testDOCX = () => testFormat('docx');

// Export all functions to global scope
window.createTestCanvas = createTestCanvas;
window.testFormat = testFormat;
window.testWithOptions = testWithOptions;
window.testAllFormats = testAllFormats;

console.log('🎯 Test utility ready! Try: testAllFormats() or testFormat("png")');
