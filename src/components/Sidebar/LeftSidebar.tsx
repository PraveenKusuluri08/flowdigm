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
    <div className="w-64 bg-gradient-to-b from-white via-gray-50/50 to-blue-50/30 border-r border-white/20 flex flex-col h-full flex-shrink-0 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex-shrink-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
        
        <div className="relative z-10">
          <h2 className="text-lg font-black text-white drop-shadow-lg">Shapes</h2>
          <p className="text-blue-100 text-xs font-medium">Drag & Drop</p>
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
          className="w-full text-left text-sm font-bold text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 px-3 py-2 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-lg group"
          onClick={() => setExpanded((e) => ({ ...e, general: !e.general }))}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
            <span>General</span>
            <div className="ml-auto text-blue-600 group-hover:scale-110 transition-transform duration-300">
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
          className="w-full text-left text-sm font-bold text-gray-800 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 px-3 py-2 rounded-xl border-2 border-transparent hover:border-green-200 transition-all duration-300 shadow-sm hover:shadow-lg group"
          onClick={() => setExpanded((e) => ({ ...e, bpmn: !e.bpmn }))}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
            <span>BPMN</span>
            <div className="ml-auto text-green-600 group-hover:scale-110 transition-transform duration-300">
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