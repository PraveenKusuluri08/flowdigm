import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { BPMNIcons } from '../constants/bpmnShapes';

// Base BPMN Node Component with text editing
const BPMNNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const IconComponent = data.icon;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  
  console.log('🔍 Base BPMN Node - shapeId:', data.shapeId, 'data:', data);
  console.log('🔍 IconComponent:', IconComponent);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleDoubleClick = () => {
    console.log('🎯 Double-click triggered!', { data, isEditing });
    console.log('🎯 onChange function available:', !!data.onChange);
    setIsEditing(true);
    setEditText(data.label || '');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.label || '');
    }
  };
  
  const handleInputBlur = () => {
    handleSave();
  };
  
  const handleSave = () => {
    console.log('💾 Saving text:', editText);
    setIsEditing(false);
    // Update the node data through ReactFlow
    if (data.onChange) {
      console.log('✅ Calling onChange with new data');
      data.onChange({ ...data, label: editText });
    } else {
      console.log('❌ No onChange function available');
    }
  };
  
  return (
    <div 
      className={`relative bg-white border-2 rounded shadow-sm hover:shadow-md transition-all duration-200 ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      }`}
      style={{
        width: data.width || 80,
        height: data.height || 60,
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#6b7280'),
        borderWidth: data.strokeWidth || 2,
        minWidth: data.width || 80,
        minHeight: data.height || 60,
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
      onDoubleClick={handleDoubleClick}
      onMouseDown={(e) => {
        console.log('🖱️ Node mouse down detected');
        // Don't stop propagation here to allow ReactFlow to handle selection
      }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      {/* Content */}
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        {/* Icon */}
        <div className="mb-1 flex items-center justify-center">
          {IconComponent ? <IconComponent /> : <span className="text-gray-400">📋</span>}
        </div>
        
        {/* Label - Editable on click */}
        <div className="text-center w-full relative group">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              className="w-full text-center font-medium text-gray-700 bg-blue-50 border border-blue-300 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: Math.min((data.width || 80) / 10, 12) }}
            />
          ) : (
            <>
              <div 
                className="font-medium text-gray-700 text-center break-words leading-tight cursor-pointer hover:bg-blue-50 rounded px-1 py-1 transition-colors border border-transparent hover:border-blue-200"
                style={{ fontSize: Math.min((data.width || 80) / 10, 12) }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick();
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick();
                }}
                title="Click to edit text"
              >
                {data.label || data.name || 'Click to edit'}
              </div>
              {/* Edit button that appears on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoubleClick();
                }}
                className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 flex items-center justify-center z-10"
                title="Click to edit text"
                style={{ transform: 'translate(50%, -50%)' }}
              >
                ✏️
              </button>
              {/* Debug button - always visible */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('🔍 Debug: Testing onChange function');
                  console.log('🔍 Debug: data.onChange exists:', !!data.onChange);
                  console.log('🔍 Debug: data:', data);
                  if (data.onChange) {
                    console.log('🔍 Debug: Calling onChange with test data');
                    data.onChange({ ...data, label: 'Test Text ' + Date.now() });
                  }
                }}
                className="absolute top-0 left-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center z-10"
                title="Debug: Test onChange function"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                🐛
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// BPMN Event Nodes (Circular) - Each with specific icons
const BPMNEventNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const size = Math.min(data.width || 40, data.height || 40);
  const IconComponent = data.icon;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleDoubleClick = () => {
    console.log('🎯 Double-click triggered!', { data, isEditing });
    console.log('🎯 onChange function available:', !!data.onChange);
    setIsEditing(true);
    setEditText(data.label || '');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.label || '');
    }
  };
  
  const handleInputBlur = () => {
    handleSave();
  };
  
  const handleSave = () => {
    setIsEditing(false);
    // Update the node data through ReactFlow
    if (data.onChange) {
      data.onChange({ ...data, label: editText });
    }
  };
  
  // Get the specific BPMN icon based on the shape ID
  const getBPMNIcon = () => {
    console.log('🔍 BPMN Event Node - shapeId:', data.shapeId, 'data:', data);
    console.log('🔍 Available BPMN icons:', Object.keys(BPMNIcons));
    console.log('🔍 Data keys:', Object.keys(data));
    
    if (data.shapeId && BPMNIcons[data.shapeId as keyof typeof BPMNIcons]) {
      const SpecificIcon = BPMNIcons[data.shapeId as keyof typeof BPMNIcons];
      console.log('✅ Found specific BPMN icon for:', data.shapeId);
      return SpecificIcon();
    }
    console.log('❌ No specific BPMN icon found for:', data.shapeId, 'using fallback');
    console.log('❌ Available icons:', Object.keys(BPMNIcons));
    return IconComponent ? <IconComponent /> : <span className="text-gray-400">⚡</span>;
  };
  
  return (
    <div 
      className={`relative bg-white border-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      }`}
      style={{
        width: size,
        height: size,
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#6b7280'),
        borderWidth: data.strokeWidth || 2,
        userSelect: 'none',
      }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      {/* Content */}
      <div className="w-full h-full flex flex-col items-center justify-center p-1">
        {/* Icon */}
        <div className="mb-1 flex items-center justify-center">
          {getBPMNIcon()}
        </div>
        
        {/* Label - Editable on click */}
        <div className="text-center w-full">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              className="w-full text-center font-medium text-gray-700 bg-blue-50 border border-blue-300 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: Math.min(size / 8, 10) }}
            />
          ) : (
            <div 
              className="font-medium text-gray-700 text-center break-words leading-tight cursor-pointer hover:bg-blue-50 rounded px-1 py-1 transition-colors border border-transparent hover:border-blue-200"
              style={{ fontSize: Math.min(size / 8, 10) }}
              onClick={handleDoubleClick}
              onDoubleClick={handleDoubleClick}
              title="Click to edit text"
            >
              {data.label || data.name || 'Click to edit'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// BPMN Gateway Nodes (Diamond) - Each with specific icons
const BPMNGatewayNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const size = Math.min(data.width || 50, data.height || 50);
  const IconComponent = data.icon;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleDoubleClick = () => {
    console.log('🎯 Double-click triggered!', { data, isEditing });
    console.log('🎯 onChange function available:', !!data.onChange);
    setIsEditing(true);
    setEditText(data.label || '');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.label || '');
    }
  };
  
  const handleInputBlur = () => {
    handleSave();
  };
  
  const handleSave = () => {
    setIsEditing(false);
    // Update the node data through ReactFlow
    if (data.onChange) {
      data.onChange({ ...data, label: editText });
    }
  };
  
  // Get the specific BPMN icon based on the shape ID
  const getBPMNIcon = () => {
    console.log('🔍 BPMN Gateway Node - shapeId:', data.shapeId, 'data:', data);
    console.log('🔍 Available BPMN icons:', Object.keys(BPMNIcons));
    console.log('🔍 Data keys:', Object.keys(data));
    
    if (data.shapeId && BPMNIcons[data.shapeId as keyof typeof BPMNIcons]) {
      const SpecificIcon = BPMNIcons[data.shapeId as keyof typeof BPMNIcons];
      console.log('✅ Found specific BPMN icon for:', data.shapeId);
      return SpecificIcon();
    }
    console.log('❌ No specific BPMN icon found for:', data.shapeId, 'using fallback');
    console.log('❌ Available icons:', Object.keys(BPMNIcons));
    return IconComponent ? <IconComponent /> : <span className="text-gray-400">🔀</span>;
  };
  
  return (
    <div 
      className={`relative bg-white border-2 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      }`}
      style={{
        width: size,
        height: size,
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#6b7280'),
        borderWidth: data.strokeWidth || 2,
        transform: 'rotate(45deg)',
        userSelect: 'none',
      }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ transform: 'rotate(-45deg)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ transform: 'rotate(-45deg)' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ transform: 'rotate(-45deg)' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ transform: 'rotate(-45deg)' }}
      />
      
      {/* Content */}
      <div className="w-full h-full flex flex-col items-center justify-center p-1" style={{ transform: 'rotate(-45deg)' }}>
        {/* Icon */}
        <div className="mb-1 flex items-center justify-center">
          {getBPMNIcon()}
        </div>
        
        {/* Label - Editable on click */}
        <div className="text-center w-full">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              className="w-full text-center font-medium text-gray-700 bg-blue-50 border border-blue-300 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: Math.min(size / 10, 10) }}
            />
          ) : (
            <div 
              className="font-medium text-gray-700 text-center break-words leading-tight cursor-pointer hover:bg-blue-50 rounded px-1 py-1 transition-colors border border-transparent hover:border-blue-200"
              style={{ fontSize: Math.min(size / 10, 10) }}
              onClick={handleDoubleClick}
              onDoubleClick={handleDoubleClick}
              title="Click to edit text"
            >
              {data.label || data.name || 'Click to edit'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// BPMN Data Object Node Component (Skewed rectangle)
const BPMNDataObjectNodeComponent = ({ data, selected }: { data: any; selected?: boolean }) => {
  const IconComponent = data.icon;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleDoubleClick = () => {
    console.log('🎯 Double-click triggered!', { data, isEditing });
    console.log('🎯 onChange function available:', !!data.onChange);
    setIsEditing(true);
    setEditText(data.label || '');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.label || '');
    }
  };
  
  const handleInputBlur = () => {
    handleSave();
  };
  
  const handleSave = () => {
    setIsEditing(false);
    // Update the node data through ReactFlow
    if (data.onChange) {
      data.onChange({ ...data, label: editText });
    }
  };
  
  // Get the specific BPMN icon based on the shape ID
  const getBPMNIcon = () => {
    console.log('🔍 BPMN Data Object Node - shapeId:', data.shapeId, 'data:', data);
    console.log('🔍 Available BPMN icons:', Object.keys(BPMNIcons));
    console.log('🔍 Data keys:', Object.keys(data));
    
    if (data.shapeId && BPMNIcons[data.shapeId as keyof typeof BPMNIcons]) {
      const SpecificIcon = BPMNIcons[data.shapeId as keyof typeof BPMNIcons];
      console.log('✅ Found specific BPMN icon for:', data.shapeId);
      return SpecificIcon();
    }
    console.log('❌ No specific BPMN icon found for:', data.shapeId, 'using fallback');
    console.log('❌ Available icons:', Object.keys(BPMNIcons));
    return IconComponent ? <IconComponent /> : <span className="text-gray-400">💾</span>;
  };
  
  return (
    <div 
      className={`relative bg-white border-2 shadow-sm hover:shadow-md transition-all duration-200 ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      }`}
      style={{
        width: data.width || 80,
        height: data.height || 60,
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#6b7280'),
        borderWidth: data.strokeWidth || 2,
        transform: 'skew(20deg)',
        userSelect: 'none',
      }}
    >
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ transform: 'skew(20deg)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ transform: 'skew(20deg)' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ transform: 'skew(20deg)' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        style={{ transform: 'skew(20deg)' }}
      />
      
      {/* Content */}
      <div className="w-full h-full flex flex-col items-center justify-center p-2" style={{ transform: 'skew(20deg)' }}>
        {/* Icon */}
        <div className="mb-1 flex items-center justify-center">
          {getBPMNIcon()}
        </div>
        
        {/* Label - Editable on click */}
        <div className="text-center w-full">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              className="w-full text-center font-medium text-gray-700 bg-blue-50 border border-blue-300 rounded px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: Math.min((data.width || 80) / 12, 10) }}
            />
          ) : (
            <div 
              className="font-medium text-gray-700 text-center break-words leading-tight cursor-pointer hover:bg-blue-50 rounded px-1 py-1 transition-colors border border-transparent hover:border-blue-200"
              style={{ fontSize: Math.min((data.width || 80) / 12, 10) }}
              onClick={handleDoubleClick}
              onDoubleClick={handleDoubleClick}
              title="Click to edit text"
            >
              {data.label || data.name || 'Click to edit'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Individual BPMN Node Components
export const BPMNStartEventNode = (props: any) => <BPMNEventNode {...props} />;
export const BPMNIntermediateEventNode = (props: any) => <BPMNEventNode {...props} />;
export const BPMNEndEventNode = (props: any) => <BPMNEventNode {...props} />;
export const BPMNMessageStartNode = (props: any) => <BPMNEventNode {...props} />;
export const BPMNTimerStartNode = (props: any) => <BPMNEventNode {...props} />;
export const BPMNSignalStartNode = (props: any) => <BPMNEventNode {...props} />;

export const BPMNTaskNode = (props: any) => <BPMNNode {...props} />;
export const BPMNUserTaskNode = (props: any) => <BPMNNode {...props} />;
export const BPMNServiceTaskNode = (props: any) => <BPMNNode {...props} />;
export const BPMNScriptTaskNode = (props: any) => <BPMNNode {...props} />;
export const BPMNSubprocessNode = (props: any) => <BPMNNode {...props} />;

export const BPMNExclusiveGatewayNode = (props: any) => <BPMNGatewayNode {...props} />;
export const BPMNParallelGatewayNode = (props: any) => <BPMNGatewayNode {...props} />;
export const BPMNInclusiveGatewayNode = (props: any) => <BPMNGatewayNode {...props} />;
export const BPMNEventGatewayNode = (props: any) => <BPMNGatewayNode {...props} />;

export const BPMNDataObjectNode = (props: any) => <BPMNDataObjectNodeComponent {...props} />;
export const BPMNDataStoreNode = (props: any) => <BPMNDataObjectNodeComponent {...props} />;
export const BPMNDataInputNode = (props: any) => <BPMNDataObjectNodeComponent {...props} />;
export const BPMNDataOutputNode = (props: any) => <BPMNDataObjectNodeComponent {...props} />;

export const BPMNTextAnnotationNode = (props: any) => <BPMNNode {...props} />;
export const BPMNGroupNode = (props: any) => <BPMNNode {...props} />;

// Export all BPMN node components for easy mapping
export const BPMNNodeComponents = {
  // Events
  'bpmn-start-event': BPMNStartEventNode,
  'bpmn-intermediate-event': BPMNIntermediateEventNode,
  'bpmn-end-event': BPMNEndEventNode,
  'bpmn-message-start': BPMNMessageStartNode,
  'bpmn-timer-start': BPMNTimerStartNode,
  'bpmn-signal-start': BPMNSignalStartNode,
  
  // Activities
  'bpmn-task': BPMNTaskNode,
  'bpmn-user-task': BPMNUserTaskNode,
  'bpmn-service-task': BPMNServiceTaskNode,
  'bpmn-script-task': BPMNScriptTaskNode,
  'bpmn-subprocess': BPMNSubprocessNode,
  
  // Gateways
  'bpmn-exclusive-gateway': BPMNExclusiveGatewayNode,
  'bpmn-parallel-gateway': BPMNParallelGatewayNode,
  'bpmn-inclusive-gateway': BPMNInclusiveGatewayNode,
  'bpmn-event-gateway': BPMNEventGatewayNode,
  
  // Data Objects
  'bpmn-data-object': BPMNDataObjectNode,
  'bpmn-data-store': BPMNDataStoreNode,
  'bpmn-data-input': BPMNDataInputNode,
  'bpmn-data-output': BPMNDataOutputNode,
  
  // Artifacts
  'bpmn-text-annotation': BPMNTextAnnotationNode,
  'bpmn-group': BPMNGroupNode,
}; 