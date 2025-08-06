// components/CanvasEditor/ReactFlowCanvas.tsx - NEW FILE
import { ReactFlowProvider } from 'reactflow';
import DrawingCanvas from './Drawingcanvas';

const ReactFlowCanvas = () => {
  return (
    <div className="flex-1 bg-white relative overflow-hidden">
      <ReactFlowProvider>
        <DrawingCanvas />
      </ReactFlowProvider>
    </div>
  );
};

export default ReactFlowCanvas;