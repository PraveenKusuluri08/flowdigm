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
      <div className="p-3 border-b border-gray-200 flex-shrink-0 bg-white relative">
        <div className="relative z-10">
          <h2 className="text-base font-semibold text-gray-800">Shapes</h2>
          <p className="text-gray-500 text-xs">Drag & Drop</p>
        </div>
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
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* General & Basic */}
        <button
          className="w-full text-left text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 py-1.5 rounded-md border border-transparent hover:border-gray-300 transition-all duration-200 group"
          onClick={() => setExpanded((e) => ({ ...e, general: !e.general }))}
        >
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors duration-200"></div>
            <span>General</span>
            <div className="ml-auto text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
              {expanded.general ? '▼' : '▶'}
            </div>
          </div>
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
          className="w-full text-left text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 py-1.5 rounded-md border border-transparent hover:border-gray-300 transition-all duration-200 group"
          onClick={() => setExpanded((e) => ({ ...e, bpmn: !e.bpmn }))}
        >
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors duration-200"></div>
            <span>BPMN</span>
            <div className="ml-auto text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
              {expanded.bpmn ? '▼' : '▶'}
            </div>
          </div>
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
          className="w-full text-left text-sm font-black text-gray-800 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 px-4 py-3 rounded-2xl border-2 border-transparent hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-lg group"
          onClick={() => setExpanded((e) => ({ ...e, aws: !e.aws }))}
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
            <span>AWS</span>
            <div className="ml-auto text-orange-600 group-hover:scale-110 transition-transform duration-300">
              {expanded.aws ? '▼' : '▶'}
            </div>
          </div>
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
          className="w-full text-left text-sm font-black text-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 px-4 py-3 rounded-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-lg group"
          onClick={() => setExpanded((e) => ({ ...e, gcp: !e.gcp }))}
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
            <span>GCP</span>
            <div className="ml-auto text-blue-600 group-hover:scale-110 transition-transform duration-300">
              {expanded.gcp ? '▼' : '▶'}
            </div>
          </div>
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
          className="w-full text-left text-sm font-black text-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 px-4 py-3 rounded-2xl border-2 border-transparent hover:border-purple-200 transition-all duration-300 shadow-sm hover:shadow-lg group"
          onClick={() => setExpanded((e) => ({ ...e, azure: !e.azure }))}
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
            <span>Azure</span>
            <div className="ml-auto text-purple-600 group-hover:scale-110 transition-transform duration-300">
              {expanded.azure ? '▼' : '▶'}
            </div>
          </div>
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