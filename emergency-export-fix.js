// Emergency export fix - simplified and reliable export functions
console.log('🚑 Loading emergency export fixes...');

// Simple PNG export that works reliably
async function emergencyExportPNG(filename = 'export') {
    console.log('🔄 Emergency PNG export starting...');
    
    try {
        // Find ReactFlow canvas
        let canvasElement = document.querySelector('.react-flow');
        if (!canvasElement) {
            canvasElement = document.querySelector('[data-testid="rf__wrapper"]');
        }
        if (!canvasElement) {
            canvasElement = document.querySelector('#canvas-container');
        }
        
        if (!canvasElement) {
            throw new Error('No canvas element found');
        }
        
        console.log('✅ Found canvas element:', canvasElement.className);
        
        // Use html2canvas with simple options
        const canvas = await html2canvas(canvasElement, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: true,
            removeContainer: true,
            ignoreElements: (element) => {
                const className = element.className || '';
                return className.includes('react-flow__controls') || 
                       className.includes('react-flow__minimap') ||
                       className.includes('react-flow__panel');
            }
        });
        
        console.log('✅ Canvas captured successfully');
        
        // Download
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        console.log('✅ PNG download triggered');
        return true;
        
    } catch (error) {
        console.error('❌ Emergency PNG export failed:', error);
        throw error;
    }
}

// Simple SVG export
function emergencyExportSVG(filename = 'export') {
    console.log('🔄 Emergency SVG export starting...');
    
    try {
        // Get ReactFlow instance data
        const reactFlowInstance = window.__REACT_FLOW_INSTANCE__;
        if (!reactFlowInstance) {
            throw new Error('ReactFlow instance not found');
        }
        
        const nodes = reactFlowInstance.getNodes() || [];
        const edges = reactFlowInstance.getEdges() || [];
        
        if (nodes.length === 0) {
            throw new Error('No nodes found to export');
        }
        
        console.log(`✅ Found ${nodes.length} nodes and ${edges.length} edges`);
        
        // Calculate bounds
        let minX = 0, minY = 0, maxX = 800, maxY = 600;
        
        if (nodes.length > 0) {
            minX = Math.min(...nodes.map(n => n.position.x));
            minY = Math.min(...nodes.map(n => n.position.y));
            maxX = Math.max(...nodes.map(n => n.position.x + (n.data?.width || 100)));
            maxY = Math.max(...nodes.map(n => n.position.y + (n.data?.height || 80)));
        }
        
        const padding = 50;
        const width = maxX - minX + padding * 2;
        const height = maxY - minY + padding * 2;
        
        // Generate SVG
        let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white"/>`;
        
        // Add nodes
        nodes.forEach(node => {
            const x = node.position.x - minX + padding;
            const y = node.position.y - minY + padding;
            const width = node.data?.width || 80;
            const height = node.data?.height || 60;
            const fill = node.data?.fill || '#ffffff';
            const stroke = node.data?.stroke || '#000000';
            const label = node.data?.label || node.type || '';
            
            svg += `
  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="4"/>
  <text x="${x + width/2}" y="${y + height/2}" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="12" fill="#333">${label}</text>`;
        });
        
        svg += '</svg>';
        
        // Download
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        
        console.log('✅ SVG download triggered');
        return true;
        
    } catch (error) {
        console.error('❌ Emergency SVG export failed:', error);
        throw error;
    }
}

// Simple JSON export
function emergencyExportJSON(filename = 'export') {
    console.log('🔄 Emergency JSON export starting...');
    
    try {
        // Get ReactFlow instance data
        const reactFlowInstance = window.__REACT_FLOW_INSTANCE__;
        if (!reactFlowInstance) {
            throw new Error('ReactFlow instance not found');
        }
        
        const nodes = reactFlowInstance.getNodes() || [];
        const edges = reactFlowInstance.getEdges() || [];
        
        const data = {
            nodes: nodes,
            edges: edges,
            viewport: { x: 0, y: 0, zoom: 1 },
            fileName: filename,
            version: '1.0',
            exportDate: new Date().toISOString()
        };
        
        console.log(`✅ Exporting ${nodes.length} nodes and ${edges.length} edges`);
        
        // Download
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        
        console.log('✅ JSON download triggered');
        return true;
        
    } catch (error) {
        console.error('❌ Emergency JSON export failed:', error);
        throw error;
    }
}

// Emergency export function that tries multiple approaches
async function emergencyExport(format, filename = 'emergency-export') {
    console.log(`🚑 Emergency export for ${format.toUpperCase()} format`);
    
    try {
        switch (format.toLowerCase()) {
            case 'png':
                return await emergencyExportPNG(filename);
            case 'svg':
                return emergencyExportSVG(filename);
            case 'json':
                return emergencyExportJSON(filename);
            case 'jpeg':
            case 'jpg':
                // For JPEG, we'll use PNG method and convert
                const result = await emergencyExportPNG(filename);
                console.log('ℹ️ JPEG export using PNG method (convert manually if needed)');
                return result;
            default:
                throw new Error(`Format ${format} not supported in emergency mode. Use PNG, SVG, or JSON.`);
        }
    } catch (error) {
        console.error(`❌ Emergency export failed for ${format}:`, error);
        throw error;
    }
}

// Add to global scope
window.emergencyExport = emergencyExport;
window.emergencyExportPNG = emergencyExportPNG;
window.emergencyExportSVG = emergencyExportSVG;
window.emergencyExportJSON = emergencyExportJSON;

console.log('🚑 Emergency export functions loaded:');
console.log('  - emergencyExport(format, filename)');
console.log('  - emergencyExportPNG(filename)');
console.log('  - emergencyExportSVG(filename)');
console.log('  - emergencyExportJSON(filename)');
console.log('Usage: await emergencyExport("png", "my-diagram")');
