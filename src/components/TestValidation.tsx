// TestValidation.tsx - Component to test the shape validation system
import React, { useState } from 'react';
import { validateShapeLabel, autoCorrectShape } from '../utils/shapeValidation';

export const TestValidation: React.FC = () => {
  const [testLabel, setTestLabel] = useState('');
  const [testShapeId, setTestShapeId] = useState('rectangle');
  const [result, setResult] = useState<any>(null);

  const runTest = () => {
    const testData = {
      shapeId: testShapeId,
      label: testLabel
    };
    
    const validation = validateShapeLabel(testData);
    const correction = autoCorrectShape(testData);
    
    setResult({
      validation,
      correction,
      originalData: testData
    });
  };

  const testCases = [
    { label: 'This is a diamond shape', shapeId: 'rectangle' },
    { label: 'Circle process', shapeId: 'rectangle' },
    { label: 'Database server', shapeId: 'rectangle' },
    { label: 'User interface', shapeId: 'rectangle' },
    { label: 'Triangle arrow', shapeId: 'circle' },
    { label: 'Decision point', shapeId: 'rectangle' },
    { label: 'Star rating', shapeId: 'rectangle' },
    { label: 'Pentagon building', shapeId: 'rectangle' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shape Validation Test</h2>
      
      {/* Manual Test */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Manual Test</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Label Text</label>
            <input
              type="text"
              value={testLabel}
              onChange={(e) => setTestLabel(e.target.value)}
              placeholder="Enter label text..."
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Current Shape</label>
            <select
              value={testShapeId}
              onChange={(e) => setTestShapeId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="triangle">Triangle</option>
              <option value="diamond">Diamond</option>
              <option value="hexagon">Hexagon</option>
              <option value="star">Star</option>
              <option value="pentagon">Pentagon</option>
            </select>
          </div>
        </div>
        <button
          onClick={runTest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Validation
        </button>
        
        {/* Results */}
        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Results:</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Valid: </span>
                <span className={result.validation.isValid ? 'text-green-600' : 'text-red-600'}>
                  {result.validation.isValid ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Current Shape: </span>
                {result.validation.currentShapeName}
              </div>
              {result.validation.expectedShapeId && (
                <div>
                  <span className="font-medium">Expected Shape: </span>
                  {result.validation.expectedShapeName}
                </div>
              )}
              <div>
                <span className="font-medium">Confidence: </span>
                {Math.round(result.validation.confidence * 100)}%
              </div>
              {result.validation.suggestions.length > 0 && (
                <div>
                  <span className="font-medium">Suggestions: </span>
                  {result.validation.suggestions.join(', ')}
                </div>
              )}
              {result.correction && (
                <div>
                  <span className="font-medium">Auto-correction: </span>
                  <span className="text-green-600">
                    Change to {result.correction.shapeId}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Predefined Test Cases */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
        <div className="space-y-2">
          {testCases.map((testCase, index) => (
            <button
              key={index}
              onClick={() => {
                setTestLabel(testCase.label);
                setTestShapeId(testCase.shapeId);
                const testData = {
                  shapeId: testCase.shapeId,
                  label: testCase.label
                };
                const validation = validateShapeLabel(testData);
                const correction = autoCorrectShape(testData);
                setResult({
                  validation,
                  correction,
                  originalData: testData
                });
              }}
              className="w-full text-left p-3 border rounded hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">"{testCase.label}"</div>
              <div className="text-sm text-gray-600">
                Current: {testCase.shapeId}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestValidation;
