// components/Sidebar/LeftSidebar.jsx
import React, { useState } from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import SearchBar from './Searchbar';
import QuickAccess from './QuickAccess';
import ShapeCategory from './ShapeCategory';
import { shapeCategories } from '../CanvasEditor/shapeDefinition';
import { bpmnShapes } from '../constants/bpmnShapes';
import { 
  awsServices, 
  googleCloudServices, 
  azureServices,
  awsAllServices,
  ServiceCategory 
} from './CloudServiceIcons';

const LeftSidebar = () => {
  const { state: _state } = useSidebar();
  const [expanded, setExpanded] = useState({
    general: true,
    bpmn: false,
    aws: false,
    gcp: false,
    azure: false,
  });
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-sm font-medium text-gray-700">Archplot</h2>
      </div>
      
      {/* Removed tabs; using accordion sections below */}
      
      {/* Search */}
      <div className="flex-shrink-0">
        <SearchBar />
      </div>
      
      {/* Quick Access */}
      <div className="flex-shrink-0">
        <QuickAccess />
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* General & Basic */}
        <button
          className="w-full text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 py-2 rounded"
          onClick={() => setExpanded((e) => ({ ...e, general: !e.general }))}
        >
          {expanded.general ? '▼' : '▶'} General & Basic
        </button>
        {expanded.general && (
          <div className="space-y-2">
            {Object.entries(shapeCategories).map(([key, category]) => (
              <ShapeCategory key={key} categoryKey={key} category={category} />
            ))}
          </div>
        )}

        {/* BPMN */}
        <button
          className="w-full text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 py-2 rounded"
          onClick={() => setExpanded((e) => ({ ...e, bpmn: !e.bpmn }))}
        >
          {expanded.bpmn ? '▼' : '▶'} BPMN
        </button>
        {expanded.bpmn && (
          <div className="space-y-2">
            {Object.entries(bpmnShapes).map(([key, category]) => (
              <ShapeCategory key={key} categoryKey={key} category={category} />
            ))}
          </div>
        )}

        {/* AWS */}
        <button
          className="w-full text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 py-2 rounded"
          onClick={() => setExpanded((e) => ({ ...e, aws: !e.aws }))}
        >
          {expanded.aws ? '▼' : '▶'} AWS
        </button>
        {expanded.aws && (
          <div className="space-y-4">
            <ServiceCategory title="All" services={awsAllServices} />
            <ServiceCategory title="Compute" services={awsServices.compute} />
            <ServiceCategory title="Storage" services={awsServices.storage} />
            <ServiceCategory title="Database" services={awsServices.database} />
            <ServiceCategory title="Networking" services={awsServices.networking} />
            <ServiceCategory title="Security" services={awsServices.security} />
          </div>
        )}

        {/* GCP */}
        <button
          className="w-full text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 py-2 rounded"
          onClick={() => setExpanded((e) => ({ ...e, gcp: !e.gcp }))}
        >
          {expanded.gcp ? '▼' : '▶'} GCP
        </button>
        {expanded.gcp && (
          <div className="space-y-4">
            <ServiceCategory title="Compute" services={googleCloudServices.compute} />
            <ServiceCategory title="Storage" services={googleCloudServices.storage} />
            <ServiceCategory title="Database" services={googleCloudServices.database} />
            <ServiceCategory title="Networking" services={googleCloudServices.networking} />
            <ServiceCategory title="Security" services={googleCloudServices.security} />
          </div>
        )}

        {/* Azure */}
        <button
          className="w-full text-left text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 py-2 rounded"
          onClick={() => setExpanded((e) => ({ ...e, azure: !e.azure }))}
        >
          {expanded.azure ? '▼' : '▶'} Azure
        </button>
        {expanded.azure && (
          <div className="space-y-4">
            <ServiceCategory title="Compute" services={azureServices.compute} />
            <ServiceCategory title="Storage" services={azureServices.storage} />
            <ServiceCategory title="Database" services={azureServices.database} />
            <ServiceCategory title="Networking" services={azureServices.networking} />
            <ServiceCategory title="Security" services={azureServices.security} />
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