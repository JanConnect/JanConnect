import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { URGENCY_LEVELS } from '../utils/constants';

const UrgencyIndicator = ({ level, showLabel = true, size = 'md' }) => {
  const getUrgencyConfig = () => {
    switch (level) {
      case URGENCY_LEVELS.LOW:
        return {
          color: 'green',
          icon: Info,
          text: 'Low Urgency',
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          textColor: 'text-green-400',
          pulseColor: 'bg-green-500',
        };
      case URGENCY_LEVELS.MODERATE:
        return {
          color: 'yellow',
          icon: AlertCircle,
          text: 'Moderate Urgency',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          textColor: 'text-yellow-400',
          pulseColor: 'bg-yellow-500',
        };
      case URGENCY_LEVELS.CRITICAL:
        return {
          color: 'red',
          icon: AlertTriangle,
          text: 'Critical!',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          textColor: 'text-red-400',
          pulseColor: 'bg-red-500',
        };
      default:
        return {
          color: 'gray',
          icon: AlertCircle,
          text: level,
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/20',
          textColor: 'text-gray-400',
          pulseColor: 'bg-gray-500',
        };
    }
  };

  const config = getUrgencyConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`inline-flex items-center rounded-full ${config.bg} ${config.border} border ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.pulseColor}`}></span>
      </span>
      <Icon className={`h-3 w-3 ${config.textColor}`} />
      {showLabel && <span className={`font-medium ${config.textColor}`}>{config.text}</span>}
    </motion.div>
  );
};

export default UrgencyIndicator;