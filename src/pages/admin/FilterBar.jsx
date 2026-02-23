import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PRIORITIES, STATUS_OPTIONS } from '../utils/constant';

const FilterBar = ({ filters, onFilterChange, categories = [] }) => {
  const [showFilters, setShowFilters] = useState(false);

  const categoryOptions = categories && categories.length > 0 
    ? categories 
    : ['Infrastructure', 'Sanitation', 'Street Lighting', 'Water Supply', 'Traffic', 'Parks', 'Other'];

  // Count active filters
  const activeFilterCount = [
    filters.category !== 'all' && filters.category,
    filters.status !== 'all' && filters.status,
    filters.priority !== 'all' && filters.priority,
    filters.search
  ].filter(Boolean).length;

  return (
    <motion.div 
      className="p-6 mb-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Search Row */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
          <input
            type="text"
            placeholder="Search reports..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-8 pr-4 py-4 bg-transparent border-b border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition-colors text-lg"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-4 flex items-center gap-3 transition-colors text-lg ${
            showFilters || activeFilterCount > 0
              ? 'text-indigo-300 font-bold'
              : 'text-white/70 hover:text-white/90 font-bold'
          }`}
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="hidden sm:inline font-bold text-xl">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-indigo-500 text-white text-sm rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <select
              value={filters.category || 'all'}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer text-lg"
            >
              <option value="all" className="bg-[#0f172a] text-lg">All Categories</option>
              {categoryOptions.map(category => (
                <option key={category} value={category} className="bg-[#0f172a] text-lg">{category}</option>
              ))}
            </select>
            <div className="absolute right-0 top-3 text-white/40 pointer-events-none text-lg">▼</div>
          </div>

          <div className="relative">
            <select
              value={filters.status || 'all'}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer text-lg"
            >
              <option value="all" className="bg-[#0f172a] text-lg">All Statuses</option>
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-[#0f172a] text-lg">{option.label}</option>
              ))}
            </select>
            <div className="absolute right-0 top-3 text-white/40 pointer-events-none text-lg">▼</div>
          </div>

          <div className="relative">
            <select
              value={filters.priority || 'all'}
              onChange={(e) => onFilterChange({ priority: e.target.value })}
              className="w-full px-0 py-3 bg-transparent border-b border-white/20 text-white focus:outline-none focus:border-indigo-400 appearance-none cursor-pointer text-lg"
            >
              <option value="all" className="bg-[#0f172a] text-lg">All Priorities</option>
              {PRIORITIES.map(priority => (
                <option key={priority.value} value={priority.value} className="bg-[#0f172a] text-lg">{priority.label}</option>
              ))}
            </select>
            <div className="absolute right-0 top-3 text-white/40 pointer-events-none text-lg">▼</div>
          </div>
        </motion.div>
      )}

      {/* Active Filters - Only show when filters are active */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-white/10">
          <span className="text-white/70 text-sm mr-2">Active:</span>
          
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
              {filters.category}
              <button onClick={() => onFilterChange({ category: 'all' })} className="hover:text-white">×</button>
            </span>
          )}
          
          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              {STATUS_OPTIONS.find(s => s.value === filters.status)?.label || filters.status}
              <button onClick={() => onFilterChange({ status: 'all' })} className="hover:text-white">×</button>
            </span>
          )}
          
          {filters.priority !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
              {PRIORITIES.find(p => p.value === filters.priority)?.label}
              <button onClick={() => onFilterChange({ priority: 'all' })} className="hover:text-white">×</button>
            </span>
          )}
          
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
              "{filters.search.length > 15 ? filters.search.substring(0, 15) + '...' : filters.search}"
              <button onClick={() => onFilterChange({ search: '' })} className="hover:text-white">×</button>
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FilterBar;