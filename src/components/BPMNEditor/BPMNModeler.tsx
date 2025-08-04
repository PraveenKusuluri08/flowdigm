import React, { useEffect, useRef, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';

// Import BPMN CSS files
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

// Sample BPMN XML for initial diagram
const initialBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Task 1">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="145" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="392" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="400" y="145" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="392" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

interface BPMNModelerProps {
  onSave?: (xml: string) => void;
  onError?: (error: any) => void;
  initialXml?: string;
}

const BPMNModelerComponent: React.FC<BPMNModelerProps> = ({ 
  onSave, 
  onError, 
  initialXml = initialBpmnXml 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelerRef = useRef<BpmnModeler | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initializeModeler = async () => {
      try {
        console.log('Initializing BPMN Modeler...');
        
        // Create BPMN modeler instance
        const modeler = new BpmnModeler({
          container: containerRef.current!,
          keyboard: {
            bindTo: document
          }
        });

        modelerRef.current = modeler;

        console.log('Loading BPMN XML...');
        
        // Load initial diagram
        await modeler.importXML(initialXml);
        
        console.log('BPMN XML loaded successfully');
        
        // Fit to viewport
        (modeler as any).get('canvas').zoom('fit-viewport');
        
        setIsLoading(false);
        console.log('BPMN Modeler initialized successfully');

        // Set up event listeners
        (modeler as any).on('commandStack.changed', () => {
          console.log('Diagram modified');
        });

        (modeler as any).on('element.click', (event: any) => {
          const element = event.element;
          console.log('Element clicked:', element);
        });

      } catch (err: any) {
        console.error('Error initializing BPMN modeler:', err);
        setError(`Failed to load BPMN diagram: ${err instanceof Error ? err.message : 'Unknown error'}`);
        onError?.(err);
        setIsLoading(false);
      }
    };

    initializeModeler();

    // Cleanup
    return () => {
      if (modelerRef.current) {
        try {
          modelerRef.current.destroy();
        } catch (err: any) {
          console.error('Error destroying BPMN modeler:', err);
        }
      }
    };
  }, [initialXml, onError]);

  const handleSave = async () => {
    if (!modelerRef.current) return;

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true });
      if (xml) {
        onSave?.(xml);
        console.log('BPMN diagram saved');
      }
    } catch (err: any) {
      console.error('Error saving BPMN diagram:', err);
      setError('Failed to save BPMN diagram');
      onError?.(err);
    }
  };

  const handleExportSVG = async () => {
    if (!modelerRef.current) return;

    try {
      const { svg } = await modelerRef.current.saveSVG();
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

  const handleUndo = () => {
    if (modelerRef.current) {
      (modelerRef.current as any).get('commandStack').undo();
    }
  };

  const handleRedo = () => {
    if (modelerRef.current) {
      (modelerRef.current as any).get('commandStack').redo();
    }
  };

  const handleZoomIn = () => {
    if (modelerRef.current) {
      const canvas = (modelerRef.current as any).get('canvas');
      canvas.zoom(canvas.zoom() * 1.2);
    }
  };

  const handleZoomOut = () => {
    if (modelerRef.current) {
      const canvas = (modelerRef.current as any).get('canvas');
      canvas.zoom(canvas.zoom() / 1.2);
    }
  };

  const handleFitView = () => {
    if (modelerRef.current) {
      (modelerRef.current as any).get('canvas').zoom('fit-viewport');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-lg font-semibold mb-2">BPMN Editor Error</div>
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleUndo}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Undo"
          >
            ↩ Undo
          </button>
          <button
            onClick={handleRedo}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
            title="Redo"
          >
            ↪ Redo
          </button>
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
            📤 SVG
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-blue-600 text-white border border-blue-600 rounded hover:bg-blue-700"
            title="Save"
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* BPMN Editor Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-gray-600">Loading BPMN Editor...</div>
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

export default BPMNModelerComponent; 