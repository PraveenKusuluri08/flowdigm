// components/Sidebar/LeftSidebar.jsx
import React, { useState } from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import SearchBar from './Searchbar';
import QuickAccess from './QuickAccess';
import ShapeCategory from './ShapeCategory';
import { shapeCategories } from './shapeDefinition';
import { bpmnShapes } from '../constants/bpmnShapes';
import { 
  awsServices, 
  googleCloudServices, 
  azureServices,
  ServiceCategory 
} from './CloudServiceIcons';

const LeftSidebar = () => {
  const { state } = useSidebar();
  const [activeTab, setActiveTab] = useState('shapes');
  
  const handleDragStart = (e: React.DragEvent, serviceId: string) => {
    console.log('📤 Setting drag data for service:', serviceId);
    const dragData = { shapeId: serviceId };
    console.log('📦 Drag data:', dragData);
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
  };
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Archplot</h2>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('shapes')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'shapes' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Shapes
        </button>
        <button
          onClick={() => setActiveTab('bpmn')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'bpmn' 
              ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          BPMN
        </button>
        <button
          onClick={() => setActiveTab('aws')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'aws' 
              ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          AWS
        </button>
        <button
          onClick={() => setActiveTab('gcp')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'gcp' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          GCP
        </button>
        <button
          onClick={() => setActiveTab('azure')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'azure' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          Azure
        </button>
      </div>
      
      {/* Search */}
      <SearchBar />
      
      {/* Quick Access */}
      <QuickAccess />
      
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'shapes' && (
          <>
            {Object.entries(shapeCategories).map(([key, category]) => (
              <ShapeCategory key={key} categoryKey={key} category={category} />
            ))}
          </>
        )}
        
        {activeTab === 'bpmn' && (
          <>
            {Object.entries(bpmnShapes).map(([key, category]) => (
              <ShapeCategory key={key} categoryKey={key} category={category} />
            ))}
          </>
        )}
        
        {activeTab === 'aws' && (
          <div className="space-y-4">
            <ServiceCategory title="Compute" services={awsServices.compute} onDragStart={handleDragStart} />
            <ServiceCategory title="Storage" services={awsServices.storage} onDragStart={handleDragStart} />
            <ServiceCategory title="Database" services={awsServices.database} onDragStart={handleDragStart} />
            <ServiceCategory title="Networking" services={awsServices.networking} onDragStart={handleDragStart} />
            <ServiceCategory title="Security" services={awsServices.security} onDragStart={handleDragStart} />
          </div>
        )}
        
        {activeTab === 'gcp' && (
          <div className="space-y-4">
            <ServiceCategory title="Compute" services={googleCloudServices.compute} onDragStart={handleDragStart} />
            <ServiceCategory title="Storage" services={googleCloudServices.storage} onDragStart={handleDragStart} />
            <ServiceCategory title="Database" services={googleCloudServices.database} onDragStart={handleDragStart} />
            <ServiceCategory title="Networking" services={googleCloudServices.networking} onDragStart={handleDragStart} />
            <ServiceCategory title="Security" services={googleCloudServices.security} onDragStart={handleDragStart} />
          </div>
        )}
        
        {activeTab === 'azure' && (
          <div className="space-y-4">
            <ServiceCategory title="Compute" services={azureServices.compute} onDragStart={handleDragStart} />
            <ServiceCategory title="Storage" services={azureServices.storage} onDragStart={handleDragStart} />
            <ServiceCategory title="Database" services={azureServices.database} onDragStart={handleDragStart} />
            <ServiceCategory title="Networking" services={azureServices.networking} onDragStart={handleDragStart} />
            <ServiceCategory title="Security" services={azureServices.security} onDragStart={handleDragStart} />
          </div>
        )}
      </div>
      
      {/* Footer Info - Optional Debug Info */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="p-3 border-t border-gray-200 text-xs text-gray-500">
          <div>Selected: {state.selectedShape?.name || 'None'}</div>
          <div>Recent: {state.recentShapes.length}</div>
          <div>Favorites: {state.favoriteShapes.length}</div>
        </div>
      )} */}
    </div>
  );
};

export default LeftSidebar;