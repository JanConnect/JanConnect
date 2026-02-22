import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { PRIORITIES, STATUS_OPTIONS } from '../utils/constant';

const FilterBar = ({ filters, onFilterChange, categories = [], municipalities = [] }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const categoryOptions = categories && categories.length > 0 
    ? categories 
    : ['Infrastructure', 'Sanitation', 'Street Lighting', 'Water Supply', 'Traffic', 'Parks', 'Other'];

  useEffect(() => {
    const handleClickOutside = () => {
      setIsCategoryOpen(false);
      setIsStatusOpen(false);
      setIsPriorityOpen(false);
    };

    if (isCategoryOpen || isStatusOpen || isPriorityOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isCategoryOpen, isStatusOpen, isPriorityOpen]);

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6 relative z-20 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <input
            type="text"
            placeholder="Search reports by title, description, or location..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          />
        </div>
        
        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCategoryOpen(!isCategoryOpen);
              setIsStatusOpen(false);
              setIsPriorityOpen(false);
            }}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <span className="truncate">
              {filters.category === 'all' ? 'All Categories' : filters.category || 'Select Category'}
            </span>
            {isCategoryOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
          </button>
          
          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterChange({ category: 'all' });
                  setIsCategoryOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                  filters.category === 'all' ? 'bg-white/20 text-blue-200' : ''
                }`}
              >
                All Categories
              </button>
              {categoryOptions.map(category => (
                <button
                  key={category}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ category });
                    setIsCategoryOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                    filters.category === category ? 'bg-white/20 text-blue-200' : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsStatusOpen(!isStatusOpen);
              setIsCategoryOpen(false);
              setIsPriorityOpen(false);
            }}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <span className="truncate">
              {filters.status === 'all' ? 'All Statuses' : 
               filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1).replace('-', ' ') : 'Select Status'}
            </span>
            {isStatusOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
          </button>
          
          {isStatusOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ status: option.value });
                    setIsStatusOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                    filters.status === option.value ? 'bg-white/20 text-blue-200' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Priority Filter */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPriorityOpen(!isPriorityOpen);
              setIsCategoryOpen(false);
              setIsStatusOpen(false);
            }}
            className="flex items-center justify-between gap-2 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white w-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <span className="truncate">
              {PRIORITIES.find(p => p.value === filters.priority)?.label || 'All Priorities'}
            </span>
            {isPriorityOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
          </button>
          
          {isPriorityOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50">
              {PRIORITIES.map(priority => (
                <button
                  key={priority.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ priority: priority.value });
                    setIsPriorityOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                    filters.priority === priority.value ? 'bg-white/20 text-blue-200' : ''
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.category !== 'all' || filters.status !== 'all' || filters.priority !== 'all' || filters.search) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
          <span className="text-white/70 text-sm">Active filters:</span>
          
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-xs">
              Category: {filters.category}
              <button 
                onClick={() => onFilterChange({ category: 'all' })}
                className="hover:text-indigo-200"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs">
              Status: {filters.status}
              <button 
                onClick={() => onFilterChange({ status: 'all' })}
                className="hover:text-blue-200"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.priority !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-md text-xs">
              Priority: {PRIORITIES.find(p => p.value === filters.priority)?.label}
              <button 
                onClick={() => onFilterChange({ priority: 'all' })}
                className="hover:text-yellow-200"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded-md text-xs">
              Search: "{filters.search}"
              <button 
                onClick={() => onFilterChange({ search: '' })}
                className="hover:text-green-200"
              >
                ×
              </button>
            </span>
          )}
          
          <button 
            onClick={() => onFilterChange({ 
              category: 'all', 
              status: 'all', 
              priority: 'all', 
              search: '' 
            })}
            className="text-xs text-white/70 hover:text-white underline"
          >
            Clear all
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default FilterBar;