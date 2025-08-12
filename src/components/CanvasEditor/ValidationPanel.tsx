// ValidationPanel.tsx - Shape validation results display
import React, { useState, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { Shield, AlertTriangle, CheckCircle, X, RefreshCw } from 'lucide-react';
import { validateAllShapes, getValidationSummary, autoCorrectShape } from '../../utils/shapeValidation';

interface ValidationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ isOpen, onClose }) => {
  const { getNodes, setNodes } = useReactFlow();
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [isValidating, setIsValidating] = useState(false);

  const runValidation = async () => {
    setIsValidating(true);
    const nodes = getNodes();
    
    // Run validation
    const results = validateAllShapes(nodes);
    const summaryData = getValidationSummary(nodes);
    
    setValidationResults(results);
    setSummary(summaryData);
    setIsValidating(false);
  };

  // Auto-run validation when panel opens
  useEffect(() => {
    if (isOpen) {
      runValidation();
    }
  }, [isOpen]);

  const handleAutoCorrect = (nodeId: string, validation: any) => {
    const nodes = getNodes();
    const targetNode = nodes.find(n => n.id === nodeId);
    
    if (!targetNode || !validation.expectedShapeId) return;
    
    const correctedData = autoCorrectShape(targetNode.data);
    if (correctedData) {
      setNodes((nds) => 
        nds.map((node) => 
          node.id === nodeId 
            ? { 
                ...node, 
                type: correctedData.shapeId,
                data: correctedData 
              }
            : node
        )
      );
      
      // Re-run validation
      setTimeout(runValidation, 100);
    }
  };

  const handleAutoCorrectAll = () => {
    const nodes = getNodes();
    let hasChanges = false;
    
    const updatedNodes = nodes.map((node) => {
      const correctedData = autoCorrectShape(node.data);
      if (correctedData) {
        hasChanges = true;
        return {
          ...node,
          type: correctedData.shapeId,
          data: correctedData
        };
      }
      return node;
    });
    
    if (hasChanges) {
      setNodes(updatedNodes);
      setTimeout(runValidation, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Shape Validation</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Summary */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{summary.validNodes || 0}</div>
            <div className="text-xs text-gray-600">Valid</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{summary.invalidNodes || 0}</div>
            <div className="text-xs text-gray-600">Invalid</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{summary.totalNodes || 0}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button
            onClick={runValidation}
            disabled={isValidating}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
            {isValidating ? 'Validating...' : 'Re-validate'}
          </button>
          
          {summary.invalidNodes > 0 && (
            <button
              onClick={handleAutoCorrectAll}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Fix All
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="overflow-y-auto max-h-96">
        {validationResults.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No validation results</p>
            <p className="text-sm">Click "Re-validate" to check shapes</p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {validationResults.map((result) => {
              const { nodeId, validation } = result;
              const isValid = validation.isValid;
              
              return (
                <div 
                  key={nodeId}
                  className={`p-3 rounded-lg border ${
                    isValid 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      {isValid ? (
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">
                          Node: {nodeId}
                        </div>
                        
                        {!isValid && (
                          <div className="mt-1">
                            <div className="text-xs text-gray-600">
                              Current: <span className="font-medium">{validation.currentShapeName}</span>
                            </div>
                            {validation.expectedShapeName && (
                              <div className="text-xs text-gray-600">
                                Expected: <span className="font-medium text-green-700">{validation.expectedShapeName}</span>
                              </div>
                            )}
                            <div className="text-xs text-blue-600 mt-1">
                              Confidence: {Math.round(validation.confidence * 100)}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isValid && validation.expectedShapeId && validation.confidence >= 0.7 && (
                      <button
                        onClick={() => handleAutoCorrect(nodeId, validation)}
                        className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex-shrink-0"
                      >
                        Fix
                      </button>
                    )}
                  </div>
                  
                  {!isValid && validation.suggestions.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      💡 {validation.suggestions[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationPanel;
