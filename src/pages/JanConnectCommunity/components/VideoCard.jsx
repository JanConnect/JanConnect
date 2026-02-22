import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  Flame,
  MapPin,
  Clock,
  Shield,
  Play,
  Pause
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import UrgencyIndicator from './UrgencyIndicator';
import ActionBar from './ActionBar';

// Fallback for haptics on web
const haptics = {
  impactAsync: async () => console.log('Haptic impact (web)'),
  notificationAsync: async () => console.log('Haptic notification (web)'),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' }
};

const VideoCard = ({ post, isActive, onSupport, onComment, onShare, onAmplify, onEscalate }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showCaption, setShowCaption] = useState(false);
  const [progress, setProgress] = useState(0);

  // Video playback control
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      videoRef.current.play().catch(() => {
        // Auto-play was prevented
        setIsPlaying(false);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Use sample video if none provided
  const videoUrl = post.videoUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden">
      {/* Video Element */}
      <div className="relative aspect-video bg-gray-900">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={handleLoadedData}
          onClick={togglePlay}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        <AnimatePresence>
          {!isPlaying && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50"
              onClick={togglePlay}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <StatusBadge status={post.status} />
        </div>

        {/* Urgency Indicator */}
        <div className="absolute top-2 right-2">
          <UrgencyIndicator level={post.urgency} showLabel={false} />
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-white" />
          ) : (
            <Volume2 className="h-4 w-4 text-white" />
          )}
        </button>
      </div>

      {/* Post Info */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
        {/* User Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img
              src={post.user?.avatar || `https://i.pravatar.cc/40?u=${post.user?.id}`}
              alt={post.user?.username}
              className="w-8 h-8 rounded-full border-2 border-white/20"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-white font-medium text-sm">@{post.user?.username}</span>
                {post.user?.isVerified && (
                  <Shield className="h-3 w-3 text-indigo-400 fill-indigo-400/20" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <MapPin className="h-3 w-3" />
                <span>{post.location?.name || 'Unknown location'}</span>
                <span>·</span>
                <Clock className="h-3 w-3" />
                <span>{getTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Trending Score */}
          <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2 py-1">
            <Flame className="h-3 w-3 text-orange-400" />
            <span className="text-orange-400 font-bold text-xs">
              {formatNumber(post.trendingScore || 0)}
            </span>
          </div>
        </div>

        {/* Caption (truncated) */}
        <p 
          className="text-white/80 text-sm mb-2 cursor-pointer line-clamp-2 hover:line-clamp-none transition-all"
          onClick={() => setShowCaption(!showCaption)}
        >
          {post.caption}
        </p>

        {/* Hashtags */}
        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.hashtags.map(tag => (
              <span key={tag} className="text-indigo-400 text-xs">#{tag}</span>
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-white/40 text-xs mb-3">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{formatNumber(post.stats?.views || 0)}</span>
          </div>
          <span>·</span>
          <span>{formatNumber(post.stats?.supports || 0)} supports</span>
          <span>·</span>
          <span>{formatNumber(post.stats?.comments || 0)} comments</span>
        </div>

        {/* Action Bar */}
        <ActionBar
          supports={post.stats?.supports || 0}
          comments={post.stats?.comments || 0}
          shares={post.stats?.shares || 0}
          onSupport={(e) => { e?.stopPropagation(); onSupport?.(post.id); }}
          onComment={(e) => { e?.stopPropagation(); onComment?.(post.id); }}
          onShare={(e) => { e?.stopPropagation(); onShare?.(post.id); }}
          onAmplify={(e) => { e?.stopPropagation(); onAmplify?.(post.id); }}
          onEscalate={(e) => { e?.stopPropagation(); onEscalate?.(post.id); }}
          size="sm"
        />
      </div>
    </div>
  );
};

export default VideoCard;