// Shape Validation Utilities

export interface ValidationResult {
  isValid: boolean;
  currentShapeId: string;
  expectedShapeId?: string;
  expectedShapeName?: string;
  confidence: number;
  suggestions: string[];
  errors: string[];
}

export interface ShapeData {
  label: string;
  shapeId: string;
  properties?: Record<string, any>;
}

// Stub implementation for shape validation
export function validateShapeLabel(data: ShapeData): ValidationResult {
  return {
    isValid: true,
    currentShapeId: data.shapeId,
    confidence: 1.0,
    suggestions: [],
    errors: []
  };
}

// Stub implementation for shape auto-correction
export function autoCorrectShape(data: ShapeData): ShapeData | null {
  // For now, return null (no auto-correction)
  return null;
}

// Additional validation utilities
export function validateShapeProperties(shapeId: string, properties: Record<string, any>): ValidationResult {
  return {
    isValid: true,
    currentShapeId: shapeId,
    confidence: 1.0,
    suggestions: [],
    errors: []
  };
}

export function suggestShapeType(label: string): string[] {
  // Simple keyword-based suggestions
  const suggestions: string[] = [];
  
  const labelLower = label.toLowerCase();
  
  if (labelLower.includes('process') || labelLower.includes('task')) {
    suggestions.push('process');
  }
  
  if (labelLower.includes('decision') || labelLower.includes('choice')) {
    suggestions.push('diamond');
  }
  
  if (labelLower.includes('start') || labelLower.includes('begin')) {
    suggestions.push('circle');
  }
  
  if (labelLower.includes('end') || labelLower.includes('stop')) {
    suggestions.push('circle');
  }
  
  if (labelLower.includes('document') || labelLower.includes('file')) {
    suggestions.push('document');
  }
  
  if (labelLower.includes('database') || labelLower.includes('data')) {
    suggestions.push('database');
  }
  
  return suggestions;
} 