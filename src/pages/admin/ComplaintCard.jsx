import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, RefreshCw, CheckCircle, XCircle, 
  AlertTriangle, AlertCircle, FileText, MapPin, 
  MessageSquare, ArrowBigUp 
} from 'lucide-react';
import { safeRender, getUpvoteCount, getUpdatesCount } from '../utils/helpers';

// Info icon component
const Info = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const ComplaintCard = ({ complaint, onClick, index }) => {
  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    'in-progress': <RefreshCw className="h-5 w-5 text-blue-500" />,
    resolved: <CheckCircle className="h-5 w-5 text-green-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-500" />
  };
  
  const statusText = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected'
  };
  
  const priorityIcons = {
    5: <AlertTriangle className="h-5 w-5 text-red-500" />,
    4: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    3: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    2: <Info className="h-5 w-5 text-blue-500" />,
    1: <Info className="h-5 w-5 text-green-500" />,
    high: <AlertTriangle className="h-5 w-5 text-red-500" />,
    medium: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    low: <Info className="h-5 w-5 text-blue-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-5 cursor-pointer hover:shadow-lg transition-all duration-300 mb-4 max-w-4xl mx-auto min-h-32 flex flex-col justify-between hover:bg-white/15"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-1">
            {statusIcons[complaint.status]}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-lg mb-1">
              {safeRender(complaint.title, 'Untitled Report')}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2 mb-2">
              {safeRender(complaint.description, 'No description available')}
            </p>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">
                <FileText className="h-3 w-3" />
                {safeRender(complaint.category, 'Unknown Category')}
              </span>
              
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-white/10 text-white/80 rounded-md border border-white/20">
                <MapPin className="h-3 w-3" />
                {safeRender(complaint.area || complaint.municipality?.name, 'Unknown Location')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-4">
          <div className="flex items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-col sm:flex-row">
            <div className="hidden sm:block">
              {priorityIcons[complaint.priority] || priorityIcons[complaint.urgency]}
            </div>
            
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              complaint.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              complaint.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              complaint.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {statusText[complaint.status] || 'Unknown'}
            </span>
          </div>
          
          <span className="text-xs text-white/70">
            {complaint.date ? new Date(complaint.date).toLocaleDateString() : 'No date'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-white/60 text-sm mt-3">
        <div className="flex items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-col sm:flex-row">
          <div className="flex items-center">
            <ArrowBigUp className="h-4 w-4 mr-1" />
            <span>{getUpvoteCount(complaint)} upvotes</span>
          </div>
          
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{getUpdatesCount(complaint)} updates</span>
          </div>
        </div>
        
        <div className="text-xs">
          ID: {safeRender(complaint.reportId || `#${String(complaint._id).slice(-4)}`, 'N/A')}
        </div>
      </div>
    </motion.div>
  );
};

export default ComplaintCard;