import React, { useEffect, useRef, useState } from 'react';
import BpmnViewer from 'bpmn-js/lib/Viewer';

// Import BPMN CSS files
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

interface BPMNViewerProps {
  xml: string;
  onError?: (error: any) => void;
}

const BPMNViewerComponent: React.FC<BPMNViewerProps> = ({ xml, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<BpmnViewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || !xml) return;

    const initializeViewer = async () => {
      try {
        console.log('Initializing BPMN Viewer...');
        
        // Create BPMN viewer instance
        const viewer = new BpmnViewer({
          container: containerRef.current!,
          keyboard: {
            bindTo: document
          }
        });

        viewerRef.current = viewer;

        console.log('Loading BPMN XML...');
        
        // Load BPMN XML
        await viewer.importXML(xml);
        
        console.log('BPMN XML loaded successfully');
        
        // Fit to viewport
        (viewer as any).get('canvas').zoom('fit-viewport');
        
        setIsLoading(false);
        console.log('BPMN Viewer initialized successfully');

        // Set up event listeners
        (viewer as any).on('element.click', (event: any) => {
          const element = event.element;
          console.log('Element clicked:', element);
        });

      } catch (err: any) {
        console.error('Error initializing BPMN viewer:', err);
        setError(`Failed to load BPMN diagram: ${err instanceof Error ? err.message : 'Unknown error'}`);
        onError?.(err);
        setIsLoading(false);
      }
    };

    initializeViewer();

    // Cleanup
    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (err: any) {
          console.error('Error destroying BPMN viewer:', err);
        }
      }
    };
  }, [xml, onError]);

  const handleZoomIn = () => {
    if (viewerRef.current) {
      const canvas = (viewerRef.current as any).get('canvas');
      canvas.zoom(canvas.zoom() * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const canvas = (viewerRef.current as any).get('canvas');
      canvas.zoom(canvas.zoom() / 1.2);
    }
  };

  const handleFitView = () => {
    if (viewerRef.current) {
      (viewerRef.current as any).get('canvas').zoom('fit-viewport');
    }
  };

  const handleExportSVG = async () => {
    if (!viewerRef.current) return;

    try {
      const { svg } = await viewerRef.current.saveSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bpmn-diagram.svg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error exporting SVG:', err);
      setError('Failed to export SVG');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-lg font-semibold mb-2">BPMN Viewer Error</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!xml) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="text-gray-600 text-lg font-semibold mb-2">No BPMN Diagram</div>
          <div className="text-gray-500">Please provide a BPMN XML to view</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">BPMN Viewer</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Zoom Out"
          >
            🔍-
          </button>
          <button
            onClick={handleFitView}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Fit to View"
          >
            🔍 Fit
          </button>
          <button
            onClick={handleZoomIn}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Zoom In"
          >
            🔍+
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportSVG}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Export SVG"
          >
            📤 Export SVG
          </button>
        </div>
      </div>

      {/* BPMN Viewer Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-gray-600">Loading BPMN Viewer...</div>
            </div>
          </div>
        )}
        
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ minHeight: '500px' }}
        />
      </div>
    </div>
  );
};

export default BPMNViewerComponent; 