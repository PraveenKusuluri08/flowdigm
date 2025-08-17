// components/CanvasEditor/ReactFlowNodes.tsx - ENHANCED VERSION
import { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

// Connection handles component
const ConnectionHandles = ({ selected }: { selected: boolean }) => {
  const [handleSize, setHandleSize] = useState(8);
  
  const handleStyle = {
    background: selected ? '#3b82f6' : '#6b7280',
    width: handleSize,
    height: handleSize,
    border: '1px solid white',
    borderRadius: '50%',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    cursor: 'pointer',
  };

  const handleMouseEnter = () => {
    setHandleSize(10); // Very small hover size
  };

  const handleMouseLeave = () => {
    setHandleSize(8); // Very small default size
  };

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        style={handleStyle} 
        className={`transition-all duration-200 group-hover:opacity-100 hover:scale-110 z-50 ${selected ? 'opacity-100' : 'opacity-10'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={handleStyle}
        className={`transition-all duration-200 group-hover:opacity-100 hover:scale-110 z-50 ${selected ? 'opacity-100' : 'opacity-10'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Handle 
        type="target" 
        position={Position.Right} 
        style={handleStyle}
        className={`transition-all duration-200 group-hover:opacity-100 hover:scale-110 z-50 ${selected ? 'opacity-100' : 'opacity-10'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Handle 
        type="source" 
        position={Position.Left} 
        style={handleStyle}
        className={`transition-all duration-200 group-hover:opacity-100 hover:scale-110 z-50 ${selected ? 'opacity-100' : 'opacity-10'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
};

// Base resizable node component
const ResizableNode = ({ 
  data, 
  selected, 
  children, 
  minWidth = 60, 
  minHeight = 60, 
  keepAspectRatio = false 
}: {
  data: any;
  selected?: boolean;
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
  keepAspectRatio?: boolean;
}) => {
  const [currentSize, setCurrentSize] = useState({ 
    width: data.width || minWidth, 
    height: data.height || minHeight 
  });
  
  useEffect(() => {
    setCurrentSize({ width: data.width || minWidth, height: data.height || minHeight });
  }, [data.width, data.height, minWidth, minHeight]);
  
  return (
    <div
      className="relative group"
      style={{
        width: currentSize.width,
        height: currentSize.height,
        minWidth: minWidth,
        minHeight: minHeight,
        transition: 'none',
        overflow: 'visible',
      }}
    >
      <NodeResizer
        color="#3b82f6"
        isVisible={selected || false}
        minWidth={minWidth}
        minHeight={minHeight}
        keepAspectRatio={keepAspectRatio}
        handleStyle={{
          width: 8,
          height: 8,
          backgroundColor: '#3b82f6',
          border: '1px solid white'
        }}
        onResize={(_event, params) => {
          const newWidth = Math.max(params.width, minWidth);
          const newHeight = Math.max(params.height, minHeight);
          
          setCurrentSize({ width: newWidth, height: newHeight });
          
          // Preserve all existing data when resizing
          if (data.onResize) {
            data.onResize({ 
              ...data,
              width: newWidth, 
              height: newHeight 
            });
          }
        }}
      />
      {children}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};

// Editable text component
const EditableText = ({ 
  data, 
  placeholder, 
  className = "text-gray-800 font-medium text-center",
  style = { fontSize: '10px' }
}: {
  data: any;
  placeholder: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label || '');
  const [showTextToolbar, setShowTextToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update editText when data.label changes (from RightSidebar)
  useEffect(() => {
    setEditText(data.label || '');
  }, [data.label]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    setIsEditing(false);
    setShowTextToolbar(false);
    if (data.onChange) {
      data.onChange({ ...data, label: editText });
    }
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    setIsEditing(true);
    setShowTextToolbar(true);
    setToolbarPosition({
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleStyleChange = (property: string, value: any) => {
    if (data.onChange) {
      data.onChange({ ...data, [property]: value });
    }
  };

  // Apply text styling from data - ENHANCED to use RightSidebar values
  const textStyle: React.CSSProperties = {
    fontSize: `${data.fontSize || 8}px`,
    fontFamily: data.fontFamily || 'Arial',
    color: data.fontColor || '#000000',
    fontWeight: data.fontWeight || 'normal',
    fontStyle: data.fontStyle || 'normal',
    textDecoration: data.textDecoration || 'none',
    textAlign: data.textAlign || 'center',
    lineHeight: data.lineHeight || 1.2,
    letterSpacing: data.letterSpacing ? `${data.letterSpacing}px` : 'normal',
    ...style
  };

  console.log('🎨 EditableText: Applying text style:', {
    fontSize: data.fontSize,
    fontFamily: data.fontFamily,
    color: data.fontColor,
    fontWeight: data.fontWeight,
    fontStyle: data.fontStyle,
    textAlign: data.textAlign
  });

  return (
    <>
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
              setShowTextToolbar(false);
              setEditText(data.label || '');
            }
          }}
          onBlur={handleSave}
          className="w-full text-center bg-transparent border-none outline-none"
          style={textStyle}
        />
      ) : (
        <span
          className={`${className} cursor-text hover:bg-gray-100 px-1 py-0.5 rounded`}
          style={textStyle}
          onDoubleClick={handleDoubleClick}
        >
          {data.label || placeholder}
        </span>
      )}
      
      {/* Floating Text Toolbar */}
      {showTextToolbar && (
        <div
          className="fixed bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50"
          style={{
            left: toolbarPosition.x,
            top: toolbarPosition.y - 60,
            minWidth: '300px'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Text Formatting</span>
            <button
              onClick={() => setShowTextToolbar(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-gray-600 mb-1">Font Size</label>
              <select
                value={data.fontSize || 8}
                onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
                className="w-full p-1 border rounded"
              >
                <option value={6}>6px</option>
                <option value={8}>8px</option>
                <option value={10}>10px</option>
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-600 mb-1">Font Weight</label>
              <select
                value={data.fontWeight || 'normal'}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full p-1 border rounded"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-600 mb-1">Text Color</label>
              <input
                type="color"
                value={data.fontColor || '#000000'}
                onChange={(e) => handleStyleChange('fontColor', e.target.value)}
                className="w-full h-6 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 mb-1">Alignment</label>
              <select
                value={data.textAlign || 'center'}
                onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                className="w-full p-1 border rounded"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Rectangle Node
export const RectangleNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} minWidth={40} minHeight={30}>
    <div
      className="bg-white border-2 rounded shadow-sm hover:shadow-md transition-all duration-200 group flex items-center justify-center p-1 w-full h-full"
      style={{
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#d1d5db'),
        borderWidth: data.strokeWidth || 2,
        boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <EditableText 
        data={data} 
        placeholder="Rectangle" 
        className="text-gray-800 font-medium"
        style={{ 
          fontSize: `${data.fontSize || 8}px`,
          fontFamily: data.fontFamily || 'Arial',
          color: data.fontColor || '#000000',
          fontWeight: data.fontWeight || 'normal',
          fontStyle: data.fontStyle || 'normal',
          textAlign: data.textAlign || 'center'
        }}
      />
    </div>
  </ResizableNode>
);

// Circle Node
export const CircleNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} minWidth={40} minHeight={40} keepAspectRatio={true}>
    <div
      className="bg-white border-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group flex items-center justify-center p-1 w-full h-full"
      style={{
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : (data.stroke || '#d1d5db'),
        borderWidth: data.strokeWidth || 2,
        boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <EditableText 
        data={data} 
        placeholder="Circle" 
        className="text-gray-800 font-medium"
        style={{ 
          fontSize: `${data.fontSize || 8}px`,
          fontFamily: data.fontFamily || 'Arial',
          color: data.fontColor || '#000000',
          fontWeight: data.fontWeight || 'normal',
          fontStyle: data.fontStyle || 'normal',
          textAlign: data.textAlign || 'center'
        }}
      />
    </div>
  </ResizableNode>
);

// Shape Node with CSS clip-path
const ShapeNode = ({ 
  data, 
  selected, 
  clipPath, 
  placeholder,
  maintainAspectRatio = true 
}: {
  data: any;
  selected?: boolean;
  clipPath: string;
  placeholder: string;
  maintainAspectRatio?: boolean;
}) => (
  <ResizableNode data={data} selected={selected} minWidth={35} minHeight={35} keepAspectRatio={maintainAspectRatio}>
    <div className="relative flex items-center justify-center w-full h-full" style={{ overflow: 'hidden' }}>
      <div
        className="absolute inset-0"
        style={{
          background: data.fill || '#ffffff',
          clipPath,
          border: `2px solid ${selected ? '#3b82f6' : '#d1d5db'}`,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      />
      <div className="relative z-10" style={{ fontSize: '6px' }}>
        <EditableText data={data} placeholder={placeholder} className="text-gray-800 font-medium text-center" style={{ fontSize: '6px' }} />
      </div>
    </div>
  </ResizableNode>
);

// Geometric shapes using ShapeNode
export const TriangleNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ShapeNode data={data} selected={selected} clipPath="polygon(50% 0%, 0% 100%, 100% 100%)" placeholder="Triangle" maintainAspectRatio={true} />
);

export const DiamondNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} minWidth={35} minHeight={35} keepAspectRatio={true}>
    <div className="relative flex items-center justify-center w-full h-full">
      <div
        className="absolute inset-0 transform rotate-45"
        style={{
          background: data.fill || '#ffffff',
          border: `2px solid ${selected ? '#3b82f6' : '#d1d5db'}`,
          borderRadius: '4px',
          boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />
      <div className="relative z-10" style={{ fontSize: '6px' }}>
        <EditableText data={data} placeholder="Diamond" className="text-gray-800 font-medium text-center" style={{ fontSize: '6px' }} />
      </div>
    </div>
  </ResizableNode>
);

export const HexagonNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ShapeNode data={data} selected={selected} clipPath="polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" placeholder="Hexagon" maintainAspectRatio={true} />
);

export const StarNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ShapeNode data={data} selected={selected} clipPath="polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" placeholder="Star" maintainAspectRatio={true} />
);

// Icon-based node component
const IconNode = ({ 
  data, 
  selected, 
  bgColor, 
  borderColor, 
  textColor, 
  placeholder 
}: {
  data: any;
  selected?: boolean;
  bgColor: string;
  borderColor: string;
  textColor: string;
  placeholder: string;
}) => (
  <ResizableNode data={data} selected={selected} minWidth={30} minHeight={30}>
    <div
      className={`w-full h-full flex flex-col items-center justify-center p-1 border-2 rounded shadow-sm hover:shadow-md transition-all duration-200 group ${bgColor} ${borderColor}`}
      style={{
        borderColor: selected ? '#3b82f6' : undefined,
      }}
    >
      <EditableText data={data} placeholder={placeholder} className={`${textColor} font-medium text-center`} style={{ fontSize: '6px' }} />
    </div>
  </ResizableNode>
);

// Basic nodes
export const TextNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  console.log('🎨 TextNode: Rendering with data:', {
    label: data.label,
    fontSize: data.fontSize,
    fontFamily: data.fontFamily,
    fontColor: data.fontColor,
    fontWeight: data.fontWeight,
    fontStyle: data.fontStyle,
    textAlign: data.textAlign
  });

  return (
    <ResizableNode data={data} selected={selected} minWidth={60} minHeight={20}>
      <div className="w-full h-full flex items-center justify-center p-1 bg-transparent">
        <EditableText 
          data={data} 
          placeholder="Text" 
          className="text-gray-800 font-medium text-center" 
          style={{ 
            fontSize: `${data.fontSize || 8}px`,
            fontFamily: data.fontFamily || 'Arial',
            color: data.fontColor || '#000000',
            fontWeight: data.fontWeight || 'normal',
            fontStyle: data.fontStyle || 'normal',
            textAlign: data.textAlign || 'center'
          }} 
        />
      </div>
    </ResizableNode>
  );
};

export const LineNode = ({ data, selected }: { data?: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} minWidth={80} minHeight={2}>
    <div className="w-full h-full flex items-center justify-center border-t-2 border-gray-400">
      <ConnectionHandles selected={selected || false} />
    </div>
  </ResizableNode>
);

// Arrow nodes
const ArrowNode = ({ data, selected, symbol }: { data?: any; selected?: boolean; symbol: string }) => (
  <ResizableNode data={data} selected={selected} minWidth={40} minHeight={40} keepAspectRatio={true}>
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-2xl text-blue-600" style={{ fontSize: 'clamp(16px, 50%, 32px)' }}>{symbol}</div>
    </div>
  </ResizableNode>
);

export const ArrowRightNode = ({ data, selected }: { data?: any; selected?: boolean }) => <ArrowNode data={data} selected={selected} symbol="→" />;
export const ArrowLeftNode = ({ data, selected }: { data?: any; selected?: boolean }) => <ArrowNode data={data} selected={selected} symbol="←" />;
export const ArrowUpNode = ({ data, selected }: { data?: any; selected?: boolean }) => <ArrowNode data={data} selected={selected} symbol="↑" />;
export const ArrowDownNode = ({ data, selected }: { data?: any; selected?: boolean }) => <ArrowNode data={data} selected={selected} symbol="↓" />;

// Service nodes using IconNode
export const CloudNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-blue-100" borderColor="border-blue-300" textColor="text-blue-800" placeholder="Cloud" />
);

export const ServerNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-gray-100" borderColor="border-gray-400" textColor="text-gray-800" placeholder="Server" />
);

export const DatabaseNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-green-100" borderColor="border-green-400" textColor="text-green-800" placeholder="Database" />
);

export const ProcessNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-yellow-100" borderColor="border-yellow-400" textColor="text-yellow-800" placeholder="Process" />
);

export const DocumentNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-purple-100" borderColor="border-purple-400" textColor="text-purple-800" placeholder="Document" />
);

export const UserNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-blue-100" borderColor="border-blue-400" textColor="text-blue-800" placeholder="User" />
);

export const UsersNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-blue-100" borderColor="border-blue-400" textColor="text-blue-800" placeholder="Users" />
);

export const RouterNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-orange-100" borderColor="border-orange-400" textColor="text-orange-800" placeholder="Router" />
);

export const FirewallNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-red-100" borderColor="border-red-400" textColor="text-red-800" placeholder="Firewall" />
);

export const BuildingNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-gray-100" borderColor="border-gray-400" textColor="text-gray-800" placeholder="Building" />
);

// Enhanced cloud service nodes with specific icons
const CloudServiceNode = ({ 
  data, 
  selected, 
  bgColor, 
  borderColor, 
  textColor, 
  iconSrc,
  serviceName 
}: {
  data: any;
  selected?: boolean;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconSrc?: string;
  serviceName: string;
}) => (
  <ResizableNode data={data} selected={selected} minWidth={32} minHeight={32}>
    {data.iconOnly ? (
      <div className="w-full h-full flex items-center justify-center">
        {(() => {
          // Render priority: ReactNode icon → iconSrc on data → iconSrc prop
          if (data.icon && typeof data.icon !== 'string') {
            return <div className="w-full h-full flex items-center justify-center">{data.icon}</div>;
          }
          const src = (typeof data.icon === 'string' ? data.icon : undefined) || data.iconSrc || iconSrc;
          if (src) {
            return <img src={src} alt={serviceName} className="w-full h-full object-contain" />;
          }
          if (data.iconRaw) {
            return (
              <div
                className="w-full h-full"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                dangerouslySetInnerHTML={{ __html: data.iconRaw }}
              />
            );
          }
          return null;
        })()}
      </div>
    ) : (
      <div className={`w-full h-full ${bgColor} border-2 ${borderColor} rounded flex flex-col items-center justify-center p-2`}>
        {data.icon ? (
          <div className="mb-1 flex items-center justify-center">{typeof data.icon === 'string' ? <img src={data.icon} alt={serviceName} className="w-12 h-12" /> : data.icon}</div>
        ) : (
          iconSrc ? <img src={iconSrc} alt={serviceName} className="w-12 h-12 mb-1" /> : null
        )}
        <EditableText 
          data={data} 
          placeholder={serviceName} 
          className={`${textColor} font-medium text-center opacity-60`} 
          style={{ fontSize: '7px', lineHeight: '1' }} 
        />
      </div>
    )}
  </ResizableNode>
);

// AWS Service Nodes
export const AWSEC2Node = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-orange-50" 
    borderColor="border-orange-400" 
    textColor="text-orange-800"
    iconSrc="/icons/aws/aws-ec2.svg"
    serviceName="EC2"
  />
);

export const AWSS3Node = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-orange-50" 
    borderColor="border-orange-400" 
    textColor="text-orange-800"
    iconSrc="/icons/aws/aws-s3.svg"
    serviceName="S3"
  />
);

export const AWSLambdaNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-orange-50" 
    borderColor="border-orange-400" 
    textColor="text-orange-800"
    iconSrc="/icons/aws/aws-lambda.svg"
    serviceName="Lambda"
  />
);

export const AWSRDSNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-orange-50" 
    borderColor="border-orange-400" 
    textColor="text-orange-800"
    iconSrc="/icons/aws/aws-rds.svg"
    serviceName="RDS"
  />
);

export const AWSVPCNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-orange-50" 
    borderColor="border-orange-400" 
    textColor="text-orange-800"
    iconSrc="/icons/aws/aws-vpc.svg"
    serviceName="VPC"
  />
);

// Azure Service Nodes
export const AzureVMNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-blue-50" 
    borderColor="border-blue-400" 
    textColor="text-blue-800"
    serviceName="VM"
  />
);

export const AzureStorageNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-blue-50" 
    borderColor="border-blue-400" 
    textColor="text-blue-800"
    serviceName="Storage"
  />
);

export const AzureFunctionsNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-blue-50" 
    borderColor="border-blue-400" 
    textColor="text-blue-800"
    serviceName="Functions"
  />
);

// GCP Service Nodes
export const GCPComputeNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-green-50" 
    borderColor="border-green-400" 
    textColor="text-green-800"
    iconSrc="/icons/gcp/gcp-compute-engine.svg"
    serviceName="Compute"
  />
);

export const GCPStorageNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-green-50" 
    borderColor="border-green-400" 
    textColor="text-green-800"
    iconSrc="/icons/gcp/gcp-cloud-storage.svg"
    serviceName="Storage"
  />
);

export const GCPFunctionsNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-green-50" 
    borderColor="border-green-400" 
    textColor="text-green-800"
    iconSrc="/icons/gcp/gcp-cloud-functions.svg"
    serviceName="Functions"
  />
);

// Additional GCP node types for the onDrop function
export const GCPComputeEngineNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-green-50" 
    borderColor="border-green-400" 
    textColor="text-green-800"
    iconSrc="/icons/gcp/gcp-compute-engine.svg"
    serviceName="Compute Engine"
  />
);

export const GCPCloudStorageNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-green-50" 
    borderColor="border-green-400" 
    textColor="text-green-800"
    iconSrc="/icons/gcp/gcp-cloud-storage.svg"
    serviceName="Cloud Storage"
  />
);

export const GCPCloudFunctionsNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={data} 
    selected={selected} 
    bgColor="bg-green-50" 
    borderColor="border-green-400" 
    textColor="text-green-800"
    iconSrc="/icons/gcp/gcp-cloud-functions.svg"
    serviceName="Cloud Functions"
  />
);

// Keep the original generic cloud service nodes for backward compatibility
export const AWSServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={{ ...data, iconOnly: true }} 
    selected={selected} 
    bgColor="bg-transparent" 
    borderColor="border-transparent" 
    textColor="text-transparent" 
    serviceName="AWS"
  />
);

export const AzureServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={{ ...data, iconOnly: true }} 
    selected={selected} 
    bgColor="bg-transparent" 
    borderColor="border-transparent" 
    textColor="text-transparent" 
    serviceName="Azure"
  />
);

export const GCPServiceNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <CloudServiceNode 
    data={{ ...data, iconOnly: true }} 
    selected={selected} 
    bgColor="bg-transparent" 
    borderColor="border-transparent" 
    textColor="text-transparent" 
    serviceName="GCP"
  />
);

export const ImportedImageNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <IconNode data={data} selected={selected} bgColor="bg-gray-100" borderColor="border-gray-400" textColor="text-gray-800" placeholder="Image" />
);

// FIXED RawIconNode - Container exactly matches icon size, no extra spacing at all
export const RawIconNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  console.log('🔍 RawIconNode rendering:', data.shapeId, data);
  
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get icon URL from multiple possible sources
  const iconUrl = data.iconUrl || data.iconSrc || data.icon;
  
  console.log('🔍 Icon URL resolved:', iconUrl);
  
  // If we have a valid icon URL, show the image
  if (iconUrl && !imageError) {
    return (
      <ResizableNode data={data} selected={selected} minWidth={36} minHeight={36} keepAspectRatio={true}>
        <div 
          className="relative flex items-center justify-center bg-transparent"
          style={{
            border: selected ? '2px solid #3b82f6' : 'none',
            boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
            width: '36px',
            height: '36px',
            padding: '0',
            margin: '0',
            position: 'absolute',
            top: '0',
            left: '0'
          }}
        >
          <img
            src={iconUrl}
            alt={data.serviceName || data.label || 'Icon'}
            style={{
              width: '36px',
              height: '36px',
              padding: '0',
              margin: '0',
              display: 'block'
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', iconUrl);
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={(e) => {
              console.error('❌ Image failed to load:', iconUrl, e);
              setImageError(true);
              setImageLoaded(false);
            }}
          />
        </div>
      </ResizableNode>
    );
  }
  
  // Fallback: Show only service name, no error messages
  console.log('🔍 Using fallback for:', data.shapeId, 'iconUrl:', iconUrl);
  
  return (
    <ResizableNode data={data} selected={selected} minWidth={36} minHeight={36} keepAspectRatio={true}>
      <div 
        className="relative flex items-center justify-center bg-gray-50 border border-gray-300 rounded"
        style={{
          borderColor: selected ? '#3b82f6' : '#d1d5db',
          borderWidth: selected ? '2px' : '1px',
          boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
          width: '36px',
          height: '36px',
          padding: '0',
          margin: '0',
          position: 'absolute',
          top: '0',
          left: '0'
        }}
      >
        <div className="text-gray-600 font-semibold text-center text-xs px-1">
          {data.serviceName || data.label || 'Icon'}
        </div>
      </div>
    </ResizableNode>
  );
};

// Container Node that can hold icons inside
export const ContainerNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const [currentSize, setCurrentSize] = useState({ 
    width: data.width || 120, 
    height: data.height || 80 
  });
  
  useEffect(() => {
    setCurrentSize({ width: data.width || 120, height: data.height || 80 });
  }, [data.width, data.height]);
  
  return (
    <div
      className="relative group"
      style={{
        width: currentSize.width,
        height: currentSize.height,
        minWidth: 80,
        minHeight: 60,
        transition: 'none',
        overflow: 'visible',
      }}
    >
      <NodeResizer
        color="#3b82f6"
        isVisible={selected || false}
        minWidth={80}
        minHeight={60}
        keepAspectRatio={false}
        handleStyle={{
          width: 8,
          height: 8,
          backgroundColor: '#3b82f6',
          border: '1px solid white'
        }}
        onResize={(_event, params) => {
          const newWidth = Math.max(params.width, 80);
          const newHeight = Math.max(params.height, 60);
          
          setCurrentSize({ width: newWidth, height: newHeight });
          
          if (data.onResize) {
            data.onResize({ width: newWidth, height: newHeight });
          }
        }}
      />
      
      {/* Container Rectangle */}
      <div
        className={`w-full h-full border-2 rounded-lg transition-all duration-200 ${
          selected 
            ? 'border-blue-500 bg-blue-50 shadow-lg' 
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
        style={{
          backgroundColor: data.fill || '#ffffff',
          borderColor: selected ? '#3b82f6' : (data.stroke || '#d1d5db'),
          borderWidth: data.strokeWidth || 2,
        }}
      >
        {/* Container Content - Hidden when selected */}
        {!selected && data.children && (
          <div className="w-full h-full p-2 flex items-center justify-center">
            {data.children}
          </div>
        )}
        
        {/* Container Label */}
        {data.label && (
          <div className="absolute bottom-1 left-1 right-1 text-center">
            <div className="text-xs text-gray-600 bg-white bg-opacity-90 px-1 rounded">
              {data.label}
            </div>
          </div>
        )}
      </div>
      
      {/* Connection Handles */}
      <ConnectionHandles selected={selected || false} />
    </div>
  );
};