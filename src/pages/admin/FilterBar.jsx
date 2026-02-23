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
      className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Search Row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <input
            type="text"
            placeholder="Search reports..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl border flex items-center gap-2 transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <select
            value={filters.category || 'all'}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.priority || 'all'}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </select>
        </motion.div>
      )}

      {/* Active Filters - Only show when filters are active */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
          <span className="text-white/70 text-sm mr-2">Active:</span>
          
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
              {filters.category}
              <button onClick={() => onFilterChange({ category: 'all' })}>×</button>
            </span>
          )}
          
          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              {STATUS_OPTIONS.find(s => s.value === filters.status)?.label || filters.status}
              <button onClick={() => onFilterChange({ status: 'all' })}>×</button>
            </span>
          )}
          
          {filters.priority !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
              {PRIORITIES.find(p => p.value === filters.priority)?.label}
              <button onClick={() => onFilterChange({ priority: 'all' })}>×</button>
            </span>
          )}
          
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
              "{filters.search.length > 15 ? filters.search.substring(0, 15) + '...' : filters.search}"
              <button onClick={() => onFilterChange({ search: '' })}>×</button>
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default FilterBar;