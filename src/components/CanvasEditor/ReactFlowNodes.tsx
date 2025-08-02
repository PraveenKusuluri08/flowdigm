// components/CanvasEditor/ReactFlowNodes.tsx - WORKING Resize
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

// Simple working resize handle
const ResizeHandle = ({ position, onResize, nodeRef }) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!nodeRef.current) return;
    
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = nodeRef.current.offsetWidth;
    const startHeight = nodeRef.current.offsetHeight;
    
    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      // Calculate new size based on handle position
      if (position.includes('right')) {
        newWidth = Math.max(50, startWidth + deltaX);
      }
      if (position.includes('left')) {
        newWidth = Math.max(50, startWidth - deltaX);
      }
      if (position.includes('bottom')) {
        newHeight = Math.max(30, startHeight + deltaY);
      }
      if (position.includes('top')) {
        newHeight = Math.max(30, startHeight - deltaY);
      }
      
      // Apply size immediately for visual feedback
      if (nodeRef.current) {
        nodeRef.current.style.width = `${newWidth}px`;
        nodeRef.current.style.height = `${newHeight}px`;
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      
      if (nodeRef.current && onResize) {
        const finalWidth = nodeRef.current.offsetWidth;
        const finalHeight = nodeRef.current.offsetHeight;
        
        onResize({
          width: finalWidth,
          height: finalHeight
        });
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [position, onResize, nodeRef]);

  const getHandleStyle = () => {
    const baseStyle = {
      position: 'absolute',
      width: '8px',
      height: '8px',
      backgroundColor: '#3b82f6',
      border: '1px solid white',
      borderRadius: '2px',
      cursor: getCursor(position),
      zIndex: 1000,
    };

    const positionStyle = getPositionStyle(position);
    return { ...baseStyle, ...positionStyle };
  };

  const getCursor = (pos) => {
    if (pos === 'top-left' || pos === 'bottom-right') return 'nw-resize';
    if (pos === 'top-right' || pos === 'bottom-left') return 'ne-resize';
    if (pos === 'top' || pos === 'bottom') return 'ns-resize';
    if (pos === 'left' || pos === 'right') return 'ew-resize';
    return 'default';
  };

  const getPositionStyle = (pos) => {
    switch (pos) {
      case 'top-left': return { top: '-4px', left: '-4px' };
      case 'top': return { top: '-4px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right': return { top: '-4px', right: '-4px' };
      case 'right': return { top: '50%', right: '-4px', transform: 'translateY(-50%)' };
      case 'bottom-right': return { bottom: '-4px', right: '-4px' };
      case 'bottom': return { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-left': return { bottom: '-4px', left: '-4px' };
      case 'left': return { top: '50%', left: '-4px', transform: 'translateY(-50%)' };
      default: return {};
    }
  };

  return (
    <div
      style={getHandleStyle()}
      onMouseDown={handleMouseDown}
    />
  );
};

// Base resizable node
const ResizableNode = ({ children, data, selected = false, minWidth = 50, minHeight = 30 }) => {
  const nodeRef = useRef(null);
  
  const handleResize = useCallback((newSize) => {
    if (data.onResize) {
      data.onResize(newSize);
    }
  }, [data]);

  return (
    <div 
      ref={nodeRef}
      className={`relative bg-white border-2 rounded shadow-sm hover:shadow-md transition-shadow ${
        selected ? 'border-blue-500' : ''
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
      
      {/* Resize handles - only show when selected */}
      {selected && (
        <>
          <ResizeHandle position="top-left" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="top" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="top-right" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="right" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="bottom-right" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="bottom" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="bottom-left" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="left" onResize={handleResize} nodeRef={nodeRef} />
        </>
      )}
      
      {/* Connection handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: '#3b82f6', 
          width: 10, 
          height: 10,
          border: '2px solid white',
          zIndex: 100
        }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ 
          background: '#3b82f6', 
          width: 10, 
          height: 10,
          border: '2px solid white',
          zIndex: 100
        }}
      />
      <Handle 
        type="target" 
        position={Position.Bottom} 
        style={{ 
          background: '#3b82f6', 
          width: 10, 
          height: 10,
          border: '2px solid white',
          zIndex: 100
        }}
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        style={{ 
          background: '#3b82f6', 
          width: 10, 
          height: 10,
          border: '2px solid white',
          zIndex: 100
        }}
      />
    </div>
  );
};

// Rectangle Node
export const RectangleNode = ({ data, selected }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center p-2">
        <span 
          className="font-medium text-gray-700 text-center break-words"
          style={{ fontSize: Math.min((data.width || 80) / 8, 16) }}
        >
          {data.label || 'Rectangle'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Circle Node (special handling to maintain aspect ratio)
export const CircleNode = ({ data, selected }) => {
  const nodeRef = useRef(null);
  const size = Math.min(data.width || 80, data.height || 60);
  
  const handleResize = useCallback((newSize) => {
    // Keep aspect ratio for circles
    const newDimension = Math.max(newSize.width, newSize.height);
    if (data.onResize) {
      data.onResize({
        width: newDimension,
        height: newDimension
      });
    }
  }, [data]);

  return (
    <div 
      ref={nodeRef}
      className={`relative bg-white border-2 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center justify-center ${
        selected ? 'border-blue-500' : ''
      }`}
      style={{
        width: size,
        height: size,
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#000000'),
        borderWidth: data.strokeWidth || 2,
        userSelect: 'none',
      }}
    >
      <span 
        className="font-medium text-gray-700 text-center px-1 break-words"
        style={{ fontSize: Math.min(size / 6, 14) }}
      >
        {data.label || 'Circle'}
      </span>
      
      {/* Resize handles for circle */}
      {selected && (
        <>
          <ResizeHandle position="top-right" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="bottom-right" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="bottom-left" onResize={handleResize} nodeRef={nodeRef} />
          <ResizeHandle position="top-left" onResize={handleResize} nodeRef={nodeRef} />
        </>
      )}
      
      {/* Connection handles */}
      <Handle type="target" position={Position.Top} style={{ background: '#3b82f6', width: 10, height: 10, border: '2px solid white' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6', width: 10, height: 10, border: '2px solid white' }} />
      <Handle type="target" position={Position.Bottom} style={{ background: '#3b82f6', width: 10, height: 10, border: '2px solid white' }} />
      <Handle type="source" position={Position.Left} style={{ background: '#3b82f6', width: 10, height: 10, border: '2px solid white' }} />
    </div>
  );
};

// AWS Service Node
export const AWSServiceNode = ({ data, selected }) => {
  return (
    <ResizableNode data={data} selected={selected} minWidth={100} minHeight={70}>
      <div className="w-full h-full p-2 flex flex-col">
        {/* Header */}
        <div className="flex items-center mb-1">
          <div 
            className="w-4 h-4 rounded mr-2 flex-shrink-0"
            style={{ backgroundColor: data.stroke || '#FF9900' }}
          />
          <span className="text-xs font-bold text-orange-600">AWS</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 text-center">
          <div 
            className="font-semibold text-gray-800 break-words leading-tight"
            style={{ fontSize: Math.min((data.width || 120) / 12, 12) }}
          >
            {data.serviceName || data.label?.replace('aws-', '').toUpperCase()}
          </div>
          <div 
            className="text-gray-500 break-words leading-tight mt-1"
            style={{ fontSize: Math.min((data.width || 120) / 15, 9) }}
          >
            {data.description || 'Amazon Web Services'}
          </div>
        </div>
      </div>
    </ResizableNode>
  );
};

// Azure Service Node
export const AzureServiceNode = ({ data, selected }) => {
  return (
    <ResizableNode data={data} selected={selected} minWidth={100} minHeight={70}>
      <div className="w-full h-full p-2 flex flex-col">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded mr-2 bg-blue-500 flex-shrink-0" />
          <span className="text-xs font-bold text-blue-600">Azure</span>
        </div>
        
        <div className="flex-1 text-center">
          <div 
            className="font-semibold text-gray-800 break-words leading-tight"
            style={{ fontSize: Math.min((data.width || 120) / 12, 12) }}
          >
            {data.serviceName || data.label?.replace('azure-', '').toUpperCase()}
          </div>
          <div 
            className="text-gray-500 break-words leading-tight mt-1"
            style={{ fontSize: Math.min((data.width || 120) / 15, 9) }}
          >
            {data.description || 'Microsoft Azure'}
          </div>
        </div>
      </div>
    </ResizableNode>
  );
};

// GCP Service Node
export const GCPServiceNode = ({ data, selected }) => {
  return (
    <ResizableNode data={data} selected={selected} minWidth={100} minHeight={70}>
      <div className="w-full h-full p-2 flex flex-col">
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded mr-2 bg-blue-400 flex-shrink-0" />
          <span className="text-xs font-bold text-blue-600">GCP</span>
        </div>
        
        <div className="flex-1 text-center">
          <div 
            className="font-semibold text-gray-800 break-words leading-tight"
            style={{ fontSize: Math.min((data.width || 120) / 12, 12) }}
          >
            {data.serviceName || data.label?.replace('gcp-', '').toUpperCase()}
          </div>
          <div 
            className="text-gray-500 break-words leading-tight mt-1"
            style={{ fontSize: Math.min((data.width || 120) / 15, 9) }}
          >
            {data.description || 'Google Cloud'}
          </div>
        </div>
      </div>
    </ResizableNode>
  );
};

// Triangle Node
export const TriangleNode = ({ data, selected }) => {
  return (
    <ResizableNode data={data} selected={selected}>
      <div className="w-full h-full flex items-center justify-center relative">
        <div 
          className="border-l-transparent border-r-transparent"
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: (data.width || 80) / 2,
            borderRightWidth: (data.width || 80) / 2,
            borderBottomWidth: (data.height || 60) - 10,
            borderBottomColor: data.fill || '#ffffff',
            borderBottomStyle: 'solid',
            filter: `drop-shadow(0 0 0 ${data.strokeWidth || 2}px ${data.stroke || '#000000'})`,
          }}
        />
        <span 
          className="absolute bottom-2 font-medium text-gray-700 text-center"
          style={{ fontSize: Math.min((data.width || 80) / 10, 12) }}
        >
          {data.label || 'Triangle'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Diamond Node
export const DiamondNode = ({ data, selected }) => {
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
        <span 
          className="relative z-10 font-medium text-gray-700 text-center px-1"
          style={{ fontSize: Math.min((data.width || 80) / 10, 12) }}
        >
          {data.label || 'Diamond'}
        </span>
      </div>
    </ResizableNode>
  );
};

// Simple versions for other shapes
export const HexagonNode = ({ data, selected }) => <RectangleNode data={{...data, label: data.label || 'Hexagon'}} selected={selected} />;
export const StarNode = ({ data, selected }) => <RectangleNode data={{...data, label: data.label || 'Star'}} selected={selected} />;
export const LineNode = ({ data, selected }) => <RectangleNode data={{...data, label: data.label || 'Line'}} selected={selected} />;
export const TextNode = ({ data, selected }) => <RectangleNode data={{...data, label: data.label || 'Text'}} selected={selected} />;
export const CloudNode = ({ data, selected }) => <RectangleNode data={{...data, label: data.label || 'Cloud'}} selected={selected} />;
export const ServerNode = ({ data, selected }) => <RectangleNode data={{...data, label: data.label || 'Server'}} selected={selected} />;
export const DatabaseNode = ({ data, selected }) => <RectangleNode data={{...data, label: data.label || 'Database'}} selected={selected} />;