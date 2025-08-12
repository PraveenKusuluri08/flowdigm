// components/CanvasEditor/ResizableWrapper.tsx
import React, { useState, useRef } from 'react';

interface ResizableWrapperProps {
  children: React.ReactNode;
  width: number;
  height: number;
  onResize: (newSize: { width: number; height: number }) => void;
  selected?: boolean;
  minWidth?: number;
  minHeight?: number;
}

export const ResizableWrapper: React.FC<ResizableWrapperProps> = ({
  children,
  width,
  height,
  onResize,
  selected = false,
  minWidth = 50,
  minHeight = 30
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ Starting resize:', direction);
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate new dimensions
      switch (direction) {
        case 'se': // Southeast corner
          newWidth = Math.max(minWidth, startWidth + deltaX);
          newHeight = Math.max(minHeight, startHeight + deltaY);
          break;
        case 'sw': // Southwest corner
          newWidth = Math.max(minWidth, startWidth - deltaX);
          newHeight = Math.max(minHeight, startHeight + deltaY);
          break;
        case 'ne': // Northeast corner
          newWidth = Math.max(minWidth, startWidth + deltaX);
          newHeight = Math.max(minHeight, startHeight - deltaY);
          break;
        case 'nw': // Northwest corner
          newWidth = Math.max(minWidth, startWidth - deltaX);
          newHeight = Math.max(minHeight, startHeight - deltaY);
          break;
        case 'e': // East edge
          newWidth = Math.max(minWidth, startWidth + deltaX);
          break;
        case 'w': // West edge
          newWidth = Math.max(minWidth, startWidth - deltaX);
          break;
        case 's': // South edge
          newHeight = Math.max(minHeight, startHeight + deltaY);
          break;
        case 'n': // North edge
          newHeight = Math.max(minHeight, startHeight - deltaY);
          break;
      }

      console.log('📏 Resizing to:', { newWidth, newHeight });
      onResize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      console.log('🖱️ Resize finished');
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const resizeHandleStyle = {
    position: 'absolute' as const,
    backgroundColor: '#3b82f6',
    border: '2px solid white',
    borderRadius: '50%',
    width: '12px',
    height: '12px',
    opacity: selected ? 1 : 0,
    transition: 'opacity 0.2s ease',
    zIndex: 1000,
    cursor: 'pointer'
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: selected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff'
      }}
    >
      {children}
      
      {/* Resize handles - only show when selected */}
      {selected && (
        <>
          {/* Corner handles */}
          <div
            style={{ ...resizeHandleStyle, top: '-6px', left: '-6px', cursor: 'nw-resize' }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            style={{ ...resizeHandleStyle, top: '-6px', right: '-6px', cursor: 'ne-resize' }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            style={{ ...resizeHandleStyle, bottom: '-6px', left: '-6px', cursor: 'sw-resize' }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            style={{ ...resizeHandleStyle, bottom: '-6px', right: '-6px', cursor: 'se-resize' }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          
          {/* Edge handles */}
          <div
            style={{ ...resizeHandleStyle, top: '-6px', left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' }}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            style={{ ...resizeHandleStyle, bottom: '-6px', left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' }}
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            style={{ ...resizeHandleStyle, top: '50%', left: '-6px', transform: 'translateY(-50%)', cursor: 'w-resize' }}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            style={{ ...resizeHandleStyle, top: '50%', right: '-6px', transform: 'translateY(-50%)', cursor: 'e-resize' }}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
        </>
      )}
    </div>
  );
};
