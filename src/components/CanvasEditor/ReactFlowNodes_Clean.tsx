// components/CanvasEditor/ReactFlowNodes_Clean.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

// Working connection handles component
const ConnectionHandles = ({ selected }: { selected: boolean }) => {
  const handleStyle = {
    background: selected ? '#3b82f6' : '#6b7280',
    width: 12,
    height: 12,
    border: '2px solid white',
    borderRadius: '50%',
    opacity: 0.8,
  };

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={handleStyle}
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={handleStyle}
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
      />
      <Handle 
        type="target" 
        position={Position.Right} 
        style={handleStyle}
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        style={handleStyle}
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
      />
    </>
  );
};

// Rectangle Node with built-in ReactFlow resizing
export const RectangleNode = (props: any) => {
  console.log('🎯 RectangleNode props:', props);
  const { data, selected } = props;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    console.log('💾 Saving rectangle text:', editText);
    setIsEditing(false);
    if (data.onChange) {
      data.onChange({ ...data, label: editText });
    }
  };

  return (
    <div
      className="w-full h-full bg-white border-2 rounded shadow-sm hover:shadow-md transition-all duration-200 group flex items-center justify-center p-2"
      style={{
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : '#e5e7eb',
        minWidth: '80px',
        minHeight: '40px',
      }}
    >
      <div className="text-center w-full relative">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setIsEditing(false);
                setEditText(data.label || '');
              }
            }}
            onBlur={handleSave}
            className="w-full text-center bg-transparent border-none outline-none text-gray-800 font-medium"
            style={{ fontSize: '12px' }}
          />
        ) : (
          <span
            className="text-gray-800 font-medium cursor-text hover:bg-gray-100 px-1 py-0.5 rounded"
            style={{ fontSize: '12px' }}
            onDoubleClick={() => setIsEditing(true)}
          >
            {data.label || 'Rectangle'}
          </span>
        )}
      </div>
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// Circle Node
export const CircleNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange({ ...data, label: editText });
    }
  };

  return (
    <div
      className="w-full h-full bg-white border-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group flex items-center justify-center p-2"
      style={{
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : '#e5e7eb',
        minWidth: '60px',
        minHeight: '60px',
        aspectRatio: '1',
      }}
    >
      <div className="text-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setIsEditing(false);
                setEditText(data.label || '');
              }
            }}
            onBlur={handleSave}
            className="w-full text-center bg-transparent border-none outline-none text-gray-800 font-medium"
            style={{ fontSize: '12px' }}
          />
        ) : (
          <span
            className="text-gray-800 font-medium cursor-text hover:bg-gray-100 px-1 py-0.5 rounded"
            style={{ fontSize: '12px' }}
            onDoubleClick={() => setIsEditing(true)}
          >
            {data.label || 'Circle'}
          </span>
        )}
      </div>
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// Triangle Node
export const TriangleNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <div
      className="w-full h-full relative flex items-center justify-center"
      style={{ minWidth: '60px', minHeight: '60px' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: data.fill || '#ffffff',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          border: `2px solid ${selected ? '#3b82f6' : '#e5e7eb'}`,
        }}
      />
      <span
        className="relative z-10 text-gray-800 font-medium text-center"
        style={{ fontSize: '10px' }}
      >
        {data.label || 'Triangle'}
      </span>
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// Diamond Node
export const DiamondNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <div
      className="w-full h-full relative flex items-center justify-center"
      style={{ minWidth: '60px', minHeight: '60px' }}
    >
      <div
        className="absolute inset-0 transform rotate-45"
        style={{
          background: data.fill || '#ffffff',
          border: `2px solid ${selected ? '#3b82f6' : '#e5e7eb'}`,
          borderRadius: '8px',
        }}
      />
      <span
        className="relative z-10 text-gray-800 font-medium text-center"
        style={{ fontSize: '10px' }}
      >
        {data.label || 'Diamond'}
      </span>
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// Basic nodes for other types
export const TextNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center p-2">
    <span className="text-gray-800 font-medium text-center" style={{ fontSize: '12px' }}>
      {data.label || 'Text'}
    </span>
  </div>
);

export const CloudNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-blue-100 border-2 border-blue-300 rounded-full flex items-center justify-center p-2">
    <span className="text-blue-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Cloud'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const ServerNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-gray-100 border-2 border-gray-400 rounded flex items-center justify-center p-2">
    <span className="text-gray-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Server'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const DatabaseNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-green-100 border-2 border-green-400 rounded flex items-center justify-center p-2">
    <span className="text-green-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Database'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

// Arrow nodes
export const ArrowRightNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-2xl text-blue-600">→</div>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const ArrowLeftNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-2xl text-blue-600">←</div>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const ArrowUpNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-2xl text-blue-600">↑</div>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const ArrowDownNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-2xl text-blue-600">↓</div>
    <ConnectionHandles selected={selected || false} />
  </div>
);

// Process and flow nodes
export const ProcessNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-yellow-100 border-2 border-yellow-400 rounded flex items-center justify-center p-2">
    <span className="text-yellow-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Process'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const DocumentNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-purple-100 border-2 border-purple-400 rounded flex items-center justify-center p-2">
    <span className="text-purple-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Document'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

// User and infrastructure nodes
export const UserNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-blue-100 border-2 border-blue-400 rounded-full flex items-center justify-center p-2">
    <span className="text-blue-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'User'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const UsersNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-blue-100 border-2 border-blue-400 rounded flex items-center justify-center p-2">
    <span className="text-blue-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Users'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const RouterNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-orange-100 border-2 border-orange-400 rounded flex items-center justify-center p-2">
    <span className="text-orange-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Router'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const FirewallNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-red-100 border-2 border-red-400 rounded flex items-center justify-center p-2">
    <span className="text-red-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Firewall'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const BuildingNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-gray-100 border-2 border-gray-400 rounded flex items-center justify-center p-2">
    <span className="text-gray-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Building'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

// Additional basic nodes
export const HexagonNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-gray-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Hexagon'}
    </div>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const StarNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-gray-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Star'}
    </div>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const LineNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center border-t-2 border-gray-400">
    <ConnectionHandles selected={selected || false} />
  </div>
);

// Cloud service nodes (simplified)
export const AWSServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-orange-100 border-2 border-orange-500 rounded flex items-center justify-center p-2">
    <span className="text-orange-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'AWS'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const AzureServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-blue-100 border-2 border-blue-500 rounded flex items-center justify-center p-2">
    <span className="text-blue-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Azure'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const GCPServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-green-100 border-2 border-green-500 rounded flex items-center justify-center p-2">
    <span className="text-green-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'GCP'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);

export const ImportedImageNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className="w-full h-full bg-gray-100 border-2 border-gray-400 rounded flex items-center justify-center p-2">
    <span className="text-gray-800 font-medium text-center" style={{ fontSize: '10px' }}>
      {data.label || 'Image'}
    </span>
    <ConnectionHandles selected={selected || false} />
  </div>
);
