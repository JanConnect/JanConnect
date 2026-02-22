import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Building, 
  TrendingUp, 
  AlertTriangle,
  Flame
} from 'lucide-react';
import { FILTER_TYPES } from '../utils/constants';

const FilterChips = ({ activeFilter, onFilterChange, className = '' }) => {
  const filters = [
    { 
      id: FILTER_TYPES.TRENDING_TODAY, 
      label: 'Trending Today', 
      icon: Flame,
      color: 'orange'
    },
    { 
      id: FILTER_TYPES.NEAR_ME, 
      label: 'Near Me', 
      icon: MapPin,
      color: 'blue'
    },
    { 
      id: FILTER_TYPES.MY_MUNICIPALITY, 
      label: 'My Municipality', 
      icon: Building,
      color: 'purple'
    },
    { 
      id: FILTER_TYPES.MOST_ESCALATED, 
      label: 'Most Escalated', 
      icon: AlertTriangle,
      color: 'red'
    },
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      orange: {
        active: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
        inactive: 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
      },
      blue: {
        active: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
        inactive: 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
      },
      purple: {
        active: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
        inactive: 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
      },
      red: {
        active: 'bg-red-500/20 border-red-500/40 text-red-400',
        inactive: 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
      },
    };
    return colors[color]?.[isActive ? 'active' : 'inactive'] || colors.blue.inactive;
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        
        return (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${getColorClasses(filter.color, isActive)}`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium whitespace-nowrap">{filter.label}</span>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-current ml-1"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default FilterChips;