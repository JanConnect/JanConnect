import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, Building, User } from 'lucide-react';

const AuthorityPinnedComment = ({ 
  comment, 
  authorityName = 'Municipal Corporation',
  designation = 'Official Response',
  timestamp,
  verified = true,
  onViewDetails 
}) => {
  const getTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 p-4"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <Shield className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{authorityName}</span>
                {verified && (
                  <div className="flex items-center gap-1 bg-blue-500/20 px-1.5 py-0.5 rounded-full">
                    <CheckCircle className="h-3 w-3 text-blue-400" />
                    <span className="text-xs text-blue-400">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-indigo-300/70">{designation}</p>
            </div>
          </div>
          
          {timestamp && (
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(timestamp)}</span>
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="ml-9 mb-3">
          <p className="text-white/90 text-sm leading-relaxed">{comment}</p>
        </div>

        {/* Action Buttons */}
        <div className="ml-9 flex items-center gap-3">
          <button 
            onClick={onViewDetails}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            <Building className="h-3 w-3" />
            View Department Details
          </button>
          <span className="text-white/20">•</span>
          <button className="text-xs text-white/40 hover:text-white/60 transition-colors flex items-center gap-1">
            <User className="h-3 w-3" />
            Contact Authority
          </button>
        </div>

        {/* Official Stamp */}
        <div className="absolute bottom-2 right-2 opacity-10">
          <Shield className="h-12 w-12 text-indigo-400" />
        </div>
      </div>
    </motion.div>
  );
};

export default AuthorityPinnedComment;