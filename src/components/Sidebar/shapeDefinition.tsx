// constants/shapeDefinitions.js
import { 
  Square, 
  Circle, 
  Triangle, 
  Minus,
  Diamond,
  Hexagon,
  Star,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  Grid3X3,
  Type,
  Image,
  Bookmark
} from 'lucide-react';

export const shapeCategories = {
  general: {
    name: 'General',
    icon: Grid3X3,
    shapes: [
      { id: 'rect', name: 'Rectangle', icon: Square, type: 'basic' },
      { id: 'circle', name: 'Circle', icon: Circle, type: 'basic' },
      { id: 'triangle', name: 'Triangle', icon: Triangle, type: 'basic' },
      { id: 'diamond', name: 'Diamond', icon: Diamond, type: 'basic' },
      { id: 'hexagon', name: 'Hexagon', icon: Hexagon, type: 'basic' },
      { id: 'star', name: 'Star', icon: Star, type: 'basic' }
    ]
  },
  basic: {
    name: 'Basic',
    icon: Square,
    shapes: [
      { id: 'line', name: 'Line', icon: Minus, type: 'line' },
      { id: 'arrow-right', name: 'Arrow Right', icon: ArrowRight, type: 'arrow' },
      { id: 'arrow-left', name: 'Arrow Left', icon: ArrowLeft, type: 'arrow' },
      { id: 'arrow-up', name: 'Arrow Up', icon: ArrowUp, type: 'arrow' },
      { id: 'arrow-down', name: 'Arrow Down', icon: ArrowDown, type: 'arrow' }
    ]
  },
  flowchart: {
    name: 'Flowchart',
    icon: Diamond,
    shapes: [
      { id: 'process', name: 'Process', icon: Square, type: 'flowchart' },
      { id: 'decision', name: 'Decision', icon: Diamond, type: 'flowchart' },
      { id: 'terminator', name: 'Terminator', icon: Circle, type: 'flowchart' },
      { id: 'document', name: 'Document', icon: Bookmark, type: 'flowchart' }
    ]
  },
  uml: {
    name: 'UML',
    icon: Grid3X3,
    shapes: [
      { id: 'class', name: 'Class', icon: Square, type: 'uml' },
      { id: 'actor', name: 'Actor', icon: Circle, type: 'uml' },
      { id: 'usecase', name: 'Use Case', icon: Circle, type: 'uml' }
    ]
  },
  text: {
    name: 'Text',
    icon: Type,
    shapes: [
      { id: 'text', name: 'Text', icon: Type, type: 'text' },
      { id: 'label', name: 'Label', icon: Type, type: 'text' }
    ]
  },
  images: {
    name: 'Images',
    icon: Image,
    shapes: [
      { id: 'image', name: 'Image', icon: Image, type: 'image' }
    ]
  }
};