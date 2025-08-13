// utils/importExportUtils.ts
import type { Node, Edge } from 'reactflow';
import type { CanvasData } from '../types/importExport';
import html2canvas from 'html2canvas';

// @ts-ignore
import domtoimage from 'dom-to-image';

// Main export function that supports all formats
export const exportCanvas = async (format: string = 'png'): Promise<void> => {
  try {
    console.log('🔄 Starting comprehensive canvas export in format:', format);
    
    // Get the ReactFlow instance
    const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
    if (!reactFlowInstance) {
      throw new Error('ReactFlow instance not found. Please refresh the page and try again.');
    }
    
    // Get current nodes and edges
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    
    console.log('📊 Found nodes:', nodes.length, 'edges:', edges.length);
    
    if (nodes.length === 0 && !['html', 'txt', 'csv'].includes(format)) {
      alert('No shapes found! Please add some shapes to the canvas first.');
      return;
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `flowdigm-diagram-${timestamp}`;
    
    // Export based on format
    switch (format.toLowerCase()) {
      // Image formats
      case 'png':
        await exportAsPNGSimple(fileName);
        break;
      case 'jpeg':
      case 'jpg':
        await exportAsJPEG(document.querySelector('.react-flow') as HTMLElement, fileName);
        break;
      case 'webp':
        await exportAsWebP(document.querySelector('.react-flow') as HTMLElement, fileName);
        break;
      case 'bmp':
        await exportAsBMP(document.querySelector('.react-flow') as HTMLElement, fileName);
        break;
      case 'tiff':
        await exportAsTIFF(document.querySelector('.react-flow') as HTMLElement, fileName);
        break;
        
      // Vector formats
      case 'svg':
        exportAsSVG(nodes, edges, fileName);
        break;
        
      // Document formats
      case 'pdf':
        await exportAsPDF(nodes, edges, fileName);
        break;
      case 'html':
        exportAsHTML(nodes, edges, fileName);
        break;
      case 'xml':
        exportAsXML(nodes, edges, fileName);
        break;
      case 'csv':
        exportAsCSV(nodes, edges, fileName);
        break;
      case 'txt':
        exportAsText(nodes, edges, fileName);
        break;
        
      // Diagram tool formats
      case 'json':
        const canvasData: CanvasData = {
          nodes: nodes.map((node: any) => ({
            id: node.id,
            type: node.type || 'default',
            position: node.position,
            data: node.data
          })),
          edges: edges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || 'default'
          })),
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
          fileName: fileName,
          version: '1.0'
        };
        exportAsJSON(canvasData, fileName);
        break;
      case 'drawio':
        exportAsDrawIO(nodes, edges, fileName);
        break;
      case 'visio':
        exportAsVisio(nodes, edges, fileName);
        break;
      case 'mermaid':
        exportAsMermaid(nodes, edges, fileName);
        break;
      case 'plantuml':
        exportAsPlantUML(nodes, edges, fileName);
        break;
      case 'javascript':
        exportAsJavaScript(nodes, edges, fileName);
        break;
      case 'typescript':
        exportAsTypeScript(nodes, edges, fileName);
        break;
      case 'python':
        exportAsPython(nodes, edges, fileName);
        break;
      case 'yaml':
        exportAsYAML(nodes, edges, fileName);
        break;
      case 'toml':
        exportAsTOML(nodes, edges, fileName);
        break;
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    console.log('✅ Export completed successfully');
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export functions
export const exportAsPNGSimple = async (fileName: string): Promise<void> => {
  try {
    console.log('=== PNG EXPORT STARTING ===');
    
    // Get the ReactFlow instance
    const reactFlowInstance = (window as any).__REACT_FLOW_INSTANCE__;
    console.log('ReactFlow instance found:', !!reactFlowInstance);
    
    if (reactFlowInstance) {
      try {
        const nodes = reactFlowInstance.getNodes();
        const edges = reactFlowInstance.getEdges();
        console.log('ReactFlow nodes found:', nodes.length);
        
        if (nodes.length > 0) {
          console.log('Using ReactFlow data for export');
          await exportFromReactFlowData(nodes, edges, fileName);
          return;
        }
      } catch (error) {
        console.error('Error getting ReactFlow data:', error);
      }
    }
    
    // Create a test export
    console.log('No shapes found, creating test export...');
    await createTestExport(fileName);
    
  } catch (error) {
    console.error('Error in PNG export:', error);
    throw new Error(`Failed to export as PNG: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Helper function to export from ReactFlow data
const exportFromReactFlowData = async (nodes: any[], edges: any[], fileName: string) => {
  console.log('=== EXPORTING FROM REACTFLOW DATA ===');
  
  // Calculate canvas bounds
  let minX = 0, minY = 0, maxX = 800, maxY = 600;
  
  if (nodes.length > 0) {
    minX = Math.min(...nodes.map(n => n.position.x));
    minY = Math.min(...nodes.map(n => n.position.y));
    maxX = Math.max(...nodes.map(n => n.position.x + (n.data?.width || 100)));
    maxY = Math.max(...nodes.map(n => n.position.y + (n.data?.height || 80)));
  }
  
  const padding = 50;
  const canvasWidth = Math.max(800, maxX - minX + padding * 2);
  const canvasHeight = Math.max(600, maxY - minY + padding * 2);
  
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw grid
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvasWidth; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  for (let y = 0; y < canvasHeight; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }
  
  // Draw edges first
  if (edges.length > 0) {
    edges.forEach((edge: any) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        const sourceCenterX = sourceNode.position.x - minX + padding + (sourceNode.data?.width || 100) / 2;
        const sourceCenterY = sourceNode.position.y - minY + padding + (sourceNode.data?.height || 80) / 2;
        const targetCenterX = targetNode.position.x - minX + padding + (targetNode.data?.width || 100) / 2;
        const targetCenterY = targetNode.position.y - minY + padding + (targetNode.data?.height || 80) / 2;
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sourceCenterX, sourceCenterY);
        ctx.lineTo(targetCenterX, targetCenterY);
        ctx.stroke();
        
        // Arrow head
        const angle = Math.atan2(targetCenterY - sourceCenterY, targetCenterX - sourceCenterX);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(targetCenterX, targetCenterY);
        ctx.lineTo(targetCenterX - arrowLength * Math.cos(angle - Math.PI / 6), targetCenterY - arrowLength * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(targetCenterX, targetCenterY);
        ctx.lineTo(targetCenterX - arrowLength * Math.cos(angle + Math.PI / 6), targetCenterY - arrowLength * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    });
  }
  
  // Draw nodes
  nodes.forEach((node: any) => {
    const x = node.position.x - minX + padding;
    const y = node.position.y - minY + padding;
    const width = node.data?.width || 100;
    const height = node.data?.height || 80;
    
    ctx.fillStyle = node.data?.fill || '#e3f2fd';
    ctx.strokeStyle = node.data?.stroke || '#1976d2';
    ctx.lineWidth = 2;
    
    if (node.type === 'rect' || node.type === 'rectangle') {
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
    } else if (node.type === 'circle') {
      ctx.beginPath();
      ctx.arc(x + width/2, y + height/2, Math.min(width, height)/2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    } else if (node.type === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(x + width/2, y + 10);
      ctx.lineTo(x + width - 10, y + height - 10);
      ctx.lineTo(x + 10, y + height - 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (node.type === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(x + width/2, y);
      ctx.lineTo(x + width, y + height/2);
      ctx.lineTo(x + width/2, y + height);
      ctx.lineTo(x, y + height/2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
    }
    
    // Draw label
    if (node.data?.label) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.data.label, x + width/2, y + height/2);
    }
  });
  
  // Download
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  console.log('ReactFlow data export completed');
};

// Helper function to create test export
const createTestExport = async (fileName: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 800, 600);
  
  // Text
  ctx.fillStyle = '#000000';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('No shapes found - add shapes to export', 400, 300);
  
  // Download
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  console.log('Test export completed');
};

// Simple export functions for other formats
export const exportAsJPEG = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  if (!canvasElement) {
    throw new Error('Canvas element is required');
  }
  const canvas = await html2canvas(canvasElement, { backgroundColor: '#ffffff' });
  const link = document.createElement('a');
  link.download = `${fileName}.jpg`;
  link.href = canvas.toDataURL('image/jpeg', 0.9);
  link.click();
};

export const exportAsWebP = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  if (!canvasElement) {
    throw new Error('Canvas element is required');
  }
  const canvas = await html2canvas(canvasElement, { backgroundColor: '#ffffff' });
  const link = document.createElement('a');
  link.download = `${fileName}.webp`;
  link.href = canvas.toDataURL('image/webp', 0.9);
  link.click();
};

export const exportAsBMP = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  if (!canvasElement) {
    throw new Error('Canvas element is required');
  }
  const canvas = await html2canvas(canvasElement, { backgroundColor: '#ffffff' });
  const link = document.createElement('a');
  link.download = `${fileName}.bmp`;
  link.href = canvas.toDataURL('image/png'); // BMP not natively supported, use PNG
  link.click();
};

export const exportAsTIFF = async (canvasElement: HTMLElement, fileName: string): Promise<void> => {
  if (!canvasElement) {
    throw new Error('Canvas element is required');
  }
  const canvas = await html2canvas(canvasElement, { backgroundColor: '#ffffff' });
  const link = document.createElement('a');
  link.download = `${fileName}.tiff`;
  link.href = canvas.toDataURL('image/png'); // TIFF not natively supported, use PNG
  link.click();
};

export const exportAsSVG = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const bounds = calculateCanvasBounds(nodes);
  const padding = 50;
  const svgContent = generateSVGContent(nodes, edges, bounds, padding);
  
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = `${fileName}.svg`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
};

export const exportAsPDF = async (nodes: Node[], edges: Edge[], fileName: string): Promise<void> => {
  // For PDF, we'll create an HTML version and let user print to PDF
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>FlowDigm Diagram</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .node { border: 2px solid #333; padding: 10px; margin: 10px; display: inline-block; background: #f0f8ff; }
    </style>
</head>
<body>
    <h1>FlowDigm Diagram Export</h1>
    <p>Use your browser's Print function and select "Save as PDF" to create a PDF.</p>
    ${nodes.map(node => `
        <div class="node">
            <strong>${node.data?.label || node.id}</strong><br>
            Type: ${node.type}<br>
            Position: (${node.position.x}, ${node.position.y})
        </div>
    `).join('')}
</body>
</html>`;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.html`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsHTML = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowDigm Diagram Export</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .node { border: 2px solid #333; padding: 10px; margin: 10px; display: inline-block; background: #f0f8ff; }
        .edge { margin: 5px 0; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>FlowDigm Diagram Export</h1>
        <h2>Nodes (${nodes.length})</h2>
        ${nodes.map(node => `
            <div class="node">
                <strong>ID:</strong> ${node.id}<br>
                <strong>Type:</strong> ${node.type || 'default'}<br>
                <strong>Position:</strong> (${node.position.x}, ${node.position.y})<br>
                <strong>Label:</strong> ${node.data?.label || 'No label'}
            </div>
        `).join('')}
        
        <h2>Edges (${edges.length})</h2>
        ${edges.map(edge => `
            <div class="edge">
                ${edge.source} → ${edge.target}
            </div>
        `).join('')}
        
        <p><small>Exported from FlowDigm on ${new Date().toLocaleString()}</small></p>
    </div>
</body>
</html>`;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.html`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsXML = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<diagram>
  <nodes>
    ${nodes.map(node => `
    <node id="${node.id}" type="${node.type || 'default'}" x="${node.position.x}" y="${node.position.y}">
      <label>${node.data?.label || ''}</label>
    </node>`).join('')}
  </nodes>
  <edges>
    ${edges.map(edge => `
    <edge id="${edge.id}" source="${edge.source}" target="${edge.target}"/>`).join('')}
  </edges>
</diagram>`;
  
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.xml`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsCSV = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const csvContent = `Type,ID,Label,X,Y
${nodes.map(node => `Node,${node.id},"${node.data?.label || ''}",${node.position.x},${node.position.y}`).join('\n')}
${edges.map(edge => `Edge,${edge.id},,${edge.source},${edge.target}`).join('\n')}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.csv`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsText = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const textContent = `FlowDigm Diagram Export
Generated: ${new Date().toLocaleString()}

NODES (${nodes.length}):
${nodes.map(node => `
• ID: ${node.id}
  Type: ${node.type || 'default'}
  Label: ${node.data?.label || 'No label'}
  Position: (${node.position.x}, ${node.position.y})
`).join('')}

EDGES (${edges.length}):
${edges.map(edge => `• ${edge.source} → ${edge.target}`).join('\n')}

Total elements: ${nodes.length + edges.length}
`;
  
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.txt`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsDrawIO = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const xmlString = `<mxfile host="FlowDigm">
  <diagram name="FlowDigm Export">
    <mxGraphModel>
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${nodes.map((node, index) => `
        <mxCell id="node-${index + 2}" value="${node.data?.label || ''}" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="${node.position.x}" y="${node.position.y}" width="100" height="80" as="geometry"/>
        </mxCell>`).join('')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  
  const blob = new Blob([xmlString], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.drawio`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsVisio = (nodes: Node[], edges: Edge[], fileName: string): void => {
  // Create a simplified Visio-compatible XML
  const visioContent = `<?xml version="1.0" encoding="UTF-8"?>
<VisioDocument>
  <Pages>
    <Page Name="FlowDigm Export">
      <Shapes>
        ${nodes.map((node, index) => `
        <Shape ID="${index + 1}" Name="${node.data?.label || `Shape${index + 1}`}">
          <Text>${node.data?.label || ''}</Text>
        </Shape>`).join('')}
      </Shapes>
    </Page>
  </Pages>
</VisioDocument>`;
  
  const blob = new Blob([visioContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.vsdx`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsMermaid = (nodes: Node[], edges: Edge[], fileName: string): void => {
  let mermaidContent = 'graph TD\n';
  
  // Add node definitions
  nodes.forEach(node => {
    const label = node.data?.label || node.id;
    mermaidContent += `    ${node.id}[${label}]\n`;
  });
  
  // Add edge definitions
  edges.forEach(edge => {
    mermaidContent += `    ${edge.source} --> ${edge.target}\n`;
  });
  
  const blob = new Blob([mermaidContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.mmd`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsPlantUML = (nodes: Node[], edges: Edge[], fileName: string): void => {
  let plantUMLContent = '@startuml\n';
  
  // Add node definitions
  nodes.forEach(node => {
    const label = node.data?.label || node.id;
    plantUMLContent += `rectangle ${node.id} as "${label}"\n`;
  });
  
  plantUMLContent += '\n';
  
  // Add relationships
  edges.forEach(edge => {
    plantUMLContent += `${edge.source} --> ${edge.target}\n`;
  });
  
  plantUMLContent += '\n@enduml';
  
  const blob = new Blob([plantUMLContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.puml`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsJavaScript = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const jsContent = `// FlowDigm Diagram Export - JavaScript
// Generated on ${new Date().toLocaleString()}

const diagram = {
  nodes: [
${nodes.map(node => `    {
      id: '${node.id}',
      type: '${node.type || 'default'}',
      position: { x: ${node.position.x}, y: ${node.position.y} },
      data: { label: '${node.data?.label || ''}' }
    }`).join(',\n')}
  ],
  edges: [
${edges.map(edge => `    {
      id: '${edge.id}',
      source: '${edge.source}',
      target: '${edge.target}'
    }`).join(',\n')}
  ]
};

export default diagram;
`;
  
  const blob = new Blob([jsContent], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.js`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsTypeScript = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const tsContent = `// FlowDigm Diagram Export - TypeScript
// Generated on ${new Date().toLocaleString()}

interface DiagramNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
}

interface DiagramEdge {
  id: string;
  source: string;
  target: string;
}

const diagram = {
  nodes: [
${nodes.map(node => `    {
      id: '${node.id}',
      type: '${node.type || 'default'}',
      position: { x: ${node.position.x}, y: ${node.position.y} },
      data: { label: '${node.data?.label || ''}' }
    } as DiagramNode`).join(',\n')}
  ],
  edges: [
${edges.map(edge => `    {
      id: '${edge.id}',
      source: '${edge.source}',
      target: '${edge.target}'
    } as DiagramEdge`).join(',\n')}
  ]
};

export default diagram;
`;
  
  const blob = new Blob([tsContent], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.ts`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsPython = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const pyContent = `# FlowDigm Diagram Export - Python
# Generated on ${new Date().toLocaleString()}

diagram = {
    "nodes": [
${nodes.map(node => `        {
            "id": "${node.id}",
            "type": "${node.type || 'default'}",
            "position": {"x": ${node.position.x}, "y": ${node.position.y}},
            "data": {"label": "${node.data?.label || ''}"}
        }`).join(',\n')}
    ],
    "edges": [
${edges.map(edge => `        {
            "id": "${edge.id}",
            "source": "${edge.source}",
            "target": "${edge.target}"
        }`).join(',\n')}
    ]
}

if __name__ == "__main__":
    print(f"Diagram has {len(diagram['nodes'])} nodes and {len(diagram['edges'])} edges")
`;
  
  const blob = new Blob([pyContent], { type: 'text/x-python' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.py`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsYAML = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const yamlContent = `# FlowDigm Diagram Export - YAML
# Generated on ${new Date().toLocaleString()}

diagram:
  nodes:
${nodes.map(node => `    - id: "${node.id}"
      type: "${node.type || 'default'}"
      position:
        x: ${node.position.x}
        y: ${node.position.y}
      data:
        label: "${node.data?.label || ''}"`).join('\n')}
  
  edges:
${edges.map(edge => `    - id: "${edge.id}"
      source: "${edge.source}"
      target: "${edge.target}"`).join('\n')}
`;
  
  const blob = new Blob([yamlContent], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.yaml`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsTOML = (nodes: Node[], edges: Edge[], fileName: string): void => {
  const tomlContent = `# FlowDigm Diagram Export - TOML
# Generated on ${new Date().toLocaleString()}

[metadata]
created = "${new Date().toISOString()}"
tool = "FlowDigm"

${nodes.map((node, index) => `
[[nodes]]
id = "${node.id}"
type = "${node.type || 'default'}"
label = "${node.data?.label || ''}"

[nodes.position]
x = ${node.position.x}
y = ${node.position.y}`).join('')}

${edges.map(edge => `
[[edges]]
id = "${edge.id}"
source = "${edge.source}"
target = "${edge.target}"`).join('')}
`;
  
  const blob = new Blob([tomlContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${fileName}.toml`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsJSON = (canvasData: CanvasData, fileName: string): void => {
  try {
    const jsonContent = JSON.stringify(canvasData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${fileName}.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting as JSON:', error);
    throw new Error('Failed to export as JSON');
  }
};

// Helper functions
const calculateCanvasBounds = (nodes: Node[]) => {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 800, maxY: 600 };
  }
  
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  nodes.forEach(node => {
    const x = node.position.x;
    const y = node.position.y;
    const width = node.data?.width || 80;
    const height = node.data?.height || 60;
    
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  
  return { minX, minY, maxX, maxY };
};

const generateSVGContent = (nodes: Node[], edges: Edge[], bounds: any, padding: number) => {
  const width = bounds.maxX - bounds.minX + padding * 2;
  const height = bounds.maxY - bounds.minY + padding * 2;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;
  
  // Add edges first
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const x1 = sourceNode.position.x + 40 - bounds.minX + padding;
      const y1 = sourceNode.position.y + 40 - bounds.minY + padding;
      const x2 = targetNode.position.x + 40 - bounds.minX + padding;
      const y2 = targetNode.position.y + 40 - bounds.minY + padding;
      
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="2"/>`;
    }
  });
  
  // Add nodes
  nodes.forEach(node => {
    const x = node.position.x - bounds.minX + padding;
    const y = node.position.y - bounds.minY + padding;
    const width = node.data?.width || 80;
    const height = node.data?.height || 60;
    const label = node.data?.label || node.type || '';
    
    svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#f0f8ff" stroke="#333" stroke-width="2"/>`;
    svg += `<text x="${x + width / 2}" y="${y + height / 2 + 4}" text-anchor="middle" font-family="Arial" font-size="12" fill="#333">${label}</text>`;
  });
  
  svg += '</svg>';
  return svg;
};

// Import functions
export const importFromJSON = (file: File): Promise<CanvasData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const canvasData = JSON.parse(content) as CanvasData;
        
        if (!canvasData.nodes || !canvasData.edges) {
          throw new Error('Invalid file format: missing nodes or edges');
        }
        
        resolve(canvasData);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// File input helper
export const createFileInput = (accept: string, multiple: boolean = false): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.multiple = multiple;
  input.style.display = 'none';
  return input;
};
