import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flag, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  UserCheck,
  HelpCircle 
} from 'lucide-react';
import { ISSUE_STATUS } from '../utils/constants';

const StatusBadge = ({ status, size = 'md', showIcon = true }) => {
  const getStatusConfig = () => {
    switch (status) {
      case ISSUE_STATUS.REPORTED:
        return {
          color: 'yellow',
          icon: Flag,
          text: 'Reported',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          textColor: 'text-yellow-400',
        };
      case ISSUE_STATUS.IN_PROGRESS:
        return {
          color: 'blue',
          icon: AlertCircle,
          text: 'In Progress',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          textColor: 'text-blue-400',
        };
      case ISSUE_STATUS.RESOLVED:
        return {
          color: 'green',
          icon: CheckCircle,
          text: 'Resolved',
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          textColor: 'text-green-400',
        };
      case ISSUE_STATUS.VERIFIED:
        return {
          color: 'purple',
          icon: UserCheck,
          text: 'Verified',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          textColor: 'text-purple-400',
        };
      case ISSUE_STATUS.ASSIGNED:
        return {
          color: 'indigo',
          icon: Clock,
          text: 'Assigned',
          bg: 'bg-indigo-500/10',
          border: 'border-indigo-500/20',
          textColor: 'text-indigo-400',
        };
      default:
        return {
          color: 'gray',
          icon: HelpCircle,
          text: status,
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/20',
          textColor: 'text-gray-400',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-full ${config.bg} ${config.border} border ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={`h-3 w-3 ${config.textColor}`} />}
      <span className={`font-medium ${config.textColor}`}>{config.text}</span>
    </motion.div>
  );
};

export default StatusBadge;