import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FILTER_OPTIONS } from '../utils/constants';
import { LogOut, ChevronDown, ChevronRight, Filter } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  // State to track expanded sections
  const [expanded, setExpanded] = useState({
    gender: true,
    brand: false,
    color: true,
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SidebarSection = ({ title, options, sectionKey }) => (
    <div className="border-b border-secondary-200 py-4">
      <button 
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-medium text-text-900 hover:text-primary-600 transition-colors mb-2"
      >
        <span className="capitalize">{title.replace(/([A-Z])/g, ' $1').trim()}</span>
        {expanded[sectionKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      
      {expanded[sectionKey] && (
        <div className="space-y-2 animate-fade-in pl-2">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-colors"
                name={sectionKey}
              />
              <span className="text-sm text-text-600 group-hover:text-text-900 transition-colors">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-64 bg-background-50 border-r border-secondary-200 flex flex-col h-[calc(100vh-64px)] sticky top-[64px] overflow-hidden">
      <div className="p-4 border-b border-secondary-200">
        <h2 className="font-serif text-xl font-bold text-text-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-accent-500" />
          Filters
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {Object.entries(FILTER_OPTIONS).map(([key, options]) => (
          <SidebarSection 
            key={key} 
            title={key} 
            options={options} 
            sectionKey={key} 
          />
        ))}
      </div>

      <div className="p-4 border-t border-secondary-200 bg-secondary-50">
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
