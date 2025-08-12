// components/Sidebar/SearchBar.jsx
import React from 'react';
import { Search } from 'lucide-react';
import { useSidebar } from '../../hooks/useSidebar';

const SearchBar = () => {
  const { state, dispatch } = useSidebar();
  
  return (
    <div className="p-3 border-b border-gray-200">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search shapes..."
          value={state.searchTerm}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default SearchBar;