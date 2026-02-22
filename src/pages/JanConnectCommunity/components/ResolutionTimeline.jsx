import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flag, 
  CheckCircle, 
  UserCheck, 
  Clock, 
  Check,
  AlertCircle,
  Building
} from 'lucide-react';

const ResolutionTimeline = ({ timeline = {}, currentStatus, onStepClick }) => {
  const steps = [
    {
      key: 'reported',
      label: 'Reported',
      icon: Flag,
      color: 'yellow',
      description: 'Issue reported by citizen'
    },
    {
      key: 'verified',
      label: 'Verified',
      icon: CheckCircle,
      color: 'blue',
      description: 'Verified by authorities'
    },
    {
      key: 'assigned',
      label: 'Assigned',
      icon: UserCheck,
      color: 'purple',
      description: 'Assigned to department'
    },
    {
      key: 'resolved',
      label: 'Resolved',
      icon: Check,
      color: 'green',
      description: 'Issue resolved'
    }
  ];

  const getStatusIndex = (status) => {
    const statusMap = {
      'Reported': 0,
      'Verified': 1,
      'Assigned': 2,
      'Resolved': 3,
      'In Progress': 1,
      'Completed': 3
    };
    return statusMap[status] !== undefined ? statusMap[status] : -1;
  };

  const currentStepIndex = getStatusIndex(currentStatus);

  const getStepColor = (color, isActive, isCompleted) => {
    if (isCompleted) return 'bg-green-500 border-green-500 text-white';
    if (isActive) {
      const colors = {
        yellow: 'bg-yellow-500 border-yellow-500 text-white',
        blue: 'bg-blue-500 border-blue-500 text-white',
        purple: 'bg-purple-500 border-purple-500 text-white',
        green: 'bg-green-500 border-green-500 text-white'
      };
      return colors[color] || 'bg-gray-500 border-gray-500 text-white';
    }
    return 'bg-white/5 border-white/10 text-white/40';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-400" />
          Resolution Progress
        </h3>
        {currentStatus && (
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30">
            Current: {currentStatus}
          </span>
        )}
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-white/10">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ 
              width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` 
            }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const stepDate = timeline[step.key];
            const isClickable = stepDate || isCompleted || isActive;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center relative z-10"
                style={{ width: `${100 / steps.length}%` }}
              >
                <motion.button
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  onClick={() => isClickable && onStepClick?.(step.key)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    getStepColor(step.color, isActive, isCompleted)
                  } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.button>

                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${
                    isActive ? 'text-indigo-400' : 
                    isCompleted ? 'text-green-400' : 
                    'text-white/40'
                  }`}>
                    {step.label}
                  </p>
                  
                  {stepDate && (
                    <p className="text-[10px] text-white/30 mt-1">
                      {formatDate(stepDate)}
                    </p>
                  )}

                  {/* Tooltip on hover */}
                  <div className="relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                      {step.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      {timeline.estimatedResolution && (
        <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span className="text-white/60">Estimated Resolution:</span>
            <span className="text-white font-medium">
              {formatDate(timeline.estimatedResolution)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResolutionTimeline;