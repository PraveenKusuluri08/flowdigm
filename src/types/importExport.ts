// types/importExport.ts
import type { Node, Edge } from 'reactflow';

export interface CanvasData {
  nodes: Node[];
  edges: Edge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  grid: {
    visible: boolean;
    size: number;
    snap: boolean;
  };
  fileName: string;
  version: string;
} 