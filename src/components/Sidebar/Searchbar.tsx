// components/Sidebar/SearchBar.jsx
import { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="p-6 border-b border-white/20 bg-gradient-to-r from-gray-50/50 to-blue-50/30">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" size={18} />
        <input
          type="text"
          placeholder="Search shapes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm group-hover:shadow-lg placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default SearchBar;