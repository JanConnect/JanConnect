import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Users, 
  Flame, 
  MessageCircle, 
  AlertTriangle,
  Shield,
  TrendingUp,
  ArrowRight,
  Award,
  MapPin,
  Eye,
  Heart
} from "lucide-react";

const CommunityCard = ({ userId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigateToCommunity = () => {
    if (userId) {
      navigate(`/user/${userId}/community`);
    } else {
      navigate("/community");
    }
  };

  // Mock stats for the card
  const stats = {
    activePosts: 156,
    trendingHashtags: ["#GarbageCrisis", "#BrokenRoad", "#WaterLeak"],
    civicHeroes: 24,
    resolvedToday: 12,
    totalSupports: 3452,
    onlineNow: 48
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-6xl mx-auto mt-8 px-4"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br border border-white/20 p-6 md:p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64  rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3-500/20 rounded-xl border border-indigo-500/30">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  JanConnect Community
                  <Shield className="h-5 w-5 text-indigo-400" />
                </h2>
                <p className="text-white/60 text-sm mt-1">
                  Join {stats.onlineNow}+ citizens active now
                </p>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-sm font-medium">LIVE</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Active</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.activePosts}</p>
              <p className="text-white/40 text-xs">posts today</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <Award className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Heroes</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.civicHeroes}</p>
              <p className="text-white/40 text-xs">civic heroes</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Resolved</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.resolvedToday}</p>
              <p className="text-white/40 text-xs">today</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <Heart className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Supports</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.totalSupports}</p>
              <p className="text-white/40 text-xs">total supports</p>
            </div>
          </div>

          {/* Trending Hashtags */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-white/80 text-sm font-medium">Trending in your area</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.trendingHashtags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-indigo-400 text-sm font-medium"
                >
                  {tag}
                </motion.span>
              ))}
              <span className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white/60 text-sm">
                +3 more
              </span>
            </div>
          </div>

          {/* Recent Activity Preview */}
          <div className="mb-6 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-white/60">
              <Eye className="h-4 w-4" />
              <span>1.2k views</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <MessageCircle className="h-4 w-4" />
              <span>89 comments</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <MapPin className="h-4 w-4" />
              <span>Near you</span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNavigateToCommunity}
            className="w-full md:w-auto group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-[2px]"
          >
            <div className="relative flex items-center justify-center gap-3 px-8 py-4  transition-all group-hover:bg-transparent">
              <span className="text-white font-semibold text-lg">
                Explore Community Feed
              </span>
              <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]"></div>
            </div>
          </motion.button>

          {/* Active Users Indicator */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/32?u=${i}`}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-[#0A0B0E]"
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border-2 border-[#0A0B0E] flex items-center justify-center text-xs text-indigo-400">
                +12
              </div>
            </div>
            <span className="text-white/40 text-sm">
              <span className="text-green-400">{stats.onlineNow}</span> people posting now
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityCard;