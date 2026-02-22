import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Award, X, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

// Import your modular components
import VideoCard from './JanConnectCommunity/components/VideoCard';
import TrendingBar from './JanConnectCommunity/components/TrendingBar';
import FilterChips from './JanConnectCommunity/components/FilterChips';
import ActionBar from './JanConnectCommunity/components/ActionBar';
import StatusBadge from './JanConnectCommunity/components/StatusBadge';
import UrgencyIndicator from './JanConnectCommunity/components/UrgencyIndicator';
import CivicLeaderboard from './JanConnectCommunity/components/CivicLeaderboard';
import AuthorityPinnedComment from './JanConnectCommunity/components/AuthorityPinnedComment';
import ResolutionTimeline from './JanConnectCommunity/components/ResolutionTimeline';

// Import hooks and utils
import { useCommunityFeed } from './JanConnectCommunity/hooks/useCommunityFeed';
import { useVideoPlayer } from './JanConnectCommunity/hooks/useVideoPlayer';

const CommunitySection = ({ user }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("trending");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [supportedPosts, setSupportedPosts] = useState(new Set());
  const [amplifiedPosts, setAmplifiedPosts] = useState(new Set());
  
  // Use the custom hook for feed data
  const { posts, trendingTopics, isLoading, refreshFeed } = useCommunityFeed(activeFilter);

  const handleSupport = (postId) => {
    if (supportedPosts.has(postId)) return;
    setSupportedPosts(prev => new Set(prev).add(postId));
    // API call would go here
  };

  const handleAmplify = (postId) => {
    if (amplifiedPosts.has(postId)) return;
    setAmplifiedPosts(prev => new Set(prev).add(postId));
    // API call would go here
  };

  const handleEscalate = (postId) => {
    // API call would go here
    alert("Issue escalated to local authorities");
  };

  const handleComment = (postId) => {
    // Open comment modal or navigate to comments
    console.log("Comment on post:", postId);
  };

  const handleShare = (postId) => {
    // Share functionality
    console.log("Share post:", postId);
  };

  const [activeVideoId, setActiveVideoId] = useState(null);

  // Add this function to check visibility
  const handleVideoVisibility = (postId, isVisible) => {
    if (isVisible) {
      setActiveVideoId(postId);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-16 px-4 relative z-10">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Shield className="h-8 w-8 text-indigo-400" />
            JanConnect Community
          </h2>
          <p className="text-white/60 mt-1">Join the conversation about civic issues in your area</p>
        </div>
        
        {/* Civic Hero Badge */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl px-4 py-2"
        >
          <Award className="h-5 w-5 text-yellow-400" />
          <span className="text-white font-medium">Civic Hero Board</span>
        </motion.button>
      </motion.div>

      {/* Trending Topics - Using TrendingBar component */}
      <TrendingBar 
        topics={trendingTopics} 
        onTopicClick={(topic) => console.log("Topic clicked:", topic)}
      />

      {/* Filter Chips - Using FilterChips component */}
      <FilterChips 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        className="mb-6"
      />

      {/* Leaderboard Modal - Using CivicLeaderboard component */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Civic Hero Leaderboard
                </h3>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Use the CivicLeaderboard component */}
              <CivicLeaderboard />
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm text-center">
                  Your Civic Score: {Math.floor(Math.random() * 500) + 100}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Feed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-24"></div>
                </div>
              </div>
              <div className="h-48 bg-white/10 rounded-xl mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-full"></div>
                <div className="h-3 bg-white/10 rounded w-3/4"></div>
              </div>
            </div>
          ))
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-indigo-500/30 transition-all duration-300"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.user.avatar}
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">@{post.user.username}</span>
                      {post.user.isVerified && (
                        <Shield className="h-4 w-4 text-indigo-400 fill-indigo-400/20" />
                      )}
                      {post.user.isAuthority && (
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                          Official
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span>{post.location.name}</span>
                      <span>·</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Trending Score */}
                <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-lg px-2 py-1">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 font-bold text-sm">
                    {post.trendingScore?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Video Card - Using VideoCard component */}
              <VideoCard 
                post={post}
                isActive={activeVideoId === post.id}
                onVisibilityChange={(isVisible) => handleVideoVisibility(post.id, isVisible)}
              />

              {/* Post Content */}
              <div className="p-4">
                <p className="text-white/90 mb-3">{post.caption}</p>
                
                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.hashtags.map((tag) => (
                    <button
                      key={tag}
                      className="text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Status and Urgency - Using components */}
                <div className="flex items-center gap-3 mb-4">
                  <StatusBadge status={post.status} />
                  <UrgencyIndicator level={post.urgency} />
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-between text-sm text-white/60 mb-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-1">
                    <span>{post.stats?.views?.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{post.stats?.supports?.toLocaleString()} supports</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{post.stats?.comments?.toLocaleString()} comments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{post.stats?.escalations?.toLocaleString()} escalated</span>
                  </div>
                </div>

                {/* Action Buttons - Using ActionBar component */}
                <ActionBar
                  supports={post.stats?.supports || 0}
                  comments={post.stats?.comments || 0}
                  shares={post.stats?.shares || 0}
                  onSupport={() => handleSupport(post.id)}
                  onComment={() => handleComment(post.id)}
                  onShare={() => handleShare(post.id)}
                  onAmplify={() => handleAmplify(post.id)}
                  onEscalate={() => handleEscalate(post.id)}
                />

                {/* Authority Response - Using AuthorityPinnedComment component */}
                {post.authorityResponse?.pinned && (
                  <AuthorityPinnedComment
                    comment={post.authorityResponse.comment}
                    timestamp={post.authorityResponse.respondedAt}
                  />
                )}

                {/* Resolution Timeline - Using ResolutionTimeline component */}
                {post.resolutionTimeline && (
                  <ResolutionTimeline 
                    timeline={post.resolutionTimeline}
                    currentStatus={post.status}
                  />
                )}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Load More Button */}
      {!isLoading && posts.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={refreshFeed}
          className="w-full mt-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-all"
        >
          Load More Posts
        </motion.button>
      )}
    </div>
  );
};

export default CommunitySection;