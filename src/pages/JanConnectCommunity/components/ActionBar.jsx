// src/features/JanConnectCommunity/components/ActionBar.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Star, AlertTriangle } from 'lucide-react';

const ActionBar = ({
  supports = 0,
  comments = 0,
  shares = 0,
  onSupport,
  onComment,
  onShare,
  onAmplify,
  onEscalate,
  size = 'md'
}) => {
  const [supported, setSupported] = useState(false);
  const [amplified, setAmplified] = useState(false);

  const handleSupport = (e) => {
    e?.stopPropagation();
    setSupported(!supported);
    onSupport?.(e);
  };

  const handleAmplify = (e) => {
    e?.stopPropagation();
    setAmplified(!amplified);
    onAmplify?.(e);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const sizeClasses = {
    sm: {
      button: 'p-1.5',
      icon: 'h-4 w-4',
      text: 'text-xs',
    },
    md: {
      button: 'p-2',
      icon: 'h-5 w-5',
      text: 'text-sm',
    },
    lg: {
      button: 'p-2.5',
      icon: 'h-6 w-6',
      text: 'text-base',
    },
  };

  const ActionButton = ({ icon: Icon, label, count, onClick, active, activeColor }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg transition-colors ${sizeClasses[size].button} ${
        active 
          ? `${activeColor} text-white` 
          : 'hover:bg-white/10 text-white/60'
      }`}
    >
      <Icon className={`${sizeClasses[size].icon} ${active ? 'fill-current' : ''}`} />
      {count !== undefined && (
        <span className={`font-medium ${sizeClasses[size].text}`}>
          {formatNumber(count)}
        </span>
      )}
      {label && (
        <span className={`${sizeClasses[size].text} hidden sm:inline`}>{label}</span>
      )}
    </motion.button>
  );

  return (
    <div className="flex items-center gap-1">
      <ActionButton
        icon={Heart}
        label="Support"
        count={supports}
        onClick={handleSupport}
        active={supported}
        activeColor="bg-red-500/20 text-red-400"
      />
      
      <ActionButton
        icon={MessageCircle}
        label="Comment"
        count={comments}
        onClick={onComment}
        activeColor="bg-blue-500/20 text-blue-400"
      />
      
      <ActionButton
        icon={Share2}
        label="Share"
        count={shares}
        onClick={onShare}
        activeColor="bg-green-500/20 text-green-400"
      />
      
      <ActionButton
        icon={Star}
        label="Amplify"
        onClick={handleAmplify}
        active={amplified}
        activeColor="bg-yellow-500/20 text-yellow-400"
      />
      
      <ActionButton
        icon={AlertTriangle}
        label="Escalate"
        onClick={onEscalate}
        activeColor="bg-orange-500/20 text-orange-400"
      />
    </div>
  );
};

export default ActionBar;