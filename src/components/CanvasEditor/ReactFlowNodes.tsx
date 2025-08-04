// components/CanvasEditor/ReactFlowNodes.tsx - USING REACTFLOW BUILT-IN RESIZING
import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

// Working connection handles component - ONLY VISIBLE ON HOVER
const ConnectionHandles = ({ selected }: { selected: boolean }) => {
  const handleStyle = {
    background: selected ? '#3b82f6' : '#6b7280',
    width: 12,
    height: 12,
    border: '2px solid white',
    borderRadius: '50%',
    zIndex: 1000,
    transition: 'all 0.2s ease',
    cursor: 'crosshair',
  };

  return (
    <>
      {/* Top handle - for incoming connections */}
      <Handle 
        id="top"
        type="target" 
        position={Position.Top} 
        style={handleStyle}
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
      />
      
      {/* Right handle - for outgoing connections */}
      <Handle 
        id="right"
        type="source" 
        position={Position.Right} 
        style={handleStyle}
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
      />
      
      {/* Bottom handle - for outgoing connections */}
      <Handle 
        id="bottom"
        type="source" 
        position={Position.Bottom} 
        style={handleStyle}
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
      />
      
      {/* Left handle - for incoming connections */}
      <Handle 
        id="left"
        type="target" 
        position={Position.Left} 
        style={handleStyle}
        className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
      />
    </>
  );
};

// Base resizable node component
const ResizableNode = ({ 
  children, 
  data, 
  selected = false, 
  minWidth = 50, 
  minHeight = 30 
}: {
  children: React.ReactNode;
  data: any;
  selected?: boolean;
  minWidth?: number;
  minHeight?: number;
}) => {
  return (
    <div 
      className={`relative bg-white border-2 rounded shadow-sm hover:shadow-md transition-all duration-200 ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      }`}
      style={{
        width: data.width || 80,
        height: data.height || 60,
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#000000'),
        borderWidth: data.strokeWidth || 2,
        minWidth,
        minHeight,
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {children}
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// Rectangle Node
export const RectangleNode = ({ data, selected }: { data: any; selected?: boolean }) => {
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
    console.log('🎯 Rectangle double-click triggered!', { data, isEditing });
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
    console.log('💾 Saving rectangle text:', editText);
    setIsEditing(false);
    if (data.onChange) {
      console.log('✅ Calling onChange with new data');
      data.onChange({ ...data, label: editText });
    } else {
      console.log('❌ No onChange function available');
    }
  };

  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        {/* Text Content - Editable */}
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
            </>
          )}
        </div>
      </div>
    </ResizableNode>
  );
};

// Circle Node
export const CircleNode = ({ data, selected }: { data: any; selected?: boolean }) => {
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
    console.log('🎯 Circle double-click triggered!', { data, isEditing });
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
    console.log('💾 Saving circle text:', editText);
    setIsEditing(false);
    if (data.onChange) {
      console.log('✅ Calling onChange with new data');
      data.onChange({ ...data, label: editText });
    } else {
      console.log('❌ No onChange function available');
    }
  };

  return (
    <div 
      className={`relative bg-white border-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
      }`}
      style={{
        width: data.width || 80,
        height: data.height || 80,
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#000000'),
        borderWidth: data.strokeWidth || 2,
        minWidth: 50,
        minHeight: 50,
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
      
      {/* Content */}
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        {/* Text Content - Editable */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// AWS Service Node - ICON ONLY
export const AWSServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  // Use the actual icon from data if available, otherwise show a default
  const renderIcon = () => {
    if (data.icon) {
      // If it's a React element (SVG), render it with proper styling
      if (React.isValidElement(data.icon)) {
        return React.cloneElement(data.icon, {
          style: { 
            width: '48px', 
            height: '48px', 
            color: '#FF9900' // AWS orange
          }
        });
      }
      return data.icon;
    }
    
    // Fallback to specific icons based on shapeId
    switch (data.shapeId) {
      case 'aws-ec2': return <span style={{ color: '#FF9900', fontSize: '48px' }}>🖥️</span>;
      case 'aws-lambda': return <span style={{ color: '#FF9900', fontSize: '48px' }}>⚡</span>;
      case 'aws-ecs': return <span style={{ color: '#FF9900', fontSize: '48px' }}>🐳</span>;
      case 'aws-eks': return <span style={{ color: '#FF9900', fontSize: '48px' }}>☸️</span>;
      case 'aws-s3': return <span style={{ color: '#FF9900', fontSize: '48px' }}>📦</span>;
      case 'aws-ebs': return <span style={{ color: '#FF9900', fontSize: '48px' }}>💾</span>;
      case 'aws-efs': return <span style={{ color: '#FF9900', fontSize: '48px' }}>📁</span>;
      case 'aws-rds': return <span style={{ color: '#FF9900', fontSize: '48px' }}>🗄️</span>;
      case 'aws-dynamodb': return <span style={{ color: '#FF9900', fontSize: '48px' }}>⚡</span>;
      default: return <span style={{ color: '#FF9900', fontSize: '48px' }}>☁️</span>;
    }
  };

  return (
    <div 
      className="relative group"
      style={{
        width: data.width || 80,
        height: data.height || 80,
        userSelect: 'none',
      }}
    >
      {/* Icon Only */}
      <div className="w-full h-full flex items-center justify-center">
        {renderIcon()}
      </div>
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// Azure Service Node - ICON ONLY
export const AzureServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  // Use the actual icon from data if available, otherwise show a default
  const renderIcon = () => {
    if (data.icon) {
      // If it's a React element (SVG), render it with proper styling
      if (React.isValidElement(data.icon)) {
        return React.cloneElement(data.icon, {
          style: { 
            width: '48px', 
            height: '48px', 
            color: '#0078D4' // Azure blue
          }
        });
      }
      return data.icon;
    }
    
    // Fallback to specific icons based on shapeId
    switch (data.shapeId) {
      case 'azure-vm': return <span style={{ color: '#0078D4', fontSize: '48px' }}>🖥️</span>;
      case 'azure-functions': return <span style={{ color: '#0078D4', fontSize: '48px' }}>⚡</span>;
      case 'azure-aks': return <span style={{ color: '#0078D4', fontSize: '48px' }}>☸️</span>;
      case 'azure-storage': return <span style={{ color: '#0078D4', fontSize: '48px' }}>📦</span>;
      case 'azure-sql': return <span style={{ color: '#0078D4', fontSize: '48px' }}>🗄️</span>;
      case 'azure-cosmos': return <span style={{ color: '#0078D4', fontSize: '48px' }}>🌌</span>;
      default: return <span style={{ color: '#0078D4', fontSize: '48px' }}>☁️</span>;
    }
  };

  return (
    <div 
      className="relative group"
      style={{
        width: data.width || 80,
        height: data.height || 80,
        userSelect: 'none',
      }}
    >
      {/* Icon Only */}
      <div className="w-full h-full flex items-center justify-center">
        {renderIcon()}
      </div>
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// GCP Service Node - ICON ONLY
export const GCPServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  // Use the actual icon from data if available, otherwise show a default
  const renderIcon = () => {
    if (data.icon) {
      // If it's a React element (SVG), render it with proper styling
      if (React.isValidElement(data.icon)) {
        return React.cloneElement(data.icon, {
          style: { 
            width: '48px', 
            height: '48px', 
            color: '#4285F4' // GCP blue
          }
        });
      }
      return data.icon;
    }
    
    // Fallback to specific icons based on shapeId
    switch (data.shapeId) {
      case 'gcp-compute-engine': return <span style={{ color: '#4285F4', fontSize: '48px' }}>🖥️</span>;
      case 'gcp-cloud-functions': return <span style={{ color: '#4285F4', fontSize: '48px' }}>⚡</span>;
      case 'gcp-gke': return <span style={{ color: '#4285F4', fontSize: '48px' }}>☸️</span>;
      case 'gcp-cloud-storage': return <span style={{ color: '#4285F4', fontSize: '48px' }}>📦</span>;
      case 'gcp-cloud-sql': return <span style={{ color: '#4285F4', fontSize: '48px' }}>🗄️</span>;
      case 'gcp-firestore': return <span style={{ color: '#4285F4', fontSize: '48px' }}>🔥</span>;
      case 'gcp-bigquery': return <span style={{ color: '#4285F4', fontSize: '48px' }}>📊</span>;
      default: return <span style={{ color: '#4285F4', fontSize: '48px' }}>☁️</span>;
    }
  };

  return (
    <div 
      className="relative group"
      style={{
        width: data.width || 80,
        height: data.height || 80,
        userSelect: 'none',
      }}
    >
      {/* Icon Only */}
      <div className="w-full h-full flex items-center justify-center">
        {renderIcon()}
      </div>
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// Triangle Node
export const TriangleNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  console.log('TriangleNode rendering with data:', data);
  
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
    console.log('🎯 Triangle double-click triggered!', { data, isEditing });
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
    console.log('💾 Saving triangle text:', editText);
    setIsEditing(false);
    if (data.onChange) {
      console.log('✅ Calling onChange with new data');
      data.onChange({ ...data, label: editText });
    } else {
      console.log('❌ No onChange function available');
    }
  };
  
  const width = data.width || 80;
  const height = data.height || 60;
  const fill = data.fill || '#ffffff';
  const stroke = data.stroke || '#000000';
  const strokeWidth = data.strokeWidth || 2;
  
  return (
    <div 
      className="relative"
      style={{
        width: width,
        height: height,
        userSelect: 'none',
      }}
    >
      {/* Triangle SVG */}
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
          style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <polygon
          points={`${width/2},10 ${width-10},${height-10} 10,${height-10}`}
          fill={fill}
          stroke={selected ? '#3b82f6' : stroke}
          strokeWidth={selected ? strokeWidth + 2 : strokeWidth}
        />
      </svg>
      
      {/* Text Content - Editable */}
      <div className="absolute inset-0 flex items-center justify-center p-2">
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
              style={{ fontSize: Math.min(width / 10, 12) }}
            />
          ) : (
            <>
              <div 
                className="font-medium text-gray-700 text-center break-words leading-tight cursor-pointer hover:bg-blue-50 rounded px-1 py-1 transition-colors border border-transparent hover:border-blue-200"
                style={{ fontSize: Math.min(width / 10, 12) }}
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
            </>
          )}
        </div>
      </div>
      
      {/* Connection handles */}
      <ConnectionHandles selected={selected || false} />
      </div>
  );
};

// Diamond Node
export const DiamondNode = ({ data, selected }: { data: any; selected?: boolean }) => {
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
    console.log('🎯 Diamond double-click triggered!', { data, isEditing });
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
    console.log('💾 Saving diamond text:', editText);
    setIsEditing(false);
    if (data.onChange) {
      console.log('✅ Calling onChange with new data');
      data.onChange({ ...data, label: editText });
    } else {
      console.log('❌ No onChange function available');
    }
  };

  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center relative">
        <div 
          className="absolute inset-4 transform rotate-45 border-2"
          style={{
            backgroundColor: data.fill || '#ffffff',
            borderColor: data.stroke || '#000000',
            borderWidth: data.strokeWidth || 2,
          }}
        />
        {/* Text Content - Editable */}
        <div className="relative z-10 text-center w-full relative group">
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
            </>
          )}
        </div>
      </div>
    </ResizableNode>
  );
};

// Imported Image Node
export const ImportedImageNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  console.log('ImportedImageNode rendering with data:', data);
  
  return (
    <ResizableNode data={data} selected={selected} minWidth={50} minHeight={50}>
      <div className="w-full h-full flex flex-col">
        {/* Image */}
        {data.icon && (
          <div className="flex-1 flex items-center justify-center p-2">
            <img 
              src={data.icon} 
              alt={data.label || 'Imported Image'}
              className="max-w-full max-h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onLoad={() => console.log('Image loaded successfully:', data.icon)}
              onError={(e) => console.error('Image failed to load:', data.icon, e)}
            />
          </div>
        )}
        
        {/* Label */}
        {data.label && (
          <div className="text-center p-1 bg-gray-50 border-t">
            <span 
              className="text-xs font-medium text-gray-700 break-words"
              style={{ fontSize: Math.min((data.width || 80) / 10, 12) }}
            >
              {data.label}
            </span>
          </div>
        )}
        
        {/* Debug info - remove in production */}
        <div className="text-xs text-gray-400 p-1">
          Type: {data.type} | Icon: {data.icon ? 'Yes' : 'No'}
        </div>
      </div>
    </ResizableNode>
  );
};

// Hexagon Node
export const HexagonNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center relative">
        <div 
          className="absolute inset-2 transform rotate-45 border-2"
          style={{
            backgroundColor: data.fill || '#ffffff',
            borderColor: data.stroke || '#000000',
            borderWidth: data.strokeWidth || 2,
          }}
        />
        <span 
          className="relative z-10 font-medium text-gray-700 text-center px-1"
          style={{ fontSize: Math.min((data.width || 80) / 10, 12) }}
        >
          {data.label || 'Hexagon'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Star Node
export const StarNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="text-4xl"
          style={{ color: data.fill || '#FFD700' }}
        >
          ⭐
        </div>
        <span 
          className="absolute bottom-1 font-medium text-gray-700 text-center text-xs"
        >
          {data.label || 'Star'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Line Node
export const LineNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="w-full h-1"
          style={{
            backgroundColor: data.stroke || '#000000',
            height: data.strokeWidth || 2,
          }}
        />
      </div>
    </ResizableNode>
  );
};

// Text Node Component for floating text
export const TextNode = ({ data, selected }: { data: any; selected?: boolean }) => {
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
  
  return (
    <div 
      className={`relative bg-transparent border-0 shadow-none hover:shadow-sm transition-all duration-200 ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{
        width: data.width || 120,
        height: data.height || 40,
        userSelect: 'none',
      }}
    >
      {/* Content */}
      <div className="w-full h-full flex items-center justify-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className="w-full text-center font-medium text-gray-700 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
            style={{ fontSize: Math.min((data.width || 120) / 10, 16) }}
          />
        ) : (
          <div 
            className="font-medium text-gray-700 text-center break-words leading-tight cursor-text hover:bg-gray-50 rounded px-2 py-1"
            style={{ fontSize: Math.min((data.width || 120) / 10, 16) }}
            onDoubleClick={handleDoubleClick}
            title="Double-click to edit text"
          >
            {data.label || 'Double-click to edit'}
          </div>
        )}
      </div>
    </div>
  );
};

// Cloud Node
export const CloudNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="text-3xl"
          style={{ color: data.fill || '#87CEEB' }}
        >
          ☁️
        </div>
        <span 
          className="absolute bottom-1 font-medium text-gray-700 text-center text-xs"
        >
          {data.label || 'Cloud'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Server Node
export const ServerNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected} minWidth={80} minHeight={60}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div 
          className="text-2xl mb-1"
          style={{ color: data.fill || '#4A5568' }}
        >
          🖥️
        </div>
        <span 
          className="font-medium text-gray-700 text-center text-xs break-words"
        >
          {data.label || 'Server'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Database Node
export const DatabaseNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected} minWidth={80} minHeight={60}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div 
          className="text-2xl mb-1"
          style={{ color: data.fill || '#3182CE' }}
        >
          🗄️
        </div>
        <span 
          className="font-medium text-gray-700 text-center text-xs break-words"
        >
          {data.label || 'Database'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Arrow Nodes
export const ArrowRightNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="text-3xl"
          style={{ color: data.fill || '#000000' }}
        >
          →
        </div>
      </div>
    </ResizableNode>
  );
};

export const ArrowLeftNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="text-3xl"
          style={{ color: data.fill || '#000000' }}
        >
          ←
        </div>
      </div>
    </ResizableNode>
  );
};

export const ArrowUpNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="text-3xl"
          style={{ color: data.fill || '#000000' }}
        >
          ↑
        </div>
      </div>
    </ResizableNode>
  );
};

export const ArrowDownNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="text-3xl"
          style={{ color: data.fill || '#000000' }}
        >
          ↓
        </div>
      </div>
    </ResizableNode>
  );
};

// Process Node (for flowchart)
export const ProcessNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center p-2">
        <span 
          className="font-medium text-gray-700 text-center break-words"
          style={{ fontSize: Math.min((data.width || 80) / 8, 16) }}
        >
          {data.label || 'Process'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Document Node
export const DocumentNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div 
          className="text-2xl mb-1"
          style={{ color: data.fill || '#4A5568' }}
        >
          📄
        </div>
        <span 
          className="font-medium text-gray-700 text-center text-xs break-words"
        >
          {data.label || 'Document'}
        </span>
      </div>
    </ResizableNode>
  );
};

// User Node
export const UserNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div 
          className="text-2xl mb-1"
          style={{ color: data.fill || '#4A5568' }}
        >
          👤
        </div>
        <span 
          className="font-medium text-gray-700 text-center text-xs break-words"
        >
          {data.label || 'User'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Users Node
export const UsersNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div 
          className="text-2xl mb-1"
          style={{ color: data.fill || '#4A5568' }}
        >
          👥
        </div>
        <span 
          className="font-medium text-gray-700 text-center text-xs break-words"
        >
          {data.label || 'Users'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Router Node
export const RouterNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div 
          className="text-2xl mb-1"
          style={{ color: data.fill || '#4A5568' }}
        >
          🌐
        </div>
        <span 
          className="font-medium text-gray-700 text-center text-xs break-words"
        >
          {data.label || 'Router'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Firewall Node
export const FirewallNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div 
          className="text-2xl mb-1"
          style={{ color: data.fill || '#E53E3E' }}
        >
          🛡️
        </div>
        <span 
          className="font-medium text-gray-700 text-center text-xs break-words"
        >
          {data.label || 'Firewall'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Building Node
export const BuildingNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex flex-col items-center justify-center p-2">
        <div 
          className="text-2xl mb-1"
          style={{ color: data.fill || '#4A5568' }}
        >
          🏢
        </div>
        <span 
          className="font-medium text-gray-700 text-center text-xs break-words"
        >
          {data.label || 'Building'}
        </span>
      </div>
    </ResizableNode>
  );
};