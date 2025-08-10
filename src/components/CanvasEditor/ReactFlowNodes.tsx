// components/CanvasEditor/ReactFlowNodes.tsx - ENHANCED VERSION
import { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

// Connection handles component
const ConnectionHandles = ({ selected }: { selected: boolean }) => {
  const handleStyle = {
    background: selected ? '#3b82f6' : '#6b7280',
    width: 12,
    height: 12,
    border: '2px solid white',
    borderRadius: '50%',
    opacity: selected ? 1 : 0.8,
  };

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} 
        className={`transition-opacity ${selected ? 'opacity-100' : 'opacity-0 hover:opacity-100 group-hover:opacity-100'}`} />
      <Handle type="source" position={Position.Bottom} style={handleStyle}
        className={`transition-opacity ${selected ? 'opacity-100' : 'opacity-0 hover:opacity-100 group-hover:opacity-100'}`} />
      <Handle type="target" position={Position.Right} style={handleStyle}
        className={`transition-opacity ${selected ? 'opacity-100' : 'opacity-0 hover:opacity-100 group-hover:opacity-100'}`} />
      <Handle type="source" position={Position.Left} style={handleStyle}
        className={`transition-opacity ${selected ? 'opacity-100' : 'opacity-0 hover:opacity-100 group-hover:opacity-100'}`} />
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
          
          if (data.onResize) {
            data.onResize({ width: newWidth, height: newHeight });
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
  style = { fontSize: '12px' }
}: {
  data: any;
  placeholder: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
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

  return isEditing ? (
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
      style={style}
    />
  ) : (
    <span
      className={`${className} cursor-text hover:bg-gray-100 px-1 py-0.5 rounded`}
      style={style}
      onDoubleClick={() => setIsEditing(true)}
    >
      {data.label || placeholder}
    </span>
  );
};

// Rectangle Node
export const RectangleNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} minWidth={80} minHeight={40}>
    <div
      className="bg-white border-2 rounded shadow-sm hover:shadow-md transition-all duration-200 group flex items-center justify-center p-2 w-full h-full"
      style={{
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : '#e5e7eb',
      }}
    >
      <EditableText data={data} placeholder="Rectangle" />
    </div>
  </ResizableNode>
);

// Circle Node
export const CircleNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} minWidth={60} minHeight={60} keepAspectRatio={true}>
    <div
      className="bg-white border-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 group flex items-center justify-center p-2 w-full h-full"
      style={{
        backgroundColor: data.fill || '#ffffff',
        borderColor: selected ? '#3b82f6' : '#e5e7eb',
      }}
    >
      <EditableText data={data} placeholder="Circle" />
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
  <ResizableNode data={data} selected={selected} keepAspectRatio={maintainAspectRatio}>
    <div className="relative flex items-center justify-center w-full h-full" style={{ overflow: 'hidden' }}>
      <div
        className="absolute inset-0"
        style={{
          background: data.fill || '#ffffff',
          clipPath,
          border: `2px solid ${selected ? '#3b82f6' : '#e5e7eb'}`,
          transition: 'border-color 0.2s ease',
        }}
      />
      <div className="relative z-10" style={{ fontSize: '10px' }}>
        <EditableText data={data} placeholder={placeholder} className="text-gray-800 font-medium text-center" style={{ fontSize: '10px' }} />
      </div>
    </div>
  </ResizableNode>
);

// Geometric shapes using ShapeNode
export const TriangleNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ShapeNode data={data} selected={selected} clipPath="polygon(50% 0%, 0% 100%, 100% 100%)" placeholder="Triangle" maintainAspectRatio={true} />
);

export const DiamondNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} keepAspectRatio={true}>
    <div className="relative flex items-center justify-center w-full h-full">
      <div
        className="absolute inset-0 transform rotate-45"
        style={{
          background: data.fill || '#ffffff',
          border: `2px solid ${selected ? '#3b82f6' : '#e5e7eb'}`,
          borderRadius: '8px',
        }}
      />
      <div className="relative z-10" style={{ fontSize: '10px' }}>
        <EditableText data={data} placeholder="Diamond" className="text-gray-800 font-medium text-center" style={{ fontSize: '10px' }} />
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
  <ResizableNode data={data} selected={selected} minWidth={80} minHeight={40}>
    <div className={`w-full h-full ${bgColor} border-2 ${borderColor} rounded flex items-center justify-center p-2`}>
      <EditableText data={data} placeholder={placeholder} className={`${textColor} font-medium text-center`} style={{ fontSize: '10px' }} />
    </div>
  </ResizableNode>
);

// Basic nodes
export const TextNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} minWidth={80} minHeight={30}>
    <div className="w-full h-full flex items-center justify-center p-2 bg-transparent">
      <EditableText data={data} placeholder="Text" className="text-gray-800 font-medium text-center" style={{ fontSize: '12px' }} />
    </div>
  </ResizableNode>
);

export const LineNode = ({ data, selected }: { data?: any; selected?: boolean }) => (
  <ResizableNode data={data} selected={selected} minWidth={100} minHeight={2}>
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

// COMPLETELY REBUILT RawIconNode - Simple and robust
export const RawIconNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const getIconSource = () => {
    const sources = [data.iconUrl, data.iconSrc, typeof data.icon === 'string' ? data.icon : null].filter(Boolean);
    return (sources[0] as string) || null;
  };

  const iconSource = getIconSource();
  
  const renderIcon = () => {
    // First priority: Raw SVG content
    if (data.iconRaw && typeof data.iconRaw === 'string') {
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: data.iconRaw }}
        />
      );
    }

    // Second priority: Image URL
    if (iconSource && !imageError) {
      return (
        <img
          src={iconSource}
          alt={data.serviceName || data.label || 'Icon'}
          className="w-full h-full object-contain"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block',
            objectFit: 'contain',
            minWidth: '32px',
            minHeight: '32px'
          }}
          onLoad={() => {
            setImageError(false);
            setImageLoaded(true);
          }}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
        />
      );
    }

    // Fallback: Show text with debugging info
    const fallbackText = data.serviceName || data.label || data.shapeId || 'Icon';
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-gray-600 font-semibold p-1">
        <div className="text-center break-words">
          {fallbackText}
        </div>
        {data.shapeId && (
          <div className="text-[8px] text-gray-400 mt-1 text-center">
            {data.shapeId}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative bg-white border-2 rounded-lg shadow-md transition-all duration-200 group ${
        selected ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'
      }`}
      style={{
        width: '80px',
        height: '80px',
        minWidth: '80px',
        minHeight: '80px',
      }}
    >
      <div className="w-full h-full p-1 flex items-center justify-center overflow-hidden">
        {renderIcon()}
      </div>
      
      {/* Connection Handles */}
      <ConnectionHandles selected={selected || false} />
      
      {data.serviceType && (
        <div
          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
            data.serviceType === 'AWS' ? 'bg-orange-500' :
            data.serviceType === 'AZURE' ? 'bg-blue-600' :
            data.serviceType === 'GCP' ? 'bg-blue-500' : 'bg-gray-500'
          }`}
        />
      )}
    </div>
  );
};