import React, { useEffect, useRef, useState } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './BPMNEditor.css';

// Sample BPMN XML
const sampleBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Sample Task">
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

interface BPMNEditorProps {
  onSave?: (xml: string) => void;
  onExport?: (svg: string) => void;
}

const BPMNEditor: React.FC<BPMNEditorProps> = ({ onSave, onExport }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const propertiesRef = useRef<HTMLDivElement>(null);
  const [modeler, setModeler] = useState<BpmnModeler | null>(null);
  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create BPMN modeler
    const bpmnModeler = new BpmnModeler({
      container: canvasRef.current
    });

    setModeler(bpmnModeler);

    // Load sample BPMN
    bpmnModeler
      .importXML(sampleBpmn)
      .then(() => {
        const canvas = bpmnModeler.get('canvas') as any;
        canvas?.zoom?.('fit-viewport');
      })
      .catch((err: unknown) => {
        console.error('Error loading BPMN:', err);
      });

    // Listen for changes
    bpmnModeler.on('commandStack.changed', () => {
      bpmnModeler.saveXML({ format: true }).then((result: any) => {
        setXml(result?.xml ?? '');
      });
    });

    return () => {
      bpmnModeler.destroy();
    };
  }, []);

  const handleSave = async () => {
    if (!modeler) return;
    
    try {
      const result = (await modeler.saveXML({ format: true })) as any;
      const xmlOut: string = result?.xml ?? '';
      onSave?.(xmlOut);
      console.log('BPMN saved:', xmlOut);
    } catch (err: unknown) {
      console.error('Error saving BPMN:', err);
    }
  };

  const handleExportSVG = async () => {
    if (!modeler) return;
    
    try {
      const result = (await modeler.saveSVG()) as any;
      const svgOut: string = result?.svg ?? '';
      onExport?.(svgOut);
      console.log('BPMN exported as SVG');
    } catch (err: unknown) {
      console.error('Error exporting BPMN:', err);
    }
  };

  const handleNew = () => {
    if (!modeler) return;
    
    modeler
      .createDiagram()
      .then(() => {
        const canvas = modeler.get('canvas') as any;
        canvas?.zoom?.('fit-viewport');
      })
      .catch((err: unknown) => {
        console.error('Error creating new diagram:', err);
      });
  };

  const handleOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !modeler) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const xml = e.target?.result as string;
      if (xml) {
        modeler
          .importXML(xml)
          .then(() => {
            const canvas = modeler.get('canvas') as any;
            canvas?.zoom?.('fit-viewport');
          })
          .catch((err: unknown) => {
            console.error('Error loading file:', err);
          });
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!xml) return;
    
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bpmn-diagram.bpmn';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bpmn-editor-container">
      {/* BPMN Toolbar */}
      <div className="bpmn-toolbar">
        <div className="toolbar-left">
          <button onClick={handleNew} className="toolbar-btn">
            📄 New
          </button>
          <label className="toolbar-btn">
            📂 Open
            <input
              type="file"
              accept=".bpmn,.xml"
              onChange={handleOpen}
              style={{ display: 'none' }}
            />
          </label>
          <button onClick={handleSave} className="toolbar-btn">
            💾 Save
          </button>
          <button onClick={handleDownload} className="toolbar-btn">
            ⬇️ Download
          </button>
        </div>
        <div className="toolbar-center">
          <span>BPMN Process Modeler</span>
        </div>
        <div className="toolbar-right">
          <button onClick={handleExportSVG} className="toolbar-btn">
            🖼️ Export SVG
          </button>
          <button className="toolbar-btn">
            🔍 Zoom Fit
          </button>
          <button className="toolbar-btn">
            📊 Properties
          </button>
        </div>
      </div>

      {/* BPMN Canvas and Properties */}
      <div className="bpmn-main">
        <div className="bpmn-canvas" ref={canvasRef}></div>
        <div className="bpmn-properties" ref={propertiesRef}>
          <div className="properties-header">
            <h3>Properties Panel</h3>
            <p>Select an element to edit its properties</p>
          </div>
          <div className="properties-content">
            <div className="property-group">
              <h4>General</h4>
              <div className="property-field">
                <label>Name</label>
                <input type="text" placeholder="Enter name..." />
              </div>
              <div className="property-field">
                <label>Description</label>
                <textarea placeholder="Enter description..." rows={3}></textarea>
              </div>
            </div>
            <div className="property-group">
              <h4>Appearance</h4>
              <div className="property-field">
                <label>Background Color</label>
                <input type="color" defaultValue="#ffffff" />
              </div>
              <div className="property-field">
                <label>Border Color</label>
                <input type="color" defaultValue="#000000" />
              </div>
            </div>
            <div className="property-group">
              <h4>Behavior</h4>
              <div className="property-field">
                <label>Process Type</label>
                <select>
                  <option>Manual</option>
                  <option>Automated</option>
                  <option>User Task</option>
                  <option>Service Task</option>
                </select>
              </div>
              <div className="property-field">
                <label>Priority</label>
                <select>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <button className="floating-action-btn" title="Add Task">
          ➕
        </button>
        <button className="floating-action-btn" title="Add Gateway">
          🔀
        </button>
        <button className="floating-action-btn" title="Add Event">
          ⚡
        </button>
        <button className="floating-action-btn" title="Connect Elements">
          🔗
        </button>
      </div>
    </div>
  );
};

export default BPMNEditor; 