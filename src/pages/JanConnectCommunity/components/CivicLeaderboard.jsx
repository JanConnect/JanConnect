import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp,
  Users,
  ChevronRight,
  X
} from 'lucide-react';

const CivicLeaderboard = ({ 
  data = [],
  userRank = null,
  onViewAll,
  className = '' 
}) => {
  const [showAll, setShowAll] = useState(false);

  const mockData = [
    { 
      id: 1, 
      name: 'EcoWarrior', 
      username: '@ecowarrior',
      score: 2450, 
      badge: '🏆',
      avatar: 'https://i.pravatar.cc/150?u=101',
      contributions: 156,
      resolved: 89,
      trend: 'up'
    },
    { 
      id: 2, 
      name: 'CleanCityAdvocate', 
      username: '@cleancity',
      score: 2100, 
      badge: '🥈',
      avatar: 'https://i.pravatar.cc/150?u=102',
      contributions: 134,
      resolved: 72,
      trend: 'up'
    },
    { 
      id: 3, 
      name: 'RoadSafetyHero', 
      username: '@roadsafety',
      score: 1875, 
      badge: '🥉',
      avatar: 'https://i.pravatar.cc/150?u=103',
      contributions: 98,
      resolved: 56,
      trend: 'steady'
    },
    { 
      id: 4, 
      name: 'WaterConserver', 
      username: '@waterhero',
      score: 1540, 
      badge: '⭐',
      avatar: 'https://i.pravatar.cc/150?u=104',
      contributions: 87,
      resolved: 43,
      trend: 'up'
    },
    { 
      id: 5, 
      name: 'StreetLightWatch', 
      username: '@lightwatch',
      score: 1320, 
      badge: '⭐',
      avatar: 'https://i.pravatar.cc/150?u=105',
      contributions: 76,
      resolved: 38,
      trend: 'down'
    },
  ];

  const displayData = data.length > 0 ? data : mockData;
  const topThree = displayData.slice(0, 3);
  const rest = displayData.slice(3);

  const getRankColor = (index) => {
    switch(index) {
      case 0: return 'from-yellow-400 to-yellow-600';
      case 1: return 'from-gray-300 to-gray-500';
      case 2: return 'from-orange-400 to-orange-600';
      default: return 'from-indigo-400 to-purple-600';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-400" />;
    if (trend === 'down') return <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />;
    return null;
  };

  return (
    <>
      <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <h3 className="text-white font-semibold">Civic Hero Leaderboard</h3>
            </div>
            <button
              onClick={() => setShowAll(true)}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="p-4 flex items-end justify-center gap-3 bg-gradient-to-b from-transparent to-white/5">
          {topThree.map((hero, index) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center ${
                index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
              }`}
            >
              <div className="relative">
                <img
                  src={hero.avatar}
                  alt={hero.name}
                  className={`w-${
                    index === 0 ? '16' : '14'
                  } h-${
                    index === 0 ? '16' : '14'
                  } rounded-full border-2 border-white/20`}
                />
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${getRankColor(index)} flex items-center justify-center text-xs font-bold`}>
                  {index + 1}
                </div>
              </div>
              <p className="text-white font-medium mt-2 text-sm">{hero.name}</p>
              <p className="text-indigo-400 text-xs">{hero.score} pts</p>
              <div className="flex items-center gap-1 mt-1">
                {getTrendIcon(hero.trend)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rest of the list */}
        <div className="p-4 space-y-2">
          {rest.map((hero, index) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-white/40 w-6 text-sm">{index + 4}</span>
                <img
                  src={hero.avatar}
                  alt={hero.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-white text-sm font-medium">{hero.name}</p>
                  <p className="text-white/40 text-xs">{hero.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-indigo-400 text-sm font-bold">{hero.score}</p>
                  <p className="text-white/40 text-xs">pts</p>
                </div>
                {getTrendIcon(hero.trend)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Rank (if provided) */}
        {userRank && (
          <div className="p-3 bg-indigo-500/10 border-t border-indigo-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Medal className="h-4 w-4 text-indigo-400" />
                <span className="text-white text-sm">Your Rank</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold">#{userRank.position}</span>
                <span className="text-white">{userRank.score} pts</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Modal */}
      <AnimatePresence>
        {showAll && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAll(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0A0B0E] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Civic Hero Leaderboard
                </h2>
                <button
                  onClick={() => setShowAll(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  {displayData.map((hero, index) => (
                    <motion.div
                      key={hero.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRankColor(index)} flex items-center justify-center text-sm font-bold`}>
                          {index + 1}
                        </span>
                        <img
                          src={hero.avatar}
                          alt={hero.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{hero.name}</p>
                          <p className="text-white/40 text-sm">{hero.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-indigo-400 font-bold">{hero.score}</p>
                          <p className="text-white/40 text-xs">points</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white">{hero.contributions}</p>
                          <p className="text-white/40 text-xs">posts</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400">{hero.resolved}</p>
                          <p className="text-white/40 text-xs">resolved</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CivicLeaderboard;